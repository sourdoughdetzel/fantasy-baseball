import {Injectable} from '@angular/core';
import {Manager} from '../models/manager';
import {Team} from '../models/team';
import {RfaProcess} from '../models/rfa-process';
import {Nomination} from '../models/nomination';
import * as _ from "lodash";

@Injectable()
export class NominationService{
    private maxNominators : number = 3;
    private maxRFA = 3;
    private defaultNominator: any = {id: -1};
    nextNominator(process: RfaProcess, teams: Team[]): Manager{
        if(!this.processInProgress(process) || this.biddingInProgress(process))return this.defaultNominator;
 
        let eligibleTeams = this.eligibleManagers(teams);
        let lastNominatingTeam = this.getLastNominatingTeam(process, teams);
        if(!lastNominatingTeam) return eligibleTeams[0].manager;

        let nominatorIdx = _.indexOf(eligibleTeams, lastNominatingTeam) + 1;
        let teamIdx: number;
        if(nominatorIdx === 0){
            let lowerRankedTeams = _.filter(eligibleTeams, t => t.rank > lastNominatingTeam.rank);
            teamIdx = lowerRankedTeams.length ? _.indexOf(eligibleTeams, lowerRankedTeams[0]) : 0;
        }
        else{
            teamIdx = ((nominatorIdx >= (this.maxNominators)) || eligibleTeams.length === 1) ? 0 : nominatorIdx;
        }
        return eligibleTeams[teamIdx].manager;
    }

    private eligibleManagers(teams: Team[]): Team[]{
       return _.take(_.orderBy(_.filter(teams, t => t.bidPoints > 0), ["rank"], ["asc"]), this.maxNominators);
    }

    private getLastNominatingTeam(process: RfaProcess, teams: Team[]): Team{
        let lastNomination = this.getLastNomination(process);
        if(!lastNomination) return null;
        return _.find(teams, t => t.manager.id === lastNomination.nominatorKey);
    }

    getLastNomination(process: RfaProcess): Nomination{
        return _.orderBy(process.nominations, ["nominationDate"], ["desc"])[0];
    }   

    getLastWonNomination(process: RfaProcess): Nomination{
        let noms = _.orderBy(_.filter(process.nominations, n => n.status === "Complete"), ["nominationDate"], ["desc"]);
        return noms.length ? noms[0] : null;
    }

    private processInProgress(rfaProcess: RfaProcess): boolean{
        return rfaProcess.status === "Bidding";
    }

    private biddingInProgress(rfaProcess: RfaProcess): boolean{
        let lastNomination = this.getLastNomination(rfaProcess);
        return (!lastNomination) ? false : (lastNomination.status === "InProgress" || lastNomination.status === "PendingCompensation");
    }

    requiresCompensation(nomination: Nomination, winner: Team, teams: Team[]): boolean{
        let owner = _.find(teams, t => t.manager.id === nomination.ownerKey);
        return winner.rank < owner.rank;
    }

    nextRosterFiller(rfaProcess: RfaProcess, teams: Team[]): Manager{
        let needPlayers = _.orderBy(_.filter(teams, t => _.filter(t.players, p => p.protected&& (p.designation === "RFA" || p.designation === "Acquired")).length < this.maxRFA), ["rank"], ["asc"]);
        let lastNomination = this.getLastNominatingTeam(rfaProcess, teams);
        console.log(_.select(needPlayers, p => p.$key));
        console.log(lastNomination);
        let next = _.find(needPlayers, t => t.rank > lastNomination.rank || (_.last(needPlayers).$key === lastNomination.$key && t.$key === needPlayers[0].$key));
        return next ? next.manager : null;
    }
}
