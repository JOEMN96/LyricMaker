import "./style.css";
import lyricData from "../public/testFiles/lyric.json";

let audioPlayer = <HTMLMediaElement>document.querySelector(".audioPlayer");
let h2 = <HTMLHeadingElement>document.querySelector("h2");
let playBtn = <HTMLButtonElement>document.querySelector(".playBtn");

let recentLine = 0;

audioPlayer.ontimeupdate = function (e) {
  let time = (e.target as HTMLMediaElement).currentTime;
  let lyric = Lyric.syncLyric(time, lyricData.lyrics.lines);
  if (lyric && recentLine === Number(lyric.startTimeMs)) return;
  recentLine = Number(lyric.startTimeMs);
  h2.innerText = lyric?.words || "";
};

playBtn?.addEventListener("click", () => {
  audioPlayer.play();
});

class Lyric {
  static syncLyric(currentTime: number, lyrics: typeof lyricData.lyrics.lines) {
    let currentLyric: LYRICLINE[] = lyrics.filter((lyric: LYRICLINE) => {
      if (UtilityFunctions.convertFromSecondsToMs(currentTime) > Number(lyric.startTimeMs)) {
        return lyric;
      }
    });
    return currentLyric[currentLyric.length - 1];
  }
}

class HtmlBasedLyricUI {
  textBasedCanvasArea;
  progressBar;
  subtractButton;
  addButton;
  fontNameSelector;
  textColorPicker1;
  textColorPicker2;
  bgColorPicker1;
  bgColorPicker2;
  controlArea;
  searchBox;
  searchBtn;

  constructor() {
    this.controlArea = <HTMLDivElement>document.querySelector("#textBasedLyric .wrapper");
    this.textBasedCanvasArea = <HTMLDivElement>document.querySelector("#textBasedLyric .textBasedCanvasArea");
    this.progressBar = <HTMLProgressElement>document.querySelector("#textBasedLyric .progress-bar-values");
    this.subtractButton = <HTMLElement>this.progressBar?.nextElementSibling?.nextElementSibling;
    this.addButton = <HTMLElement>this.subtractButton.nextElementSibling;
    this.fontNameSelector = <HTMLSelectElement>document.querySelector("#textBasedLyric .fontName");
    this.textColorPicker1 = <HTMLInputElement>document.querySelector("#textBasedLyric .textColorPicker1");
    this.textColorPicker2 = <HTMLInputElement>document.querySelector("#textBasedLyric .textColorPicker2");
    this.bgColorPicker1 = <HTMLInputElement>document.querySelector("#textBasedLyric .bgColorPicker1");
    this.bgColorPicker2 = <HTMLInputElement>document.querySelector("#textBasedLyric .bgColorPicker2");
    this.searchBox = <HTMLInputElement>document.querySelector(".search");
    this.searchBtn = <HTMLButtonElement>document.querySelector(".searchBtn");
    this.textBasedCanvasArea.style.width = "60%";
  }

