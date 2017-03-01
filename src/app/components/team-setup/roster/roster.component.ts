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

    edit: boolean;
    constructor(private teamService: TeamService,
        private viewContainerRef: ViewContainerRef,
        private dialog: MdDialog){  }
    
    ngOnInit(){
        this.edit = false;
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
        dialogRef.afterClosed().subscribe(res => this.updatePlayer(player));
    }

    updatePlayer(player: Player):void{
        this.teamService.players.update(player.$key, player);
    }
    
    deletePlayer(player: Player): void{
        this.teamService.players.remove(player.$key);
    }

    updateTeam(): void{
        if(this.edit){
             this.teamService.teams.update(this.selectedTeam.$key, this.selectedTeam);
        }
        this.edit = !this.edit;
    }

    private pushPlayerToTeam(player: Player) {
        if(player){
            player.teamId = this.selectedTeam.id;
            this.teamService.players.push(player);
        }
    }

    get rfas(): Player[]{
        return _.filter(this.selectedTeam.players, p => p.designation === "RFA");
    }

    get rfasLocked(): boolean{
        return (this.maxProtectedRFAs - _.filter(this.rfas, r => !!r.protected).length) <= 0;
    }

    get maxProtectedRFAs(): number{
        return Math.max(0, 4 - this.selectedTeam.rank);
    }
}