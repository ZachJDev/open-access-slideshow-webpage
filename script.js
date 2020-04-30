let form = document.getElementById("myForm");
let slowAdd, infoBarOpacityTimer; // As to easily remove them later

let titleInfo = document.getElementById("title"),
  artistInfo = document.getElementById("artist"),
  dateInfo = document.getElementById("date"),
  sourceInfo = document.getElementById("source"),
  usageInfo = document.getElementById("usage");

//Control how the infoBar works
(() => {
  const infoBar = document.getElementById("infoBar");
  infoBarTimeout();
  infoBar.addEventListener("mouseover", () => {
    infoBar.style.opacity = "100%";
    clearInterval(infoBarOpacityTimer);
  });
  infoBar.addEventListener("mouseleave", infoBarTimeout);
})();

let picInfo = document.querySelector("#picInfo"); 

// picInfo.addEventListener("click", () => {
//   picInfo.classList.toggle("show");  // Not yet implemented
// })

// Holds main functionality -- submit AJAX request and start slideshow
form.addEventListener("submit", (event) => {
  event.preventDefault();
  let slides = document.querySelector(".slideshow");
  if (slowAdd) clearInterval(slowAdd); // Stops the currently running slideshow
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
        data = JSON.parse(data);
        loadImages(data);
        slideshow(data);
      });
  })();
});
/*****************************Helper functions**************************************************/
function slideshow(array) {
  let i = 0;
  let slides = document.querySelector(".slideshow").children;

  slowAdd = setInterval(() => {
    slides[i].classList.add("active"); // Set new slide as active
    updateInfo(array[i]); // Display the metadata for the slide
    if (i == 0 && slides.length > 1)
      slides[slides.length - 1].classList.remove("active"); // Remove the active class from the last slide on repeat of slideshow
    if (i > 0) slides[i - 1].classList.remove("active"); //Remove the active class from previous slide normally
    i++;
    if (i == slides.length) i = 0; // Wrap around back to the beginning once the end is reached
  }, 5000);
}

function loadImages(array) {
  let i = 0;
  insertSlide(array[i], i);
  i++
  let addSlides = setInterval(() => {
    insertSlide(array[i], i);
    i++;
    if(i >= array.length) clearInterval(addSlides);
  }, 3000)
}

function insertSlide(image, i) {
  const body = document.querySelector(".slideshow");
  body.insertAdjacentHTML(                                    // Insert the slide
    "beforeend",
    `<div class="slide"><img id=${i} src=${image.url}></div>`
  );
  let newSlide = document.getElementById(i);
  newSlide.addEventListener("error", () => { // Remove slide if error on image load
    newSlide.parentElement.remove(0);
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
