import { format } from "date-fns";

export default class CalendarEvent {
  _date;
  _title;
  _amount;
  _id;

  constructor(calendarEventObj) {
    if (CalendarEvent.validate(calendarEventObj)) {
      this.date = calendarEventObj.date;
      this.title = calendarEventObj.title;
      this.amount = calendarEventObj.amount;
      this._id =
        format(this.date, "yyyy-MM-dd") +
        `_${calendarEventObj.title.replace(/\s+/, "-")}${+new Date()}`;
    }
  }

  static validate(calendarEventObj) {
    if (
      !calendarEventObj.hasOwnProperty("date") ||
      (typeof calendarEventObj.date !== "string" &&
        !(calendarEventObj.date instanceof Date))
    ) {
      throw new Error(
        "`date` attribute is required and must be a date string or `Date` object."
      );
    }

    if (
      !calendarEventObj.hasOwnProperty("title") ||
      calendarEventObj.title.trim().length < 1
    ) {
      throw new Error(
        "`title` attribute is required and must be at least one character long."
      );
    }

    if (
      !calendarEventObj.hasOwnProperty("amount") ||
      isNaN(parseFloat(calendarEventObj.amount))
    ) {
      throw new Error(
        "`amount` attribute is required and must be a numeric value."
      );
    }

    return true;
  }

  get date() {
    return this._date;
  }

  set date(date) {
    this._date = date;

    if (typeof date === "string") {
      this._date = new Date(date);
    }

    if (!(this._date instanceof Date)) {
      this._date = undefined;
      throw new Error("Date must be a `Date` object or parsable date string");
    }
  }

  get title() {
    return this._title;
  }

  set title(title) {
    this._title = `${title}`.trim();
  }

  get amount() {
    return +this._amount;
  }

  set amount(amount) {
    this._amount = parseFloat(amount);

    if (isNaN(this._amount)) {
      this._amount = 0;
      throw new Error("Invalid event amount. Must be a numeric value.");
    }
  }

  get id() {
    return this._id;
  }
}
