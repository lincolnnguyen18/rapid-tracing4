import Cookies from '/modules/js.cookie.min.mjs';
window.Cookies = Cookies;
window.user_id = Cookies.get('id');
window.$container = document.querySelectorAll('#container')[0];

window.$upload_dialog = document.querySelectorAll('#upload-dialog')[0];
window.$upload_dialog_window = document.querySelectorAll('#upload-dialog-window')[0];
window.$upload_dialog_cancel_button = document.querySelectorAll('#upload-dialog-cancel-button')[0];
window.$upload_dialog_upload_button = document.querySelectorAll('#upload-dialog-upload-button')[0];
window.$upload_dialog_window_image = document.querySelectorAll('#upload-dialog-window-image')[0];
window.$upload_dialog_input = document.querySelectorAll('#upload-dialog-input')[0];
window.$upload_dialog_placeholder = document.querySelectorAll('#upload-dialog-placeholder')[0];
window.$upload_dialog_window_header = document.querySelectorAll('#upload-dialog-window .dialog-header')[0];
window.$upload_dialog_placeholder_text = document.querySelectorAll('#upload-dialog-placeholder .placeholder-text')[0];
window.$upload_dialog_invert_button = document.querySelectorAll('#upload-dialog-window .dialog-bottom .invert')[0];
window.$upload_dialog_header_modes_original_button = document.querySelectorAll('#upload-dialog-header-modes-original-button')[0];
window.$upload_dialog_header_modes_outline_button = document.querySelectorAll('#upload-dialog-header-modes-outline-button')[0];
window.$upload_dialog_header_modes_details_button = document.querySelectorAll('#upload-dialog-header-modes-details-button')[0];
window.$upload_dialog_dropbox = document.querySelectorAll('#upload-dialog-window .dialog-top')[0];
window.$kernel_size_slider = document.querySelectorAll('#kernel-size-slider')[0];
window.$kernel_sigma_slider = document.querySelectorAll('#kernel-sigma-slider')[0];

window.$library_dialog = document.querySelectorAll('#library-dialog')[0];
window.$library_dialog_window = document.querySelectorAll('#library-dialog-window')[0];
window.$library_dialog_window_close_button = document.querySelectorAll('#library-dialog-window > div.buttons > span.close-button')[0];
window.$library_dialog_window_placeholder = document.querySelectorAll('#library-dialog-window > div.placeholder')[0];
window.$library_dialog_window_images = document.querySelectorAll('#library-dialog-window > div.images')[0];

window.$chart_dialog = document.querySelectorAll('#timerecord-chart-dialog')[0];
window.$chart_dialog_window = document.querySelectorAll('#timerecord-chart-dialog-window')[0];
window.$chart_dialog_window_img = document.querySelectorAll('#timerecord-chart-dialog-window .top')[0];
window.$chart_dialog_window_placeholder_text = document.querySelectorAll('#timerecord-chart-dialog-window .placeholder-text')[0];
window.$chart_dialog_continue_button = document.querySelectorAll('#timerecord-chart-dialog-continue-button')[0];

window.$top_region = document.querySelectorAll('#top')[0];
window.$left_time = document.querySelectorAll('#left-time')[0];
window.$right_time = document.querySelectorAll('#right-time')[0];
window.$modes_region = document.querySelectorAll('#modes')[0];
window.$progress = document.querySelectorAll('#progress')[0];

window.$controls_start_button = document.querySelectorAll('#bottom-left > span.start-button')[0];
window.$controls_done_button = document.querySelectorAll('#bottom-left > span.done-button')[0];
window.$upload_button = document.querySelectorAll('#upload-button')[0];
window.$pictures_button = document.querySelectorAll('#pictures-button')[0];
window.$chart_button = document.querySelectorAll('#chart-button')[0];
window.$logout_button = document.querySelectorAll('#logout-button')[0];

// document.addEventListener('keydown', (e) => {
//   if (e.key == 'Escape') {
//     close_upload_dialog();
//     close_library_dialog();
//     close_chart_dialog();
//     if (waiting_for_chart_to_close) {
//       reset_timer();
//       start_timer();
//     }
//   }
// });