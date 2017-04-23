import {Component, ViewContainerRef, Input} from '@angular/core';
import {Player} from '../../../models/player';
import {Team} from '../../../models/team';
import {TeamService} from '../../../services/team.service';
import { MdDialogConfig, MdDialog } from '@angular/material';
import {AddPlayerDialog} from '../add-player/add-player.component';
import {AdminService} from '../../../services/admin.service';
import * as _ from 'lodash';

@Component({
    selector: 'roster-player',
    templateUrl: './roster-player.component.html',
    styleUrls: ['./roster-player.component.scss']
})
export class RosterPlayerComponent {
    @Input()player: Player;
    @Input()team: Team;
    edit: boolean;

    constructor(private teamService: TeamService,
        private viewContainerRef: ViewContainerRef,
        private dialog: MdDialog,
        private adminService: AdminService){}

     updatePlayer(player: Player):void{
        this.teamService.players.update(player.$key, player);
    }
    
    deletePlayer(player: Player): void{
        this.teamService.players.remove(player.$key);
    }

    private pushPlayerToTeam(player: Player) {
        if(player){
            player.teamId = this.team.id;
            this.teamService.players.push(player);
        }
    }

    get rfas(): Player[]{
        return _.filter(this.team.players, p => p.designation === "RFA");
    }

    get rfasLocked(): boolean{
        return (this.maxProtectedRFAs - _.filter(this.rfas, r => !!r.protected).length) <= 0;
    }

    get maxProtectedRFAs(): number{
        return Math.max(0, 4 - this.team.rank);
    }

    editPlayer(player: Player): void{
        let config = new MdDialogConfig();
        config.viewContainerRef = this.viewContainerRef;
        config.data = {player: player};
        let dialogRef = this.dialog.open(AddPlayerDialog, config);
        dialogRef.afterClosed().subscribe(res => this.updatePlayer(player));
    }

    get canEdit(): boolean{
        return this.adminService.isAdmin;
    }
}