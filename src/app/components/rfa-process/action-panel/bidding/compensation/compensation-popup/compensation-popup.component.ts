import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import {Nomination} from '../../../../../../models/nomination';
import {Manager} from '../../../../../../models/manager';
import {ManagerService} from '../../../../../../services/manager.service';
import {RfaService} from '../../../../../../services/rfa.service';
import {BidTeam} from '../../../../../../models/bid';
import {Team} from '../../../../../../models/team';
import {Player, Button} from '../../../../../../models/player';
import {TeamService} from '../../../../../../services/team.service';
import {BidService} from '../../../../../../services/bid.service';
import {RfaProcess} from '../../../../../../models/rfa-process';
import {NominationService} from '../../../../../../services/nomination.service';
import * as _ from 'lodash';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-compensation-popup',
  templateUrl: './compensation-popup.component.html',
  styleUrls: ['./compensation-popup.component.scss']
})
export class CompensationDialog implements OnInit {
  bestBid: BidTeam;
  manager: Manager;
  gimmeBtn: Button;
  constructor(public dialogRef: MdDialogRef<CompensationDialog>, 
              private teamService: TeamService,
              private rfaService: RfaService,
              private bidService: BidService,
              private nominationService: NominationService) {
   }

  ngOnInit() {
        this.gimmeBtn = {
          action: this.gimme, 
          display: "Gimme!", 
          show: this.canCompensate  
        };

        let subscription = Observable.interval(2000).subscribe(() => {
          if(this.lastNomination.status !== "PendingCompensation"){
            this.dialogRef.close();
          }
        });

  }

  get teams(): Team[]{
    return this.teamService.teamsData;
  }

    get rfaProcess(): RfaProcess{
        return this.rfaService.currentRfaProcessData;
    }

 get lastNomination(): Nomination{
        return this.nominationService.getLastNomination(this.rfaProcess);
    }

  

  get higherRank(): boolean{
    return this.manager.id !== this.lastNomination.ownerKey;
  }

  get rfaPlayer(): Player{
    return _.find(this.teamService.playersData, p => p.$key === this.lastNomination.playerKey);
  }

  get rfaTeam(): Team{
    return _.find(this.teams, t => t.manager.id === this.lastNomination.ownerKey);
  }
  get compensationPlayer(): Player{
    return _.find(this.teamService.playersData, p => p.$key === this.lastNomination.compensationPlayerKey);
  }

  get team(): Team{
    return this.bestBid.team;
  }

  get selectedPlayer(): string{
        return this.compensationPlayer ? this.compensationPlayer.$key : null;
    }

  gimme = (player: Player):void => {
      this.lastNomination.compensationPlayerKey = player.$key;
      this.rfaService.updateNomination(this.lastNomination);
  }

  canCompensate = (player: Player): boolean => {
    return !this.higherRank && (!this.compensationPlayer || this.compensationPlayer.$key !== player.$key);
  }

  killTheDeal(): void{
      this.lastNomination.status = "Fail";
      this.lastNomination.compensationPlayerKey = null;
      this.lastNomination.bids = [];
      this.rfaService.updateNomination(this.lastNomination);
      this.dialogRef.close();
  }

  doTheDeal(): void{
    this.bidService.completeTransaction(this.lastNomination, this.teamService.teamsData);
    this.lastNomination.status = "Complete";
    this.lastNomination.bids = [];
    this.rfaService.updateNomination(this.lastNomination);
    this.dialogRef.close(); 
  }
}
