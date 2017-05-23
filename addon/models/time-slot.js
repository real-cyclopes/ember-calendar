import moment from 'moment';
import Ember from 'ember';

var TimeSlot = Ember.Object.extend({
  duration: null,
  time: null,

  endingTime: Ember.computed('time', 'duration', function() {
    return moment.duration(this.get('time')).add(this.get('duration'));
  }),

  day: Ember.computed(function() {
    return moment().startOf('day');
  }),

  value: Ember.computed('day', 'time', function() {
    return moment(this.get('day')).add(this.get('time'));
  }),

  endingValue: Ember.computed('day', 'endingTime', function() {
    return moment(this.get('day')).add(this.get('endingTime'));
  }),

  isInRange: function(startingTime, endingTime) {
    var value = this.get('value');
    var day = this.get('day');

    return value >= moment(day).add(startingTime) &&
           this.get('endingValue') <= moment(day).add(endingTime);
  },

  next: function() {
    var duration = this.get('duration');

    return TimeSlot.create({
      time: moment.duration(this.get('time')).add(duration),
      duration: duration
    });
  }
});

TimeSlot.reopenClass({
  buildDay: function(options) {
    var timeSlots = Ember.A();

    var currentTimeSlot = this.create({
      time: options.startingTime,
      duration: options.duration
    });

    while (currentTimeSlot.isInRange(
      options.startingTime,
      options.endingTime
    )) {
      timeSlots.pushObject(currentTimeSlot);
      currentTimeSlot = currentTimeSlot.next();
    }

    return timeSlots;
  }
});

export default TimeSlot;
