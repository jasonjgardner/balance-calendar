<template>
  <div id="app" role="application">
    <main>
      <Calendar :events="events"/>
    </main>
    <div class="events">
      <EventForm :date="selectedDate" @submit="addEvent"/>
      <EventList :events="events"/>
    </div>
  </div>
</template>

<script>
import { EventBus } from "@/lib/EventBus";
import { CalendarEvent, isCalendarEvent } from "@/lib/CalendarEvent";
import { RecurringEvent } from "@/lib/RecurringEvent";
import { mutations } from "./store";
import Calendar from "@/components/Calendar";
import EventForm from "@/components/EventForm";
import EventList from "@/components/EventList";

export default {
  name: "App",
  components: {
    Calendar,
    EventForm,
    EventList
  },
  props: {
    events: {
      type: Array,
      required: true,
      default: () => [
        new CalendarEvent({
          date: new Date(),
          title: "Schedule some events",
          amount: 1
        })
      ],
      validator: v => Array.isArray(v) && v.every(isCalendarEvent)
    }
  },
  data() {
    return {
      selectedDate: undefined
    };
  },
  mounted() {
    EventBus.$on("select-day", ({ date }) => {
      this.selectedDate = date;
      this.showAddEvents = true;
    });

    EventBus.$on("remove-event", ({ id }) => mutations.removeEvent(id));
  },

  methods: {
    /**
     * Create an event
     * @param {CalendarEvent|RecurringEvent} - Event data to store
     */
    addEvent(event) {
      mutations.addEvent(
        event.recurs ? new RecurringEvent(event) : new CalendarEvent(event)
      );
    }
  }
};
</script>

<style lang="scss">
#app {
  align-items: stretch;
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
}

.events {
  background-color: var(--event-list__background);
  color: var(--event-list__color);
  display: flex;
  flex: 1 0 var(--event-list__size);
  flex-flow: column nowrap;
  height: 100%;
}
</style>
