import Ember from 'ember';
import moment from 'moment';
import interact from 'interact';
import OccurrenceComponent from '../occurrence';

export default OccurrenceComponent.extend({
  classNameBindings: [':as-calendar-occurrence--timetable'],

  timetable: null,
  isInteracting: false,
  isDraggable: true,
  isResizable: true,
  isRemovable: true,
  dayWidth: Ember.computed.oneWay('timetable.dayWidth'),
  referenceElement: Ember.computed.oneWay('timetable.referenceElement'),

  _calendar: Ember.computed.oneWay('model.calendar'),
  _dayEndingTime: Ember.computed.oneWay('day.endingTime'),
  _dragBottomDistance: null,
  _dragTopDistance: null,
  _dragVerticalOffset: null,
  _preview: Ember.computed.oneWay('_calendar.occurrencePreview'),

  _setupInteractable: Ember.on('didInsertElement', function() {
    var interactable = interact(this.$()[0]).on('mouseup', (event) => {
      Ember.run(this, this._mouseUp, event);
    });

    if (this.get('isResizable')) {
      interactable.resizable({
        edges: { bottom: '.as-calendar-occurrence__resize-handle' },

        onstart: (event) => {
          Ember.run(this, this._resizeStart, event);
        },

        onmove: (event) => {
          Ember.run(this, this._resizeMove, event);
        },

        onend: (event) => {
          Ember.run(this, this._resizeEnd, event);
        },
      });
    }

    if (this.get('isDraggable')) {
      interactable.draggable({
        onstart: (event) => {
          Ember.run(this, this._dragStart, event);
        },

        onmove: (event) => {
          Ember.run(this, this._dragMove, event);
        },

        onend: (event) => {
          Ember.run(this, this._dragEnd, event);
        },
      });
    }
  }),

  _teardownInteractable: Ember.on('willDestroyElement', function() {
    interact(this.$()[0]).off();
  }),

  _resizeStart: function() {
    this.set('isInteracting', true);
    this.set('_calendar.occurrencePreview', this.get('model').copy());
  },

  _resizeMove: function(event) {
    var newDuration = moment.duration(
      Math.floor(event.rect.height / this.get('timeSlotHeight')) *
      this.get('computedTimeSlotDuration').as('ms')
    );

    var changes = {
      endsAt: moment(this.get('_startingTime')).add(newDuration).toDate()
    };

    this._validateAndSavePreview(changes);
  },

  _resizeEnd: function() {
    this.attrs.onUpdate(this.get('content'), {
      endsAt: this.get('_preview.content.endsAt')
    });

    this.set('isInteracting', false);
    this.set('_calendar.occurrencePreview', null);
  },

  _dragStart: function() {
    var $this = this.$();
    var $referenceElement = Ember.$(this.get('referenceElement'));

    this.set('isInteracting', true);
    this.set('_calendar.occurrencePreview', this.get('model').copy());
    this.set('_dragVerticalOffset', 0);
    this.set('_dragTopDistance', $referenceElement.offset().top - $this.offset().top);

    this.set('_dragBottomDistance',
             ($referenceElement.offset().top + $referenceElement.height()) -
             ($this.offset().top + $this.height()));
  },

  _dragMove: function(event) {
    this.set('_dragVerticalOffset', this.get('_dragVerticalOffset') + event.dy);

    var dragTimeSlotOffset = this._dragTimeSlotOffset(event);
    var dragDayOffset = this._dragDayOffset(event);
    var startsAt = moment(this.get('_startingTime')).add(dragTimeSlotOffset).add(dragDayOffset);

    var changes = {
      startsAt: startsAt.toDate(),
      endsAt: moment(startsAt).add(this.get('_duration')).toDate()
    };

    this._validateAndSavePreview(changes);
  },

  _dragTimeSlotOffset: function() {
    var verticalDrag = this._clamp(
      this.get('_dragVerticalOffset'),
      this.get('_dragTopDistance'),
      this.get('_dragBottomDistance')
    );

    return moment.duration(
      Math.floor(verticalDrag / this.get('timeSlotHeight')) * this.get('computedTimeSlotDuration')
    );
  },

  _dragDayOffset: function(event) {
    var $referenceElement = Ember.$(this.get('referenceElement'));

    var offsetX = this._clamp(
      event.pageX - $referenceElement.offset().left,
      0,
      $referenceElement.width() - 1
    );

    return moment.duration(
      Math.floor(offsetX / this.get('dayWidth')) -
      this.get('day.offset'),
      'days'
    );
  },

  _dragEnd: function() {
    this.attrs.onUpdate(this.get('content'), {
      startsAt: this.get('_preview.content.startsAt'),
      endsAt: this.get('_preview.content.endsAt')
    });

    this.set('isInteracting', false);
    this.set('_calendar.occurrencePreview', null);
    this.set('_dragVerticalOffset', null);
    this.set('_dragTopDistance', null);
    this.set('_dragBottomDistance', null);
  },

  _mouseUp: function() {
    Ember.$(document.documentElement).css('cursor', '');
  },

  _validateAndSavePreview: function(changes) {
    if (this._validatePreviewChanges(changes)) {
      this.attrs.onUpdate(this.get('_preview.content'), changes);
    }
  },

  _validatePreviewChanges: function(changes) {
    var newPreview = this.get('_preview').copy();

    newPreview.get('content').setProperties(changes);

    return newPreview.get('startingTime') >= newPreview.get('day.startingTime') &&
           newPreview.get('endingTime') <= newPreview.get('day.endingTime') &&
           newPreview.get('duration') >= this.get('computedTimeSlotDuration');
  },

  _clamp: function(number, min, max) {
    return Math.max(min, Math.min(number, max));
  },

  actions: {
    remove: function() {
      this.attrs.onRemove(this.get('content'));
    }
  }
});
