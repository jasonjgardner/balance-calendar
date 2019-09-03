<template>
  <article class="day" role="cell" :title="format(day.date, 'PPPP')" @click="selectDay">
    <h3 class="day__title">
      <time :datetime="format(day.date, 'yyyy-M-dd')">{{ format(day.date, "d") }}</time>
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
