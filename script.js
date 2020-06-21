let form = document.getElementById("myForm");
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
        if(slideshow) slideshow.stop();
        Slideshow.clear();
        data = JSON.parse(data);
        slideshow = new Slideshow(data)
        slideshow.start();
      });
  })();
});