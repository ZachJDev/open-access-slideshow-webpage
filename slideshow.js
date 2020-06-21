class Slideshow {
  constructor(data) {
      this.playing = false;

    this.StartingImage = new Image(data[0], 0);
    this.StartingImage.load();
    this.StartingImage.next = this.StartingImage;
    let currentImage = this.StartingImage;
    for (let i = 1; i < data.length; i++) {
      let nextImage = new Image(data[i], i);
      nextImage.load();
      currentImage.next = nextImage;
      currentImage = nextImage;
    }
    currentImage.next = this.StartingImage;
    this.currentImage = currentImage;

    this.initializeControls();
  }
  start() {
      this.playing = true;
      this.advanceSlide()
      this.timer = setInterval(() => {
        this.advanceSlide()
      }, 5000);  
  }

  stop() {
    clearInterval(this.timer)
    this.playing = false;
  }

  advanceSlide() {
    this.currentImage.hide();
      this.currentImage = this.currentImage.next;
      this.currentImage.updateInfoBar();
      this.currentImage.show();
  }

  initializeControls() {
    let playButton = document.getElementById("playButton");
    let pauseButton = document.getElementById("pauseButton");
    let togglePlay = document.getElementById("play_pause");

    togglePlay.addEventListener("click", () => {
        if (this.playing) {
        this.stop();
          playButton.style.opacity = "100";
          pauseButton.style.opacity = "0";
        } else {
          this.start();
          pauseButton.style.opacity = "100";
          playButton.style.opacity = "0";
        }
      });
  }

  static clear() {
    let currentSlideShow = document.body.querySelector(".slideshow");
    while (currentSlideShow.firstChild) {
      currentSlideShow.removeChild(currentSlideShow.lastChild);
    }
  }
}

class Image {
  constructor({ url, artist, title, source, usage, date }, id) {
    this.artist = artist;
    this.url = url;
    this.title = title;
    this.source = source;
    this.date = date;
    this.id = id
  }

  load() {
    let slideshow = document.body.querySelector(".slideshow")
    slideshow.insertAdjacentHTML(
      // Insert the slide
      "beforeend",
      `<div class="slide"><img id="${this.id}" src=${this.url} alt ="${this.title}"></div>`
    );
    this.slide = slideshow.lastChild;

  }

    show() {
        this.slide.classList.add("active");
    }
    hide() {
        this.slide.classList.remove("active");
    }
    updateInfoBar() {
        document.getElementById("title").textContent = this.title;
        document.getElementById("artist").textContent = this.artist;
        document.getElementById("date").textContent = this.date;
        document.getElementById("source").textContent = this.source;
        // document.getElementById("usage").textContent = this.usage;
    }
  }

