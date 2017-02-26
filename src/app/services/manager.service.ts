import { Injectable } from '@angular/core';
import { Manager } from '../models/manager';
import { LocalStorageService } from 'angular-2-local-storage';
@Injectable()
export class ManagerService {
    constructor(private localStorageService: LocalStorageService){}
    private key: string = "#!ffbManager!#";

    getCurrentManager(): Manager {
        return this.localStorageService.get(this.key) as Manager;
    }

    setCurrentManager(manager: Manager): void {
        this.localStorageService.set(this.key, manager);
    }

    getLeagueManagers(): Manager[] {
        return [
            {firstName: 'Andrew', lastName: 'Chong'},
            {firstName: 'Ed', lastName: 'Dankanich'},
            {firstName: 'Mike', lastName: 'Dankanich'},
            {firstName: 'Nick', lastName: 'DeLuca'},
            {firstName: 'Andrew', lastName: 'Detzel'},
            {firstName: 'Eric', lastName: 'Detzel'},
            {firstName: 'Jared', lastName: 'Duncan'},
            {firstName: 'Ryan', lastName: 'Frigm'},
            {firstName: 'Adam', lastName: 'Halpin'},
            {firstName: 'Jeremy', lastName: 'Lehn'},
            {firstName: 'Ashley', lastName: 'Vernon'},
        ];
    }
}