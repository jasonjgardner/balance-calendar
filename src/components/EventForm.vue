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
          v-model.number="event.amount"
          @click="selectAll"
          @focus.native="selectAll"
        >

        <div class="check-group" @click="event.amount = Math.abs(event.amount)">
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

        <div class="check-group" @click="event.amount = Math.abs(event.amount) * -1">
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

      <div class="input-group">
        <label class="label" for="event[recurs]">Recurs</label>
        <select class="input" id="event[recurs]" name="event[recurs]" v-model="event.measure">
          <option value="months">Monthly</option>
          <option value="weeks">Weekly</option>
          <option value="days">Daily</option>
          <option value="years">Annually</option>
        </select>
      </div>

      <div v-show="event.measure === 'days'">
        <label class="label" for="event[recurrance][days]">Every</label>
        <input
          class="input"
          type="number"
          id="event[recurrance][days]"
          name="event[recurrance][days]"
          step="1"
          placeholder="Days"
          min="1"
          max="6"
          @input="setUnits"
        >
      </div>
      <div v-show="event.measure === 'weeks'">
        <div class="input-group">
          <label class="label" for="event[recurrance][weeks]">Every</label>
          <input
            class="input"
            type="number"
            id="event[recurrance][weeks]"
            name="event[recurrance][weeks]"
            step="1"
            placeholder="Weeks"
            min="1"
            max="6"
            @input="setUnits"
          >
        </div>
        <div class="input-group">
          <div
            v-once
            v-for="(weekdayLabel, fullDayLabel) in weekdays"
            :title="fullDayLabel"
            :key="fullDayLabel"
          >
            <label>{{ weekdayLabel }}</label>
            <input
              class="input"
              type="checkbox"
              :value="fullDayLabel"
              @input="setWeekdayUnits(fullDayLabel)"
            >
          </div>
        </div>
      </div>
      <div v-show="event.measure === 'months'">
        <label class="label" for="event[recurrance][months]">Every</label>
        <input
          class="input"
          type="number"
          id="event[recurrance][months]"
          name="event[recurrance][months]"
          step="1"
          placeholder="Months"
          min="1"
          max="11"
          @input="setUnits"
        >
      </div>
      <div v-show="event.measure === 'years'">
        <label class="label" for="event[recurrance][years]">Every</label>
        <input
          class="input"
          type="number"
          id="event[recurrance][years]"
          name="event[recurrance][years]"
          step="1"
          placeholder="Years"
          min="1"
          max="10"
          @input="setUnits"
        >
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
import Weekdays from "@/mixins/Weekdays";

export default {
  name: "EventForm",
  mixins: [Weekdays],
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
      amount: 0,
      measure: null,
      units: []
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
     * Selects input value on click or focus
     */
    selectAll(focusEvent) {
      focusEvent.target.select();
    },
    setUnits(every) {
      this.event.units = Array.from([every]);
    },
    setWeekdayUnits(day) {
      const idx = Object.keys(this.weekdays).indexOf(day);

      if (idx < 0) {
        return;
      }

      this.event.units = [...Array.from(this.event.units), idx];
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
