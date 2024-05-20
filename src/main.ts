import "./style.css";
import lyricData from "./testFiles/lyric.json";

let audioPlayer = <HTMLMediaElement>document.querySelector(".audioPlayer");

console.log(lyricData);

audioPlayer.onplaying = function (e) {
  let currentAudioPlayerTimeInS = (e.target as HTMLMediaElement).currentTime;
  let currentAudioPlayerTimeInMs = convertFromSecondsToMs(currentAudioPlayerTimeInS);

  let lyric = getAppropriateLineFromLyric(currentAudioPlayerTimeInMs, lyricData.lyrics.lines);

  loadLyric(lyric);
};

async function loadLyric(lyric: typeof lyricData.lyrics.lines) {
  for await (const [index, line] of lyricData.lyrics.lines.entries()) {
    let prevLineStartTimeMs = index ? lyricData.lyrics.lines[index - 1].startTimeMs : 0;

    await wait(Number(line.startTimeMs) - Number(prevLineStartTimeMs));
    if (audioPlayer.paused) break;
    console.log(line.words);
  }
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function convertFromSecondsToMs(seconds: number) {
  return Math.floor(seconds * 1000);
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
