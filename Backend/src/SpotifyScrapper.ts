import puppeteer from "puppeteer";

const FILE_END_POINT = "https://gae2-spclient.spotify.com/storage-resolve/v2/files/audio/interactive/";

class SpotifyScrapper {
  private songName: string;

  constructor(songName: string) {
    this.songName = songName;
  }

  async init() {
    this.getSong(" carnival");
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
    // await page.waitForSelector(`[data-testid*="top-result-card"] `);
    // await page.click(`[data-testid*="top-result-card"]`, { delay: 1500 });

    await page.setRequestInterception(true);
    page.on("request", (request) => {
      request.continue();
    });
    page.on("response", async (response) => {
      const request = response.request();

      if (request.url().includes(FILE_END_POINT) && request.method() === "GET") {
        const text = await response.text();
        console.log(text);
        if (text) {
        }
      }
    });

    await page.waitForSelector(`[data-testid*="search-tracks-result"] [aria-rowindex*="1"]`);
    await page.click(`[data-testid*="search-tracks-result"] [aria-rowindex*="1"] > div  button`, { delay: 1500 });

    // await page.click(`.search-icon`, { delay: 1500 });

    // const element = await page.waitForSelector(".playBtn");
  }
}

export default SpotifyScrapper;

// 6AI3ezQ4o3HUoP6Dhudph3

// https://api-partner.spotify.com/pathfinder/v1/query?operationName=getTrack&variables
