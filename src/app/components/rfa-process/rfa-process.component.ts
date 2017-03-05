import {Component, OnInit} from "@angular/core";
import {TeamService} from '../../services/team.service';
import {RfaService} from '../../services/rfa.service';
import {ManagerService} from '../../services/manager.service';
import {NominationService} from '../../services/nomination.service';
import {RfaProcess} from '../../models/rfa-process';
import {Team} from '../../models/team';
import {Manager} from '../../models/manager';
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
                private nominationService: NominationService){
    }

    get manager(): Manager{
        return this.managerService.currentManager;
    }

    get rfaProcess(): RfaProcess{
        return this.rfaService.currentRfaProcessData;
    }

    private updateProcessToBidding():void{
        if(this.rfaProcess && 
            this.teams && 
            this.rfaProcess.readyManagers &&
            this.rfaProcess.status === "Created" &&
            this.teams.length === this.rfaProcess.readyManagers.length
        ){
            this.rfaProcess.status = "Bidding";
            this.rfaService.updateProcess(this.rfaProcess);   
        }
    }

    get teams(): Team[]{
        let t = this.teamService.teamsData;
        this.myTeam = _.find(t, team => team.manager.id === this.manager.id);
        return t;
    }

    createProcess(): void{
        if(!this.rfaProcess){
            this.rfaService.createProcess();
            this.rfaService.managerReady(this.manager.id, this.rfaProcess.$key);
        }
    }

    get loading(): boolean{
        return !this.teams || !this.rfaProcess;
    }

}