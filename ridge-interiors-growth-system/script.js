const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.navigation');

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const isOpen = navigation.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });

  navigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navigation.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });
}

const projectForm = document.querySelector('#project-form');
const formMessage = document.querySelector('#form-message');

if (projectForm && formMessage) {
  projectForm.addEventListener('submit', (event) => {
    event.preventDefault();
    formMessage.textContent = 'Demo only: the final version will send this enquiry to Ridge by email and save it to the client tracker.';
  });
}
