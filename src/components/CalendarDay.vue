<template>
  <article class="day" role="cell" :title="format(day.date, 'PPPP')" @click="selectDay">
    <header class="day__header">
      <h3 class="day__title">
        <time :datetime="format(day.date, 'yyyy-MM-dd')">{{ dayLabel }}</time>
      </h3>
    </header>
    <div class="day__events">
      <EventItem v-for="event in day.events" :event="event" :key="event.id"/>
    </div>
    <p class="day__balance">{{ day.balance | toCurrency }}</p>
  </article>
</template>

<script>
import { format, isFirstDayOfMonth } from "date-fns";
import { EventBus } from "@/lib/EventBus";
import EventItem from "@/components/EventItem";

export default {
  name: "CalendarDay",
  components: {
    EventItem
  },
  props: {
    day: {
      type: Object,
      required: true
    }
  },
  methods: {
    format,
    /**
     * Day selected event
     * @event CalendarDay#selectDay
     * @type {CalendarDay}
     */
    selectDay() {
      EventBus.$emit("select-day", this.day);
    }
  },
  computed: {
    dayLabel() {
      return format(
        this.day.date,
        isFirstDayOfMonth(this.day.date) ? "LLL d" : "d"
      );
    }
  }
};
</script>

<style lang="scss">
@import '../assets/css/variables';

.day {
  align-items: flex-start;
  background: var(--day__background);
  border-top: 1px solid var(--day__border-color);
  color: var(--day__color);
  display: flex;
  justify-content: space-between;
  flex-flow: column nowrap;
  font-size: 1rem;
  height: var(--day__size);
  max-width: var(--day__size);
  min-width: var(--day__size);
  overflow: hidden;
  padding: 0;
  position: relative;
  transition: background-color 0.425s ease-out, border-color 0.425s ease-out,
    color 0.425s ease-out;

  &:hover,
  &:focus-within {
    border-color: var(--day__border-color_hover);
  }

  &--is-selected,
  &--is-today {
    z-index: 2; /// Overlap border
  }

   &.day--in-month {
     --day__color: var(--day__color_in-month);
     --day__background: var(--day__background_in-month);
  }

  &.day--is-selected,
  &.day--in-month.day--is-selected {
    --day__color: var(--day__color_is-selected);
    --day__border-color: var(--day__border-color_is-selected, currentColor);
    --day__background: var(--day__background_is-selected);
    box-shadow: inset 0 0 1px 1px var(--day__border-color);
    outline: 1px solid var(--day__border-color, currentColor);
  }

  &.day--is-today {
    --day__background: var(--day__background_is-today);
    --day__color: var(--day__color_is-today);
  }

  &__header {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    margin: 0;
    padding: 0;
    width: 100%;
  }

  &__title,
  &__balance {
    box-sizing: border-box;
    display: inline-block;
    font-size: 1rem;
    font-weight: normal;
    margin: 0;
  }

  &__balance {
    background-color: var(--day-balance__background);
    color: var(--day-balance__color);
    font-weight: normal;
    padding: 0.25rem 0.5rem 0.25rem 0.25rem;
    text-align: right;
    width: 100%;
  }

  &__events {
    flex-grow: 1;
  }
}

@if $enable-column-borders {
  .day + .day {
    border-left: 1px solid var(--day__border-color);
  }
}

.day--is-today::after {
  background-color: var(--color-primary_base);
  content: '';
  display: block;
  height: calc(2 * var(--size_base));
  position: absolute;
  top: 0;
  width: 100%;
  z-index: -1;
}

.day--is-today .day__title,
.day--is-selected .day__title {
  font-weight: bold;
}

.day--is-today .day__title time {
  background-color: var(--day__background_today);
  border-radius: 50%;
  color: var(--day__color_is-today);
  display: inline-block;
  text-align: center;
}

.day--is-today ~ .day {
  background-color: var(--day__background_future);
}

.day__title >>> .event {
  display: inline-block;
  max-width: calc(var(--day__size) - 0.825rem);
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>