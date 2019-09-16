/**
 * Calendar Day
 * @typedef {Object} CalendarDay
 * @property {string} id - Unique identifier
 * @property {Date} date - Date and time of calendar day
 * @property {CalendarEvent[]} events - List of events for this day
 * @property {number} balance - Expected balance by end of day
 */

import "@/assets/css/index.scss";
import Vue from "vue";
import Unicon from "vue-unicons";
import {
  uniAngleRight,
  uniAngleDown,
  uniAngleUp,
  uniAngleLeft,
  uniMoneyStack,
  uniBill,
  uniMoneyWithdrawal,
  uniInvoice,
  uniReceipt,
  uniMoneyInsert,
  uniMoneyWithdraw,
  uniCalendarAlt,
  uniStepForward,
  uniPrevious,
  uniRedo,
  uniPlus,
  uniMinus,
  uniEllipsisV,
  uniEllipsisH,
  uniCheck,
  uniCalendarSlash,
  uniMoneyBillStack,
  uniReceiptAlt,
  uniInfoCircle,
  uniQuestionCircle,
  uniExclamationTriangle,
  uniExclamationOctagon,
  uniSort,
  uniRepeat,
  uniCheckCircle,
  uniPlusCircle,
  uniTimesCircle,
  uniCalender,
  uniEditAlt,
  uniTimes,
  uniMinusCircle,
  uniPlusSquare,
  uniStar
} from "vue-unicons/src/icons";

import App from "./App.vue";
import { store } from "./store";
import { CalendarEvent } from "./lib/CalendarEvent";

Vue.config.productionTip = false;

Unicon.add([
  uniAngleRight,
  uniAngleDown,
  uniAngleUp,
  uniAngleLeft,
  uniMoneyStack,
  uniBill,
  uniMoneyWithdrawal,
  uniInvoice,
  uniReceipt,
  uniMoneyInsert,
  uniMoneyWithdraw,
  uniCalendarAlt,
  uniStepForward,
  uniPrevious,
  uniRedo,
  uniPlus,
  uniMinus,
  uniEllipsisV,
  uniEllipsisH,
  uniCheck,
  uniCalendarSlash,
  uniMoneyBillStack,
  uniReceiptAlt,
  uniInfoCircle,
  uniQuestionCircle,
  uniExclamationTriangle,
  uniExclamationOctagon,
  uniSort,
  uniRepeat,
  uniCheckCircle,
  uniPlusCircle,
  uniTimesCircle,
  uniCalender,
  uniEditAlt,
  uniTimes,
  uniMinusCircle,
  uniPlusSquare,
  uniStar
]);
Vue.use(Unicon);

Vue.filter("toCurrency", (value, locale = null, options = {}) => {
  if (typeof value !== "number") {
    return value;
  }

  const formatter = new Intl.NumberFormat(locale || "en-US", {
    currency: "USD",
    minimumFractionDigits: 2,
    ...options,
    style: "currency"
  });

  return formatter.format(value);
});

new Vue({
  render: h =>
    h(App, {
      props: {
        events:
          store.events.length > 0
            ? store.events
            : [
                new CalendarEvent({
                  title: "Schedule something",
                  amount: 0,
                  date: new Date()
                })
              ]
      }
    })
}).$mount("#app");
