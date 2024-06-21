import { launch, getStream } from "puppeteer-stream";
import { exec } from "child_process";

export async function puppeteerFfmpegStream() {
  const browser = await launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    args: ["--autoplay-policy=no-user-gesture-required"],
    defaultViewport: {
      width: 1536,
      height: 703,
    },
    // headless: "new",
  });

  const page = await browser.newPage();
  await page.goto("http://localhost:3000?capture=true");
  const element = await page.waitForSelector(".playBtn");
  element?.click();
  const stream = await getStream(page, {
    audio: true,
    video: true,
    frameSize: 1000,
    videoConstraints: { mandatory: { frameRate: 60 } },
  });
  console.log("recording");
  const ffmpeg = exec(`ffmpeg  -y -i - -c copy output.mp4`);
  //   ffmpeg -f gdigrab -framerate 30 -offset_x 10 -offset_y 20 -video_size 640x480 -show_region 1 -i desktop output.mkv
  if (ffmpeg && ffmpeg.stderr && ffmpeg.stdin) {
    ffmpeg.stderr.on("data", (chunk: any) => {
      console.log(chunk.toString());
    });

    stream.on("close", () => {
      console.log("stream close");
      ffmpeg.stdin?.end();
    });

    stream.pipe(ffmpeg?.stdin);
  }

  setTimeout(async () => {
    stream.destroy();
    console.log("finished");
    await browser.close();
  }, 1000 * 10);
}
