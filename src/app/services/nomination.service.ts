import {Injectable} from '@angular/core';
import {Manager} from '../models/manager';
import {Team} from '../models/team';
import {RfaProcess} from '../models/rfa-process';
import {Nomination} from '../models/nomination';
import * as _ from "lodash";

@Injectable()
export class NominationService{
    private maxNominators : number = 3;
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
            teamIdx = lowerRankedTeams ? _.indexOf(eligibleTeams, lowerRankedTeams[0]) : 0;
        }
        else{
            teamIdx = (nominatorIdx >= (this.maxNominators)) ? 0 : nominatorIdx;
        }
       
        return eligibleTeams[teamIdx].manager;
    }

    private eligibleManagers(teams: Team[]): Team[]{
       return _.take(_.orderBy(_.filter(teams, t => _.filter(t.players, p => p.designation === "RFA" && !p.protected).length > 0), ["rank"], ["asc"]), this.maxNominators);
    }

    private getLastNominatingTeam(process: RfaProcess, teams: Team[]): Team{
        let lastNomination = this.getLastNomination(process);
        if(!lastNomination) return null;
        return _.find(teams, t => t.manager.id === lastNomination.nominatorKey);
    }

    getLastNomination(process: RfaProcess): Nomination{
        return _.orderBy(process.nominations, ["nominationDate"], ["desc"])[0];
    }   

    private processInProgress(rfaProcess: RfaProcess): boolean{
        return rfaProcess.status === "Bidding";
    }

    private biddingInProgress(rfaProcess: RfaProcess): boolean{
        let lastNomination = this.getLastNomination(rfaProcess);
        return (!lastNomination) ? false : (lastNomination.status === "InProgress");
    }

    requiresCompensation(nomination: Nomination, winner: Team, teams: Team[]): boolean{
        let owner = _.find(teams, t => t.manager.id === nomination.ownerKey);
        return winner.rank > owner.rank;
    }
}
