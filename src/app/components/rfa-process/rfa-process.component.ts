import {Component, OnInit} from "@angular/core";
import {TeamService} from '../../services/team.service';
import {RfaService} from '../../services/rfa.service';
import {ManagerService} from '../../services/manager.service';
import {RfaProcess} from '../../models/rfa-process';
import {Team} from '../../models/team';
import {Manager} from '../../models/manager';
import * as _ from 'lodash';

@Component({
    templateUrl: './rfa-process.component.html'
})
export class RFAProcessComponent implements OnInit{

    rfaProcess: RfaProcess;
    teams: Team[];
    manager: Manager;
    myTeam: Team;

    constructor(private teamService: TeamService, 
                private rfaService: RfaService,
                private managerService: ManagerService){
    }

    ngOnInit(){
        this.manager = this.managerService.getCurrentManager();
        this.setupProcess();
        this.getTeams();
    }

    private setupProcess():void{
        this.rfaService.rfaProcess.subscribe((p) => {
            if(p.length){
                this.rfaProcess = p[0];
                this.rfaService.nominations(this.rfaProcess.$key).subscribe(n => {
                    this.rfaProcess.nominations = n;
                });
            }
        }); 
    }

    private getTeams():void{
        this.teamService.teamsData.subscribe(t => {
            this.myTeam = _.find(t, team => team.manager.id === this.manager.id);
            this.teams = t;
        });
    }

    createProcess(): void{
        this.rfaService.createProcess();
    }
}