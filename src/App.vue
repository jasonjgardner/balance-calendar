<template>
  <div id="app">
    <Calendar :events="events"/>
    <div class="events">
      <EventForm @submit="addEvent"/>
      <EventItem v-for="event in eventList" :event="event" :key="event.id" @remove="removeEvent"/>
    </div>
  </div>
</template>

<script>
import Calendar from "./components/Calendar";
import EventForm from "./components/EventForm";
import EventItem from "./components/EventItem";
import CalendarEvent from "@/lib/CalendarEvent";

export default {
  name: "App",
  components: {
    Calendar,
    EventForm,
    EventItem
  },
  data() {
    return {
      events: []
    };
  },
  computed: {
    eventList() {
      return this.events.slice().sort((a, b) => (a.date > b.date ? 1 : -1));
    }
  },
  methods: {
    /**
     * Create an event
     * @param {CalendarEvent} - Event data to store
     */
    addEvent(event) {
      this.events.push(new CalendarEvent(event));
    },
    /**
     * Remove a specific event
     * @param {CalendarEvent} - Calendar event with ID to remove
     */
    removeEvent({ id: removeId }) {
      this.events = this.events.filter(({ id }) => id !== removeId);
    }
  }
};
</script>

<style>
#app {
  margin: 1vh auto;
  max-width: 90%;
}
</style>
