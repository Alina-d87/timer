import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const refs = {
  btnStart: document.querySelector('[data-start'),
  input: document.querySelector('#datetime-picker'),
  spanDay: document.querySelector('[data-days]'),
  spanHours: document.querySelector('[data-hours]'),
  spanMinutes: document.querySelector('[data-minutes]'),
  spanSeconds: document.querySelector('[data-seconds]'),
};

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (Date.now() > selectedDates[0]) {
      Notiflix.Notify.failure('Please choose a date in the future');
      return;
    }
    if (Date.now() < selectedDates[0]) {
      refs.btnStart.disabled = false;
    }
  },
};

refs.btnStart.disabled = true;

const initCalendar = flatpickr(refs.input, options);

let timerId = null;
let ms = 0;

refs.btnStart.addEventListener('click', timeData);

function timeData() {
  const selectedData = initCalendar.selectedDates[0];
  console.log(selectedData);
  timerId = setInterval(() => {
    ms = selectedData - new Date();
    if (ms <= 0) {
      clearInterval(timerId);
      return;
    }
    const time = convertMs(ms);
    console.log(time);
  }, 1000);
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = addLeadingZero(Math.floor(ms / day));
  // Remaining hours
  const hours = addLeadingZero(Math.floor((ms % day) / hour));
  // Remaining minutes
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  // Remaining seconds
  const seconds = addLeadingZero(
    Math.floor((((ms % day) % hour) % minute) / second)
  );

  refs.spanDay.textContent = days;
  refs.spanHours.textContent = hours;
  refs.spanMinutes.textContent = minutes;
  refs.spanSeconds.textContent = seconds;

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  if (String.length < 2) {
    return String(value).padStart(2, '0');
  }
  if (String.length > 2) {
    return String(value).padStart(3, '0');
  }
}
