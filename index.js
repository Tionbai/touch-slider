const slider = document.querySelector(".slider"),
  slides = Array.from(document.querySelectorAll(".slide"));

let isDragging = false,
  startPosition = 0,
  currentTranslate = 0,
  prevTranslate = 0,
  animationID = 0,
  currentIndex = 0;

const getPositionX = (event) => {
  return event.type.includes("mouse") ? event.pageX : event.touches[0].clientX;
};

const setSliderPosition = () => {
  slider.style.transform = `translateX(${currentTranslate}px)`;
};

const animation = () => {
  setSliderPosition();
  if (isDragging) requestAnimationFrame(animation);
};

const setPositionByIndex = () => {
  currentTranslate = currentIndex * -window.innerWidth;
  prevTranslate = currentTranslate;
  setSliderPosition();
};

const touchStart = (index) => {
  return (event) => {
    currentIndex = index;
    startPosition = getPositionX(event);
    isDragging = true;

    animationID = requestAnimationFrame(animation);
    slider.classList.add("grabbing");
  };
};

const touchEnd = () => {
  isDragging = false;
  cancelAnimationFrame(animationID);

  const movedBy = currentTranslate - prevTranslate;

  if (movedBy < -100 && currentIndex < slides.length - 1) currentIndex += 1;
  if (movedBy > 100 && currentIndex > 0) currentIndex -= 1;

  setPositionByIndex();

  slider.classList.remove("grabbing");
};

const touchMove = (event) => {
  if (isDragging) {
    const currentPosition = getPositionX(event);
    currentTranslate = prevTranslate + currentPosition - startPosition;
  }
};

slides.forEach((slide, index) => {
  const slideImage = slide.querySelector("img");
  slideImage.addEventListener("dragstart", (event) => event.preventDefault());

  // Touch events
  slide.addEventListener("touchstart", touchStart(index));
  slide.addEventListener("touchend", touchEnd);
  slide.addEventListener("touchmove", touchMove);

  // Mouse events
  slide.addEventListener("mousedown", touchStart(index));
  slide.addEventListener("mouseup", touchEnd);
  slide.addEventListener("mouseleave", touchEnd);
  slide.addEventListener("mousemove", touchMove);
});

window.oncontextmenu = (event) => {
  event.preventDefault();
  event.stopPropagation();
  return false;
};
