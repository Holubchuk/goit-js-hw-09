import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const startBtn = document.querySelector('[data-start]');
startBtn.disabled = true;

class Coutdown {
  intervalId;
  targetDate;
  constructor() {}
  start() {
    if (this.targetDate) {
      this.intervalId = setInterval(() => {
        const currentTime = new Date();
        const diff = this.targetDate - currentTime;

        if (diff <= 0) {
          clearInterval(this.intervalId);
        } else {
          const { days, hours, minutes, seconds } = this.convertMs(diff);

          document.querySelector('[data-days]').textContent =
            this.addLeadingZero(days);
          document.querySelector('[data-hours]').textContent =
            this.addLeadingZero(hours);
          document.querySelector('[data-minutes]').textContent =
            this.addLeadingZero(minutes);
          document.querySelector('[data-seconds]').textContent =
            this.addLeadingZero(seconds);
        }
      }, 1000);
      startBtn.disabled = true;
    }
  }
  addLeadingZero(value) {
    return value.toString().padStart(2, '0');
  }
  convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
  }
};

const coutdown = new Coutdown();

flatpickr('#datetime-picker', {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];

    if (selectedDate < new Date()) {
      Notiflix.Notify.failure('Please choose a date in the future');
    } else {
      startBtn.disabled = false;
      coutdown.targetDate = selectedDate;
      Notiflix.Notify.success('Well done');
    }
  },
});

startBtn.addEventListener('click', () => {
  coutdown.start();
});
