import Ember from 'ember';
import moment from 'moment';
import TimeSlot from './time-slot';
import Day from './day';
import OccurrenceProxy from './occurrence-proxy';

export default Ember.Object.extend({
  dayEndingTime: null,
  dayStartingTime: null,
  occurrences: null,
  startingDate: null,
  timeSlotDuration: null,
  occurrencePreview: null,

  isInCurrentWeek: Ember.computed('week', '_currentWeek', function() {
    return this.get('week').isSame(this.get('_currentWeek'));
  }),

  timeSlots: Ember.computed(
    'dayStartingTime',
    'dayEndingTime',
    'timeSlotDuration', function() {
    return TimeSlot.buildDay({
      startingTime: this.get('dayStartingTime'),
      endingTime: this.get('dayEndingTime'),
      duration: this.get('timeSlotDuration')
    });
  }),

  days: Ember.computed(function() {
    return Day.buildWeek({ calendar: this });
  }),

  week: Ember.computed('startingTime', function() {
    return moment(this.get('startingTime')).startOf('isoWeek');
  }),

  _currentWeek: Ember.computed(function() {
    return moment().startOf('isoWeek');
  }),

  initializeCalendar: Ember.on('init', function() {
    if (this.get('startingTime') == null) {
      this.goToCurrentWeek();
    }
  }),

  createOccurrence: function(options) {
    var content = Ember.merge({
      endsAt: moment(options.startsAt)
        .add(this.get('defaultOccurrenceDuration')).toDate(),

      title: this.get('defaultOccurrenceTitle')
    }, options);

    return OccurrenceProxy.create({
      calendar: this,
      content: Ember.Object.create(content)
    });
  },

  navigateWeek: function(index) {
    this.set('startingTime', moment(this.get('startingTime')).add(index, 'weeks'));
  },

  goToCurrentWeek: function() {
    this.set('startingTime', moment());
  }
});
