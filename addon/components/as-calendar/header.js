import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: [':as-calendar-header'],
  tagName: 'header',

  isInCurrentWeek: Ember.computed.oneWay('model.isInCurrentWeek'),
  model: null,
  title: '',

  actions: {
    navigateWeek: function(index) {
      this.get('model').navigateWeek(index);

      if (this.attrs['onNavigateWeek']) {
        this.attrs['onNavigateWeek'](index);
      }
    },

    goToCurrentWeek: function() {
      this.get('model').goToCurrentWeek();
      
      if (this.attrs['onNavigateWeek']) {
        this.attrs['onNavigateWeek'](0);
      }
    }
  }
});
