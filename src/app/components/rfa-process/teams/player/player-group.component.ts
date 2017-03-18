import {Component, Input, OnInit} from '@angular/core';
import {Player, Designation, Button} from '../../../../models/player';
import {Manager} from '../../../../models/manager';
import {ManagerService} from '../../../../services/manager.service';
import {RfaProcess} from '../../../../models/rfa-process';
import {RfaService} from '../../../../services/rfa.service';
import {TeamService} from '../../../../services/team.service';
import {NominationService} from '../../../../services/nomination.service';
import {Team} from '../../../../models/team';
import {Nomination} from '../../../../models/nomination';
import {SearchService} from '../../../../services/search.service';

import * as _ from "lodash";
@Component({
    selector: 'player-group',
    templateUrl: './player-group.component.html',
    styleUrls: ['./player-group.component.scss']
})
export class PlayerGroupComponent implements OnInit{
    @Input()players: Player[];
    @Input('designation')dez: Designation;
    @Input()hideEmpty: boolean;
    playerNominateBtn: Button;
    constructor(private rfaService: RfaService,
                private teamService: TeamService,
                private managerService: ManagerService,
                private nominationService: NominationService,
                private searchService: SearchService){
    }

    ngOnInit(){
        this.playerNominateBtn = {
            action: this.nominate,
            display: "Nominate",
            show: this.showNominate
        };
    }

    get searchText(): string{
        return this.searchService.searchText;
    }
    
    get rfaProcess(): RfaProcess{
        return this.rfaService.currentRfaProcessData;
    }

    private get manager(): Manager{
        return this.managerService.currentManager;
    }

    private get teams(): Team[]{
        return this.teamService.teamsData;
    }
    
    nominate = (player: Player): void => {
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

    get playerKey(): string{
        let lastNom = this.nominationService.getLastNomination(this.rfaProcess);
        if(!lastNom || lastNom.status === "Complete" || lastNom.status === "Fail") return "";
        return lastNom.playerKey;
    }

    get myNomination(): boolean{
        return this.nominationService.nextNominator(this.rfaProcess, this.teams).id === this.manager.id;
    }

    showNominate = (player: Player): boolean => {
        return this.myNomination && !player.protected && player.designation === 'RFA';
    }
}