import puppeteer from "puppeteer";

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
    await page.type(`[role="search"] input`, songName, { delay: 100 });
    await page.waitForSelector(`[data-testid*="top-result-card"] `);
    await page.click(`[data-testid*="top-result-card"]`, { delay: 1500 });
    // await page.waitForSelector(`[data-testid*="action-bar-row"] .encore-bright-accent-set`);
    // await page.click(`[data-testid*="action-bar-row"] .encore-bright-accent-set`, { delay: 1500 });

    // await page.click(`.search-icon`, { delay: 1500 });

    // const element = await page.waitForSelector(".playBtn");
  }
}

export default SpotifyScrapper;

// 6AI3ezQ4o3HUoP6Dhudph3

// https://api-partner.spotify.com/pathfinder/v1/query?operationName=getTrack&variables
