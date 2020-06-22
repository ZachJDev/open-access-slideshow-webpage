let form = document.getElementById("myForm");
let playButton = document.getElementById("playButton");
let pauseButton = document.getElementById("pauseButton");

let slideshow;

// Holds main functionality -- submit AJAX request and start slideshow
form.addEventListener("submit", (event) => {
  event.preventDefault();
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
        pauseButton.style.opacity = "100";
        if (slideshow) slideshow.clear();
        data = JSON.parse(data);
        slideshow = new Slideshow(data);
        slideshow.start();
      });
  })();
});

let togglePlay = document.getElementById("play_pause");
togglePlay.addEventListener("click", playPause);
function playPause() {
  console.log(slideshow.playing);
  if (slideshow.playing) {
    slideshow.stop();
    playButton.style.opacity = "100";
    pauseButton.style.opacity = "0";
  } else {
    slideshow.start();
    pauseButton.style.opacity = "100";
    playButton.style.opacity = "0";
  }
}
