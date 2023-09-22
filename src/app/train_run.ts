import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";
require("dotenv").config();
import {
  listUsers,
  queryCollectionDocumentsToObject,
} from "../controllers/facesController";
import { encode, decode } from "base-64";
const appPath = path.dirname(__filename);

export async function run_train(): Promise<void> {
  const dataPath = path.join(appPath + "/train_model/dataset/");
  const dataRaw = path.join(appPath + "/train_model/dataraw/");
  const trainerPath = path.join(appPath, "/train_model/trainer/");
  const pythonScriptsPath = path.join(appPath, "/train_model/");
  create_path_nonexist(dataPath);
  create_path_nonexist(trainerPath);
  create_path_nonexist(dataRaw);

  const usersList: string[] = await listUsers();
  const collectionNames = usersList.slice();
  saveUsersNames(pythonScriptsPath, usersList);
  console.log(collectionNames);
  try {
    await loadUsersImages(collectionNames, dataRaw);
  } catch (error) {
    throw error;
  }
  try {
    facesDetectOnImages(pythonScriptsPath);
  } catch (error) {
    console.log(error);
  }
}

function executePython(scriptPath: string) {
  let fullCommand = "";
  if (process.platform === 'win32'){
    fullCommand = `python3.11 ${scriptPath}`;
  }else{
    const shellScriptPath = path.join(appPath, "run.sh");
    
    fullCommand = `${shellScriptPath} "${scriptPath}" "${process.env.PYTHON_ENV || 'train_env'}"`;
  }
  
  exec(fullCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Erro ao executar o script Python: ${error}`);
      return;
    } else {
      console.log(`${stdout}`);
    }
  });
}
function facesDetectOnImages(pythonScriptsPath: string) {
  const detectScript = pythonScriptsPath + "dataset_face.py";
  executePython(detectScript);
}
function create_path_nonexist(dirPath: string) {
  fs.access(dirPath, fs.constants.F_OK, (err) => {
    if (err) {
      makeDir(dirPath);
      return 1;
    } else {
      return 0;
    }
  });
}

function makeDir(path: string) {
  fs.mkdir(path, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Diretório criado com sucesso");
    }
  });
}
async function saveUsersNames(pythonScriptsPath: string, usersList: string[]) {
  const convertFilesScript = pythonScriptsPath + "convert_file_users.py";
  usersList.unshift("None");
  const saveToFile = usersList.join(",");
  const file_path: string = path.join(appPath, "/train_model/nomes.txt");
  fs.writeFileSync(file_path, saveToFile); //Save users names to file
  executePython(convertFilesScript); // Convert names file to python
}
async function loadUsersImages(collectionNames: any, dataPath: string) {
  const data = await queryCollectionDocumentsToObject(collectionNames);
  // console.log(data);
  if (Object.keys(data).length === 0) {
    throw new Error("Sem usuários cadastrados!");
  }

  let faceId = 1;
  for (const user in data) {
    const images = data[user];

    let count = 1;
    for (const imageKey in images) {
      const binaryString = images[imageKey];
      const base64String = encode(binaryString);
      const fileName = `${dataPath}User.${faceId}.${count}.jpg`;

      // Convert base64 string to image and save it
      const buffer = Buffer.from(base64String, "base64");
      fs.writeFileSync(fileName, buffer);
      // console.log(fileName);

      count++;
    }
    faceId++;
  }
}
