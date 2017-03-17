import { Component, Input, ViewContainerRef, OnInit} from '@angular/core';
import {TeamService} from '../../../../../services/team.service';
import {RfaService} from '../../../../../services/rfa.service';
import {ManagerService} from '../../../../../services/manager.service';
import {NominationService} from '../../../../../services/nomination.service';
import {BidService} from '../../../../../services/bid.service';
import {RfaProcess} from '../../../../../models/rfa-process';
import {Team} from '../../../../../models/team';
import {Manager} from '../../../../../models/manager';
import {Nomination} from '../../../../../models/nomination';
import {Player, Button} from '../../../../../models/player';
import {Bid, BidTeam} from '../../../../../models/bid';
import { MdDialogConfig, MdDialog, MdDialogRef } from '@angular/material';
import {CompensationDialog} from './compensation-popup/compensation-popup.component';

import * as _ from 'lodash';

@Component({
  selector: 'compensation',
  templateUrl: './compensation.component.html',
  styleUrls: ['./compensation.component.scss']
})
export class CompensationComponent implements OnInit{
  @Input()bestBid: BidTeam;

  constructor(private rfaService: RfaService, 
                private managerService: ManagerService,
                private nominationService: NominationService,
                private teamService: TeamService,
                private bidService: BidService,
                private viewContainerRef: ViewContainerRef,
                private dialog: MdDialog) { }

    ngOnInit(){
        if((this.lastNomination && this.bestBid) && 
            (this.lastNomination.ownerKey === this.manager.id ||
            this.bestBid.team.manager.id === this.manager.id)){
            this.openCompensationDialog();
        }
        
    }

    private openCompensationDialog(): void{
        let config = new MdDialogConfig();
        config.viewContainerRef = this.viewContainerRef;
        config.disableClose = true;
        let dialogRef : MdDialogRef<CompensationDialog> = this.dialog.open(CompensationDialog, config);
        dialogRef.componentInstance.bestBid = this.bestBid;
        dialogRef.componentInstance.manager = this.manager;
        dialogRef.afterClosed().subscribe(res => {
            //do something
        });
    }

    get lastNomination(): Nomination{
        return this.nominationService.getLastNomination(this.rfaProcess);
    }

  get manager(): Manager{
        return this.managerService.currentManager;
    }

    get teams(): Team[]{
        return this.teamService.teamsData;
    }
    
    get rfaProcess(): RfaProcess{
        return this.rfaService.currentRfaProcessData;
    }

    private _nominatedPlayer: Player;
     get nominatedPlayer(): Player{
      if(!this._nominatedPlayer)
          this._nominatedPlayer = !this.lastNomination ? null : _.find(this.teamService.playersData, p => p.$key === this.lastNomination.playerKey);
      return this._nominatedPlayer;
  }

    get negotiationText(): string{
        return `${this.bestBid.team.manager.nickName} and 
                ${_.find(this.teams, t => this.lastNomination.ownerKey === t.manager.id).manager.nickName} 
                are negotiating compensation for ${this.nominatedPlayer.firstName} ${this.nominatedPlayer.lastName}`
    }


}
