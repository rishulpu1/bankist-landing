'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrolTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const navLinks = document.querySelector('.nav__links');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabButtons = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnScrolTo.addEventListener('click', function (e) {
  e.preventDefault();
  //Old way of scroll to section
  // const s1Cord = section1.getBoundingClientRect();
  // window.scrollTo({
  //   left: s1Cord.left + window.scrollX,
  //   top: s1Cord.top + window.scrollY,
  //   behavior: 'smooth',
  // });

  //Modern way of scroll to section
  section1.scrollIntoView({ behavior: 'smooth' });
});

// Navigation
navLinks.addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');

    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//Tabbed Content
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  if (!clicked) return;

  //Remove active classes
  tabButtons.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // Show Active Tab Content
  clicked.classList.add('operations__tab--active');
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//Navigation hover effect

const navHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', navHover.bind(0.5));

nav.addEventListener('mouseout', navHover.bind(1));

// Sticky navigation

const navHeight = nav.getBoundingClientRect().height;

const navObs = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(navObs, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

//Revealing section on scroll

const sectionObs = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(sectionObs, {
  root: null,
  threshold: 0.15,
});
document.querySelectorAll('.section').forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// Lazy loading images
const lazyImgs = document.querySelectorAll('img[data-src]');

const loadedImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  //loading images
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadedImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

lazyImgs.forEach(img => imgObserver.observe(img));

//Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnRight = document.querySelector('.slider__btn--right');
  const btnLeft = document.querySelector('.slider__btn--left');
  let currentSlide = 0;
  const maxSlide = slides.length;
  const dotsContainer = document.querySelector('.dots');
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotsContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide=${i}></button>`
      );
    });
  };
  const gotoSlide = function (slide) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
    });
  };
  const activeDots = function (slide) {
    document.querySelectorAll('.dots__dot').forEach(dot => {
      dot.classList.remove('dots__dot--active');
    });
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };
  gotoSlide(0);
  const init = function () {
    createDots();
    gotoSlide(0);
    activeDots(0);
  };

  init();

  const slideToRight = function () {
    if (currentSlide === maxSlide - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    gotoSlide(currentSlide);
    activeDots(currentSlide);
  };
  const slideToLeft = function () {
    if (currentSlide === 0) {
      currentSlide = maxSlide - 1;
    } else {
      currentSlide--;
    }
    gotoSlide(currentSlide);
    currentSlide(currentSlide);
  };
  btnRight.addEventListener('click', slideToRight);
  btnLeft.addEventListener('click', slideToLeft);

  //Slide with arrow keys
  document.addEventListener('keydown', function (e) {
    e.key === 'ArrowLeft' && slideToLeft();
    e.key === 'ArrowRight' && slideToRight();
  });

  //Slide with dots
  dotsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const slide = e.target.dataset.slide;
      gotoSlide(slide);
      currentSlide(slide);
    }
  });
};
slider();
