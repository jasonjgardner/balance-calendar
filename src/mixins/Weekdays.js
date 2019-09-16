export default {
	computed: {
		/**
		 * Get list of days of the week and their desired abbreviations
		 * @returns {{[string]:string}} Returns object with weekday names as keys and their abbreviations as values.
		 */
		weekdays() {
			const fullNames = [
				'Sunday',
				'Monday',
				'Tuesday',
				'Wednesday',
				'Thursday',
				'Friday',
				'Saturday'
			];

			let labels = fullNames;

			if (localStorage.abbreviateCalendarLabels) {
				labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
			}

			if (localStorage.abbreviateCalendarLabels === 'SINGLE_CHARACTER') {
				labels = labels.map(a => a.charAt(0));
			}

			return labels.reduce((previousValue, value, idx) => {
				previousValue[fullNames[idx]] = value;
				return previousValue;
			}, {});
		}
	}
};
