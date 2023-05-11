import { error } from "console";
import express from "express";
import { create } from "../controllers/facesController";

const router = express.Router();
import { SaveDataFormat } from "../interfaces/interfaces";

router.get("/date", (req, res) => {
  console.log("Hello World");
  res.status(200).send(new Date());
});

router.post("/save-faces", (req, res) => {
  try {
    const data = req.body as SaveDataFormat;
    console.log(data);
    create(data);
    res.status(200).send("Saved data to db!");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error saving data!");
  }
});

export default router;
