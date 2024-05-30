import puppeteer from "puppeteer";
import { exec } from "child_process";

export async function viaPuppeteer() {
  // Launch the browser and open a new blank page
  // const browser = await puppeteer.launch({
  //   headless: false,
  //   args: [`--window-size=${1920},${1080}`, "--window-position=0,0", "--start-maximized", "--no-sandbox"],
  //   defaultViewport: null,
  // });

  const browser = await puppeteer.connect({
    browserWSEndpoint: "ws://127.0.0.1:9222/devtools/browser/447a8298-cf7a-4427-ae40-158dbcd15cfb",
    defaultViewport: null,
  });

  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto("http://localhost:3000?capture=true");
  const element = await page.waitForSelector(".playBtn");
  element?.click();
  //http://127.0.0.1:9222/json/version

  try {
    const ffmpeg = exec(
      `ffmpeg -y -f gdigrab -framerate 30 -video_size 720x480 -i desktop -f dshow -i audio="Stereo Mix (Realtek High Definition Audio)" -c:v libvpx-vp9 -b:v 1M -crf 10 -auto-alt-ref 0 -c:a libopus -b:a 128K output.webm`
    );

    // `ffmpeg -y  -f gdigrab -framerate 30 -offset_x 0 -offset_y 170  -video_size 1900x703  -show_region 1  -i desktop  output.mp4`

    if (ffmpeg && ffmpeg.stderr && ffmpeg.stdin) {
      ffmpeg.stderr.on("data", (chunk: any) => {
        console.log(chunk.toString());
      });

      setTimeout(async () => {
        ffmpeg.stdin?.write("q");
        ffmpeg.kill();
        await page.close();
        // await browser.close();
      }, 1000 * 5);
    }
  } catch (error) {
    console.log(error);
  }
}
