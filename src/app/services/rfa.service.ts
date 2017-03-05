import {Injectable} from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';
import {Nomination} from '../models/nomination';
import {Bid} from '../models/bid';
import {RfaProcess} from '../models/rfa-process';
import {Observable} from 'rxjs';
import * as _ from 'lodash';

@Injectable()
export class RfaService{
    currentRfaProcessData: RfaProcess;
    currentNominationData: Observable<Nomination>;

    constructor(private af: AngularFire){
        console.log('fired constructor');
        this.setCurrentRfaProcess();
        this.setupNominations();
        this.setupBids();
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
            this.currentRfaProcessData = p;
        });
    }
    
    private setupNominations() : void{
        this.af.database.list('/nominations').map(n => {
            if(this.currentRfaProcessData){
                this.currentRfaProcessData.nominations = _.filter((n as Nomination[]), nom => nom.rfaProcessKey === this.currentRfaProcessData.$key);
            }
        });
    }

    private getProcessNominations(processKey: string): FirebaseListObservable<Nomination[]>{
        return this.af.database.list('/nominations', {query:{
            orderByChild: 'rfaProcessKey',
            equalTo: processKey
        }});
    }

    processNominations(process: RfaProcess): Observable<Nomination[]>{
        return Observable.combineLatest(this.getProcessNominations(process.$key), this.allBids, (n, b) => {
            return _.map(n, nomination => {
                nomination.bids = _.filter(b, bid => {bid.nominationKey === nomination.$key});
                return nomination;
            });
        });
    }

    private get allNominations(): FirebaseListObservable<Nomination[]>{
        return this.af.database.list('/nominations');
    }

    get allBids(): FirebaseListObservable<Bid[]>{
        return this.af.database.list('/bids');
    }

    private setupBids(): void{
        this.allBids.map(b => {
            if(this.currentRfaProcessData && this.currentRfaProcessData.nominations){
                _.forEach(this.currentRfaProcessData.nominations, n => {
                    n.bids = _.filter((b as Bid[]), bid => bid.nominationKey === n.$key);
                })
            }
        });
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