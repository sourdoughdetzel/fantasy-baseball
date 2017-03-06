import { Injectable } from '@angular/core';
import {RfaService} from './rfa.service';
import {NominationService} from './nomination.service';
import {Manager} from '../models/manager';
import {Team} from '../models/team';
import {Nomination, NominationStatus} from '../models/nomination';
import {Bid, BidTeam} from '../models/bid';
import * as _ from 'lodash';

@Injectable()
export class BidService {
  private defaultNominator: any = {id: -1};
  private maxBid : number = 2;
  constructor(private rfaService: RfaService, private nominationService: NominationService) { }

    createBid(points: number, bidderId: number, nomination: Nomination, teams: Team[]){
        let bidder = _.find(teams, t => t.manager.id === bidderId);
        let bid : Bid = {
          managerId: bidder.manager.id,
          points: points,
          nominationKey: nomination.$key,
          bidDate: new Date().getTime()
        }
        let nominationClone = _.clone(nomination);
        nominationClone.bids.push(bid);
        if(this.noOneWantsPlayer(nominationClone, teams)){
            this.updateStatus(nomination, "Complete");
        }
        else{
          let nextBidder = this.getNextBidder(nominationClone, teams);
          if(nextBidder.id === -1){
            this.updateStatus(nomination, 
                          this.nominationService.requiresCompensation(nomination, bidder, teams) ? 
                            "PendingCompensation" : "Complete");
          }
        }
        this.rfaService.createBid(bid);
    }

    private noOneWantsPlayer(nomination: Nomination, teams: Team[]): boolean{
        let eligibleBidders = this.getEligibleBidders(teams, nomination);
        return _.filter(nomination.bids, b => b.points === 0).length === nomination.bids.length && nomination.bids.length >= eligibleBidders.length;
    }

    private updateStatus(nomination: Nomination, status: NominationStatus): void{
      nomination.status = status;
      this.rfaService.updateNomination(nomination);
    }
    
    getNextBidder(nomination: Nomination, teams: Team[]): Manager{
        if(nomination.status !== "InProgress") return this.defaultNominator;
        let lastBid = this.getLastBid(nomination.bids);
        let eligibleBidders = this.getEligibleBidders(teams, nomination);
        return (eligibleBidders.length) ? this.getNextInLine(lastBid, eligibleBidders) : this.defaultNominator;
    }

    managerCanBid(nomination: Nomination, teams: Team[], managerId: number): boolean{
      if(nomination.status !== "InProgress") return false;
      let eligibleBidders = this.getEligibleBidders(teams, nomination);
      return _.find(eligibleBidders, eb => eb.manager.id === managerId) != null;
    }

    bestBid(nomination: Nomination, teams: Team[]): BidTeam{
      return this.getHighestBid(nomination.bids, teams);
    }

    private getNextInLine(lastBid: Bid, eligibleTeams: Team[]): Manager{
        let nextBidTeamIdx: number;
        if(!lastBid){
          nextBidTeamIdx = 0;
        }
        else{
          nextBidTeamIdx = _.findIndex(eligibleTeams, e => e.manager.id === lastBid.managerId) + 1;
          nextBidTeamIdx = (nextBidTeamIdx < eligibleTeams.length)? nextBidTeamIdx : 0;
        }
        return eligibleTeams[nextBidTeamIdx].manager;
    }

    private getEligibleBidders(teams: Team[], nomination: Nomination) : Team[]{
        let highestBid = this.getHighestBid(nomination.bids, teams);
      return _.orderBy(_.filter(teams, t => 
                      (this.hasAvailableRfaSlot(t)) &&
                      (this.hasEnoughBidPoints(t, highestBid))), ["rank"], ["desc"]);
    }

    private hasEnoughBidPoints(team: Team, highest: BidTeam): boolean{
        let availableBidPoints = Math.min(team.bidPoints, this.maxBid);
        let highestBidPoints = !highest ? 0 : highest.bid.points;
        if(availableBidPoints === 0 || availableBidPoints < highestBidPoints)
          return false;
          
        if(!highest){
            return true;
        }

        if(team.rank >= highest.team.rank && availableBidPoints <= highestBidPoints)
          return false;

        if(team.rank < highest.team.rank && availableBidPoints < highestBidPoints)
          return false;

        return true;
    }

    private hasAvailableRfaSlot(team: Team){
      return _.find(team.players, p => !p.protected) != null;
    }

    private getLastBid(bids: Bid[]): Bid{
      return _.orderBy(bids, ["bidDate"], ["desc"])[0];
    }

    private getLastNonZeroBid(bids: Bid[]): Bid{
      return _.orderBy(_.filter(bids, b => b.points > 0), ["bidDate"], ["desc"])[0]
    }

    private getHighestBid(bids: Bid[], teams: Team[]): BidTeam{
      let bidRanks: BidTeam[];
      bidRanks = _.map(bids, b => {
        let team = _.find(teams, t => t.manager.id === b.managerId);
        return {bid: b, team: team};
      });
      return _.orderBy(bidRanks, ["bid.points", "team.rank"], ["desc", "asc"])[0];
    }
}

