import {Component, Input} from '@angular/core';
import {Player, Designation} from '../../../../models/player';
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
    @Input()biddable: boolean;

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

    get myNomination(): boolean{
        return this.nominationService.nextNominator(this.rfaProcess, this.teams).id === this.manager.id;
    }

    nominate(player: Player){

        let nomination: Nomination = {
            playerKey: player.$key,
            ownerKey: _.find(this.teams, t => _.find(t.players, p => p.$key === player.$key) != null).manager.id,
            nominatorKey: this.manager.id,
            bids: [],
            status: "InProgress",
            rfaProcessKey: this.rfaProcess.$key,
            nominationDate: new Date().getTime()
        };
        this.rfaService.createNomination(nomination);
    }

    get playerIsNominated(): boolean{
        let lastNom = this.nominationService.getLastNomination(this.rfaProcess);
        if(!lastNom || lastNom.status === "Complete" || lastNom.status === "Fail") return false;
        return this.player.$key === lastNom.playerKey;
    }
    
}