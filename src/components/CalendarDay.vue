<template>
  <article class="day" role="cell" :title="format(day.date, 'PPPP')">
    <header class="day__header">
      <h3 class="day__title">
        <time :datetime="format(day.date, 'yyyy-MM-dd')">{{ format(day.date, "d") }}</time>
      </h3>
      <button class="btn btn--link" type="button" @click="selectDay">
        <unicon name="plus-square" fill="currentColor"/>
      </button>
    </header>
    <div class="day__events">
      <EventItem v-for="event in day.events" :event="event" :key="event.id"/>
    </div>
    <p class="day__balance">{{ day.balance | toCurrency }}</p>
  </article>
</template>

<script>
import { format } from "date-fns";
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
  }
};
</script>

<style lang="scss">
@import '../assets/css/variables';

.day {
  align-items: flex-start;
  background-color: var(--day__background_past);
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
    z-index: 1; /// Overlap border
  }

  &--is-selected {
    background: var(--day__background_is-selected);
    border-color: var(--day__border-color_is-selected, currentColor);
    color: var(--day__color_is-selected);
  }

  &--is-today {
    background: var(--day__background_is-today);
    border-top-width: var(--size_base);
    color: var(--day__color_is-today);
  }

  &--in-month {
    background: var(--day__background_in-month);
    color: var(--day__color_in-month);
  }

  &__header {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    margin: 0;
    padding: 0;
    width: 100%;

    & > .btn--link {
      line-height: 1;
      margin: 0;
      padding: 0;
      position: absolute;
      right: 0;
      top: 0;
    }
  }

  &__title,
  &__balance {
    box-sizing: border-box;
    display: inline-block;
    font-size: 1rem;
    font-weight: 600;
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

.day--is-today .day__title {
  background-color: var(--day__background_today);
  border-radius: 50%;
  color: var(--day__color_is-today);
  display: inline-block;
  text-align: center;
}

.day--is-today ~ .day {
  background-color: var(--day__background);
}

.day__title >>> .event {
  display: inline-block;
  max-width: calc(var(--day__size) - 0.825rem);
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>