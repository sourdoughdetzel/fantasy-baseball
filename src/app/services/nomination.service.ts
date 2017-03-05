import {Injectable} from '@angular/core';
import {Manager} from '../models/manager';
import {Team} from '../models/team';
import {RfaProcess} from '../models/rfa-process';
import {Nomination} from '../models/nomination';
import * as _ from "lodash";

@Injectable()
export class NominationService{
    private maxNominators : number = 3;

    nextNominator(process: RfaProcess, teams: Team[]): Manager{
        let eligibleTeams = this.eligibleManagers(teams);
        let lastNominatingTeam = this.getLastNominatingTeam(process, teams);
        if(!lastNominatingTeam) return eligibleTeams[0].manager;

        let nominatorIdx = _.indexOf(eligibleTeams, lastNominatingTeam);
        let teamIdx: number;
        if(nominatorIdx === -1){
            let lowerRankedTeams = _.filter(eligibleTeams, t => t.rank > lastNominatingTeam.rank);
            teamIdx = lowerRankedTeams ? _.indexOf(eligibleTeams, lowerRankedTeams[0]) : 0;
        }
        else{
            teamIdx = (nominatorIdx === (this.maxNominators - 1)) ? 0 : nominatorIdx;
        }
       
        return eligibleTeams[teamIdx].manager;
    }

    private eligibleManagers(teams: Team[]): Team[]{
       return _.take(_.orderBy(_.filter(teams, t => _.filter(t.players, p => p.designation === "RFA" && !p.protected).length > 0), ["rank"], ["asc"]), this.maxNominators);
    }

    private getLastNominatingTeam(process: RfaProcess, teams: Team[]): Team{
        let lastNomination = this.getLastNomination(process);
        if(!lastNomination) return null;
        return _.find(teams, t => t.manager.id === lastNomination.nominatorId);
    }

    getLastNomination(process: RfaProcess): Nomination{
        return _.orderBy(process.nominations, ["nominationDate"], ["desc"])[0];
    }   
}
