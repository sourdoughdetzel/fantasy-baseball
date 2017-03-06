import {Component, ViewContainerRef} from "@angular/core";
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
export class TeamSetupComponent{
    selectedTeam: Team;

    constructor(private teamService: TeamService,
        private viewContainerRef: ViewContainerRef,
        private dialog: MdDialog){    }

    get teams(): Team[]{
        let t = this.teamService.teamsData;
        if(!t || !t.length) return [];

        let id: number;
        if(this.selectedTeam)
             id = this.selectedTeam.id; 
        this.selectedTeam = id ? _.find(t, team => team.id === id) : t[0];
        return t;
    }

    showDetails(team: Team): void{
        this.selectedTeam = team;
    }

    updateRankings(): void{
        _.forEach(this.teams, (t, i) => {
            t.rank = i+1;
        });
        _.forEach(this.teams, t => this.teamService.teams.update(t.$key, {rank: t.rank}));
    }

}