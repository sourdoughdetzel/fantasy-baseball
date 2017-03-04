import {Component, OnInit, Input} from "@angular/core";
import {Team} from '../../../models/team';

@Component({
    selector: 'rfa-teams',
    templateUrl: './rfa-teams.component.html',
    styleUrls: ['./rfa-teams.component.scss']
})
export class RfaTeamsComponent implements OnInit{
    @Input('rfaTeams') teams: Team[];
    
    constructor(){
    }
    
    ngOnInit(){

    }
}