// testRoutes.ts

// Imports ==============================================
import express from "express";
import {
  getServer,
  getCollection,
  postCollection,
} from "../controllers/testController.js";

// Routes =================================================

const testRoutes = express.Router();

// http://localhost:5001/app/test/server/
testRoutes.get("/server", getServer);

// http://localhost:5001/app/test/collection/
testRoutes.get("/collection", getCollection);

// http://localhost:5001/app/test/collection/
testRoutes.post("/collection", postCollection);

// Exports ==============================================

export default testRoutes;
