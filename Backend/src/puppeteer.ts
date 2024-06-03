import puppeteer from "puppeteer";
import { exec } from "child_process";

export async function viaPuppeteer() {
  const browser = await puppeteer.connect({
    browserWSEndpoint: "ws://127.0.0.1:9222/devtools/browser/3bc52466-93c5-4f00-aecc-107f9f508896",
    defaultViewport: null,
  });

  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto("http://localhost:3000?capture=true");
  const element = await page.waitForSelector(".playBtn");
  await element?.click();
  //http://127.0.0.1:9222/json/version

  try {
    const ffmpeg = exec(
      ` ffmpeg -y -hide_banner  -f gdigrab -framerate 60  -offset_x 0 -offset_y 170 -video_size 1900x703  -i desktop  -f dshow -i audio="Stereo Mix (Realtek High Definition Audio)" -map 0:v -map 1:a -c:a pcm_s24le -ar 96000 -c:v h264_nvenc -preset p6 -tune hq -cq 10 -bufsize 5M -qmin 0 -g 250 -bf 3 -b_ref_mode middle -temporal-aq 1 -rc-lookahead 30 -i_qfactor 0.75 -b_qfactor 1.1 output.mkv `
    );

    if (ffmpeg && ffmpeg.stderr && ffmpeg.stdin) {
      ffmpeg.stderr.on("data", (chunk: any) => {
        console.log(chunk.toString());
      });

      setTimeout(async () => {
        ffmpeg.stdin?.write("q");
        await page.close();
        ffmpeg.kill();
      }, 1000 * 30);
    }
  } catch (error) {
    console.log(error);
  }
}

// Other commands
// ` ffmpeg -y -hide_banner  -f gdigrab -framerate 60 -video_size 1920x1080  -i desktop  -f dshow -i audio="Stereo Mix (Realtek High Definition Audio)" -map 0:v -map 1:a -c:a pcm_s24le -ar 96000 -c:v h264_nvenc -preset p6 -tune hq -cq 10 -bufsize 5M -qmin 0 -g 250 -bf 3 -b_ref_mode middle -temporal-aq 1 -rc-lookahead 30 -i_qfactor 0.75 -b_qfactor 1.1 stream.mkv `;
// `ffmpeg -y  -f gdigrab -framerate 30 -offset_x 0 -offset_y 170  -video_size 1900x703  -show_region 1  -i desktop  output.mp4`
// ffmpeg -init_hw_device d3d11va -filter_complex ddagrab=0 -c:v h264_nvenc -cq:v 20 output.mkv
