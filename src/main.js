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
import App from "./App.vue";

Vue.config.productionTip = false;

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
  render: h => h(App)
}).$mount("#app");