  init() {
    this.addButton.addEventListener("click", () => {
      const value = Math.min(100, this.progressBar?.value + 10);
      this.progressBar.value = value;
      this.progressBar.textContent = `${value}%`;
      this.textBasedCanvasArea.style.width = `${value}%`;
      this.storeValuesInLocalStorage("canvasWidth", String(value));
    });

    this.subtractButton.addEventListener("click", () => {
      const value = Math.max(0, this.progressBar.value - 10);
      this.progressBar.value = value;
      this.progressBar.textContent = `${value}%`;
      this.textBasedCanvasArea.style.width = `${value}%`;
      this.storeValuesInLocalStorage("canvasWidth", String(value));
    });

    this.fontNameSelector.addEventListener("sl-change", () => {
      let index = this.fontNameSelector.value;
      this.loadFont(Number(index));
      this.storeValuesInLocalStorage("fontName", String(index));
    });

    this.textColorPicker1.addEventListener("sl-input", (e) => {
      let color = (e.target as HTMLInputElement)?.value;
      document.documentElement.style.setProperty("--textColor1", color);
      this.storeValuesInLocalStorage("--textColor1", color);
    });

    this.textColorPicker2.addEventListener("sl-input", (e) => {
      let color = (e.target as HTMLInputElement)?.value;
      document.documentElement.style.setProperty("--textColor2", color);
      this.storeValuesInLocalStorage("--textColor2", color);
    });

    this.bgColorPicker1.addEventListener("sl-input", (e) => {
      const bgColor1 = (e.target as HTMLInputElement)?.value;
      document.documentElement.style.setProperty("--bgColor1", bgColor1);
      this.storeValuesInLocalStorage("--bgColor1", bgColor1);
    });

    this.bgColorPicker2.addEventListener("sl-input", (e) => {
      const bgColor2 = (e.target as HTMLInputElement)?.value;
      document.documentElement.style.setProperty("--bgColor2", bgColor2);
      this.storeValuesInLocalStorage("--bgColor2", bgColor2);
    });

    this.searchBtn.addEventListener("click", async () => {
      let searchString = this.searchBox.value;
      if (!searchString) return;

      // add content type header
      let res = await fetch("/search", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: searchString }),
      });
      let data = await res.json();
      console.log(data);
    });

    this.loadStylesFromLocalStorage();
  }

  loadFont(index: number) {
    const fonts = [
      {
        name: "Shadows Into Light",
        url: "https://fonts.gstatic.com/s/shadowsintolight/v19/UqyNK9UOIntux_czAvDQx_ZcHqZXBNQzdcD5.woff2",
      },
      { name: "Indie Flower", url: "https://fonts.gstatic.com/s/indieflower/v21/m8JVjfNVeKWVnh3QMuKkFcZVaUuH.woff2" },
      { name: "Monoton", url: "https://fonts.gstatic.com/s/monoton/v19/5h1aiZUrOngCibe4TkHLQg.woff2" },
      {
        name: "Mystery Quest",
        url: "https://fonts.gstatic.com/s/mysteryquest/v20/-nF6OG414u0E6k0wynSGlujRLwYvDg.woff2",
      },
      {
        name: "Bungee Hairline",
        url: "https://fonts.gstatic.com/s/bungeehairline/v22/snfys0G548t04270a_ljTLUVrv-LZxec.woff2",
      },
    ];

    let choosenFont = fonts[index];

    var myfont = new FontFace(choosenFont.name, `url(${choosenFont.url}) format("woff2")`);
    myfont
      .load()
      .then(function (loadedFont) {
        document.fonts.add(loadedFont);
        let lyricText = <HTMLHeadingElement>document.querySelector("#textBasedLyric h2");
        lyricText.style.fontFamily = choosenFont.name;
        if (choosenFont.name === "Bungee Hairline") {
          lyricText.style.fontWeight = "bold";
          lyricText.style.lineHeight = "62px";
        } else {
          lyricText.style.fontWeight = "normal";
          lyricText.style.lineHeight = "initial";
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  loadStylesFromLocalStorage() {
    for (let [key, value] of Object.entries(localStorage)) {
      if (key.startsWith("--")) {
        document.documentElement.style.setProperty(key, value);
      } else if (key === "fontName") {
        this.loadFont(Number(value));
      } else if (key === "canvasWidth") {
        // implement this later
      }
    }
  }

  prepareForRecord() {
    const urlParams = new URLSearchParams(window.location.search);
    let captureMode = urlParams.get("capture");
    if (captureMode) {
      this.controlArea.style.display = "none";
      // audioPlayer.style.display = "none";
      playBtn.classList.add("offScreenBtn");
      audioPlayer.classList.add("offScreenPlayer");
      this.textBasedCanvasArea.classList.add("fullscreen");
      this.loadStylesFromLocalStorage();
    }
  }

  storeValuesInLocalStorage(name: string, value: string) {
    localStorage.setItem(name, value);
  }
}

let htmlbased = new HtmlBasedLyricUI();
htmlbased.init();
htmlbased.prepareForRecord();

class UtilityFunctions {
  static convertFromSecondsToMs(seconds: number) {
    return seconds * 1000;
  }

  static convertFromMsToS(milliseconds: number) {
    return milliseconds / 1000.0;
  }
}
