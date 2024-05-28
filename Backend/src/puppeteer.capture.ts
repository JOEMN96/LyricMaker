import { launch, getStream, wss } from "puppeteer-stream";
import fs from "fs";

export async function puppeteerStream() {
  const file = fs.createWriteStream(`./videos/vid-${new Date().getMilliseconds()}.webm`);
  const browser = await launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    args: ["--autoplay-policy=no-user-gesture-required"],
    defaultViewport: {
      width: 1536,
      height: 703,
    },
    headless: "new",
  });

  const page = await browser.newPage();
  await page.goto("http://localhost:3000?capture=true");
  const stream = await getStream(page, {
    audio: true,
    video: true,
    mimeType: "video/webm;codecs=vp8,vp9,opus",
    // bitsPerSecond: 100000000,
    videoConstraints: {
      mandatory: {
        width: 1536,
        height: 703,
        frameRate: 60,
        facingMode: "environment",
        advanced: [{ width: 1920, height: 1280 }, { aspectRatio: 1.333 }],
      },
    },
  });
  const element = await page.waitForSelector(".playBtn");

  element?.click();
  stream.pipe(file);
  setTimeout(async () => {
    await stream.destroy();
    file.close();
    console.log("finished");

    await browser.close();
    (await wss).close();
  }, 1000 * 10);
}
