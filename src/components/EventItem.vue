<template>
  <div class="event">
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

    <p
      :class="['event__amount', event.amount < 0 ? 'event__amount--debit' : 'event__amount--credit']"
    >{{event.amount | toCurrency }}</p>
  </div>
</template>

<script>
import { EventBus } from "@/lib/EventBus";
import { CalendarEvent } from "@/lib/CalendarEvent";

export default {
  name: "EventItem",
  props: {
    event: {
      type: CalendarEvent,
      required: true
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
    }
  }
};
</script>

<style lang="scss">
.event {
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
