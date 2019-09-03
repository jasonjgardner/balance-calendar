/**
 * Vue global event manager
 * @module EventBus
 */

import Vue from "vue";

/**
 * Additional Vue instance for emitting global events
 */
export const EventBus = new Vue();
