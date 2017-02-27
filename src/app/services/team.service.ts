import { Injectable } from '@angular/core';
import {Team} from '../models/team';
import {ManagerService} from './manager.service';

@Injectable()
export class TeamService {
    constructor(private managerService: ManagerService){}

    getTeams(): Team[]{
        var managers = this.managerService.getLeagueManagers();
        return [
            {id: 1, rank: 11, name: "The Fuckers", manager: managers[0], players: [ {firstName: 'Jose', lastName: 'Bautista', positions: ["DH","1B"], designation: "None"}]},
            {id: 2, rank: 10, name: "The Cheesers", manager: managers[1], players: []},
            {id: 3, rank: 9, name: "The Poopers", manager: managers[2], players: []},
            {id: 4, rank: 8, name: "The Shitters", manager: managers[3], players: []},
            {id: 5, rank: 7, name: "The Asses", manager: managers[4], players: []},
            {id: 6, rank: 6, name: "The Buttholes", manager: managers[5], players: []},
            {id: 7, rank: 5, name: "The Assholes", manager: managers[6], players: []},
            {id: 8, rank: 4, name: "The Dicks", manager: managers[7], players: []},
            {id: 9, rank: 3, name: "The Douchers", manager: managers[8], players: []},
            {id: 10, rank: 2, name: "The Tits", manager: managers[9], players: []},
            {id: 11, rank: 1, name: "The Piss", manager: managers[10], players: []}
        ];
    }
}