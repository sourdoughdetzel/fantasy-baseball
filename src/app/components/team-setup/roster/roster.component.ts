import {Component, OnInit, ViewContainerRef, Input} from '@angular/core';
import {Team} from '../../../models/team';
import {Player} from '../../../models/player';
import {TeamService} from '../../../services/team.service';
import { MdDialogConfig, MdDialog } from '@angular/material';
import {AddPlayerDialog} from '../add-player/add-player.component';
import {Observable} from 'rxjs/Rx';
import * as _ from 'lodash';

@Component({
    selector: 'roster',
    templateUrl: './roster.component.html',
    styleUrls: ['./roster.component.scss']
})
export class RosterComponent implements OnInit{
    @Input()
    selectedTeam: Team;
    
    editTeamName: boolean;
    constructor(private teamService: TeamService,
        private viewContainerRef: ViewContainerRef,
        private dialog: MdDialog){    }
    
    ngOnInit(){
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