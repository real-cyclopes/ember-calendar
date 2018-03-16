import { htmlSafe } from '@ember/string';
import { computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import Component from '@ember/component';
import moment from 'moment';

export default Component.extend({
  classNameBindings: [':as-calendar-timetable-content'],
  attributeBindings: ['_style:style'],

  days: oneWay('model.days'),
  model: null,
  timeSlotDuration: oneWay('model.timeSlotDuration'),
  timeSlots: oneWay('model.timeSlots'),
  timetable: null,

  timeSlotStyle: computed('timeSlotHeight', function() {
    return htmlSafe(`height: ${this.get('timeSlotHeight')}px`);
  }),

  dayWidth: computed(function() {
    if (this.get('_wasInserted')) {
      return this.$().width() / this.get('days.length');
    } else {
      return 0;
    }
  }).volatile(),

  _wasInserted: false,

  _style: computed(
  'timeSlotHeight',
  'timeSlots.length', function() {
    return htmlSafe(`height: ${this.get('timeSlots.length') *
                       this.get('timeSlotHeight')}px;`);
  }),

  didInsertElement() {
    this._super(...arguments);
    this.set('_wasInserted', true);
  },

  init() {
    this._super(...arguments);
    this.set('timetable.contentComponent', this);
  },

  click(event) {
    var offset = this.$().offset();
    var offsetX = event.pageX - Math.floor(offset.left);
    var offsetY = event.pageY - Math.floor(offset.top);

    var dayIndex = Math.floor(offsetX / this.get('dayWidth'));
    var timeSlotIndex = Math.floor(offsetY / this.get('timeSlotHeight'));
    var day = this.get('days')[dayIndex];

    var timeSlot = this.get('timeSlots').objectAt(timeSlotIndex);

    this.attrs.onSelectTime(
      moment(day.get('value')).add(timeSlot.get('time'))
    );
  },

  today: computed('days', function() {
    return this.get('days').find(day => {
      return day.get('isToday');
    });
  }),

  todayTop: computed(
    'today.startingTime',
    'model.timeSlotDuration',
    'timeSlotHeight', function() {
    const now = moment();
    return (now.diff(this.get('today.startingTime')) /
            this.get('model.timeSlotDuration').as('ms')) *
            this.get('timeSlotHeight');
  }),

  todayStyle: computed('_top', function() {
    return htmlSafe(`top: ${this.get('todayTop')}px;`);
  })
});
