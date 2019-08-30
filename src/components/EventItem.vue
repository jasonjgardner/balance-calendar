<template>
  <div class="event-wrapper">
    <div class="event-date">{{ event.date | toDate }}</div>
    <div class="event-title">{{ event.title }}</div>
    <div class="event-time">{{ event.date | toTime }}</div>
    <span>
      <div class="event-price">{{event.amount | toCurrency }}</div>
    </span>
    <button class="btn btn-primary bg-red" type="button" @click="$emit('remove', event)">Remove</button>
  </div>
</template>

<script>
import { format } from "date-fns";
import { CalendarEvent } from "@/lib/CalendarEvent";

export default {
  name: "EventItem",
  props: {
    event: {
      type: CalendarEvent,
      required: true
    }
  },
  filters: {
    toDate: date => format(date, "MMM, do yyyy"),
    toTime: date => format(date, "h:mm a")
  }
};
</script>
