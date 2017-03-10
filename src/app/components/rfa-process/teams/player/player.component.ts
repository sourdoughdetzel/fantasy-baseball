import {Component, Input} from '@angular/core';
import {Player, Designation, Button} from '../../../../models/player';
import {Manager} from '../../../../models/manager';
import {ManagerService} from '../../../../services/manager.service';
import {RfaProcess} from '../../../../models/rfa-process';
import {RfaService} from '../../../../services/rfa.service';
import {NominationService} from '../../../../services/nomination.service';
import {TeamService} from '../../../../services/team.service';
import {Team} from '../../../../models/team';
import {Nomination} from '../../../../models/nomination';
import * as _ from 'lodash';

@Component({
    selector: 'player-card',
    templateUrl: './player.component.html',
    styleUrls: ['./player.component.scss']
})
export class PlayerComponent {
    @Input()player: Player;
    @Input()action: Button;
    @Input()selectedKey: string;

    constructor(private rfaService: RfaService,
                private managerService: ManagerService, 
                private nominationService: NominationService,
                private teamService: TeamService){}

    private get rfaProcess(): RfaProcess{
        return this.rfaService.currentRfaProcessData;
    }

    private get manager(): Manager{
        return this.managerService.currentManager;
    }

    private get teams(): Team[]{
        return this.teamService.teamsData;
    }

    buttonClick(player: Player): void{
        this.action.action(player);
    } 

    get highlighted(): boolean{
        return this.player.$key === this.selectedKey;
    }
}