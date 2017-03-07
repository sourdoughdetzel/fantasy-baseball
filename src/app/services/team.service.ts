import { Injectable } from '@angular/core';
import {Team} from '../models/team';
import {Player} from '../models/player';
import {Manager} from '../models/manager';
import {ManagerService} from './manager.service';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import {Observable} from 'rxjs';
import * as _ from 'lodash';

@Injectable()
export class TeamService {
    teamsData: Team[];
    playersData: Player[];
    constructor(private managerService: ManagerService, private af: AngularFire){
        this.subscribeToTeams();
        this.subscribeToPlayers();
    }


    private subscribeToTeams(): void{
        Observable.combineLatest(this.teams, this.managers, this.players, (t, m, p) => {
            return this.translateTeams(t, m, p);
        }).subscribe(t => {
            this.teamsData = t;
        });
    }

    private subscribeToPlayers(): void{
        this.players.subscribe(p => {
            this.playersData = p;
        });
    }
    
    get teams(): FirebaseListObservable<Team[]>{
        return this.af.database.list('/teams', {query: {orderByChild: "rank"}});
    }

    get managers(): FirebaseListObservable<Manager[]>{
        return this.af.database.list('/managers');
    }

    get players(): FirebaseListObservable<Player[]>{
        return this.af.database.list('/players');
    }

    public getPlayer($key: string): FirebaseObjectObservable<Player>{
        return this.af.database.object(`/players/${$key}`);
    }

    updatePlayer(player: Player):void{
        this.players.update(player.$key, player);
    }

    updateTeam(team: Team): void{
        this.teams.update(team.$key, team);
    }

    private translateTeams(t: Team[], m: Manager[], p: Player[]): Team[]{
        _.map(t, team => {
            team.manager = _.find(m, manager => manager.teamId === team.id);
            team.players = _.filter(p, player => player.teamId === team.id);
        });

        return t;
    }

}