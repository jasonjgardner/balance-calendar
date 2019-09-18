import everydate from "everydate";
import { addYears } from "date-fns";
import { CalendarEvent } from "@/lib/CalendarEvent";

export class RecurringEvent extends CalendarEvent {
  _itr;
  _endDate;

  constructor(data, everydateData = {}) {
    super(data);

    if (!data.recurs) {
      throw new Error("Recurring event must include `recurs` data.");
    }

    this._itr = everydate({
      start: data.date,
      end: data.endDate || addYears(data.date, 1),
      ...everydateData
    });
  }

  get recur() {
    return this._itr;
  }

  set recur(data) {
    this._itr = everydate({
      ...data,
      returnDates: true
    });
  }

  /**
   * Event end date getter
   * @return {Date} Returns event date
   */
  get endDate() {
    return this._date;
  }

  /**
   * Event end date setter
   * @param {string|Date} date - A date object or parsable date string
   */
  set endDate(date) {
    this._endDate = date;

    if (typeof date === "string") {
      this._endDate = new Date(date);
    }

    if (!(this._endDate instanceof Date)) {
      this._endDate = undefined;
      throw new Error("Date must be a `Date` object or parsable date string");
    }
  }
}
