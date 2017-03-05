import {Component, Input} from "@angular/core";
import {RfaProcess} from '../../../models/rfa-process';
import {Team} from '../../../models/team';
import {Manager} from '../../../models/manager';
import {NominationService} from '../../../services/nomination.service';
import {RfaService} from '../../../services/rfa.service';
import {TeamService} from '../../../services/team.service';
import {ManagerService} from '../../../services/manager.service';

@Component({
    selector: 'rfa-teams',
    templateUrl: './rfa-teams.component.html',
    styleUrls: ['./rfa-teams.component.scss']
})
export class RfaTeamsComponent{
    
    constructor(private nominationService: NominationService,
                private rfaService: RfaService,
                private teamService: TeamService,
                private managerService: ManagerService){
    }

    get rfaProcess(): RfaProcess{
        return this.rfaService.currentRfaProcessData;
    }

    get manager(): Manager{
        return this.managerService.currentManager;
    }
    
    get teams(): Team[]{
        return this.teamService.teamsData;
    }

    get myNomination(): boolean{
        return this.nominationService.nextNominator(this.rfaProcess, this.teams).id === this.manager.id;
    }
    
}