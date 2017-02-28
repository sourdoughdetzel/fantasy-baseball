import {Component, OnInit, Input} from '@angular/core';
import {Team} from '../../../models/team';
import {Player} from '../../../models/player';

@Component({
    selector: 'rfa-setup',
    templateUrl: './rfa-setup.component.html',
    styleUrls: ['./rfa-setup.component.scss']
})
export class RfaSetupComponent implements OnInit{
    @Input()
    selectedTeam: Team;
    
    constructor(){    }
    
    ngOnInit(){
       
    }
}