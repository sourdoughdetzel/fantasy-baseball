import {Injectable} from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';
import {Nomination} from '../models/nomination';
import {Bid} from '../models/bid';
import {RfaProcess} from '../models/rfa-process';
import {Observable} from 'rxjs';
import * as _ from 'lodash';

@Injectable()
export class RfaService{

    constructor(private af: AngularFire){
    }

    get rfaProcess(): FirebaseListObservable<RfaProcess[]>{
        return this.af.database.list('/processes');
    }

    public nominations(processKey: string): FirebaseListObservable<Nomination[]>{
        return this.af.database.list('/nominations', {query: {
            orderByChild: 'rfaProcessKey',
            equalTo: processKey
        }});
    }

    bids(nominationId: number): FirebaseListObservable<Bid[]>{
        return this.af.database.list('/bids', {query:{
            orderByChild: 'nominationId',
            equalTo: nominationId
        }});
    }

    createProcess(): void{
        let process: RfaProcess = {
            status: "InProgress",
            nominations: []
        };
        
        this.rfaProcess.push(process);
        // console.log(process);
        // this.af.database.object('/processes').set([
        //     process
        // ]);
    }
}