window.controls_started = false;
window.shuffled = null;
window.iteration = 0;
window.seconds_since_start = 0;
window.timer_interval = null;
window.waiting_for_chart_to_close = false;

const get_time_string_from_seconds = (seconds) => {
  const padded_seconds = seconds % 60 < 10 ? '0' + seconds % 60 : seconds % 60;
  return Math.floor(seconds / 60) + ':' + padded_seconds;
}
  
$controls_start_button.onclick = () => {
  controls_started = !controls_started;
  $left_time.innerHTML = '0:00';
  if (controls_started) {
    $controls_done_button.classList.remove('disabled');
    $controls_start_button.innerHTML = 'Stop';
    $top_region.classList.remove('invisible');
    $modes_region.classList.remove('invisible');
    fetch(`/api/get-pictures`)
    .then(res => res.json())
    .then(json => {
      if (json.length > 0) {
        shuffled = _.shuffle(json);
        iteration = 0;
        $chart_button.classList.remove('disabled');
        console.log(shuffled);
        if (shuffled[0].seconds) {
          $right_time.classList.remove('invisible');
          $right_time.innerHTML = get_time_string_from_seconds(shuffled[0].seconds);
        }
      }
      timer_interval = setInterval(() => {
        seconds_since_start++;
        $left_time.innerHTML = get_time_string_from_seconds(seconds_since_start);
        if (shuffled[0].seconds) {
          $progress.value = seconds_since_start / shuffled[0].seconds;
        }
      }, 1000);
    });
  } else {
    $controls_start_button.innerHTML = 'Start';
    $controls_done_button.classList.add('disabled');
    $top_region.classList.add('invisible');
    $modes_region.classList.add('invisible');
    $chart_button.classList.add('disabled');
    clearInterval(timer_interval);
    seconds_since_start = 0;
  }
}

$controls_done_button.addEventListener('click', () => {
  const { id, filename, extension } = shuffled[iteration];
  console.log(id, filename, extension, iteration);
  fetch(`/api/add-time-record`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      seconds: seconds_since_start,
      picture_id: id
    })
  })
  .then(res => res.json())
  .then(json => {
    console.log(json);
    waiting_for_chart_to_close = true;
    display_chart();
    iteration += 1;
    if (iteration >= shuffled.length) {
      iteration = 0;
    }
  });
});

window.reset_timer = () => {
  clearInterval(timer_interval);
  seconds_since_start = 0;
  $left_time.innerHTML = '0:00';
}

window.start_timer = () => {
  timer_interval = setInterval(() => {
    seconds_since_start++;
    const padded_seconds = seconds_since_start % 60 < 10 ? '0' + seconds_since_start % 60 : seconds_since_start % 60;
    $left_time.innerHTML = `${Math.floor(seconds_since_start / 60)}:${padded_seconds}`;
  }, 1000);
}

$logout_button.addEventListener('click', () => {
  fetch('/api/logout', {
    method: 'GET'
  }).then(() => {
    window.location.href = '/';
  });
});