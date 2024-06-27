import express from "express";
import { Response } from "express";
import path from "path";
import { viaPuppeteer } from "./puppeteer";
import SpotifyScrapper from "./SpotifyScrapper";
import dotenv from "dotenv";
import bodyParser from "body-parser";

const app = express();
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

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

  if (!query) return res.status(400).json({ message: "invalid parameters" });

  try {
    let scrap = new SpotifyScrapper("not like us");
    await scrap.init();
    let data = scrap.songData;
    if (data.urls && data.urls.cdnurl.length > 1 && data.lyric && data.lyric.lyrics.lines.length > 1) {
      return res.status(200).json(data);
    }
    res.status(404).json({ message: "Unable to find song" });
  } catch (error) {
    res.status(404).json({ message: "Unable to open Browser" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
