import {Component, Input} from '@angular/core';
import {Team} from '../../../models/team';

@Component({
    selector: 'rfa-team',
    templateUrl: './rfa-team.component.html',
    styleUrls: ['./rfa-team.component.scss']
})
export class RfaTeamComponent{
    @Input()team: Team;
    showDetails: boolean;
    
}