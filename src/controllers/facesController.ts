import { MongoClient, ObjectId, Db } from "mongodb";
require("dotenv").config();

import {
  DeleteUser,
  RetrieveUserFaces,
  SaveDataFormat,
  FindUser,
  UpdateUser,
} from "../interfaces/interfaces";

const dbName = process.env.DB_NAME;
let cachedClient: MongoClient;

async function connect(): Promise<{ db: Db; client: MongoClient }> {
  const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.CLUSTER_CREDS}/?retryWrites=true&w=majority"`;
  const client = await MongoClient.connect(uri);
  const db = client.db(dbName);
  return { db, client };
}
export async function testConnection():Promise<void> {
  const {db, client } = await connect();
  try{
    await db.command({ping: 1});
    console.log("Pinged deployment. You are connected do MongoDB");
  }finally{
    await client.close();
  }
}
export async function createUser(data: SaveDataFormat): Promise<void> {
  const { db, client } = await connect();
  const userFacesStorage = await db.collection(data?.user);
  const insertPromises = [];
  for (const [key, value] of Object.entries(data.images)) {
    const insert_data = { [key]: value };
    insertPromises.push(userFacesStorage.insertOne(insert_data));
  }
  await Promise.all(insertPromises);
  await client.close();
}

export async function readAllFacesUser(data: RetrieveUserFaces) {
  const { db, client } = await connect();
  const result = await db.collection(data.user).find({}).toArray();
  await client.close();
  return result;
}
export async function findUser(userName: FindUser) {
  const { db, client } = await connect();
  const col = await db.listCollections().toArray();
  await client.close();
  return col.some((collection) => collection.name === userName.user);
}

export async function removeUser(data: DeleteUser) {
  const { db, client } = await connect();
  console.log("Deleting Collection: ", data.user);
  const result = await db
    .collection(String(data.user))
    .drop()
    .catch((error) => console.error(error));
  await client.close();
  return result;
}

export async function updateUserFaces(data: UpdateUser) {
  const { db, client } = await connect();
  const userFacesStorage = await db.collection(data?.user);
  const insertPromises = [];
  for (const [key, value] of Object.entries(data.images)) {
    const insert_data = { [key]: value };
    insertPromises.push(userFacesStorage.insertOne(insert_data));
  }
  await Promise.all(insertPromises);
  await client.close();
}

export async function listUsers() {
  const { db, client } = await connect();
  const collections = await db.listCollections().toArray();
  const collectionNames = await collections.map(
    (collection) => collection.name
  );
  collectionNames.sort();
  await client.close();
  return collectionNames;
}

export async function queryCollectionDocumentsToObject(collectionNames: any) {
  const { db, client } = await connect();
  const data: { [key: string]: { [key: string]: string } } = {};

  for (const collectionName of collectionNames) {
    const collection = db.collection(collectionName);

    const documents = await collection.find({}).toArray();

    data[collectionName] = {};
    for (const document of documents) {
      for (const key in document) {
        if (key.startsWith("image")) {
          data[collectionName][key] = document[key];
        }
      }
    }
  }
  await client.close();
  return data;
}
