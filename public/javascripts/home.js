const homeInit = () => {
  history.scrollRestoration = "manual"
  
  const navHitbox = document.querySelector('.landing-nav-hitbox');
  const navWrapper = document.querySelector('.landing-nav-wrapper');
  const navSwitch = document.querySelector('.landing-nav-switch');
  const slide = document.querySelector('.slide-2');

  navHitbox.addEventListener("click", () => {
    navSwitch.classList.toggle("right-switch-active");
    navWrapper.classList.toggle("right-wrapper-active");
    slide.classList.toggle("slide-right-active");
  });

  window.onscroll = function() {navbarOnScroll()};

  function navbarOnScroll() {
    let navSideBar = document.querySelector('.nav-global');
    let hamburger = document.querySelector('.hamburger');
    let scrollPosition = document.documentElement.scrollTop;
    let clientHeight = document.documentElement.clientHeight;

    if (scrollPosition > clientHeight/2 && navSideBar.classList.contains('screen-mode')) {
      navSideBar.classList.remove('screen-mode');
      hamburger.classList.remove('hamburger-screen-mode');
    } else if (scrollPosition <= clientHeight/2 && !(navSideBar.classList.contains('screen-mode'))) {
      navSideBar.classList.add('screen-mode');
      hamburger.classList.add('hamburger-screen-mode');
    }
  }

  const brycepSlide = document.querySelector('.eng-kit-brycep');
  const hyelosSlide = document.querySelector('.eng-kit-hyelos');
  const stcSlide = document.querySelector('.eng-kit-stc');

  const changeToBrycep = () => {
    brycepSlide.classList.remove('eng-kit-hide');
    brycepSlide.classList.add('eng-kit-hide');
    brycepSlide.classList.add('eng-kit-hide');
  }

  const changeToHyelos = () => {
    brycepSlide.classList.add('eng-kit-hide');
    brycepSlide.classList.remove('eng-kit-hide');
    brycepSlide.classList.add('eng-kit-hide');
  }

  const changeToSTC = () => {
    brycepSlide.classList.add('eng-kit-hide');
    brycepSlide.classList.add('eng-kit-hide');
    brycepSlide.classList.remove('eng-kit-hide');
  }
}