/**
 * Calendar Day
 * @typedef {Object} CalendarDay
 * @property {Date} date - Date and time of calendar day
 * @property {boolean} isCurrentMonth - `true` if day is in current month
 * @property {boolean} isToday - `true` if day is same as current day
 * @property {boolean} isSelected - `true` if day is same as selected date
 */

/**
 * Calendar Event
 * @typedef {Object} CalendarEvent
 * @property {string|Date} date - Time of event
 * @property {string} title - Name of event
 * @property {float} amount - Balance adjustment for date
 */

import "ace-css/css/ace.min.css";
import "@/assets/css/index.scss";
import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

Vue.filter("toCurrency", (value, locale = null, options = {}) => {
  if (typeof value !== "number") {
    return value;
  }

  const formatter = new Intl.NumberFormat(locale || "en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    ...options
  });

  return formatter.format(value);
});

new Vue({
  render: h => h(App)
}).$mount("#app");
