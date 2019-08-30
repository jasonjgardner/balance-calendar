<template>
  <section class="calendar" role="table">
    <header class="calendar__month">
      <h1>
        <time :datetime="calendarMonthDateTime">{{ calendarMonth }}</time>
      </h1>
      <div class="calendar__toolbar" role="toolbar">
        <button type="button" @click="goToLastMonth">&lt;&lt;</button>
        <button type="button" @click="goToNextMonth">&gt;&gt;</button>
      </div>
    </header>
    <div class="calendar__weekdays" role="columnheader">
      <h2>Sunday</h2>
    </div>
    <div class="calendar__weekdays" role="columnheader">
      <h2>Monday</h2>
    </div>
    <div class="calendar__weekdays" role="columnheader">
      <h2>Tuesday</h2>
    </div>
    <div class="calendar__weekdays" role="columnheader">
      <h2>Wednesday</h2>
    </div>
    <div class="calendar__weekdays" role="columnheader">
      <h2>Thursday</h2>
    </div>
    <div class="calendar__weekdays" role="columnheader">
      <h2>Friday</h2>
    </div>
    <div class="calendar__weekdays" role="columnheader">
      <h2>Saturday</h2>
    </div>
    <CalendarDay
      v-for="day in calendarView"
      :class="dayClassList"
      :key="day.id"
      :day="day"
      role="cell"
    />
  </section>
</template>

<script>
import {
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  isSameMonth,
  isToday,
  isSameDay,
  isBefore,
  lastDayOfMonth,
  addMonths,
  addDays,
  getDay,
  setDate,
  format
} from "date-fns";
import CalendarDay from "@/components/CalendarDay";

/**
 * Filter out events not happening today
 * @param {CalendarEvent[]} events - List of events to filter
 * @param {Date} day - The event date to include
 */
const getEvents = (events, day) =>
  events.filter(({ date }) => isSameDay(date, day));

/**
 * Calculates balance for events up until the given day
 * @param {CalendarEvent[]} events - List of events to summarize
 * @param {Date} day - The calendar day
 * @param {Number} [startingBalance=0] - The existing balance
 */
const getBalance = (events, day, startingBalance = 0) =>
  events
    .filter(({ date }) => isBefore(date, day))
    .reduce(
      (previousBalance, { amount }) => parseFloat(amount) + previousBalance,
      startingBalance || 0
    );

export default {
  name: "Calendar",
  components: {
    CalendarDay
  },
  props: {
    startDate: {
      required: false,
      type: Date
    },
    events: {
      required: false,
      type: Array
    },
    startingBalance: {
      required: false,
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      today: null,
      selectedDate: null,
      currentDate: null
    };
  },
  created() {
    this.today = new Date();
    this.selectedDate = this.today;
    this.currentDate = this.today;
  },
  computed: {
    calendarMonth() {
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];

      return `${
        months[this.currentDate.getMonth()]
      } ${this.currentDate.getFullYear()}`;
    },
    calendarMonthDateTime() {
      const month = this.currentDate.getMonth() + 1;
      return `${this.currentDate.getFullYear()}-${
        month < 10 ? `0${month}` : month
      }`;
    },
    /**
     * Creates an array of Day objects for visible dates
     * @returns {CalendarDay[]} Visible calendar days
     */
    calendarView() {
      const date = this.currentDate;

      const days = eachDayOfInterval({
        start: startOfMonth(date),
        end: endOfMonth(date)
      }).map(day => ({
        id: format(day, "yyyy-MM-dd"),
        date: day,
        events: getEvents(this.events, day),
        balance: getBalance(this.events, day, this.startingBalance)
      }));

      // gen the days from last month
      let previousMonthCursor = lastDayOfMonth(addMonths(date, -1));
      const daysBefore = getDay(days[0].date);
      for (let itr = daysBefore; itr > 0; itr--) {
        days.unshift({
          id: format(previousMonthCursor, "yyyy-MM-dd"),
          date: previousMonthCursor,
          events: getEvents(this.events, previousMonthCursor),
          balance: getBalance(
            this.events,
            previousMonthCursor,
            this.startingBalance
          )
        });
        previousMonthCursor = addDays(previousMonthCursor, -1);
      }

      // gen days for next month
      const daysAfter = days.length % 7 > 0 ? 7 - (days.length % 7) : 0;

      let nextMonthCursor = addMonths(date, 1);
      nextMonthCursor = setDate(nextMonthCursor, 1);

      for (let itr = 1; itr <= daysAfter; itr++) {
        days.push({
          id: format(nextMonthCursor, "yyyy-MM-dd"),
          date: nextMonthCursor,
          events: getEvents(this.events, nextMonthCursor),
          balance: getBalance(
            this.events,
            nextMonthCursor,
            this.startingBalance
          )
        });
        nextMonthCursor = addDays(nextMonthCursor, 1);
      }

      return days;
    }
  },
  mounted() {
    if (this.startDate) {
      this.currentDate = this.startDate;
      this.selectedDate = this.startDate;
    }
  },
  methods: {
    goToNextMonth() {
      this.currentDate = addMonths(this.currentDate, 1);
    },
    goToLastMonth() {
      this.currentDate = addMonths(this.currentDate, -1);
    },
    setSelectedDate({ date }) {
      this.selectedDate = date;
      /**
       * @event input
       * @type {Date} The selected calendar date
       */
      this.$emit("select", this.selectedDate);
    },
    dayClassList({ date, balance }) {
      return {
        "day--in-month": isSameMonth(date, this.selectedDate),
        "day--is-selected": isSameDay(date, this.selectedDate),
        "day--is-today": isToday(date),
        "balance--positive": balance > 0,
        "balance--negative": balance <= 0
      };
    }
  }
};
</script>

<style lang="scss">
.day {
  align-items: flex-start;
  color: var(--black-200);
  display: flex;
  justify-content: space-between;
  flex-flow: column nowrap;
  font-size: 1rem;

  &--is-selected {
    border: 1px solid var(--blue-grey-100);
  }

  &--in-month {
    color: var(--black-100);
  }

  &--is-today {
    background: var(--black-400);
  }

  &__title,
  &__balance {
    box-sizing: border-box;
    display: inline-block;
    font-size: 1rem;
    font-weight: 600;
    margin: 0;
    padding: 0.25rem;
    width: 100%;
  }

  &__balance {
    background-color: var(--black-400);
    font-weight: normal;
    padding-right: 0.5rem;
    text-align: right;
  }
}

.calendar {
  background-color: var(--white);
  display: grid;

  &__month {
    align-items: center;
    display: flex;
    flex-flow: row nowrap;
    font-size: 1.25rem;
    grid-column: 1 / span 7;
    justify-content: space-between;
  }

  &__weekdays {
    font-size: 0.75rem;
    font-weight: normal;
    letter-spacing: 0.125em;
    text-transform: uppercase;
  }

  .day {
    border: 1px solid lightgray;
  }
}
</style>
