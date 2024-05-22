'use strict';

///////////////////////////////////////
// Modal window
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
// ყველა ღილაკისთვის ვაკეთებთ შესვლის ფუნქციას, იგივეა რაც for of loop
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

// სქროლვის ფუნქცია
btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  console.log(e.target.getBoundingClientRect());

  console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);
  console.log(
    'height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  // scrolling სადამდე უნდა ჩასქროლოს old way :)
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // ეს უფრო თანამედროვე მეთოდია,მუშაობს მხოლოდ ახალ ბრაუზერებში სქროლვის mew way :)
  section1.scrollIntoView({
    behavior: 'smooth',
  });
});

///////////////////////////////
//page navigation
// ყველა ნავ ლინკს ჩავუშენეთ ფუნქცია რომ მითითბულ სექციებამდე ჩასქროლოს დაკლილვისას
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({
//       behavior: 'smooth',
//     });
//   });
// });
// თუმცა ესე უფრო ნელა მუშაობს ამიტომ ივენთდელეგაციის მეთოდს გამოვიყენებთ
// ჯერ ივენთ-ლისთნერს ვქმნით საერთო მშობელ ელემენტს
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  //სტრატეგიის დამთხვევა
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//მიბმული კომპონენტი

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // Guard clause,ანუ თუ არ დაკლიკდა შეწყვიტე ფუნქცია
  if (!clicked) return;

  // Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // Activate tab
  clicked.classList.add('operations__tab--active');

  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//menu fade animation
const handleHover = function (e) {
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

//ივენთლისთნერი პირდაპირ არგუმენტს ვერ მიიRებს ფუნქციაში უნდა იყოს ფუნქცია გამოძახებული არგუმენტებით,bind მეთოდი მაგას შვება
nav.addEventListener('mouseover', handleHover.bind(0.5));
// მაუსის მოშორებისას რომ დაუბრუნდეს ფერი
nav.addEventListener('mouseout', handleHover.bind(1));

////////////////////
// //sticky navigation

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
console.log(navHeight);

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`, // ეს იმისთზვსი რომ არ გაწყდეს, ანუ ჰეადერ შეჩერდეს უფრო ადრე
});

headerObserver.observe(header);

//revealing sections
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// lazy loading images სურათების ჩვენება
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);

  if (!entry.isIntersecting) return;

  //replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
});

imgTargets.forEach(img => imgObserver.observe(img));

//sliders სლაიდები
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();

///////////////////////////////
//////////////////////////////
/////////////////////////////
// TOOLS

// //
// //selecting and deleting elements
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// const header = document.querySelector('.header');
// const allSections = document.querySelectorAll('.section');
// console.log(allSections);

// document.getElementById('section--1');
// const allButtons = document.getElementsByTagName('button');
// console.log(allButtons);
// document.getElementsByClassName('btn');

// // creating and inserting elements
// // .insertAdjecentHtml
// // ვქმნით დომ ელემენტს თუმცა უნდა ჩავნერგოთ, ანუ ჯერ არ გამოჩნდება ეს დივი
// const message = document.createElement('div');
// //აქ უკვე ჩავამატეთ
// message.classList.add('cookie-message');
// message.textContent =
//   'We use cookied for improved functionality and analytics.';
// message.innerHTML =
//   'We use cookied for improved functionality and analytics. <button class ="btn btn--close-cookie">Got it!</button>';

// // აი ამით უკვე ჩაჯდა, საიტის თავში ჩასვამს
// // header.prepend(message);
// //აქ უკვე ბოლოში ჩასვა
// header.append(message.cloneNode(true));

// // header.before(message);
// // header.after(message);

// //წავშალოთ cookie ტექსტი,ღილაკზე დაჭერისას
// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     // message.remove();
//     message.parentElement.removeChild(message);
//   });

// //styles,attributes and classes მუშაობა
// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';

// console.log(message.style.height);
// console.log(message.style.backgroundColor);

// console.log(getComputedStyle(message).color);
// console.log(getComputedStyle(message).height);
// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 40 + 'px';

// // ფერი შევცვალეთ
// document.documentElement.style.setProperty('--color-primary', 'orangered');

// //დავლოგეთ html თეგების  ატრიბუტები !!!
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(logo.src);
// console.log(logo.className);

// console.log(logo.designer); // undefined
// console.log(logo.getAttribute('designer')); // imuSavebs :)

// // ეს საპირისპიროა getAttribute-ის
// logo.setAttribute('company', 'Bankist');

// // href ლინკსაც წვდება
// const link = document.querySelector('.nav__link--btn');
// console.log(link.href);
// console.log(link.getAttribute('.href'));

// // data attributes
// // დატას html შიც ვინახავთ
// console.log(logo.dataset.versionNumber);

// //classes
// logo.classList.add('c', 'j');
// logo.classList.remove('c', 'j');
// logo.classList.toggle('c', 'j');
// logo.classList.contains('c', 'j');

// // ეს არ გამოიყენო, გადატვირთავს
// logo.className = 'andro';

// const btnScrollTo = document.querySelector('.btn--scroll-to');
// const section1 = document.querySelector('#section--1');

// btnScrollTo.addEventListener('click', function (e) {
//   const s1coords = section1.getBoundingClientRect();
//   console.log(s1coords);

//   console.log(e.target.getBoundingClientRect());

//   console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);
//   console.log(
//     'height/width viewport',
//     document.documentElement.clientHeight,
//     document.documentElement.clientWidth
//   );

//   // scrolling სადამდე უნდა ჩასქროლოს old way :)
//   // window.scrollTo({
//   //   left: s1coords.left + window.pageXOffset,
//   //   top: s1coords.top + window.pageYOffset,
//   //   behavior: 'smooth',
//   // });

//   // ეს უფრო თანამედროვე მეთოდია,მუშაობს მხოლოდ ახალ ბრაუზერებში სქროლვის mew way :)
//   section1.scrollIntoView({
//     behavior: 'smooth',
//   });
// });

//types of events and event handlers

// მაუსის გადატარების ივენთი 'mouseenter'
// const h1 = document.querySelector('h1');

// const alertH1 = function (e) {
//   alert('You are reading the heading');
// };

// h1.addEventListener('mouseenter', alertH1);

// //ამ კოდით 3 წამის მერე წაშლის ამ ივენთს და აღარ იზამს
// setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);

//ეს ძველებური გზაა ასე
// h1.onmouseenter = function (e) {
//   alert('You are reading the heading');
// };

//event propagation bubbling
// rgb(255,255,255)
// რენდომად ვუცვლით ბექგრაუნდს ნავ სექციას
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();

//   //იგივე რჩება bubbling ის გამო,
//   //e.currentTarget იგივეა რაც this.keyword
//   console.log('LINK', e.target, e.currentTarget);

//   //შევწვყვეტს ამის შემდგომ იიგვე ივენთებს,რაც სხვა ელემენტებზეა ჩაშენებული
//   // e.stopPropagation();
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();

//   //იგივე რჩება bubbling ის გამო,
//   //e.currentTarget იგივეა რაც this.keyword
//   console.log('CONTAINER', e.target, e.currentTarget);
// });

// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();

//   //იგივე რჩება bubbling ის გამო,
//   //e.currentTarget იგივეა რაც this.keyword
//   console.log('NAV', e.target, e.currentTarget);
// });

// // DOM Traversing
// const h1 = document.querySelector('h1');

// // Going downwards: child
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);
// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'orangered';

// // going upwards :parents
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// // closest იგივეა არც querryselector
// h1.closest('.header').style.background = 'var(--gradient-secondary)';

// h1.closest('h1').style.background = 'var(--gradient-secondary)';

// //goingsideways : siblings
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

// //ყველა შვილ ელემენტს მივწვდით ესე
// console.log(h1.parentElement.children);
// [...h1.parentElement.children].forEach(function (el) {
//   if (el !== h1) el.style.transform = 'scale(0.5)';
// });

//lifecycle DOM events
// document.addEventListener('DOMContentLoaded', function (e) {
//   console.log('HTML parsed and DOM tree built !', e);
// });

// document.addEventListener('load', function (e) {
//   console.log('page fully loaded', e);
// });

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = 'message';
// });

//efficient script loading: defer and async
