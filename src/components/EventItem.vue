<template>
  <div class="event">
    <h4 class="event__title">{{ event.title }}</h4>
    <p
      :class="['event__amount', event.amount < 0 ? 'event__amount--debit' : 'event__amount--credit']"
    >{{event.amount | toCurrency }}</p>
    <button class="btn" type="button" @click="remove">Remove</button>
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
    remove() {
      EventBus.$emit('remove-event', this.event);
    }
  }
};
</script>

<style lang="scss" scoped>
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
    font-size: 0.925em;
  }
}
</style>
