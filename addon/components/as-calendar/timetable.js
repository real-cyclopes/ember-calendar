import { htmlSafe } from '@ember/string';
import { computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [':as-calendar-timetable'],
  tagName: 'section',

  days: oneWay('model.days'),
  model: null,
  timeSlotHeight: null,
  timeSlots: oneWay('model.timeSlots'),
  contentComponent: null,
  dayWidth: oneWay('contentComponent.dayWidth'),
  referenceElement: oneWay('contentComponent.element'),

  labeledTimeSlots: computed('timeSlots.[]', function() {
    return this.get('timeSlots').filter(function(_, index) {
      return (index % 2) === 0;
    });
  }),

  timeSlotLabelListStyle: computed('timeSlotHeight', function() {
    var timeSlotHeight = this.get('timeSlotHeight');

    return htmlSafe(`margin-top: -${timeSlotHeight}px;
             line-height: ${timeSlotHeight * 2}px;`);
  }),

  timeSlotLabelStyle: computed('timeSlotHeight', function() {
    return htmlSafe(`height: ${2 * this.get('timeSlotHeight')}px;`);
  })
});
