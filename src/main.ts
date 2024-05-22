import "./style.css";
import lyricData from "./testFiles/lyric.json";

let audioPlayer = <HTMLMediaElement>document.querySelector(".audioPlayer");
let h2 = <HTMLHeadingElement>document.querySelector("h2");

let recentLine = 0;

audioPlayer.ontimeupdate = function (e) {
  let time = (e.target as HTMLMediaElement).currentTime;
  let lyric = Lyric.syncLyric(time, lyricData.lyrics.lines);
  if (lyric && recentLine === Number(lyric.startTimeMs)) return;
  recentLine = Number(lyric.startTimeMs);
  h2.innerText = lyric?.words || "";
};

class Lyric {
  static syncLyric(currentTime: number, lyrics: typeof lyricData.lyrics.lines) {
    let currentLyric: LYRICLINE[] = lyrics.filter((lyric) => {
      if (UtilityFunctions.convertFromSecondsToMs(currentTime) > Number(lyric.startTimeMs)) {
        return lyric;
      }
    });
    return currentLyric[currentLyric.length - 1];
  }
}

class UtilityFunctions {
  static convertFromSecondsToMs(seconds: number) {
    return seconds * 1000;
  }

  static convertFromMsToS(milliseconds: number) {
    return milliseconds / 1000.0;
  }
}
