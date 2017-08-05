import { Component, OnInit } from '@angular/core';
import {TeamService} from '../../../../services/team.service';
import {RfaService} from '../../../../services/rfa.service';
import {ManagerService} from '../../../../services/manager.service';
import {NominationService} from '../../../../services/nomination.service';
import {BidService} from '../../../../services/bid.service';
import {RfaProcess} from '../../../../models/rfa-process';
import {Team} from '../../../../models/team';
import {Manager} from '../../../../models/manager';
import {Nomination} from '../../../../models/nomination';
import {Player} from '../../../../models/player';
import {Bid, BidTeam} from '../../../../models/bid';
import * as _ from 'lodash';

@Component({
  selector: 'roster-filling',
  templateUrl: './roster-filling.component.html',
  styleUrls: ['./roster-filling.component.scss']
})
export class RosterFillingComponent implements OnInit {
  newPlayer: Player;
  private maxRFA = 3;
  constructor(private rfaService: RfaService, 
                private managerService: ManagerService,
                private nominationService: NominationService,
                private teamService: TeamService,
                private bidService: BidService) { 
                }

  ngOnInit() {
  }

  get manager(): Manager{
    return this.managerService.currentManager;
  }

  get availablePlayers(): Player[]{
    return _.orderBy(_.filter(this.teamService.playersData, p => p.designation === "RFA" && !p.protected), ["lastName", "firstName"], ["asc", "asc"]);
  }
 
  get allPlayers(): Player[]{
    return this.teamService.playersData;
  }

  playerAvailable() : boolean{
    return this.newPlayer && !_.find(this.allPlayers, p => p.firstName.toLocaleLowerCase() === this.newPlayer.firstName.toLocaleLowerCase() && p.lastName.toLocaleLowerCase() === this.newPlayer.lastName.toLocaleLowerCase());
  }

  get needsPlayers(): boolean{
    let myTeam = _.find(this.teamService.teamsData, t => t.manager.id === this.manager.id);
    return _.filter(myTeam.players, p => p.protected && (p.designation === "RFA" || p.designation === "Acquired")).length < this.maxRFA;
  }

  get myTurn(): boolean{
    let next = this.nominationService.nextRosterFiller(this.rfaService.currentRfaProcessData, this.teamService.teamsData);
    return next && this.manager.id === next.id;
  }
}
