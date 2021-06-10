import express from "express";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(3000, () => {
  console.log(`App listening on the port 3000`);
})

require("./crawler/lalala")();