import { Injectable } from '@angular/core';
import { Manager } from '../models/manager';
import { LocalStorageService } from 'angular-2-local-storage';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import {Observable, Subject} from 'rxjs';

@Injectable()
export class ManagerService {

    constructor(private localStorageService: LocalStorageService, private af: AngularFire){
    }
    private key: string = "#!ffbManager!#";

    get currentManager(): Manager {
        return this.localStorageService.get(this.key) as Manager;
    }

    setCurrentManager(manager: Manager): void {
        this.localStorageService.set(this.key, manager);
    }

    getLeagueManagers(): FirebaseListObservable<Manager[]>{
        return this.af.database.list('/managers');
    }
    
}