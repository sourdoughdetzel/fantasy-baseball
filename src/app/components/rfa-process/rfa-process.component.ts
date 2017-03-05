import {Component, OnInit} from "@angular/core";
import {TeamService} from '../../services/team.service';
import {RfaService} from '../../services/rfa.service';
import {ManagerService} from '../../services/manager.service';
import {RfaProcess} from '../../models/rfa-process';
import {Team} from '../../models/team';
import {Manager} from '../../models/manager';
import * as _ from 'lodash';

@Component({
    templateUrl: './rfa-process.component.html',
    styleUrls: ['./rfa-process.component.scss']
})
export class RFAProcessComponent implements OnInit{

    rfaProcess: RfaProcess;
    teams: Team[];
    manager: Manager;
    myTeam: Team;
    ready: boolean;

    constructor(private teamService: TeamService, 
                private rfaService: RfaService,
                private managerService: ManagerService){
    }

    ngOnInit(){
        this.manager = this.managerService.getCurrentManager();
        this.managerService.managerSubject.subscribe(m => {
            this.manager = m;
        });
        this.getTeams();
        this.setupProcess();
    }

    private setupProcess():void{
        this.rfaService.currentRfaProcess.subscribe((p) => {
            this.rfaProcess = p;
        }); 
    }

    // private subscribeToNomination(processKey: string){
    //     this.rfaService.nominations().subscribe(n => {
    //         this.rfaProcess.nominations.push(n);

    //     });
    // }

    private getTeams():void{
        this.teamService.teamsData.subscribe(t => {
            this.myTeam = _.find(t, team => team.manager.id === this.manager.id);
            this.teams = t;
        });
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