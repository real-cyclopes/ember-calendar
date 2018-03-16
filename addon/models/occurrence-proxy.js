import { oneWay } from '@ember/object/computed';
import EmberObject, { computed } from '@ember/object';
import Ember from 'ember';
import moment from 'moment';
import computedMoment from 'ember-calendar/macros/computed-moment';
import Day from './day';

var OccurrenceProxy = EmberObject.extend(Ember.Copyable, {
  calendar: null,
  content: null,
  endingTime: computedMoment('content.endsAt'),
  startingTime: computedMoment('content.startsAt'),
  title: oneWay('content.title'),

  duration: computed('startingTime', 'endingTime', function() {
    return moment.duration(
      this.get('endingTime').diff(this.get('startingTime'))
    );
  }),

  day: computed('startingTime', 'calendar', function() {
    return Day.create({
      calendar: this.get('calendar'),
      offset: this.get('startingTime').isoWeekday() - 1
    });
  }),

  copy: function() {
    return OccurrenceProxy.create({
      calendar: this.get('calendar'),

      content: EmberObject.create({
        startsAt: this.get('content.startsAt'),
        endsAt: this.get('content.endsAt'),
        title: this.get('content.title')
      })
    });
  }
});

export default OccurrenceProxy;
