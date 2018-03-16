import { computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import computedMoment from 'ember-calendar/macros/computed-moment';
import computedDuration from 'ember-calendar/macros/computed-duration';
import Calendar from './calendar';
import OccurrenceProxy from './occurrence-proxy';

export default Calendar.extend({
  component: null,
  startingTime: computedMoment('component.startingDate'),
  dayStartingTime: computedDuration('component.dayStartingTime'),
  dayEndingTime: computedDuration('component.dayEndingTime'),
  timeSlotDuration: computedDuration('component.timeSlotDuration'),

  defaultOccurrenceTitle: oneWay(
    'component.defaultOccurrenceTitle'
  ),

  defaultOccurrenceDuration: computedDuration(
    'component.defaultOccurrenceDuration'
  ),

  occurrences: computed('component.occurrences.[]', function() {
    return this.get('component.occurrences').map((occurrence) => {
      return OccurrenceProxy.create({ calendar: this, content: occurrence });
    });
  })
});
