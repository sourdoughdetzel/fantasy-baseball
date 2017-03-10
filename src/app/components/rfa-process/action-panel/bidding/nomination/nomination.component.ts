import { Component, OnInit } from '@angular/core';
import {TeamService} from '../../../../../services/team.service';
import {RfaService} from '../../../../../services/rfa.service';
import {ManagerService} from '../../../../../services/manager.service';
import {NominationService} from '../../../../../services/nomination.service';
import {RfaProcess} from '../../../../../models/rfa-process';
import {Team} from '../../../../../models/team';
import {Manager} from '../../../../../models/manager';
import {Nomination} from '../../../../../models/nomination';

@Component({
  selector: 'nomination',
  templateUrl: './nomination.component.html',
  styleUrls: ['./nomination.component.scss']
})
export class NominationComponent implements OnInit {

  constructor(private rfaService: RfaService, 
                private managerService: ManagerService,
                private nominationService: NominationService,
                private teamService: TeamService) { }

  ngOnInit() {
  }

      get manager(): Manager{
        return this.managerService.currentManager;
    }

    get teams(): Team[]{
        return this.teamService.teamsData;
    }
    
    get rfaProcess(): RfaProcess{
        return this.rfaService.currentRfaProcessData;
    }

    get nominatingManager(): Manager{
        return this.nominationService.nextNominator(this.rfaProcess, this.teams);
    }

    get myNomination(): boolean{
        return this.nominatingManager.id === this.manager.id;
    }
}
