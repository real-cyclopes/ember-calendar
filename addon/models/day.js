import _ from 'lodash';
import moment from 'moment';
import Ember from 'ember';

var Day = Ember.Object.extend({
  calendar: null,
  offset: 0,

  value: Ember.computed('_week', 'offset', function() {
    return moment(this.get('_week')).add(this.get('offset'), 'day');
  }),

  occurrences: Ember.computed(
    'calendar.occurrences.@each.{startingTime,endingTime}',
    'startingTime',
    'endingTime', function() {
    return this.get('calendar.occurrences').filter(occurrence => {

      return occurrence.get('startingTime') < this.get('endingTime') &&
             occurrence.get('endingTime') > this.get('startingTime');
    });
  }),

  occurrencePreview: Ember.computed(
    'calendar.occurrencePreview.startingTime',
    'startingTime',
    'endingTime', function() {
    var occurrencePreview = this.get('calendar.occurrencePreview');

    if (occurrencePreview != null) {
      var startingTime = occurrencePreview.get('startingTime');

      if (startingTime >= this.get('startingTime') &&
          startingTime <= this.get('endingTime')) {
        return occurrencePreview;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }),

  startingTime: Ember.computed(
    'value',
    '_timeSlots.firstObject.time', function() {
    return moment(this.get('value'))
      .add(this.get('_timeSlots.firstObject.time'));
  }),

  endingTime: Ember.computed(
    'value',
    '_timeSlots.lastObject.endingTime', function() {
    return moment(this.get('value'))
      .add(this.get('_timeSlots.lastObject.endingTime'));
  }),

  isToday: Ember.computed('value', function() {
    return this.get('value').isSame(moment(), 'day');
  }),

  _week: Ember.computed.oneWay('calendar.week'),
  _timeSlots: Ember.computed.oneWay('calendar.timeSlots')
});

Day.reopenClass({
  buildWeek: function(options) {
    return Ember.A(_.range(0, 7).map(function(dayOffset) {
      return Day.create({
        calendar: options.calendar,
        offset: dayOffset
      });
    }));
  }
});

export default Day;
