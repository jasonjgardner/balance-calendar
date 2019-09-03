<template>
  <div id="app">
    <Calendar :events="events" @select="showAddEvents = !!showAddEvents">
      <template v-slot:toolbar>
        <button
          v-show="!showAddEvents"
          class="btn"
          type="button"
          @click="showAddEvents = true"
        >Add Event</button>
      </template>
    </Calendar>
    <EventForm
    class="event-form"
      v-show="showAddEvents"
      :date="selectedDate"
      @submit="addEvent"
      @dismissed="showAddEvents = false"
    />
    <div class="events-list">
      <EventItem v-for="event in eventList" :event="event" :key="event.id" @remove="removeEvent"/>
    </div>
  </div>
</template>

<script>
import { EventBus } from "@/lib/EventBus";
import Calendar from "@/components/Calendar";
import EventForm from "@/components/EventForm";
import EventItem from "@/components/EventItem";
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
      events: [],
      showAddEvents: false,
      selectedDate: undefined
    };
  },
  mounted() {
    EventBus.$on("select-day", ({ date }) => {
      this.selectedDate = date;
      this.showAddEvents = true;
    });

    EventBus.$on("remove-event", this.removeEvent);
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

<style lang="scss">
#app {
  align-items: center;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  margin: 1vh auto;
  max-width: 90%;
}
</style>
