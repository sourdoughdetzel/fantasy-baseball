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

    private pushPlayerToTeam(player: Player) {
        if(player){
            player.teamId = this.selectedTeam.id;
            this.teamService.players.push(player);
        }
    }
}