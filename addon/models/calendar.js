import { merge } from '@ember/polyfills';
import { on } from '@ember/object/evented';
import EmberObject, { computed } from '@ember/object';
import moment from 'moment';
import TimeSlot from './time-slot';
import Day from './day';
import OccurrenceProxy from './occurrence-proxy';

export default EmberObject.extend({
  dayEndingTime: null,
  dayStartingTime: null,
  occurrences: null,
  startingDate: null,
  timeSlotDuration: null,
  occurrencePreview: null,

  isInCurrentWeek: computed('week', '_currentWeek', function() {
    return this.get('week').isSame(this.get('_currentWeek'));
  }),

  timeSlots: computed(
    'dayStartingTime',
    'dayEndingTime',
    'timeSlotDuration', function() {
    return TimeSlot.buildDay({
      startingTime: this.get('dayStartingTime'),
      endingTime: this.get('dayEndingTime'),
      duration: this.get('timeSlotDuration')
    });
  }),

  days: computed(function() {
    return Day.buildWeek({ calendar: this });
  }),

  week: computed('startingTime', function() {
    return moment(this.get('startingTime')).startOf('isoWeek');
  }),

  _currentWeek: computed(function() {
    return moment().startOf('isoWeek');
  }),

  initializeCalendar: on('init', function() {
    if (this.get('startingTime') == null) {
      this.goToCurrentWeek();
    }
  }),

  createOccurrence: function(options) {
    var content = merge({
      endsAt: moment(options.startsAt)
        .add(this.get('defaultOccurrenceDuration')).toDate(),

      title: this.get('defaultOccurrenceTitle')
    }, options);

    return OccurrenceProxy.create({
      calendar: this,
      content: EmberObject.create(content)
    });
  },

  navigateWeek: function(index) {
    this.set('startingTime', moment(this.get('startingTime')).add(index, 'weeks'));
  },

  goToCurrentWeek: function() {
    this.set('startingTime', moment());
  }
});
