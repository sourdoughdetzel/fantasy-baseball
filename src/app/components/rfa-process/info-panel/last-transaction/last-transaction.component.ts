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
  selector: 'last-transaction',
  templateUrl: './last-transaction.component.html',
  styleUrls: ['./last-transaction.component.scss']
})
export class LastTransactionComponent implements OnInit {

  constructor(private rfaService: RfaService, 
                private managerService: ManagerService,
                private nominationService: NominationService,
                private teamService: TeamService,
                private bidService: BidService) { }

  ngOnInit() {
  }

   get teams(): Team[]{
        return this.teamService.teamsData;
    }
    
    get rfaProcess(): RfaProcess{
        return this.rfaService.currentRfaProcessData;
    }

    get lastNomination(): Nomination{
        return this.nominationService.getLastWonNomination(this.rfaProcess);
    }

    get winner(): Manager{
      return this.bestBid ? this.bestBid.team.manager : null;
    }

    get loser(): Manager{
      return _.find(this.teams, t => t.manager.id === this.lastNomination.ownerKey).manager;
    }

    get wonPlayer(): string{
      let player = _.find(this.teamService.playersData, p => p.$key === this.lastNomination.playerKey);
      return `${player.firstName} ${player.lastName}`;
    }

    get compensationPlayer(): string{
      let player = _.find(this.teamService.playersData, p => p.$key === this.lastNomination.compensationPlayerKey);
      return player ? `${player.firstName} ${player.lastName}` : ``;
    }
    get bestBid(): BidTeam{
        return this.bidService.bestBid(this.lastNomination, this.teams);
    }
}
