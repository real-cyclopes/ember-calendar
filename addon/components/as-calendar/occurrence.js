import { htmlSafe } from '@ember/string';
import { computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import Component from '@ember/component';
import computedDuration from 'ember-calendar/macros/computed-duration';
import moment from 'moment';

export default Component.extend({
  attributeBindings: ['_style:style'],
  classNameBindings: [':as-calendar-occurrence'],
  tagName: 'article',

  model: null,
  timeSlotDuration: null,
  timeSlotHeight: null,
  title: oneWay('model.title'),
  content: oneWay('model.content'),
  computedTimeSlotDuration: computedDuration('timeSlotDuration'),

  titleStyle: computed('timeSlotHeight', function() {
    return htmlSafe(`line-height: ${this.get('timeSlotHeight')}px;`);
  }),

  _dayStartingTime: oneWay('day.startingTime'),

  _dayEndingTime: oneWay('day.endingTime'),

  _startingTime: computed('model.startingTime', '_dayStartingTime', function() {
    if (this.get('model.startingTime').isBefore(this.get('_dayStartingTime'))) {
      return this.get('_dayStartingTime');
    } else {
      return this.get('model.startingTime');
    }
  }),

  _endingTime: computed('model.endingTime', '_dayEndingTime', function() {
    if (this.get('model.endingTime').isAfter(this.get('_dayEndingTime'))) {
      return this.get('_dayEndingTime');
    } else {
      return this.get('model.endingTime');
    }
  }),

  _duration: computed('_startingTime', '_endingTime', function() {
    return moment.duration(
      this.get('_endingTime').diff(this.get('_startingTime'))
    );
  }),

  _occupiedTimeSlots: computed(
    '_duration',
    'computedTimeSlotDuration', function() {
      return this.get('_duration').as('ms') /
             this.get('computedTimeSlotDuration').as('ms');
  }),

  _height: computed('_occupiedTimeSlots', function() {
    return this.get('timeSlotHeight') * this.get('_occupiedTimeSlots');
  }),

  _top: computed(
    '_startingTime',
    '_dayStartingTime',
    'computedTimeSlotDuration',
    'timeSlotHeight', function() {
    return (this.get('_startingTime').diff(this.get('_dayStartingTime')) /
            this.get('computedTimeSlotDuration').as('ms')) *
            this.get('timeSlotHeight');
  }),

  _style: computed('_height', '_top', function() {
    return htmlSafe(`top: ${this.get('_top')}px;
            height: ${this.get('_height')}px;`);
  }),

  click(event) {
    event.stopPropagation();
  }
});
