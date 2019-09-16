import Vue from 'vue';
import { CalendarEvent, isCalendarEvent } from '@/lib/CalendarEvent';

export const store = Vue.observable({
	events: localStorage.getItem('events')
		? JSON.parse(localStorage.events).map(e => new CalendarEvent(e))
		: []
});

const saveEvents = () => {
	localStorage.setItem(
		'events',
		JSON.stringify(
			store.events.filter(isCalendarEvent).map(calEvent => calEvent.sleep())
		)
	);
};

export const mutations = {
	addEvent(calendarEvent) {
		if (!isCalendarEvent(calendarEvent)) {
			throw new Error(
				'Can not add event. Data is not an instance of `CalendarEvent`'
			);
		}

		store.events.push(calendarEvent);
		saveEvents();
	},
	removeEvent(removeId) {
		store.events = store.events.filter(({ id }) => id !== removeId);
		saveEvents();
	}
};
