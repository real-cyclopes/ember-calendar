import Component from '@ember/component';
import ComponentCalendar from 'ember-calendar/models/component-calendar';
//import InboundActionsMixin from 'ember-component-inbound-actions/inbound-actions';

//export default Ember.Component.extend(InboundActionsMixin, {
export default Component.extend({
  classNameBindings: [':as-calendar'],
  tagName: 'section',

  dayEndingTime: '22:00',
  dayStartingTime: '8:00',
  defaultOccurrenceDuration: '1:00',
  defaultOccurrenceTitle: 'New event',
  isEditing: true,
  model: null,
  occurrences: null,
  showHeader: true,
  startingDate: null,
  timeSlotDuration: '00:30',
  timeSlotHeight: 20,
  title: null,

  disablePast: false,
  highlightNow: true,

  init() {
    this._super(...arguments);
    this.set('model', ComponentCalendar.create({ component: this }));
  },

  actions: {
    addOccurrence(time) {
      let occurrence = this.get('model').createOccurrence({
        startsAt: time.toDate()
      });

      this.get('onAddOccurrence')(occurrence.get('content'));
    },

    onNavigateWeek(index) {
      if (this.get('onNavigateWeek')) {
        this.get('onNavigateWeek')(index);
      }
    }
  }
});
