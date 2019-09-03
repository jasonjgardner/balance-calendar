<template>
  <article class="day" role="cell" :title="longDate" @click="selectDay">
    <h3 class="day__title">
      <time :datetime="dateTime">{{ calendarDate }}</time>
    </h3>
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
  computed: {
    longDate() {
      return format(this.day.date, "PPPP");
    },
    calendarDate() {
      return format(this.day.date, "d");
    },
    dateTime() {
      return format(this.day.date, "yyyy-M-dd");
    }
  },
  methods: {
    selectDay() {
      EventBus.$emit("select-day", this.day);
    }
  }
};
</script>
