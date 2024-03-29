import express from "express";
import {
  createUser,
  findUser,
  removeUser,
  updateUserFaces,
  testConnection
} from "../controllers/facesController";

const router = express.Router();
import {
  DeleteUser,
  RetrieveUserFaces,
  SaveDataFormat,
  UpdateUser,
} from "../interfaces/interfaces";
import { run_train } from "../app/train_run";

router.get("/test", async (req, res) => {
  console.log("Testing");
  // const data = req.body as SaveDataFormat;
  // const { user } = data;
  // const userName = { user };
  // const result = await findUser(userName);
  // console.log(result);
  try{
    testConnection();
    await res.status(200).send("Connected To Db")

  }catch (error){
    res.status(500).send("Not Connected To Db")
  }
});
router.post("/create-user", async (req, res) => {
  const data = req.body as SaveDataFormat;
  const { user } = data;
  const userName = { user };
  const userExist = await findUser(userName);
  if (!userExist) {
    try {
      await createUser(data);
      res.status(200).send("User created!");
    } catch (error) {
      console.log(error);
      res.status(500).send("[Error] - Not able to create user!");
    }
  } else {
    res.status(409).send("[Error] - User already exists!");
  }
});

router.delete("/delete-user", async (req, res) => {
  const data = req.body as DeleteUser;
  const { user } = data;
  const userName = { user };
  const userExist = await findUser(userName);
  if (userExist) {
    try {
      const result = await removeUser(data);
      console.log(result);
      res.status(200).send("Deleted user!");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error deleting user.");
    }
  } else {
    res.status(404).send("User does not exists!");
  }
});
router.put("/update-user", async (req, res) => {
  const data = req.body as UpdateUser;
  const { user } = data;
  const userName = { user };
  const userExist = await findUser(userName);
  if (userExist) {
    try {
      const result = await updateUserFaces(data);
      console.log(result);
      res.status(200).send("Updated user!");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error Updating user.");
    }
  } else {
    res.status(404).send("User does not exists!");
  }
});
router.get("/train-model", async (req, res) => {
  try {
    await run_train();
    res.status(200).send("Modelo treinado!");
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send("Erro: " + error.message);
    } else {
      res.status(500).send("Erro ao treinar modelo");
    }
  }
});

export default router;
