import "./style.css";
import lyricData from "./testFiles/lyric.json";

let audioPlayer = <HTMLMediaElement>document.querySelector(".audioPlayer");

console.log(lyricData);

let PAUSED = false;

audioPlayer.onplaying = function (e) {
  let currentAudioPlayerTimeInS = (e.target as HTMLMediaElement).currentTime;
  let currentAudioPlayerTimeInMs = convertFromSecondsToMs(currentAudioPlayerTimeInS);

  let lyric = getAppropriateLineFromLyric(currentAudioPlayerTimeInMs, lyricData.lyrics.lines);

  loadLyric(lyric);
};

audioPlayer.onpause = function () {
  PAUSED = true;
};

async function loadLyric(lyric: typeof lyricData.lyrics.lines) {
  for await (const [index, line] of lyric.entries()) {
    let prevLineStartTimeMs = index ? lyric[index - 1].startTimeMs : 0;
    let waitTime;
    // console.log(line);

    if (audioPlayer.paused) break;

    if (PAUSED) {
      waitTime = 0;
      PAUSED = false;
      audioPlayer.currentTime = convertFromMsToS(Number(line.startTimeMs));
    } else {
      waitTime = Number(line.startTimeMs) - Number(prevLineStartTimeMs);
    }

    await wait(waitTime);
    if (audioPlayer.paused) break;
    console.log(line.words);
  }
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getAppropriateLineFromLyric(currentTime: number, lyricArray: typeof lyricData.lyrics.lines) {
  const output = lyricArray.reduce((prev, curr) =>
    Math.abs(Number(curr.startTimeMs) - currentTime) < Math.abs(Number(prev.startTimeMs) - currentTime) ? curr : prev
  );

  if (output) {
    const lyricArrayClone = [...lyricArray];
    let index = lyricArray.findIndex((item) => item.startTimeMs === output.startTimeMs);
    return lyricArrayClone.splice(index);
  }

  return lyricArray;
}

// UTILITY FUCTIONS

function convertFromSecondsToMs(seconds: number) {
  return Math.floor(seconds * 1000);
}

function convertFromMsToS(milliseconds: number) {
  return Math.floor(milliseconds / 1000);
}
