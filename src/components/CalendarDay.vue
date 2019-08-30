<template>
  <article class="day" role="cell">
    <h3 class="day__title">
      <time :datetime="dateTime">{{ calendarDate }}</time>
    </h3>
    <div v-if="day.events" class="day__events">
      <EventItem v-for="event in day.events" :event="event" :key="event.id"/>
    </div>
    <div v-else class="day__events day__events--no-events">
      <p>No events</p>
    </div>
    <p class="day__balance">{{ day.balance | toCurrency }}</p>
  </article>
</template>

<script>
import { format } from "date-fns";
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
  computed: {
    calendarDate() {
      return format(this.day.date, "d");
    },
    dateTime() {
      return format(this.day.date, "yyyy-M-dd");
    }
  }
};
</script>
