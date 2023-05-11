import { MongoClient, ObjectId, Db } from "mongodb";
require("dotenv").config();

import { SaveDataFormat } from "../interfaces/interfaces";

const dbName = process.env.DB_NAME;

async function connect(): Promise<{ db: Db; client: MongoClient }> {
  const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.CLUSTER_CREDS}`;
  const client = await MongoClient.connect(uri);
  const db = client.db(dbName);
  return { db, client };
}

// async function write_to_database(
//   clusterName: string,
//   user_credential: string,
//   data: Object
// ): Promise<void> {
//   try {
//     await client.connect();

//     const database = client.db(clusterName);
//     const restaurants = database.collection(user_credential);

//     const query = { name: "Midwood" };
//     const restaurant = await restaurants.findOne(query);
//     console.log(restaurant);
//   } catch (error: any) {
//     console.error("Erro: " + error);
//   } finally {
//     await client.close();
//   }
// }

// write_to_database("faces_users", "Rafael", { image: "image.jpg" });

export async function create(data: SaveDataFormat): Promise<void> {
  const { db, client } = await connect();
  try {
    const userFacesStorage = await db.collection(data?.user);
    for (const image in data.images) {
      const insert_data = { image: data.images[image] };
      userFacesStorage.insertOne(insert_data);
    }

  } catch (error) {
    console.error(error);
  }finally{
    client.close();
  }
}

export async function readAll() {
  const { db, client } = await connect();
  const result = await db.collection("collectionName").find({}).toArray();
  client.close();
  return result;
}
