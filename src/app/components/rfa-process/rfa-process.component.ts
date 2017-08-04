import {Component, OnInit} from "@angular/core";
import {TeamService} from '../../services/team.service';
import {RfaService} from '../../services/rfa.service';
import {ManagerService} from '../../services/manager.service';
import {NominationService} from '../../services/nomination.service';
import {RfaProcess} from '../../models/rfa-process';
import {Team} from '../../models/team';
import {Manager} from '../../models/manager';
import {SearchService} from '../../services/search.service';

import * as _ from 'lodash';

@Component({
    templateUrl: './rfa-process.component.html',
    styleUrls: ['./rfa-process.component.scss']
})
export class RFAProcessComponent {
    myTeam: Team;
    ready: boolean;

    constructor(private teamService: TeamService, 
                private rfaService: RfaService,
                private managerService: ManagerService,
                private nominationService: NominationService,
                public searchService: SearchService){
    }

    get manager(): Manager{
        return this.managerService.currentManager;
    }

    get rfaProcess(): RfaProcess{
        return this.rfaService.currentRfaProcessData;
    }

    get teams(): Team[]{
        let t = this.teamService.teamsData;
        this.myTeam = _.find(t, team => team.manager.id === this.manager.id);
        return t;
    }


    get loading(): boolean{
        return !this.manager || !this.teams;
    }

    get newProcess(): boolean{
        return !this.rfaProcess || this.completedProcess;
    }

    get completedProcess(): boolean{
        return this.rfaProcess ? false : this.rfaProcess.status === "Complete";
    }
}
