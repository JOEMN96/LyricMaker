interface Line {
  startTimeMs: string;
  words: string;
  syllables: [];
  endTimeMs: string;
}

type songData = {
  urls?: { result: string; cdnurl: string[]; fileid: string; ttl: number } | "";
  lyric?: { lyrics: { lines: Line[] } } | "";
};
