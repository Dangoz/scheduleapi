import express from "express";
import path from "path";
import cors from "cors";
import morgan from "morgan";

module.exports = (app) => {

  app.use(express.static(path.join(__dirname, "..", "public")));
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // app.use(cors());

  app.use(morgan("tiny"));
};