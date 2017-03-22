import {Injectable} from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';
import {Nomination} from '../models/nomination';
import {Bid} from '../models/bid';
import {RfaProcess} from '../models/rfa-process';
import {Observable} from 'rxjs';
import {TeamService} from './team.service';
import {Team} from '../models/team';

import * as _ from 'lodash';

@Injectable()
export class RfaService{
    currentRfaProcessData: RfaProcess;
    currentNominationData: Observable<Nomination>;
    private maxRFA = 3;

    constructor(private af: AngularFire, private teamService: TeamService){
        this.setCurrentRfaProcess();
    }

    get rfaProcesses(): FirebaseListObservable<RfaProcess[]>{
        return this.af.database.list('/processes');
    }

    private setCurrentRfaProcess(): void{
        this.rfaProcesses.map(r => {
            let process: RfaProcess = r[0];
            if(process){
                process.readyManagers = _.toArray(process.readyManagers);
            }
            return process;
        }).subscribe(p => {
            let subscribeToNominations: boolean = !this.currentRfaProcessData;
            this.currentRfaProcessData = p;
            if(subscribeToNominations && p){
                this.processNominations(p);
            }
            
        });
    }

    private getProcessNominations(processKey: string): FirebaseListObservable<Nomination[]>{
        return this.af.database.list('/nominations', {query:{
            orderByChild: 'rfaProcessKey',
            equalTo: processKey
        }});
    }

    processNominations(process: RfaProcess): void{
        Observable.combineLatest(this.getProcessNominations(process.$key), this.allBids, (n, b) => {
            return _.map(n, nomination => {
                nomination.bids = _.filter(b, bid => {return bid.nominationKey === nomination.$key;});
                return nomination;
            });
        }).subscribe(n => {
           this.currentRfaProcessData.nominations = n;  
        });
    }

    private get allNominations(): FirebaseListObservable<Nomination[]>{
        return this.af.database.list('/nominations');
    }

    get allBids(): FirebaseListObservable<Bid[]>{
        return this.af.database.list('/bids');
    }

    createProcess(): void{
        let process: RfaProcess = {
            status: "Created",
            nominations: [],
            readyManagers: []
        };
        
        this.rfaProcesses.push(process);
    }

    createNomination(nomination: Nomination): void{
        this.allNominations.push(nomination);
    }

    createBid(bid: Bid): void{
        this.allBids.push(bid);
        this.tryFinishProcess();
    }

    private tryFinishProcess() : void {
        if(this.noRFASlots(this.teamService.teamsData)){
            this.currentRfaProcessData.endDate = (new Date()).getTime();
            this.currentRfaProcessData.status = "Complete";
            this.updateProcess(this.currentRfaProcessData);
        }
        else{
            let haveBidPoints = _.filter(this.teamService.teamsData, t => t.bidPoints > 0);
            if(haveBidPoints.length === 0 || (haveBidPoints.length > 0 && this.noRFASlots(haveBidPoints))){
                this.currentRfaProcessData.status = "RosterFilling";
                this.updateProcess(this.currentRfaProcessData);
            }
        }
    }

    private noRFASlots(teams : Team[]): boolean{
        return !_.find(teams, t => _.filter(t.players, p => p.protected && (p.designation === "RFA" || p.designation === "Acquired")).length < this.maxRFA);
    }
    
    updateBid(bid: Bid): void{
        this.allBids.update(bid.$key, bid);
    }

    updateNomination(nomination: Nomination): void{
        this.allNominations.update(nomination.$key, nomination);
    }

    updateProcess(process: RfaProcess): void{
        this.rfaProcesses.update(process.$key, process);
    }

    managerReady(managerId: number, processKey: string): void{
        this.af.database.list(`/processes/${processKey}/readyManagers`).push(managerId);
    }
}