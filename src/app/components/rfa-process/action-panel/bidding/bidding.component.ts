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
import {Bid} from '../../../../models/bid';
import * as _ from 'lodash';

@Component({
  selector: 'bidding',
  templateUrl: './bidding.component.html',
  styleUrls: ['./bidding.component.scss']
})
export class BiddingComponent implements OnInit {

  nominatedPlayer: Player;
  bidPoints: number;

  constructor(private rfaService: RfaService, 
                private managerService: ManagerService,
                private nominationService: NominationService,
                private teamService: TeamService,
                private bidService: BidService) { 
                }

  ngOnInit() {
    this.bidPoints = 1;
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

    get nominatingManager(): Manager{
        return this.nominationService.nextNominator(this.rfaProcess, this.teams);
    }

    get myNomination(): boolean{
        return this.nominatingManager.id === this.manager.id;
    }

    get lastNomination(): Nomination{
        let nomination = this.nominationService.getLastNomination(this.rfaProcess);
        this.nominatedPlayer = !nomination ? null : _.find(this.teamService.playersData, p => p.$key === nomination.playerKey);
        return nomination;
    }

    get nextToBid(): boolean{
        return this.bidService.getNextBidder(this.lastNomination, this.teams).id === this.manager.id;
    }

    get canBid(): boolean{
        return this.bidService.managerCanBid(this.lastNomination, this.teams, this.manager.id);
    }

    get winningBidText(): string{
        let bestBid = this.bidService.bestBid(this.lastNomination, this.teams);
        if(!bestBid){
            return "No bids placed yet";
        } 
        return `Best bid: ${bestBid.bid.points} points by ${bestBid.team.manager.nickName}`;
    }
    passOnThisGuy(): void{
        this.bidPoints = 0;
        this.bid();
    }

    bid(): void{
        this.bidService.createBid(this.bidPoints, this.manager.id, this.lastNomination, this.teams);
        this.bidPoints = 1;
    }
}
