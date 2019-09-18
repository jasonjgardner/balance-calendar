<template>
  <div :class="[classList, 'event']">
    <div class="event__header">
      <h4 class="event__title">{{ event.title }}</h4>

      <button
        class="btn btn--link"
        type="button"
        title="Remove event"
        aria-label="Remove"
        @click="remove"
      >
        <unicon name="times" fill="currentColor"/>
      </button>
    </div>

    <p v-if="event.recurs">Recurs</p>

    <p
      :class="['event__amount', event.amount < 0 ? 'event__amount--debit' : 'event__amount--credit']"
    >{{event.amount | toCurrency }}</p>
  </div>
</template>

<script>
import { isToday, isAfter } from "date-fns";
import { EventBus } from "@/lib/EventBus";
import { CalendarEvent, isCalendarEvent } from "@/lib/CalendarEvent";

export default {
  name: "EventItem",
  props: {
    event: {
      type: [Object, CalendarEvent],
      required: true,
      validator: v => isCalendarEvent(v),
      default: () => ({})
    }
  },
  methods: {
    /**
     * Emits CalendarEvent data to remove
     * @event EventBus#remove~remove-event
     * @type {CalendarEvent}
     */
    remove() {
      EventBus.$emit("remove-event", this.event);
    },
    classList() {
      const today = new Date();

      return {
        "event--past": isAfter(today, this.event.date),
        "event--future": isAfter(this.event.date, today),
        "event--today": isToday(this.event.date)
      };
    }
  }
};
</script>

<style lang="scss">
.event {
  &--past {
    opacity: 0.5;
  }

  &__title,
  &__amount {
    font-size: 0.825rem;
    margin: 0;
    padding: 0;
  }

  &__title {
    font-weight: 600;
  }

  &__amount {
    font-size: 0.75rem;
  }

  &__header {
    align-items: flex-start;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
  }
}
</style>
