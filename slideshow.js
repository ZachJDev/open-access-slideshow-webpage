class Slideshow {
  constructor(data, timePerSlide = 5) {
    // Slideshow Info
    this.playing = false;
    this.timePerSlide = timePerSlide * 1000;

    // Image Setup
    // A probably sloppily implemented linked list.
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
  }
  start() {
    this.playing = true;
    this.advanceSlide();
    this.timer = setInterval(() => {
      this.advanceSlide();
    }, this.timePerSlide);
  }

  stop() {
    clearInterval(this.timer);
    this.playing = false;
  }

  advanceSlide() {
    this.currentImage.hide();
    this.currentImage = this.currentImage.next;
    this.currentImage.updateInfoBar();
    this.currentImage.show();
  }

  clear() {
    let currentSlideShow = document.body.querySelector(".slideshow");
    while (currentSlideShow.firstChild) {
      currentSlideShow.removeChild(currentSlideShow.lastChild);
    }
    this.stop();
  }
}

class Image {
  constructor({ url, artist, title, source, usage, date }, id) {
    this.artist = artist;
    this.url = url;
    this.title = title;
    this.source = source;
    this.date = date;
    this.id = id;
  }

  load() {
    let slideshow = document.body.querySelector(".slideshow");
    slideshow.insertAdjacentHTML(
      // Insert the slide. After this refactor, I'm not sure I use the id any more.
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
