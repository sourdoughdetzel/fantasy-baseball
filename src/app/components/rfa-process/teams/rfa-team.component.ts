import {Component, Input} from '@angular/core';
import {Team} from '../../../models/team';
import {SearchService} from '../../../services/search.service';

@Component({
    selector: 'rfa-team',
    templateUrl: './rfa-team.component.html',
    styleUrls: ['./rfa-team.component.scss']
})
export class RfaTeamComponent{
    @Input()team: Team;
    showDetails: boolean;
    constructor(private searchService: SearchService){

    }

    get searchText(): string{
        return this.searchService.searchText;
    }

}