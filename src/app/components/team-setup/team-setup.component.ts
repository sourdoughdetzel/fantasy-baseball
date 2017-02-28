import {Component, OnInit, ViewContainerRef} from "@angular/core";
import {Team} from '../../models/team';
import {Player} from '../../models/player';
import {TeamService} from '../../services/team.service';
import { MdDialogConfig, MdDialog } from '@angular/material';
import {AddPlayerDialog} from './add-player/add-player.component';
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
        this.teams = _.orderBy(this.teamService.getTeams(), ['rank'], ['asc']);
        this.selectedTeam = this.teams[0];
    }

    showDetails(team: Team): void{
        this.selectedTeam = team;
    }

}