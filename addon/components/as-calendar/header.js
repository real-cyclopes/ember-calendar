import { computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [':as-calendar-header'],
  tagName: 'header',

  isInCurrentWeek: oneWay('model.isInCurrentWeek'),
  model: null,
  title: '',

  showPrevWeekButton: computed('disablePast', 'isInCurrentWeek', function() {
    return !this.get('disablePast') && !this.get('isInCurrentWeek');
  }),

  actions: {
    navigateWeek: function(index) {
      this.get('model').navigateWeek(index);

      if (this.get('onNavigateWeek')) {
        this.get('onNavigateWeek')(index);
      }
    },

    goToCurrentWeek: function() {
      this.get('model').goToCurrentWeek();

      if (this.get('onNavigateWeek')) {
        this.get('onNavigateWeek')(0);
      }
    }
  }
});
