<template>
  <section class="calendar" aria-label="Calendar" role="table">
    <header
      :class="['calendar__month', `calendar__month--${format(currentDate, 'MMM').toLowerCase()}`]"
    >
      <h1 class="current-date" aria-live="polite">
        <time :datetime="format(currentDate, 'yyyy-MM')">{{ format(currentDate, "MMMM yyyy") }}</time>
      </h1>
      <div class="calendar__toolbar" role="toolbar">
        <slot name="toolbar"></slot>
        <button
          v-show="!isSameDay(today, currentDate)"
          class="btn"
          type="reset"
          title="Return to current month"
          aria-label="This Month"
          @click.prevent="changeMonth(0)"
        >
          <unicon name="previous" fill="currentColor"/>
        </button>
        <button class="btn" type="button" @click="changeMonth(-1)">
          <unicon name="angle-left" fill="currentColor"/>
          <span>{{ lastMonthLabel }}</span>
        </button>
        <button class="btn" type="button" @click="changeMonth(1)">
          <span>{{ nextMonthLabel }}</span>
          <unicon name="angle-right" fill="currentColor"/>
        </button>
      </div>
      <!-- <div v-if="selectedDate" class="selected-date">
        <time
          :datetime="format(selectedDate, 'yyyy-MM-dd')"
        >{{ format(selectedDate, 'MMM d, yyyy') }}</time>
        <button class="btn btn--link" type="button" @click="selectedDate = null">
          <unicon name="times-circle" fill="currentColor"/>
        </button>
      </div>-->
    </header>
    <div
      v-once
      v-for="(weekdayLabel, fullDayLabel) in weekdays"
      :class="weekdayClassList(fullDayLabel)"
      :title="fullDayLabel"
      :key="fullDayLabel"
      role="columnheader"
    >
      <b>{{ weekdayLabel }}</b>
    </div>
    <CalendarDay
      v-for="day in calendarView"
      :class="dayClassList(day)"
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
  isSameYear,
  isBefore,
  lastDayOfMonth,
  addMonths,
  addDays,
  getDay,
  setDate,
  format
} from "date-fns";
import { EventBus } from "@/lib/EventBus";
import Weekdays from "@/mixins/Weekdays";
import CalendarDay from "@/components/CalendarDay";

