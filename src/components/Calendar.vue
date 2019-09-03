<template>
  <section class="calendar" role="table">
    <header
      :class="['calendar__month', `calendar__month--${format(currentDate, 'MMM').toLowerCase()}`]"
    >
      <h1 class="current-date">
        <time :datetime="format(currentDate, 'yyyy-MM')">{{ format(currentDate, "MMMM yyyy") }}</time>
      </h1>
      <div class="calendar__toolbar" role="toolbar">
        <slot name="toolbar"></slot>
        <button
          v-show="!isSameDay(today, currentDate)"
          class="btn"
          type="reset"
          @click.prevent="changeMonth(0)"
        >This Month</button>
        <button class="btn" type="button" @click="changeMonth(-1)">{{ lastMonthLabel }}</button>
        <button class="btn" type="button" @click="changeMonth(1)">{{ nextMonthLabel }}</button>
      </div>
      <div v-if="selectedDate" class="selected-date">
        <time
          :datetime="format(selectedDate, 'yyyy-MM-dd')"
        >{{ format(selectedDate, 'MMM d, yyyy') }}</time>
        <button class="btn" type="button" @click="selectedDate = null">Deselect</button>
      </div>
    </header>
    <div v-once v-for="day in ['Sunday','Monday','Tuesday','Wednesday','Thurday','Friday','Saturday']" :class="['calendar__weekdays', `calendar__weekdays--${day.toLowerCase()}`]" :key="day" role="columnheader">
      <b>{{ day }}</b>
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
  isSameYear,
  isBefore,
  lastDayOfMonth,
  addMonths,
  addDays,
  getDay,
  setDate,
  format
} from "date-fns";
import CalendarDay from "@/components/CalendarDay";
import { EventBus } from "@/lib/EventBus";

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
    nextMonthLabel() {
      const nextMonth = addMonths(this.currentDate, 1);
      return format(
        nextMonth,
        isSameYear(this.date, nextMonth) ? "MMMM" : "MMMM yyyy"
      );
    },
    lastMonthLabel() {
      const lastMonth = addMonths(this.currentDate, -1);
      return format(
        lastMonth,
        isSameYear(this.date, lastMonth) ? "MMMM" : "MMMM yyyy"
      );
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
        events: this.getEvents(day),
        balance: this.getBalance(day)
      }));

      // gen the days from last month
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

      // gen days for next month
      const daysAfter = days.length % 7 > 0 ? 7 - (days.length % 7) : 0;

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
    if (this.startDate) {
      this.currentDate = this.startDate;
      this.selectedDate = this.startDate;
    }

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
    dayClassList({ date, balance }) {
      return {
        "day--in-month": isSameMonth(date, this.selectedDate),
        "day--is-selected": isSameDay(date, this.selectedDate),
        "day--is-today": isToday(date),
        "balance--positive": balance > 0,
        "balance--negative": balance <= 0
      };
    },
    /**
     * Filter out events not happening on a given date
     * @param {CalendarEvent[]} events - List of events to filter
     * @param {Date} day - The event date to include
     */
    getEvents(day) {
      return this.events.slice().filter(({ date }) => isSameDay(date, day));
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

  &__toolbar {
    flex-grow: 1;
    margin-left: auto;
    text-align: right;
  }

  &__weekdays {
    font-size: 0.75rem;
    font-weight: normal;
  }

  .day {
    border: 1px solid lightgray;
  }
}

.calendar__month {
  align-items: center;
  display: flex;
  flex-flow: row wrap;
  font-size: 1.25rem;
  grid-column: 1 / span 7;
  justify-content: space-between;

  .selected-date {
    display: flex;
    flex-grow: 1;
    width: 100%;

    .btn {
      margin-left: auto;
    }
  }
}
</style>
