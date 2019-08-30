<template>
  <form @submit.prevent="addEvent">
    <fieldset class="border">
      <div class="input-group">
        <label class="label" for="event[title]">Name</label>
        <input
          class="input"
          type="text"
          id="event[title]"
          name="event[title]"
          v-model="event.title"
        >
      </div>

      <div class="input-group">
        <label class="label" for="event[date]">Date</label>
        <input class="input" type="date" id="event[date]" name="event[date]" v-model="event.date">
      </div>

      <div class="input-group">
        <label class="label" for="event[amount]">Amount</label>
        <input
          class="input"
          type="number"
          id="event[amount]"
          name="event[amount]"
          step="0.01"
          v-model="event.amount"
        >
      </div>

      <button class="btn btn-primary" type="submit">Save</button>
    </fieldset>
  </form>
</template>

<script>
export default {
  name: "EventForm",
  data: () => ({
    event: {
      title: null,
      date: null,
      amount: 0
    }
  }),
  methods: {
    addEvent() {
      this.$emit("submit", this.event);
      this.event = {};
    }
  }
};
</script>
