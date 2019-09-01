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
          maxlength="50"
          placeholder="Balance event"
          required
          v-model="event.title"
        >
      </div>

      <div class="input-group">
        <label class="label" for="event[date]">Date</label>
        <input
          class="input"
          type="date"
          id="event[date]"
          name="event[date]"
          placeholder="MM/DD/YYYY"
          required
          v-model="event.date"
        >
      </div>

      <div class="input-group">
        <label class="label" for="event[amount]">Amount</label>
        <input
          class="input"
          type="number"
          id="event[amount]"
          name="event[amount]"
          step="0.01"
          pattern="^-?[1-9]+"
          placeholder="Credit or debit amount"
          required
          v-model="event.amount"
          @click="selectAll"
          @focus.native="selectAll"
        >

        <div class="check-group" @click="amountCredit">
          <input
            class="check-group__input"
            type="radio"
            id="event[amountType][credit]"
            name="event[amountType]"
            value="credit"
            :checked="event.amount >= 0"
          >
          <label for="event[amountType][credit]">Credit</label>
        </div>

        <div class="check-group" @click="amountDebit">
          <input
            class="check-group__input"
            type="radio"
            id="event[amountType][debit]"
            name="event[amountType]"
            value="debit"
            :checked="event.amount < 0"
          >
          <label for="event[amountType][debit]">Debit</label>
        </div>
      </div>

      <button class="btn" type="reset" @click.prevent="$emit('dismissed')">Cancel</button>
      <button class="btn" type="submit" :disabled="!isValid">Save</button>
    </fieldset>
  </form>
</template>

<script>
import { format } from "date-fns";

export default {
  name: "EventForm",
  props: {
    date: {
      type: Date,
      required: false,
      default: () => new Date()
    }
  },
  data: () => ({
    isValid: false,
    event: {
      title: null,
      date: null,
      amount: 0
    }
  }),
  watch: {
    event: {
      handler: function(value) {
        this.isValid =
          value.title &&
          value.title.length > 0 &&
          value.date.length > 0 &&
          value.amount !== 0;
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.event.date = format(this.date, "yyyy-MM-dd");
  },
  methods: {
    addEvent() {
      this.$emit("submit", this.event);
      this.event = {};
    },
    amountDebit() {
      this.event.amount = Math.abs(this.event.amount) * -1;
    },
    amountCredit() {
      this.event.amount = Math.abs(this.event.amount);
    },
    selectAll(focusEvent) {
      focusEvent.target.select();
    }
  }
};
</script>
