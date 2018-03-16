import { computed } from '@ember/object';
import moment from 'moment';

export default function(dependentKey) {
  return computed(dependentKey, {
    get() {
      var dependentValue = this.get(dependentKey);

      if (dependentValue != null) {
        return moment(dependentValue);
      } else {
        return null;
      }
    },

    set(_, value) {
      if (value != null) {
        this.set(dependentKey, value.toDate());
      } else {
        this.set(dependentKey, null);
      }

      return value;
    }
  });
}
