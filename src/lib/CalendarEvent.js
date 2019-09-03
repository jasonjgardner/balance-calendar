import { format } from "date-fns";

/**
 * @typedef {Object} CalendarEventData
 * @property {string|Date} date - The event date
 * @property {string} title - The name of the event
 * @property {number} amount - Credit/debit value of event
 */

/**
 * CalendarEvent object
 */
export default class CalendarEvent {
  /**
   * Event date
   * @private
   */
  _date;

  /**
   * Event title
   * @private
   */
  _title;

  /**
   * Event credit/debit amount
   * @private
   */
  _amount;

  /**
   * Unique event identifier
   * @private
   */
  _id;

  /**
   * Instaniate CalendarEvent class from a plain object
   * @param {CalendarEventData} data - An object containing `date`, `title`, and `amount` properties
   */
  constructor(data) {
    if (CalendarEvent.validate(data)) {
      Object.assign(this, data);
    }
  }

  /**
   * Validate input `CalendarEventData`-type object
   * @param {CalendarEventData} data - An object which should contain `date`, `title`, and `amount` properties.
   * @throws Error thrown if any data is invalid
   * @returns Returns `true` if data is valid
   */
  static validate(data) {
    if (
      !data.hasOwnProperty("date") ||
      (typeof data.date !== "string" && !(data.date instanceof Date))
    ) {
      throw new Error(
        "`date` attribute is required and must be a date string or `Date` object."
      );
    }

    if (!data.hasOwnProperty("title") || data.title.trim().length < 1) {
      throw new Error(
        "`title` attribute is required and must be at least one character long."
      );
    }

    if (!data.hasOwnProperty("amount") || isNaN(parseFloat(data.amount))) {
      throw new Error(
        "`amount` attribute is required and must be a numeric value."
      );
    }

    return true;
  }

  /**
   * Prepare object for stringification
   * @returns {object} CalendarEvent properties as plain object
   */
  sleep() {
    return {
      /// Get all object properties
      ...Object.fromEntries(
        Object.entries(this).map(([key, value]) => [
          key.replace(/^_+/, ""), /// Strip underscore prefix of private properties
          value
        ])
      ),
      /// Modify properties
      date: this.date.toJSON()
    };
  }

  /**
   * Event date getter
   * @return {Date} Returns event date
   */
  get date() {
    return this._date;
  }

  /**
   * Event date setter
   * @param {string|Date} date - A date object or parsable date string
   */
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

  /**
   * Gets the event title
   * @returns {string} Event title
   */
  get title() {
    return this._title;
  }

  /**
   * Trim and set the event title
   * @param {string} title - Event title
   */
  set title(title) {
    this._title = `${title}`.trim();
  }

  /**
   * Gets the credit/debit amount of event
   * @returns {number} Event credit or debit amount
   */
  get amount() {
    return +this._amount;
  }

  /**
   * Parse and set the credit/debit amount
   * @param {string|number} amount - An amount which can be parsed as a, or is a, floating point number
   */
  set amount(amount) {
    this._amount = parseFloat(amount);

    if (isNaN(this._amount)) {
      this._amount = 0;
      throw new Error("Invalid event amount. Must be a numeric value.");
    }
  }

  /**
   * Generates and sets a unique ID
   * @returns {string} Unique ID
   */
  getId() {
    if (!this._id) {
      this._id =
        format(this.date, "yyyy-MM-dd") +
        `_${this.title.replace(/\s+/, "-").substr(0, 25)}${+new Date()}`;
    }

    return this._id;
  }

  /**
   * Gets the event unique identifier.
   * @returns {string} Unique ID
   * @see CalendarEvent.getId
   */
  get id() {
    return this._id || this.getId();
  }
}
