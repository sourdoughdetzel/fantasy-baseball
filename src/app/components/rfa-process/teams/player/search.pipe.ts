import {Pipe, PipeTransform} from '@angular/core';
import {Player, Position} from '../../../../models/player';

@Pipe({name: 'search', pure: false})
export class SearchPipe implements PipeTransform {
  transform(value: Player[], searchText: string): Player[] {
    let text = searchText ? searchText.toLocaleLowerCase(): null;
    return text ? value.filter(player => this.fullName(player.firstName, player.lastName).toLocaleLowerCase().indexOf(text) != -1) : value;
  }

  private fullName(first: string, last: string): string{
      return `${first} ${last}`;
  }
}