import {Component, OnInit, ViewContainerRef} from "@angular/core";
import {Team} from '../../models/team';
import {Player} from '../../models/player';
import {TeamService} from '../../services/team.service';
import { MdDialogConfig, MdDialog } from '@angular/material';
import {AddPlayerDialog} from './add-player/add-player.component';
import {Observable} from 'rxjs/Rx';
import * as _ from 'lodash';

@Component({
    templateUrl: './team-setup.component.html',
    styleUrls: ['./team-setup.component.scss']
})
export class TeamSetupComponent implements OnInit{
    teams: Team[];
    selectedTeam: Team;
    editTeamName: boolean;
    constructor(private teamService: TeamService,
        private viewContainerRef: ViewContainerRef,
        private dialog: MdDialog){    }
    
    ngOnInit(){
        this.teams = this.teamService.getTeams();
        this.selectedTeam = this.teams[0];
        this.editTeamName = false;
    }

    showDetails(team: Team): void{
        this.selectedTeam = team;
        this.editTeamName = false;
    }

    addPlayer(): void{
        let config = new MdDialogConfig();
        config.viewContainerRef = this.viewContainerRef;

        let dialogRef = this.dialog.open(AddPlayerDialog, config);

        dialogRef.afterClosed().subscribe(res => this.pushPlayerToTeam(res as Player));
    }

    editPlayer(player: Player): void{
        let config = new MdDialogConfig();
        config.viewContainerRef = this.viewContainerRef;
        config.data = {player: player};
        let dialogRef = this.dialog.open(AddPlayerDialog, config);
        dialogRef.afterClosed().subscribe(res => player = res)
    }

    deletePlayer(player: Player): void{
        _.remove(this.selectedTeam.players, (p) => {return p === player;});
    }

    private pushPlayerToTeam(player: Player) {
        if(player){
            this.selectedTeam.players.push(player);
        }
    }
}