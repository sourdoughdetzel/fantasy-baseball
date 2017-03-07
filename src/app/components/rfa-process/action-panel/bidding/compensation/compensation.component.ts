import { Component, Input} from '@angular/core';
import {TeamService} from '../../../../../services/team.service';
import {RfaService} from '../../../../../services/rfa.service';
import {ManagerService} from '../../../../../services/manager.service';
import {NominationService} from '../../../../../services/nomination.service';
import {BidService} from '../../../../../services/bid.service';
import {RfaProcess} from '../../../../../models/rfa-process';
import {Team} from '../../../../../models/team';
import {Manager} from '../../../../../models/manager';
import {Nomination} from '../../../../../models/nomination';
import {Player} from '../../../../../models/player';
import {Bid, BidTeam} from '../../../../../models/bid';
import * as _ from 'lodash';

@Component({
  selector: 'compensation',
  templateUrl: './compensation.component.html',
  styleUrls: ['./compensation.component.scss']
})
export class CompensationComponent {
  @Input()lastNomination: Nomination;

  constructor(private rfaService: RfaService, 
                private managerService: ManagerService,
                private nominationService: NominationService,
                private teamService: TeamService,
                private bidService: BidService) { }

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

    get bestBid(): BidTeam{
        return this.bidService.bestBid(this.lastNomination, this.teams);
    }

    get negotiationText(): string{
        return `${this.bestBid.team.manager.nickName} and 
                ${_.find(this.teams, t => this.lastNomination.ownerKey === t.manager.id).manager.nickName} 
                are negotiating compensation for ${this.nominatedPlayer.firstName} ${this.nominatedPlayer.lastName}`
    }
}
