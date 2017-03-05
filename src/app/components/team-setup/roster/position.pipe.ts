import {Pipe, PipeTransform} from '@angular/core';
import {Player, Position} from '../../../models/player';

import * as _ from 'lodash';

@Pipe({name: 'position', pure: false})
export class PositionPipe implements PipeTransform {
  transform(value: Player[], positions: Position[]): Player[] {
    return _.filter(value, v => _.intersection(v.positions, positions).length > 0);
  }
}