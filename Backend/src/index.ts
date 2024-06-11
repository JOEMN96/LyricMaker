import express from "express";
import { Response } from "express";
import path from "path";
import { puppeteerStream } from "./puppeteer.capture";
import { puppeteerFfmpegStream } from "./puppeteer.ffmpeg";
import { viaPuppeteer } from "./puppeteer";
import SpotifyScrapper from "./SpotifyScrapper";
import dotenv from "dotenv";

const app = express();
app.use(express.json());

dotenv.config();

const port = 3000;

app.use("/assets", express.static(path.join(__dirname, "../../UI/dist/assets/")));
app.use("/public", express.static(path.join(__dirname, "../../UI/dist/")));

app.get("/", (req, res: Response) => {
  res.sendFile(path.join(__dirname, "../../UI/dist/index.html"));
});
app.get("/test", async (req, res) => {
  try {
    await viaPuppeteer(res);
  } catch (error) {
    console.log(error);

    res.sendStatus(500);
  }
});

app.post("/search", async (req, res) => {
  let { query } = req.body;
  if (!query) return res.send({ message: "invalid parameters" }).sendStatus(400);
  let scrap = new SpotifyScrapper("not like us");

  await scrap.init();
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