export default {
  name: "Calendar",
  components: {
    CalendarDay
  },
  mixins: [Weekdays],
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
    /// Set current and selected date to today by default
    this.today = new Date();
    this.selectedDate = this.today;
    this.currentDate = this.today;
  },
  computed: {
    /**
     * Returns name of next month. If next month is January, the following year is appended to the name.
     * @returns {string} Month name, potentially followed by full year
     */
    nextMonthLabel() {
      const nextMonth = addMonths(this.currentDate, 1);
      return format(
        nextMonth,
        isSameYear(this.currentDate, nextMonth) ? "MMMM" : "MMMM yyyy"
      );
    },
    /**
     * Returns name of previous month. If previous month is December, the previous year is appended to the name.
     * @returns {string} Month name, potentially followed by full year
     */
    lastMonthLabel() {
      const lastMonth = addMonths(this.currentDate, -1);
      return format(
        lastMonth,
        isSameYear(this.currentDate, lastMonth) ? "MMMM" : "MMMM yyyy"
      );
    },
    /**
     * Creates an array of Day objects for visible dates
     * @returns {CalendarDay[]} Visible calendar days
     */
    calendarView() {
      const date = this.currentDate;

      //// Create days for this month
      const days = eachDayOfInterval({
        start: startOfMonth(date),
        end: endOfMonth(date)
      }).map(day => ({
        id: format(day, "yyyy-MM-dd"),
        date: day,
        events: this.getEvents(day),
        balance: this.getBalance(day)
      }));

      /// Create visible days for previous month
      let previousMonthCursor = lastDayOfMonth(addMonths(date, -1));
      const daysBefore = getDay(days[0].date);
      for (let itr = daysBefore; itr > 0; itr--) {
        days.unshift({
          id: format(previousMonthCursor, "yyyy-MM-dd"),
          date: previousMonthCursor,
          events: this.getEvents(previousMonthCursor),
          balance: this.getBalance(previousMonthCursor)
        });
        previousMonthCursor = addDays(previousMonthCursor, -1);
      }

      /// Create visible days for following month
      const daysRemaining = days.length % 7;
      const daysAfter = daysRemaining > 0 ? 7 - daysRemaining : 0;

      let nextMonthCursor = addMonths(date, 1);
      nextMonthCursor = setDate(nextMonthCursor, 1);

      for (let itr = 1; itr <= daysAfter; itr++) {
        days.push({
          id: format(nextMonthCursor, "yyyy-MM-dd"),
          date: nextMonthCursor,
          events: this.getEvents(nextMonthCursor),
          balance: this.getBalance(nextMonthCursor)
        });
        nextMonthCursor = addDays(nextMonthCursor, 1);
      }

      return days;
    }
  },
  mounted() {
    /// Set current and selected day to the given start date
    if (this.startDate) {
      this.currentDate = this.startDate;
      this.selectedDate = this.startDate;
    }

    /// Listen for date selection event
    EventBus.$on("select-day", ({ date }) => (this.selectedDate = date));
  },
  methods: {
    format,
    isSameDay,
    /**
     * Change the current month
     * @param {Number} add - Use positive numbers to go foward in time, or negative numbers to go back in time.
     */
    changeMonth(add) {
      this.currentDate = !add
        ? this.today || new Date()
        : addMonths(this.currentDate, +add);
    },
    /**
     * Create a detailed class list for a calendar day.
     * @param {CalendarDay} day - The day to examine
     * @returns {{[string]:boolean}} Returns classes as keys and activation as values
     */
    dayClassList({ date, balance, events }) {
      return {
        "day--in-month": isSameMonth(date, this.currentDate),
        "day--is-selected": isSameDay(date, this.selectedDate),
        "day--is-today": isToday(date),
        "day--no-events": events.length < 1,
        "balance--positive": balance > 0,
        "balance--negative": balance <= 0
      };
    },
    weekdayClassList(weekday) {
      const lowerWeekday = weekday.toLowerCase();

      return [
        "calendar__weekdays",
        `calendar__weekdays--${lowerWeekday}`,
        {
          "calendar__weekdays--today":
            lowerWeekday === format(this.currentDate, "EEEE").toLowerCase()
        }
      ];
    },
    /**
     * Filter out events not happening on a given date
     * @param {CalendarEvent[]} events - List of events to filter
     * @param {Date} day - The event date to include
     */
    getEvents(day) {
      let events = this.events
        .slice()
        .filter(({ date }) => isSameDay(date, day));

      return events;
    },
    /**
     * Calculates balance for events up until the given day
     * @param {CalendarEvent[]} events - List of events to summarize
     * @param {Date} day - The calendar day
     * @param {Number} [startingBalance=0] - The existing balance
     */
    getBalance(day, startingBalance = 0) {
      return this.events
        .slice()
        .filter(({ date }) => isBefore(date, day) || isSameDay(date, day))
        .reduce(
          (previousBalance, { amount }) => parseFloat(amount) + previousBalance,
          startingBalance || this.startingBalance || 0
        );
    }
  }
};
</script>

<style lang="scss">
.calendar {
  background-color: var(--calendar__background);
  border: 1px solid var(--calendar__border-color);
  box-shadow: 0 0.25rem 1rem rgba(12, 12, 12, 0.125);
  box-sizing: border-box;
  color: var(--calendar__color);
  display: grid;
  flex: 1 1 100%;
  grid-gap: 0;
  justify-self: center;
  overflow: hidden;

  &__toolbar {
    flex-grow: 1;
    margin-left: auto;
    text-align: right;
  }

  &__weekdays {
    font-size: 0.75rem;
    font-weight: normal;
    padding-bottom: var(--size_base);
    padding-top: calc(4 * var(--size_base));

    &--today {
      text-decoration: underline;
    }

    &:first-of-type {
      padding-left: calc(2 * var(--size_base));
    }
  }

  &__month {
    align-items: flex-start;
    border-bottom: 1px solid var(--calendar__border-color);
    box-sizing: border-box;
    display: flex;
    flex-flow: row wrap;
    font-size: 1.25rem;
    grid-column: 1 / span 7;
    justify-content: space-between;
    padding: calc(2 * var(--size_base));

    .current-date {
      font-size: 1.825rem;
      font-weight: 300;
      margin: 0 auto calc(4 * var(--size_base)) 0;
    }

    .selected-date {
      align-items: center;
      display: flex;
      font-size: 0.925rem;
      flex: 1 0 100%;
      flex-flow: row nowrap;
      justify-content: space-between;
    }
  }
}
</style>
