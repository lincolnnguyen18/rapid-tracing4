const forms = document.querySelectorAll('form');
forms.forEach(form => form.addEventListener('submit', e => e.preventDefault()));

const $register_link = document.querySelectorAll('#register-link')[0];
const $back_link = document.querySelectorAll('#back-link')[0];
const $login_form = document.querySelectorAll('#login-form')[0];
const $register_form = document.querySelectorAll('#register-form')[0];

let mode = 'login';

$register_link.addEventListener('click', () => {
  $login_form.classList.toggle('hidden');
  $register_form.classList.toggle('hidden');
  mode = 'register';
});

$back_link.addEventListener('click', () => {
  $login_form.classList.toggle('hidden');
  $register_form.classList.toggle('hidden');
  mode = 'login';
});

const $login_button = document.querySelectorAll('#login-button')[0];
const $register_button = document.querySelectorAll('#register-button')[0];
const $login_error = document.querySelectorAll('#login-error')[0];
const $register_error = document.querySelectorAll('#register-error')[0];

const display_error = (text) => {
  error = null;
  if (mode == 'login') {
    error = $login_error;
  } else {
    error = $register_error;
  }
  error.innerHTML = text;
  error.classList.remove('hidden');
  setTimeout(() => {
    error.classList.add('hidden');
  }, 3000);
};

$login_button.addEventListener('click', () => {
  let username = document.querySelectorAll('#login-username-input')[0].value;
  let password = document.querySelectorAll('#login-password-input')[0].value;
  let data = { username, password };
  fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(json => {
    if (!json.error) {
      window.location.href = '/';
    } else {
      display_error(json.error);
    }
  });
});

$register_button.addEventListener('click', () => {
  let username = document.querySelectorAll('#register-username-input')[0].value;
  let password = document.querySelectorAll('#register-password-input')[0].value;
  let confirm_password = document.querySelectorAll('#register-confirm-password-input')[0].value;
  if (password != confirm_password) {
    display_error('Passwords do not match');
    return;
  }
  let data = { username, password };
  fetch('/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(json => {
    if (!json.error) {
      window.location.href = '/';
    } else {
      display_error(json.error);
    }
  });
});