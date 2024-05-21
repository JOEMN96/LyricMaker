import "./style.css";
import lyricData from "./testFiles/lyric.json";

let audioPlayer = <HTMLMediaElement>document.querySelector(".audioPlayer");
let h2 = <HTMLHeadingElement>document.querySelector("h2");

let recentLine = 0;

audioPlayer.ontimeupdate = function (e) {
  let time = (e.target as HTMLMediaElement).currentTime;
  let lyric = syncLyric(time, lyricData.lyrics.lines);
  if (lyric && recentLine === Number(lyric.startTimeMs)) return;
  recentLine = Number(lyric.startTimeMs);
  h2.innerText = lyric?.words || "";
};

function syncLyric(currentTime: number, lyrics: typeof lyricData.lyrics.lines) {
  let currentLyric: LYRICLINE[] = lyrics.filter((lyric) => {
    if (convertFromSecondsToMs(currentTime) > Number(lyric.startTimeMs)) {
      return lyric;
    }
  });
  return currentLyric[currentLyric.length - 1];
}

// UTILITY FUCTIONS

function convertFromSecondsToMs(seconds: number) {
  return seconds * 1000;
}

function convertFromMsToS(milliseconds: number) {
  return milliseconds / 1000.0;
}
