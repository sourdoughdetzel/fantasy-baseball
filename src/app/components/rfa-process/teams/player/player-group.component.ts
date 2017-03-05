import {Component, Input, OnInit} from '@angular/core';
import {Player, Designation} from '../../../../models/player';
import {Manager} from '../../../../models/manager';

@Component({
    selector: 'player-group',
    templateUrl: './player-group.component.html',
    styleUrls: ['./player-group.component.scss']
})
export class PlayerGroupComponent implements OnInit{
    @Input()players: Player[];
    @Input('designation')dez: Designation;
    @Input()manager: Manager;

    constructor(){
    }

    ngOnInit(){
    }
}