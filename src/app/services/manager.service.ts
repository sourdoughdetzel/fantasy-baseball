import { Injectable } from '@angular/core';
import { Manager } from '../models/manager';
import { LocalStorageService } from 'angular-2-local-storage';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Injectable()
export class ManagerService {
    constructor(private localStorageService: LocalStorageService, private af: AngularFire){}
    private key: string = "#!ffbManager!#";

    getCurrentManager(): Manager {
        return this.localStorageService.get(this.key) as Manager;
    }

    setCurrentManager(manager: Manager): void {
        this.localStorageService.set(this.key, manager);
    }

    getLeagueManagers(): FirebaseListObservable<Manager[]>{
        return this.af.database.list('/managers');
        // return [
        //     {id: 1, firstName: 'Andrew', lastName: 'Chong'},
        //     {id: 2, firstName: 'Ed', lastName: 'Dankanich'},
        //     {id: 3, firstName: 'Mike', lastName: 'Dankanich'},
        //     {id: 4, firstName: 'Nick', lastName: 'DeLuca'},
        //     {id: 5, firstName: 'Andrew', lastName: 'Detzel'},
        //     {id: 6, firstName: 'Eric', lastName: 'Detzel'},
        //     {id: 7, firstName: 'Jared', lastName: 'Duncan'},
        //     {id: 8, firstName: 'Ryan', lastName: 'Frigm'},
        //     {id: 9, firstName: 'Adam', lastName: 'Halpin'},
        //     {id: 10, firstName: 'Jeremy', lastName: 'Lehn'},
        //     {id: 11, firstName: 'Ashley', lastName: 'Vernon'},
        // ];
    }
}