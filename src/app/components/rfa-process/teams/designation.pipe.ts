import {Pipe, PipeTransform} from '@angular/core';
import {Player, Designation} from '../../../models/player';

import * as _ from 'lodash';

@Pipe({name: 'designation', pure: false})
export class DesignationPipe implements PipeTransform {
  transform(value: Player[], designation: Designation): Player[] {
    return _.filter(value, v => v.designation === designation);
  }
}