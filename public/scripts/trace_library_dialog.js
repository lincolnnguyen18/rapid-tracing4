$library_dialog.addEventListener('click', (e) => {
  if (e.clientX != 0 && e.clientY != 0)
    close_library_dialog();
});

$library_dialog_window.addEventListener('click', (e) => {
  e.stopPropagation();
});

window.open_library_dialog = () => {
  paused = true;
  $library_dialog.classList.remove('hidden');
  $container.classList.add('blurred');
}

window.close_library_dialog = () => {
  paused = false;
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
              $library_dialog_delete_button.classList.remove('disabled');
            } else {
              $img.classList.remove('half-opacity');
              last_library_selection = null;
              last_library_selection_id = null;
              $library_dialog_delete_button.classList.add('disabled');
            }
          } else {
            $img.classList.add('half-opacity');
            last_library_selection = $img;
            last_library_selection_id = id;
            $library_dialog_delete_button.classList.remove('disabled');
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

$library_dialog_delete_button.addEventListener('click', () => {
  if (last_library_selection_id) {
    fetch(`/api/delete-picture`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ picture_id: last_library_selection_id })
    })
    .then(res => res.json())
    .then(json => {
      console.log(json);
      get_library();
    });
  }
});