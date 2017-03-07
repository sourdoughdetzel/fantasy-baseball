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
import {Observable} from 'rxjs';
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
        let bestBid = this.bestBid;
        if(!bestBid){
            return "No bids placed yet";
        } 
        return `Best bid: ${bestBid.bid.points} points by ${bestBid.team.manager.nickName}`;
    }

    get bestBid(): BidTeam{
        return this.bidService.bestBid(this.lastNomination, this.teams);
    }

    get imWinning(): boolean{
        let bestBid = this.bestBid;
        if(!bestBid)
            return false;
        return bestBid.team.manager.id === this.manager.id;
    }


    get iPassed(): boolean{
        return !!_.find(this.lastNomination.bids, b => {return b.managerId === this.manager.id && b.points === 0; });
    }

    passOnThisGuy(): void{
        this.bidPoints = 0;
        this.bid();
    }

    bid(): void{
        this.bidService.createBid(this.bidPoints, this.manager.id, this.lastNomination, this.teams);
        this.bidPoints = 1;
    }

    get minBid(): number{
        let b = this.bestBid;
        return Math.min(!b ? 1 : b.bid.points, 2);
    }

    get maxBid(): number{
       return Math.min(_.find(this.teams, t => t.manager.id === this.manager.id).bidPoints, 2);
    }

    subPoint(): void{
        this.bidPoints--;
    }

    addPoint(): void{
        this.bidPoints++;
    }
}
