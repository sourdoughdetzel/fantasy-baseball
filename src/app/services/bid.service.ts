import { Injectable } from '@angular/core';
import {RfaService} from './rfa.service';
import {NominationService} from './nomination.service';
import {Manager} from '../models/manager';
import {Team} from '../models/team';
import {Nomination, NominationStatus} from '../models/nomination';
import {Bid, BidTeam} from '../models/bid';
import {TeamService} from './team.service';
import * as _ from 'lodash';

@Injectable()
export class BidService {
  private defaultNominator: any = {id: -1};
  private maxBid : number = 2;
  constructor(private rfaService: RfaService, 
            private nominationService: NominationService,
            private teamService: TeamService) { }

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
            this.updateStatus(nomination, bidder, "Fail");
        }
        else{
          let nextBidder = this.getNextBidder(nominationClone, teams);
          if(nextBidder.id === -1){
            let requiresComp = this.nominationService.requiresCompensation(nomination, this.bestBid(nominationClone, teams).team, teams);
            this.updateStatus(nomination, bidder,
                           requiresComp ? 
                            "PendingCompensation" : "Complete");
            if(!requiresComp){
              this.completeTransaction(nominationClone, teams);
            }     
          }
        }
        this.rfaService.createBid(bid);
    }

    private noOneWantsPlayer(nomination: Nomination, teams: Team[]): boolean{
        let eligibleBidders = this.getEligibleBidders(teams, nomination);
        return _.filter(nomination.bids, b => b.points === 0).length === nomination.bids.length && eligibleBidders.length === 0;
    }

    private updateStatus(nomination: Nomination, bidder: Team, status: NominationStatus): void{
      nomination.status = status;
      nomination.bids = [];
      this.rfaService.updateNomination(nomination);
    }
    
    completeTransaction(nomination: Nomination, teams: Team[]): void{
        let player = _.find(this.teamService.playersData, p => p.$key === nomination.playerKey);
        let bestBid = this.bestBid(nomination, teams);
        player.protected = true;
        player.teamId = bestBid.team.id
        player.designation = "Acquired";
        this.teamService.updatePlayer(player);
        bestBid.team.bidPoints -= bestBid.bid.points;
        this.teamService.updateTeam(bestBid.team);
        if(nomination.status === "PendingCompensation"){
          player = _.find(this.teamService.playersData, p => p.$key === nomination.compensationPlayerKey);
          let team = _.find(teams, t => t.manager.id === nomination.ownerKey);
          player.protected = true;
          player.teamId = team.id;
          player.designation = "Acquired";
          this.teamService.updatePlayer(player);
        }
    }

    getNextBidder(nomination: Nomination, teams: Team[]): Manager{
        if(nomination.status !== "InProgress") return this.defaultNominator;
        let lastBid = this.getLastBid(nomination.bids);
        let eligibleBidders = this.getEligibleBidders(teams, nomination);
        let bidder: Team = _.find(teams, t => !!lastBid && t.manager.id === lastBid.managerId);
        return (eligibleBidders.length > 0) ? this.getNextInLine(bidder, eligibleBidders) : this.defaultNominator;
    }

    managerCanBid(nomination: Nomination, teams: Team[], managerId: number): boolean{
      if(nomination.status !== "InProgress") return false;
      let eligibleBidders = this.getEligibleBidders(teams, nomination);

      return _.find(eligibleBidders, eb => eb.manager.id === managerId) != null;
    }

    bestBid(nomination: Nomination, teams: Team[]): BidTeam{
      return this.getHighestBid(nomination.bids, teams);
    }

    private getNextInLine(bidder: Team, eligibleTeams: Team[]): Manager{
        if(!bidder){
          return eligibleTeams[0].manager;
        }
        else{
          eligibleTeams.push(bidder);
          let rankedTeams = _.orderBy(eligibleTeams, ["rank"], ["desc"]);
          let bidIdx = _.indexOf(rankedTeams, bidder);
          return rankedTeams[(bidIdx === rankedTeams.length - 1) ? 0 : bidIdx + 1].manager;
        }
        
    }

    private getEligibleBidders(teams: Team[], nomination: Nomination) : Team[]{
        let highestBid = this.getHighestBid(nomination.bids, teams);
        let bidders = _.orderBy(_.filter(teams, t => 
                      (this.isNotHighestBidder(t, highestBid)) &&
                      (this.hasAvailableRfaSlot(t)) &&
                      (this.hasEnoughBidPoints(t, highestBid)) &&
                      (this.didNotBidZero(t.manager.id, nomination.bids))), ["rank"], ["desc"]);
        return bidders;
    }

    private isNotHighestBidder(team: Team, highest: BidTeam): boolean{
      return !highest || team.id !== highest.team.id;
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
      return _.filter(team.players, p => {return (p.designation === "RFA" || p.designation === "Acquired") && p.protected;}).length < 3;
    }
    private didNotBidZero(managerId: number, bids: Bid[]): boolean{
      return !_.find(bids, b => {return b.points === 0 && b.managerId === managerId});
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

