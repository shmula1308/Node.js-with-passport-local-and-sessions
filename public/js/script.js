const card = document.querySelector(".card");

card.addEventListener("click", (ev) => {
  if (ev.target.classList.contains("close")) {
    ev.target.parentNode.remove();
  }
});
