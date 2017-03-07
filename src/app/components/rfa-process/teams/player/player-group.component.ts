import {Component, Input, OnInit} from '@angular/core';
import {Player, Designation} from '../../../../models/player';
import {Manager} from '../../../../models/manager';
import {RfaProcess} from '../../../../models/rfa-process';
import {RfaService} from '../../../../services/rfa.service';

@Component({
    selector: 'player-group',
    templateUrl: './player-group.component.html',
    styleUrls: ['./player-group.component.scss']
})
export class PlayerGroupComponent{
    @Input()players: Player[];
    @Input('designation')dez: Designation;
    @Input()hideEmpty: boolean;
    
    constructor(private rfaService: RfaService){
    }

    get rfaProcess(): RfaProcess{
        return this.rfaService.currentRfaProcessData;
    }
}