import { oneWay } from '@ember/object/computed';
import EmberObject, { computed } from '@ember/object';
import moment from 'moment';

const dayRange = [0,1,2,3,4,5,6];

var Day = EmberObject.extend({
  calendar: null,
  offset: 0,

  value: computed('_week', 'offset', function() {
    return moment(this.get('_week')).add(this.get('offset'), 'day');
  }),

  occurrences: computed(
    'calendar.occurrences.@each.{startingTime,endingTime}',
    'startingTime',
    'endingTime', function() {
    return this.get('calendar.occurrences').filter(occurrence => {

      return occurrence.get('startingTime') < this.get('endingTime') &&
             occurrence.get('endingTime') > this.get('startingTime');
    });
  }),

  occurrencePreview: computed(
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

  startingTime: computed(
    'value',
    '_timeSlots.firstObject.time', function() {
    return moment(this.get('value'))
      .add(this.get('_timeSlots.firstObject.time'));
  }),

  endingTime: computed(
    'value',
    '_timeSlots.lastObject.endingTime', function() {
    return moment(this.get('value'))
      .add(this.get('_timeSlots.lastObject.endingTime'));
  }),

  isToday: computed('value', function() {
    return this.get('value').isSame(moment(), 'day');
  }),

  _week: oneWay('calendar.week'),
  _timeSlots: oneWay('calendar.timeSlots')
});

Day.reopenClass({
  buildWeek: function(options) {
    return dayRange.map(function(dayOffset) {
      return Day.create({
        calendar: options.calendar,
        offset: dayOffset
      });
    });
  }
});

export default Day;
