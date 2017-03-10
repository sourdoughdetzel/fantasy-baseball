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
import * as _ from 'lodash';

@Component({
  selector: 'app-compensation-popup',
  templateUrl: './compensation-popup.component.html',
  styleUrls: ['./compensation-popup.component.scss']
})
export class CompensationDialog implements OnInit {
  lastNomination: Nomination;
  bestBid: BidTeam;
  manager: Manager;
  gimmeBtn: Button;
  constructor(public dialogRef: MdDialogRef<CompensationDialog>, 
              private teamService: TeamService,
              private rfaService: RfaService) {
   }

  ngOnInit() {
        this.gimmeBtn = {
          action: this.gimme, 
          display: "Gimme!", 
          show: this.canCompensate  
        };
  }

  get teams(): Team[]{
    return this.teamService.teamsData;
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
  get compensationPlayer(): string{
    return this.lastNomination.compensationPlayerKey;
  }

  get team(): Team{
    return this.bestBid.team;
  }

  get selectedPlayer(): string{
        return this.compensationPlayer;
    }

  gimme = (player: Player):void => {
      
  }

  canCompensate = (player: Player): boolean => {
    return !this.higherRank && this.compensationPlayer !== player.$key;
  }

  killTheDeal(): void{
      this.lastNomination.status = "Fail";
      this.lastNomination.compensationPlayerKey = null;
      this.rfaService.updateNomination(this.lastNomination);
      this.dialogRef.close();
  }
}
