let form = document.getElementById("myForm");
let slideshow, infoBarOpacityTimer, addSlides; // Timers, as to easily remove them later
var currentSlideIndex = 0;

let titleInfo = document.getElementById("title"),
  artistInfo = document.getElementById("artist"),
  dateInfo = document.getElementById("date"),
  sourceInfo = document.getElementById("source"),
  usageInfo = document.getElementById("usage");

//Control how the infoBar works
(() => {
  const infoBar = document.getElementById("infoBar");
  const body = document.querySelector("body");
  infoBarTimeout();
  body.addEventListener("mousemove", () => {
    infoBar.style.opacity = "100%";
    clearInterval(infoBarOpacityTimer);
    infoBarTimeout();
    // console.log("ou");
  });
})();

let picInfo = document.querySelector("#picInfo");

// picInfo.addEventListener("click", () => {
//   picInfo.classList.toggle("show");  // Not yet implemented
// })

// Holds main functionality -- submit AJAX request and start slideshow
form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (slideshow) {
    clearInterval(addSlides);
    clearInterval(slideshow); // Stops the currently running slideshow
  }
  let slides = document.querySelector(".slideshow");
  while (slides.hasChildNodes()) {
    slides.removeChild(slides.firstChild);
  }
  form = document.getElementById("myForm");
  let FD = new FormData(form);
  (async () => {
    await fetch("https://open-access-slideshow.herokuapp.com/", {
      method: "POST",
      body: FD,
    })
      .then((res) => {
        return res.text();
      })
      .then((data) => {

        let pauseButton = document.getElementById("pause");
        pauseButton.style.opacity = "100";
        data = JSON.parse(data);
        loadImages(data);
        startSlideshow(data);
        let playing = true;
        pauseButton.addEventListener("click", () => {
          if (playing) {
            clearInterval(slideshow);
            playing = false;
            console.log(currentSlideIndex);
          } else {
            playing = true;
            startSlideshow(data, currentSlideIndex);
          }
        });
      });
  })();
});
/*****************************Helper functions**************************************************/

function startSlideshow(array, i = 0) {
  let slides = document.querySelector(".slideshow").children;
  if(i > 0) {
    slides[i].classList.remove("active");
    i++
  }
  slides[i].classList.add("active"); // Set new slide as active
  updateInfo(array[i]);
  i++;
  showSlideshow(slides, array, i);
}

function showSlideshow(slides, array, i) {
  slideshow = setInterval(() => {
    currentSlideIndex = i;
    slides[i].classList.add("active"); // Set new slide as active
    updateInfo(array[i]); // Display the metadata for the slide
    if (i == 0 && slides.length > 1)
      slides[slides.length - 1].classList.remove("active"); // Remove the active class from the last slide on repeat of slideshow
    if (i > 0) slides[i - 1].classList.remove("active"); //Remove the active class from previous slide normally
    i++;
    if (i == array.length) i = 0; // Wrap around back to the beginning once the end is reached
  }, 5000);
}

function loadImages(array) {
  let i = 0;
  insertSlide(array, i);
  i++;
  addSlides = setInterval(() => {
    insertSlide(array, i);
    i++;
    if (i >= array.length) clearInterval(addSlides);
  }, 3000);
}

function insertSlide(array, i) {
  const show = document.querySelector(".slideshow");
  show.insertAdjacentHTML(
    // Insert the slide
    "beforeend",
    `<div class="slide"><img id=${i} src=${array[i].url}></div>`
  );
  let newSlide = document.getElementById(i);
  newSlide.addEventListener("error", () => {
    // Remove slide if error on image load
    newSlide.parentElement.remove(0);
    array.splice(i, 1);
  });
}

function updateInfo({ _, title, artist, source, usage, date }) {
  titleInfo.textContent = title;
  artistInfo.textContent = artist;
  dateInfo.textContent = date;
  sourceInfo.textContent = source;
  usageInfo.textContent = usage;
}

function infoBarTimeout() {
  infoBar.style.opacity = "100%";
  infoBarOpacityTimer = setTimeout(() => (infoBar.style.opacity = "0"), 2000);
}
