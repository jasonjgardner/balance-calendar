import everydate from 'everydate';
import { CalendarEvent } from '@/lib/CalendarEvent';

class RecurringEvent extends CalendarEvent {
	_recurrance;

	constructor(data, everydateData = {}) {
		super(data);
	}
}
