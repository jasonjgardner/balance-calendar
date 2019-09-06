<template>
  <form class="event-form" @submit.prevent="addEvent">
    <fieldset>
      <div v-if="!date" class="input-group">
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
      <div v-else class="input-group">
        <time class="label--day">{{ format(date, 'cccc, MMMM d, yyyy') }}</time>
        <input type="hidden" name="event[date]" :value="date">
      </div>

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
        <label class="label" for="event[amount]">Amount</label>
        <input
          class="input"
          type="number"
          id="event[amount]"
          name="event[amount]"
          step="0.01"
          pattern="^-?[1-9]+"
          placeholder="Credit or debit amount"
          min="-9999999.99"
          max="9999999.99"
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
      /**
       * Watch event model for changes
       * @param {CalendarEvent|Object} value - Form model to validate
       */
      handler: function(value) {
        this.isValid =
          value.title && value.title.length > 0 && value.amount !== 0;

        if (this.isValid) {
          this.event.date = value.date ? value.date : this.date;
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.event.date = this.date;
  },
  methods: {
    format,
    /**
     * Emits event data to store
     * @event EventForm#addEvent~submit
     */
    addEvent() {
      this.$emit("submit", this.event);
      this.event = {};
    },
    /**
     * Sets the event amount to a negative value
     */
    amountDebit() {
      this.event.amount = Math.abs(this.event.amount) * -1;
    },
    /**
     * Sets the event amount to a positive value
     */
    amountCredit() {
      this.event.amount = Math.abs(this.event.amount);
    },
    /**
     * Selects input value on click or focus
     */
    selectAll(focusEvent) {
      focusEvent.target.select();
    }
  }
};
</script>

<style lang="scss">
.event-form {
  background-color: var(--event-form__background-color);
  border: 1px solid var(--event-form__border-color);
  width: var(--event-form__size);

  & > fieldset {
    border: 0;
    height: 100%;
  }
}

.input-group {
  align-items: center;
  display: flex;
}

.label {
  display: inline-block;
  font-size: 0.825rem;
  font-weight: 600;
  margin-right: var(--size_base);
  overflow: hidden;
  text-overflow: ellipsis;
  width: calc(12 * var(--size_base));
}

.input {
  border: 1px solid var(--input__border-color);
  border-radius: calc(0.5 * var(--size_base));
  padding: var(--size_base);
}
</style>
