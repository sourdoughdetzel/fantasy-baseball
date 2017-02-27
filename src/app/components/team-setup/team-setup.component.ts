import {Component, OnInit} from "@angular/core";
import {Team} from '../../models/team';
import {TeamService} from '../../services/team.service';

@Component({
    templateUrl: './team-setup.component.html',
    styleUrls: ['./team-setup.component.scss']
})
export class TeamSetupComponent implements OnInit{
    teams: Team[];
    selectedTeam: Team;
    constructor(private teamService: TeamService){    }
    
    ngOnInit(){
        this.teams = this.teamService.getTeams();
        this.selectedTeam = this.teams[0];
    }

    showDetails(team: Team): void{
        this.selectedTeam = team;
    }

    showEspnTeam(id: number): void{

    }
}