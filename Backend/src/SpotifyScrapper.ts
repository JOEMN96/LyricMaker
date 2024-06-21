import puppeteer from "puppeteer";

const FILE_END_POINT = "https://gae2-spclient.spotify.com/storage-resolve/v2/files/audio/interactive/";
const LYRIC_END_POINT = "/color-lyrics/";

class SpotifyScrapper {
  private songName: string;
  public songData: songData = {};

  constructor(songName: string) {
    this.songName = songName;
  }

  async init() {
    await this.getSong(this.songName);
  }

  async getSong(songName: string) {
    const browser = await puppeteer.connect({
      browserWSEndpoint: process.env.CHROME_URI,
      defaultViewport: null,
    });
    const page = await browser.newPage();
    await page.goto("https://open.spotify.com/");
    await page.waitForSelector(`.search-icon`);
    await page.click(`.search-icon`, { delay: 1500 });
    await page.waitForSelector(`[data-testid*="topbar"] [role="search"] input`);
    await page.type(`[data-testid*="topbar"] [role="search"] input`, songName, { delay: 100 });

    const client = await page.createCDPSession();
    await client.send("Network.enable"); // Must enable network.
    await client.send("Network.setBypassServiceWorker", { bypass: true });
    await page.setRequestInterception(true);
    await page.setCacheEnabled(false);

    page.on("request", (request) => {
      request.continue();
    });

    page.on("response", async (response) => {
      const request = response.request();

      if (request.url().includes(FILE_END_POINT) && request.method() === "GET") {
        const text = await response.text();
        if (text) {
          this.songData.urls = JSON.parse(text);
        }

        if (this.songData?.lyric && this.songData.urls) {
          page.close();
        }
      }

      if (request.url().includes(LYRIC_END_POINT) && request.method() === "GET") {
        const respText = await response.text();
        if (respText) {
          this.songData.lyric = JSON.parse(respText);
        }

        if (this.songData?.lyric && this.songData.urls) {
          page.close();
        }
      }
    });

    await page.waitForSelector(`[data-testid*="search-tracks-result"] [aria-rowindex*="1"]`);
    await page.click(`[data-testid*="search-tracks-result"] [aria-rowindex*="1"] > div  button`, { delay: 1500 });
    await page.click(`[data-testid*="lyrics-button"]`, { delay: 3000 });
    try {
      Promise.all([await page.waitForNavigation({ waitUntil: "networkidle2", timeout: 10000 })]);
    } catch (error) {
      if (!page.isClosed()) {
        page.close();
      }
    }
  }
}

export default SpotifyScrapper;
