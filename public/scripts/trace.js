const body = document.querySelectorAll('body')[0];
let current_file = null;

// upload dialog window
const $upload_dialog = document.querySelectorAll('#upload-dialog')[0];
const $upload_dialog_window = document.querySelectorAll('#upload-dialog-window')[0];
const $upload_button = document.querySelectorAll('#upload-button')[0];
const $upload_dialog_cancel_button = document.querySelectorAll('#upload-dialog-cancel-button')[0];
const $upload_dialog_upload_button = document.querySelectorAll('#upload-dialog-upload-button')[0];
let upload_dialog_open = false;
const open_upload_dialog = () => {
  $upload_dialog.classList.remove('hidden');
  upload_dialog_open = true;
};
const close_upload_dialog = () => {
  $upload_dialog.classList.add('hidden');
  upload_dialog_open = false;
  $upload_dialog_input.value = '';
  current_file = null;
  $upload_dialog_window_image.file = null;
  $upload_dialog_window_image.src = '';
  file_cleared();
};
$upload_button.addEventListener('click', () => {
  open_upload_dialog();
});
$upload_dialog_cancel_button.addEventListener('click', () => {
  close_upload_dialog();
});
$upload_dialog_upload_button.addEventListener('click', () => {
  if (current_file) {
    upload_file(current_file);
  }
});
$upload_dialog.addEventListener('click', (e) => {
  close_upload_dialog();
});
$upload_dialog_window.addEventListener('click', (e) => {
  e.stopPropagation();
});

// upload dialog dropbox
const $upload_dialog_window_image = document.querySelectorAll('#upload-dialog-window-image')[0];
const $upload_dialog_input = document.querySelectorAll('#upload-dialog-input')[0];
const $upload_dialog_placeholder = document.querySelectorAll('#upload-dialog-placeholder')[0];
const $upload_dialog_window_header = document.querySelectorAll('#upload-dialog-window .dialog-header')[0];
const $upload_dialog_placeholder_text = document.querySelectorAll('#upload-dialog-placeholder .placeholder-text')[0];
const file_added = () => {
  $upload_dialog_placeholder.classList.add('hidden');
  $upload_dialog_window_image.classList.remove('hidden');
  $upload_dialog_placeholder.classList.remove('green');
  $upload_dialog_window_header.classList.remove('hidden');
  $upload_dialog_upload_button.classList.remove('disabled');
};
const file_cleared = () => {
  $upload_dialog_placeholder.classList.remove('hidden');
  $upload_dialog_window_image.classList.add('hidden');
  $upload_dialog_window_header.classList.add('hidden');
  $upload_dialog_upload_button.classList.add('disabled');
};
const upload_file = (file) => {
  console.log('upload_file called');
  console.log(file);
}

function handleFile(file) {
  if (current_file) {
    let old_width = $upload_dialog_window_image.offsetWidth;
    let old_height = $upload_dialog_window_image.offsetHeight;
    $upload_dialog_placeholder.style.width = `${old_width}px`;
    $upload_dialog_placeholder.style.height = `${old_height}px`;
    $upload_dialog_window_header.classList.add('disabled');
    $upload_dialog_upload_button.classList.add('disabled');
    $upload_dialog_window_image.classList.add('hidden');
    $upload_dialog_placeholder.classList.remove('hidden');
  }
  let old_text = $upload_dialog_placeholder_text.innerHTML;
  $upload_dialog_placeholder_text.innerHTML = 'Uploading...';
  current_file = file;
  $upload_dialog_window_image.file = file;
  const reader = new FileReader();
  reader.onload = (e) => {
    $upload_dialog_window_image.src = e.target.result;
  };
  reader.onloadend = () => {
    $upload_dialog_placeholder.style.width = '450px';
    $upload_dialog_placeholder.style.height = '300px';
    $upload_dialog_window_header.classList.remove('disabled');
    $upload_dialog_upload_button.classList.remove('disabled');
    $upload_dialog_placeholder.classList.add('hidden');
    $upload_dialog_placeholder_text.innerHTML = old_text;
    $upload_dialog_window_image.classList.remove('hidden');
    file_added();
  };
  reader.readAsDataURL(file);
}
function dragenter(e) {
  e.stopPropagation();
  e.preventDefault();
  $upload_dialog_placeholder.classList.add('green');
}
function dragover(e) {
  e.stopPropagation();
  e.preventDefault();
  $upload_dialog_placeholder.classList.add('green');
}
function dragleave(e) {
  e.stopPropagation();
  e.preventDefault();
  $upload_dialog_placeholder.classList.remove('green');
}
function drop(e) {
  e.stopPropagation();
  e.preventDefault();
  const dt = e.dataTransfer;
  const file = dt.files[0];
  handleFile(file);
}
$upload_dialog_input.addEventListener('change', (e) => {
  const file = e.target.files[0];
  handleFile(file);
});
const $dropbox = document.querySelectorAll('#upload-dialog-window .dialog-top')[0];
$dropbox.addEventListener('dragenter', dragenter, false);
$dropbox.addEventListener('dragover', dragover, false);
$dropbox.addEventListener('drop', drop, false);
$dropbox.addEventListener('dragleave', dragleave, false);
// keydown events
document.addEventListener('keydown', (e) => {
  if (e.key == 'Escape') {
    if (upload_dialog_open)
      close_upload_dialog();
  }
});

/* logout */
const logout_button = document.querySelectorAll('#logout-button')[0];
logout_button.addEventListener('click', () => {
  fetch('/api/logout', {
    method: 'GET'
  }).then(() => {
    window.location.href = '/';
  });
});