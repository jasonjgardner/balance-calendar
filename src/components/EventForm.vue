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
          class="input input--large"
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

      <div class="event-form__controls">
        <button
          class="btn btn--outline btn--secondary"
          type="reset"
          @click.prevent="cancelEvent"
          :disabled="!isDirty"
        >Cancel</button>
        <button class="btn" type="submit" :disabled="!isValid">Save</button>
      </div>
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
    isDirty: false,
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

        this.isDirty =
          Object.values({
            /// Ignore date input when testing for pristine fields
            ...this.event.title,
            ...this.event.amount
          }).filter(v => !v || !v.length).length > 0; /// Event data is not empty
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
     * Resets form data and emits "dismissed" event
     * @event EventForm#addEvent~dismissed
     */
    cancelEvent() {
      this.$emit("dismissed");
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

  & > fieldset {
    border: 0;
    height: 100%;
    padding: 0;
  }

  &__controls {
    align-items: center;
    background-color: var(--event-form-controls__background-color);
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-end;
    margin-top: calc(2 * var(--size_base));
    padding: calc(2 * var(--size_base));
    width: 100%;

    .btn + .btn {
      margin-left: var(--size_base);
    }
  }
}

.input-group {
  align-items: center;
  display: flex;

  & + .input-group {
    margin-top: calc(2 * var(--size_base));
  }

  &:last-of-type {
    margin-bottom: calc(2 * var(--size_base));
  }
}

.label {
  display: inline-block;
  font-size: 0.825rem;
  font-weight: 600;
  margin: 0 var(--size_base) 0 calc(2 * var(--size_base));
  overflow: hidden;
  text-overflow: ellipsis;
  width: calc(15 * var(--size_base));

  &--day {
    border-bottom: 1px solid var(--event-form__border-color);
    color: var(--color-primary_dark);
    display: block;
    font-size: 1.25rem;
    font-weight: bold;
    line-height: 2;
    padding: var(--size_base) calc(2 * var(--size_base));
    width: 100%;
  }
}

.input {
  border: 1px solid var(--input__border-color);
  border-radius: calc(0.5 * var(--size_base));
  padding: var(--size_base);
  
  &--large {
    font-size: 1.125rem;
  }
}
</style>
