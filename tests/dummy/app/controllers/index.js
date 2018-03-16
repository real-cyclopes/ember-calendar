import EmberObject from '@ember/object';
import { A } from '@ember/array';
import { on } from '@ember/object/evented';
import Controller from '@ember/controller';

export default Controller.extend({
  selections: null,
  occurrences: null,

  _initializeDefaults: on('init', function() {
    if (this.get('selections') == null) {
      this.set('selections', A());
    }

    if (this.get('occurrences') == null) {
      this.set('occurrences', A());
    }
  }),

  actions: {
    calendarAddOccurrence: function(occurrence) {
      this.get('occurrences').pushObject(EmberObject.create({
        title: occurrence.get('title'),
        startsAt: occurrence.get('startsAt'),
        endsAt: occurrence.get('endsAt')
      }));
    },

    calendarUpdateOccurrence: function(occurrence, properties) {
      occurrence.setProperties(properties);
    },

    calendarRemoveOccurrence: function(occurrence) {
      this.get('occurrences').removeObject(occurrence);
    }
  }
});
