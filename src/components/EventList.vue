<template>
  <div class="event-list">
    <div class="event-list__header">
      <h3 class="event-list__title">Events</h3>

      <div class="event-list__toolbar">
        <button class="btn btn--link" type="button" @click="showFilters = !!showFilters">
          <unicon name="sort" fill="currentColor"/>
        </button>
      </div>
      <transition name="fade">
        <div v-show="showFilters" class="event-list__filters">
          <input class="input" type="search" placeholder="Search event title" @keyup="filterEvents">
        </div>
      </transition>
    </div>
    <EventItem
      v-for="event in eventList"
      :event="event"
      :key="event.id"
      @remove="$emit('remove-event', event)"
    />
  </div>
</template>

<script>
import { isCalendarEvent } from "@/lib/CalendarEvent";
import EventItem from "@/components/EventItem";

export default {
  name: "EventList",
  components: {
    EventItem
  },
  props: {
    events: {
      type: Array,
      required: true,
      default: () => [],
      validator: v => v.every(isCalendarEvent)
    }
  },
  data: () => ({
    filter: undefined,
    showFilters: false
  }),
  methods: {
    filterEvents(value) {
      this.filter = value.toString().trim();
    }
  },
  computed: {
    /**
     * List of events sorted by date
     * @returns {CalendarEvent[]} - Array of CalendarEvents sorted by date in ascending order.
     */
    eventList() {
      let events = this.events.slice();

      if (this.filter) {
        events = events.filter(({ title }) => title.includes(this.filter));
      }

      return events.sort((a, b) => (a.date > b.date ? 1 : -1));
    }
  }
};
</script>

<style lang="scss">
.event-list {
  &__header,
  &__toolbar {
    display: flex;
    flex-flow: row wrap;
    line-height: 2;
  }
  
  &__header {
    border-bottom: 1px solid var(--event-form__border-color);
    color: var(--color-primary_darker);
    justify-content: space-between;
    padding: var(--size_base) calc(2 * var(--size_base));
  }

  &__title {
    font-weight: 600;
  }

  &__toolbar {
    margin-left: auto;
  }
}
</style>
