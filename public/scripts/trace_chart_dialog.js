window.close_chart_dialog = () => {
  $chart_dialog_window_img.classList.add('hidden');
  $chart_dialog_window_img.src = '';
  $chart_dialog.classList.add('hidden');
  $container.classList.remove('blurred');
  $chart_dialog_window_placeholder_text.classList.remove('hidden');
  $chart_dialog_window_placeholder_text.innerHTML = 'Loading...';
  if (waiting_for_chart_to_close)
    start_timer();
  waiting_for_chart_to_close = false;
  paused = false;
}

window.display_chart = () => {
  paused = true;
  if (waiting_for_chart_to_close)
    reset_timer();
  const current_picture_id = shuffled[iteration].id;
  if (!current_picture_id) {
    return;
  }
  $chart_dialog.classList.remove('hidden');
  $container.classList.add('blurred');
  fetch('/api/get-picture-timerecords-chart', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ picture_id: shuffled[iteration].id })
  })
  .then(res => res.json())
  .then(data => {
    if (data.error) {
      $chart_dialog_window_placeholder_text.innerHTML = data.error;
    } else {
      console.log(data);
      const { temp_name } = data;
      const path = `/shared/${user_id}/temp/${temp_name}`;
      $chart_dialog_window_img.src = path;
      $chart_dialog_window_img.onload = () => {
        $chart_dialog_window_placeholder_text.classList.add('hidden');
        $chart_dialog_window_img.classList.remove('hidden');
      }
    }
  });
}

$chart_button.addEventListener('click', () => {
  display_chart();
});
$chart_dialog_continue_button.addEventListener('click', () => {
  close_chart_dialog();
});
$chart_dialog_window.addEventListener('click', (e) => {
  e.stopPropagation();
});
$chart_dialog.addEventListener('click', (e) => {
  if (e.clientX != 0 && e.clientY != 0)
    close_chart_dialog();
});