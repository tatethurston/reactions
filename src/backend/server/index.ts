import express from "express";
import { Healthchecks } from "../controllers";
import { expressify, routes } from "../utils";
// import cors from "cors";

export const server = express();

server.disable("x-powered-by");
server.use(
  "/",
  routes((r) => {
    r.get("/", expressify(Healthchecks.list));
  })
);
// app.use(cors());
server.use(express.json());
