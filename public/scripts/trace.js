const body = document.querySelectorAll('body')[0];
let current_file = null;

// upload dialog window
const upload_dialog = document.querySelectorAll('#upload-dialog')[0];
const upload_dialog_window = document.querySelectorAll('#upload-dialog-window')[0];
const upload_button = document.querySelectorAll('#upload-button')[0];
const upload_dialog_cancel_button = document.querySelectorAll('#upload-dialog-cancel-button')[0];
const upload_dialog_upload_button = document.querySelectorAll('#upload-dialog-upload-button')[0];
let upload_dialog_open = false;
const open_upload_dialog = () => {
  upload_dialog.classList.remove('hidden');
  upload_dialog_open = true;
};
const close_upload_dialog = () => {
  upload_dialog.classList.add('hidden');
  upload_dialog_open = false;
  upload_dialog_input.value = '';
  current_file = null;
  upload_dialog_window_image.file = null;
  upload_dialog_window_image.src = '';
  file_cleared();
};
upload_button.addEventListener('click', () => {
  open_upload_dialog();
});
upload_dialog_cancel_button.addEventListener('click', () => {
  close_upload_dialog();
});
upload_dialog_upload_button.addEventListener('click', () => {
  if (current_file) {
    upload_file(current_file);
    close_upload_dialog();
  }
});
upload_dialog.addEventListener('click', (e) => {
  close_upload_dialog();
});
upload_dialog_window.addEventListener('click', (e) => {
  e.stopPropagation();
});

// upload dialog dropbox
const upload_dialog_window_image = document.querySelectorAll('#upload-dialog-window-image')[0];
const upload_dialog_input = document.querySelectorAll('#upload-dialog-input')[0];
const upload_dialog_placeholder = document.querySelectorAll('#upload-dialog-placeholder')[0];
const upload_dialog_window_header = document.querySelectorAll('#upload-dialog-window .dialog-header')[0];
let dropbox = document.querySelectorAll('#upload-dialog-window .dialog-top')[0];
const file_added = () => {
  upload_dialog_placeholder.classList.add('hidden');
  upload_dialog_window_image.classList.remove('hidden');
  upload_dialog_placeholder.classList.remove('green');
  upload_dialog_window_header.classList.remove('disabled');
  upload_dialog_upload_button.classList.remove('disabled');
};
const file_cleared = () => {
  upload_dialog_placeholder.classList.remove('hidden');
  upload_dialog_window_image.classList.add('hidden');
  upload_dialog_window_header.classList.add('disabled');
};
const upload_file = (file) => {
  console.log('upload_file called');
  console.log(file);
}

function handleFile(file) {
  current_file = file;
  console.log(file);
  upload_dialog_window_image.file = file;
  const reader = new FileReader();
  reader.onload = (e) => {
    upload_dialog_window_image.src = e.target.result;
  };
  reader.readAsDataURL(file);
  file_added();
}
function dragenter(e) {
  e.stopPropagation();
  e.preventDefault();
  upload_dialog_placeholder.classList.add('green');
}
function dragover(e) {
  e.stopPropagation();
  e.preventDefault();
  upload_dialog_placeholder.classList.add('green');
}
function dragleave(e) {
  e.stopPropagation();
  e.preventDefault();
  upload_dialog_placeholder.classList.remove('green');
}
function drop(e) {
  e.stopPropagation();
  e.preventDefault();
  const dt = e.dataTransfer;
  const file = dt.files[0];
  handleFile(file);
}
upload_dialog_input.addEventListener('change', (e) => {
  const file = e.target.files[0];
  handleFile(file);
});
dropbox.addEventListener('dragenter', dragenter, false);
dropbox.addEventListener('dragover', dragover, false);
dropbox.addEventListener('drop', drop, false);
dropbox.addEventListener('dragleave', dragleave, false);
// keydown events
document.addEventListener('keydown', (e) => {
  if (e.key == 'Escape') {
    if (upload_dialog_open)
      close_upload_dialog();
  }
});