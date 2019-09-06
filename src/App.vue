<template>
  <div id="app" role="application">
    <main>
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
    </main>
    <div class="event-list">
      <h3>Events</h3>
      <EventItem v-for="event in eventList" :event="event" :key="event.id" @remove="removeEvent"/>
    </div>
    <EventForm :date="selectedDate" @submit="addEvent" @dismissed="showAddEvents = false"/>
  </div>
</template>

<script>
import { EventBus } from "@/lib/EventBus";
import CalendarEvent from "@/lib/CalendarEvent";
import Calendar from "@/components/Calendar";
import EventForm from "@/components/EventForm";
import EventItem from "@/components/EventItem";

/**
 * Test if an object is a CalendarEvent
 * @param {object} val - Value to test
 * @returns {boolean} Returns `true` if `val` is a CalendarEvent object
 */
const isCalendarEvent = val => val instanceof CalendarEvent;

/**
 * Save events to local storage
 * @param {CalendarEvent[]} events - List of CalendarEvents to store
 * @throws Throws Error if `events` array does not contain exclusively CalendarEvents
 */
const storeEvents = events => {
  if (!events.every(isCalendarEvent)) {
    throw new Error(
      "Can not store event list. Every array element must be a CalendarEvent instance."
    );
  }

  localStorage.setItem(
    "events",
    JSON.stringify(events.map(calEvent => calEvent.sleep()))
  );
};

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
    if (localStorage.getItem("events")) {
      this.events = JSON.parse(localStorage.events).map(
        e => new CalendarEvent(e)
      );
    }

    EventBus.$on("select-day", ({ date }) => {
      this.selectedDate = date;
      this.showAddEvents = true;
    });

    EventBus.$on("remove-event", this.removeEvent);
  },
  computed: {
    /**
     * List of events sorted by date
     * @returns {CalendarEvent[]} - Array of CalendarEvents sorted by date in ascending order.
     */
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
      storeEvents(this.events);

      /// Close event form after submitting event
      this.showAddEvents = false;
    },
    /**
     * Remove a specific event
     * @param {CalendarEvent} - Calendar event with ID to remove
     */
    removeEvent({ id: removeId }) {
      this.events = this.events.filter(({ id }) => id !== removeId);
      storeEvents(this.events);
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

.event-list {
  background-color: var(--event-list__background);
  color: var(--event-list__color);
  width: var(--event-list__size);
}

.event-form {
  order: -2;
}
</style>
