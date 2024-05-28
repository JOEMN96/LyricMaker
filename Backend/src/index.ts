import express from "express";
import path from "path";
import { puppeteerStream } from "./puppeteer.capture";

const app = express();
const port = 3000;

app.use("/assets", express.static(path.join(__dirname, "../../UI/dist/assets/")));
app.use("/public", express.static(path.join(__dirname, "../../UI/dist/")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../UI/dist/index.html"));
});
app.get("/test", async (req, res) => {
  try {
    await puppeteerStream();
    res.send({ status: "ok" });
  } catch (error) {
    console.log(error);

    res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
