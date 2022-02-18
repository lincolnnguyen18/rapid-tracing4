import Cookies from '/modules/js.cookie.min.mjs';

const body = document.querySelectorAll('body')[0];
const user_id = Cookies.get('id');
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
  if (preview_json) {
    fetch('/api/add-picture', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preview_json)
    })
    .then(res => res.json())
    .then(json => {
      console.log(json);
      close_upload_dialog();
    });
  }
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
  const formData = new FormData();
  formData.append('picture', file);
  fetch('/api/get-picture-preview?size=' + size + '&sigma=' + sigma, {
    method: 'POST',
    body: formData
  })
  .then(res => res.json())
  .then(json => {
    preview_json = json;
    // console.log(`preview_json: ${JSON.stringify(preview_json)}`);
    // $upload_dialog_window_image.src = `/shared/${user_id}/temp/${preview_json.outline}`;
    switch (selected_button) {
      case $upload_dialog_header_modes_original_button:
        $upload_dialog_window_image.src = `/shared/${user_id}/temp/${preview_json.filename}/original.${preview_json.extension}`;
        break;
      case $upload_dialog_header_modes_outline_button:
        $upload_dialog_window_image.src = `/shared/${user_id}/temp/${preview_json.filename}/outline.${preview_json.extension}`;
        break;
      case $upload_dialog_header_modes_details_button:
        $upload_dialog_window_image.src = `/shared/${user_id}/temp/${preview_json.filename}/details.${preview_json.extension}`;
        break;
    }
  });
}
const $kernel_size_slider = document.querySelectorAll('#kernel-size-slider')[0];
const $kernel_sigma_slider = document.querySelectorAll('#kernel-sigma-slider')[0];
let seconds_since_size_change = 0;
let seconds_since_sigma_change = 0;
let last_size_interval = null;
let last_sigma_interval = null;
$kernel_size_slider.addEventListener('input', (e) => {
  seconds_since_size_change = 0;
  $upload_dialog_window_image.classList.add('getting-preview');
  if (last_size_interval)
    clearInterval(last_size_interval);
  let interval = setInterval(() => {
    seconds_since_size_change += 1;
    console.log(seconds_since_size_change);
    if (seconds_since_size_change >= 1) {
      console.log(`kernel size: ${$kernel_size_slider.value}`);
      get_preview(current_file, $kernel_size_slider.value, $kernel_sigma_slider.value);
      clearInterval(interval);
    }
  }, 1000);
  last_size_interval = interval;
});
$kernel_sigma_slider.addEventListener('input', (e) => {
  seconds_since_sigma_change = 0;
  $upload_dialog_window_image.classList.add('getting-preview');
  if (last_sigma_interval)
    clearInterval(last_sigma_interval);
  let interval = setInterval(() => {
    seconds_since_sigma_change += 1;
    console.log(seconds_since_sigma_change);
    if (seconds_since_sigma_change >= 1) {
      console.log(`kernel sigma: ${$kernel_sigma_slider.value}`);
      get_preview(current_file, $kernel_size_slider.value, $kernel_sigma_slider.value);
      clearInterval(interval);
    }
  }, 1000);
  last_sigma_interval = interval;
});
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
      const max_dimension = 2000;
      const max_kernel = Math.min(Math.max(image.width, image.height), max_dimension);
      $kernel_size_slider.max = max_kernel;
      $kernel_sigma_slider.max = max_kernel;
      $kernel_size_slider.value = $kernel_size_slider.max * 0.05;
      $kernel_sigma_slider.value = $kernel_sigma_slider.max * 1;
      get_preview(file, $kernel_size_slider.value, $kernel_sigma_slider.value).then(() => {
        $upload_dialog_window_image.onload = () => {
          $upload_dialog_window_header.classList.remove('disabled');
          $upload_dialog_upload_button.classList.remove('disabled');
          $upload_dialog_placeholder.classList.add('hidden');
          $upload_dialog_placeholder_text.innerHTML = old_text;
          $upload_dialog_window_image.classList.remove('hidden');
          $upload_dialog_window_header.classList.remove('hidden');
          $upload_dialog_placeholder.classList.remove('green');
          $upload_dialog_window_image.classList.remove('getting-preview');
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
let selected_button = $upload_dialog_header_modes_outline_button;
$upload_dialog_header_modes_original_button.addEventListener('click', () => {
  selected_button.classList.remove('selected-mode');
  selected_button = $upload_dialog_header_modes_original_button;
  selected_button.classList.add('selected-mode');
  $upload_dialog_window_image.src = `/shared/${user_id}/temp/${preview_json.filename}/original.${preview_json.extension}`;
});
$upload_dialog_header_modes_outline_button.addEventListener('click', () => {
  selected_button.classList.remove('selected-mode');
  selected_button = $upload_dialog_header_modes_outline_button;
  selected_button.classList.add('selected-mode');
  $upload_dialog_window_image.src = `/shared/${user_id}/temp/${preview_json.filename}/outline.${preview_json.extension}`;
});
$upload_dialog_header_modes_details_button.addEventListener('click', () => {
  selected_button.classList.remove('selected-mode');
  selected_button = $upload_dialog_header_modes_details_button;
  selected_button.classList.add('selected-mode');
  $upload_dialog_window_image.src = `/shared/${user_id}/temp/${preview_json.filename}/details.${preview_json.extension}`;
});

// library dialog
const $library_dialog = document.querySelectorAll('#library-dialog')[0];
const $library_dialog_window = document.querySelectorAll('#library-dialog-window')[0];
const $pictures_button = document.querySelectorAll('#pictures-button')[0];
const $library_dialog_window_close_button = document.querySelectorAll('#library-dialog-window > div.buttons > span.close-button')[0];
const $library_dialog_window_placeholder = document.querySelectorAll('#library-dialog-window > div.placeholder')[0];
const $library_dialog_window_images = document.querySelectorAll('#library-dialog-window > div.images')[0];

$library_dialog.addEventListener('click', (e) => {
  close_library_dialog();
});

$library_dialog_window.addEventListener('click', (e) => {
  e.stopPropagation();
});

const open_library_dialog = () => {
  $library_dialog.classList.remove('hidden');
  $container.classList.add('blurred');
}

const close_library_dialog = () => {
  $library_dialog.classList.add('hidden');
  $container.classList.remove('blurred');
}

let last_library_selection = null;
let last_library_selection_id = null;

const get_library = () => {
  fetch(`/api/get-pictures`)
  .then(res => res.json())
  .then(json => {
    if (json.length > 0) {
      $library_dialog_window_images.innerHTML = '';
      json.forEach(picture => {
        const { id, filename, extension } = picture;
        const $img = document.createElement('img');
        $img.src = `/shared/${user_id}/library/${filename}/thumbnail.${extension}`;
        $img.classList.add('num-' + id);
        $img.addEventListener('click', () => {
          if (last_library_selection) {
            if (last_library_selection != $img) {
              last_library_selection.classList.remove('half-opacity');
              $img.classList.add('half-opacity');
              last_library_selection = $img;
              last_library_selection_id = id;
            } else {
              $img.classList.remove('half-opacity');
              last_library_selection = null;
              last_library_selection_id = null;
            }
          } else {
            $img.classList.add('half-opacity');
            last_library_selection = $img;
            last_library_selection_id = id;
          }
          console.log(last_library_selection_id);
        });
        $library_dialog_window_images.appendChild($img);
      });
      $library_dialog_window_images.classList.remove('hidden');
      $library_dialog_window_placeholder.classList.add('hidden');
    } else {
      $library_dialog_window_placeholder.classList.remove('hidden');
    }
  });
}

$pictures_button.addEventListener('click', () => {
  open_library_dialog();
  get_library();
});

$library_dialog_window_close_button.addEventListener('click', () => {
  close_library_dialog();
});

// keydown events
document.addEventListener('keydown', (e) => {
  if (e.key == 'Escape') {
    close_upload_dialog();
    close_library_dialog();
  }
});
window.addEventListener('paste', e => {
  const files = e.clipboardData.files;
  if (files.length > 0) {
    handleFile(files[0]);
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