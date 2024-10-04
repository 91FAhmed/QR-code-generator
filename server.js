import { createRequire } from "module";
const require = createRequire(import.meta.url);
const path = require("node:path");
import bodyParser from "body-parser";
import express from "express";

const app = express();
const __dirname = path.resolve(path.dirname(""));

//external sources public
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.listen(3000, (err) => {
  if (err) throw new Error(err);
  else console.log("Server Running at Port 3000");
});
