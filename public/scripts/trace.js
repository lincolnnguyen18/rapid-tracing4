const body = document.querySelectorAll('body')[0];
let current_file = null;
let preview_json = null;

// upload dialog window
const $upload_dialog = document.querySelectorAll('#upload-dialog')[0];
const $upload_dialog_window = document.querySelectorAll('#upload-dialog-window')[0];
const $upload_button = document.querySelectorAll('#upload-button')[0];
const $upload_dialog_cancel_button = document.querySelectorAll('#upload-dialog-cancel-button')[0];
const $upload_dialog_upload_button = document.querySelectorAll('#upload-dialog-upload-button')[0];
const $container = document.querySelectorAll('#container')[0];
let upload_dialog_open = false;
const open_upload_dialog = () => {
  $upload_dialog.classList.remove('hidden');
  $container.classList.add('blurred');
  upload_dialog_open = true;
};
const close_upload_dialog = () => {
  $upload_dialog.classList.add('hidden');
  $container.classList.remove('blurred');
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
  close_upload_dialog();
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
const $upload_dialog_message = document.querySelectorAll('#upload-dialog-window .dialog-bottom .message')[0];
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
const get_preview = async (file, size, sigma) => {
  console.log('get_preview called');
  console.log(size, sigma);
  const formData = new FormData();
  formData.append('picture', file);
  fetch('/api/get-picture-preview?size=' + size + '&sigma=' + sigma, {
    method: 'POST',
    body: formData
  })
  .then(res => res.json())
  .then(json => {
    console.log(json);
    preview_json = json;
    $upload_dialog_window_image.src = `/shared/${preview_json.outline}`;
  });
}
const $kernel_size_slider = document.querySelectorAll('#kernel-size-slider')[0];
const $kernel_sigma_slider = document.querySelectorAll('#kernel-sigma-slider')[0];
function handleFile(file) {
  if (!file.type.match('image.*')) {
    $upload_dialog_message.innerText = 'Invalid image file type';
    $upload_dialog_message.classList.remove('hidden');
    setTimeout(() => {
      $upload_dialog_message.classList.add('hidden');
    }, 3000);
    $upload_dialog_placeholder.classList.remove('green');
    return;
  }
  let old_text = $upload_dialog_placeholder_text.innerHTML;
  $upload_dialog_placeholder_text.innerHTML = 'Uploading...';
  $upload_dialog_window_header.classList.add('disabled');
  $upload_dialog_upload_button.classList.add('disabled');
  $upload_dialog_window_image.classList.add('hidden');
  $upload_dialog_placeholder.classList.remove('hidden');
  current_file = file;
  $upload_dialog_window_image.file = file;
  const reader = new FileReader();
  reader.onload = (e) => {
    let image = new Image();
    image.src = e.target.result;
    image.onload = () => {
      console.log(image.width, image.height);
      $kernel_size_slider.value = parseInt(Math.min(image.width, image.height) / 33);
      $kernel_size_slider.max = parseInt($kernel_size_slider.value * 4);
      $kernel_sigma_slider.value = parseInt(Math.min(image.width, image.height) / 66);
      $kernel_sigma_slider.max = parseInt($kernel_sigma_slider.value * 4);
      get_preview(file, $kernel_size_slider.value, $kernel_sigma_slider.value).then(() => {
        $upload_dialog_window_image.onload = () => {
          $upload_dialog_window_header.classList.remove('disabled');
          $upload_dialog_upload_button.classList.remove('disabled');
          $upload_dialog_placeholder.classList.add('hidden');
          $upload_dialog_placeholder_text.innerHTML = old_text;
          $upload_dialog_window_image.classList.remove('hidden');
          $upload_dialog_window_header.classList.remove('hidden');
          $upload_dialog_placeholder.classList.remove('green');
        };
      });
    };
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

// upload dialog mode buttons
const $upload_dialog_header_modes_original_button = document.querySelectorAll('#upload-dialog-header-modes-original-button')[0];
const $upload_dialog_header_modes_outline_button = document.querySelectorAll('#upload-dialog-header-modes-outline-button')[0];
const $upload_dialog_header_modes_details_button = document.querySelectorAll('#upload-dialog-header-modes-details-button')[0];
// $upload_dialog_header_modes_original_button.addEventListener('click', () => {

// keydown events
document.addEventListener('keydown', (e) => {
  if (e.key == 'Escape') {
    if (upload_dialog_open)
      close_upload_dialog();
  }
});

// logout
const logout_button = document.querySelectorAll('#logout-button')[0];
logout_button.addEventListener('click', () => {
  fetch('/api/logout', {
    method: 'GET'
  }).then(() => {
    window.location.href = '/';
  });
});