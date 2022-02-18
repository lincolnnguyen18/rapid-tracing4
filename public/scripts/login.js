const forms = document.querySelectorAll('form');
forms.forEach(form => form.addEventListener('submit', e => e.preventDefault()));

const $register_link = document.querySelectorAll('#register-link')[0];
const $back_link = document.querySelectorAll('#back-link')[0];
const $login_form = document.querySelectorAll('#login-form')[0];
const $register_form = document.querySelectorAll('#register-form')[0];

let mode = 'login';
let submitted = false;

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

const display_message = (text) => {
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
  if (submitted) {
    return;
  }
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
      submitted = true;
      window.location.href = '/';
    } else {
      display_message(json.error);
    }
  });
});

$register_button.addEventListener('click', () => {
  if (submitted) {
    return;
  }
  let username = document.querySelectorAll('#register-username-input')[0].value;
  let password = document.querySelectorAll('#register-password-input')[0].value;
  let confirm_password = document.querySelectorAll('#register-confirm-password-input')[0].value;
  if (password != confirm_password) {
    display_message('Passwords do not match');
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
      submitted = true;
      $register_error.classList.remove('hidden');
      let remaining_time = 3;
      const interval_function = () => {
        $register_error.innerHTML = `Registered successfully. Logging you in in ${remaining_time} seconds...`;
        remaining_time--;
        if (remaining_time == 0) {
          clearInterval(interval);
          window.location.href = '/';
        }
      }
      interval_function();
      let interval = setInterval(() => {
        interval_function();
      }, 1000);
    } else {
      display_message(json.error);
    }
  });
});