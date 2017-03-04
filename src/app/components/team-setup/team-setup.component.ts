import {Component, OnInit, ViewContainerRef} from "@angular/core";
import {Team} from '../../models/team';
import {Player} from '../../models/player';
import {TeamService} from '../../services/team.service';
import { MdDialogConfig, MdDialog } from '@angular/material';
import {AddPlayerDialog} from './add-player/add-player.component';
import {FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import {Observable} from 'rxjs/Rx';
import * as _ from 'lodash';

@Component({
    selector: 'team-setup',
    templateUrl: './team-setup.component.html',
    styleUrls: ['./team-setup.component.scss']
})
export class TeamSetupComponent implements OnInit{
    teams: Team[];
    selectedTeam: Team;

    constructor(private teamService: TeamService,
        private viewContainerRef: ViewContainerRef,
        private dialog: MdDialog){    }
    
    ngOnInit(){
        this.teamService.teamsData.subscribe(
            (t) => {
                let id: number;
                if(this.selectedTeam)
                    id = this.selectedTeam.id; 
                this.teams = t;
                this.selectedTeam = id ? _.find(this.teams, team => team.id === id) : this.teams[0];
            }
        );
    }

    showDetails(team: Team): void{
        this.selectedTeam = team;
    }

    updateRankings(): void{
        _.forEach(this.teams, (t, i) => {
            t.rank = i+1;
            console.log(t.name + ' ' + t.rank);
        });
        _.forEach(this.teams, t => this.teamService.teams.update(t.$key, {rank: t.rank}));
    }

}