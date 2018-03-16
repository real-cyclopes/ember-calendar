import { computed } from '@ember/object';
import moment from 'moment';

export default function(dependentKey) {
  return computed(dependentKey, function() {
    var dependentValue = this.get(dependentKey);

    if (dependentValue != null) {
      return moment.duration(dependentValue);
    } else {
      return null;
    }
  });
}
