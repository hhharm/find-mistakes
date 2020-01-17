const CHECKED_CLASS = 'onoffswitch_checked';
const DEFAULT_THEME = 'theme_color_project-default';
const DARK_THEME = 'theme_color_project-inverse';
const ACCORDION_OPEN_CLASS = 'e-accordion__more_state_open';

document.addEventListener('click', event => {
  // check that clicked element is toggle button otherwise return
  // https://developer.mozilla.org/ru/docs/Web/API/Element/matches - matches docs
  // let target = event.target;
  let target = event.target;
  if (target.matches('.onoffswitch,.onoffswitch__button')) {
    processSwitchButtonClick(target);
  }
  if (target.matches('.e-accordion, .e-accordion__more, .e-accordion__short')) {
    //todo: it's buggy, fix
    toggleAccordion(target);
  }
}, false);

function toggleAccordion(target) {
  let moreElement = target;
  if (!target.classList.contains('e-accordion')) {
    target = target.closest('.e-accordion');
  }
  target = target.children.item(1);

  if (target.classList.contains(ACCORDION_OPEN_CLASS)) {
    target.classList.remove(ACCORDION_OPEN_CLASS);
  } else {
    target.classList.add(ACCORDION_OPEN_CLASS);
  }
}

function processSwitchButtonClick(target) {
  if (target.classList.contains('onoffswitch__button')) {
    target = document.getElementsByClassName('onoffswitch')[0];
  }
  const classes = target.classList;
  const defaultThemeEls = Array.from(document.getElementsByClassName(DEFAULT_THEME));
  const inverseThemeEls = Array.from(document.getElementsByClassName(DARK_THEME));
  if (classes.contains(CHECKED_CLASS)) {
    classes.remove(CHECKED_CLASS);
  } else {
    classes.add(CHECKED_CLASS);
  }
  defaultThemeEls.forEach(element => {
    element.classList.remove(DEFAULT_THEME);
    element.classList.add(DARK_THEME);
  });
  inverseThemeEls.forEach(element => {
    element.classList.remove(DARK_THEME);
    element.classList.add(DEFAULT_THEME);
  });
}
