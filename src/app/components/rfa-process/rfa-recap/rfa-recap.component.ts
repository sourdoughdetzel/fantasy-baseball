import { Component, OnInit } from '@angular/core';
import {TeamService} from '../../../services/team.service';
import {RfaService} from '../../../services/rfa.service';
import {ManagerService} from '../../../services/manager.service';
import {NominationService} from '../../../services/nomination.service';
import {BidService} from '../../../services/bid.service';
import {RfaProcess} from '../../../models/rfa-process';
import {Team} from '../../../models/team';
import {Manager} from '../../../models/manager';

@Component({
  selector: 'rfa-recap',
  templateUrl: './rfa-recap.component.html',
  styleUrls: ['./rfa-recap.component.scss']
})
export class RfaRecapComponent implements OnInit {

  constructor(private rfaService: RfaService, 
                private managerService: ManagerService,
                private nominationService: NominationService,
                private teamService: TeamService,
                private bidService: BidService) { }

  ngOnInit() {
  }

  get rfaProcess(): RfaProcess{
        return this.rfaService.currentRfaProcessData;
    }

    get rfaProcesses(): RfaProcess[]{
      return this.rfaService.allProcessData;
    }

    get teams(): Team[]{
       return this.teamService.teamsData;
    }

    get manager(): Manager{
      return this.managerService.currentManager;
    }

    createProcess(): void{
        if(!this.rfaProcess){
            this.rfaService.createProcess();
            this.rfaService.managerReady(this.manager.id, this.rfaProcess.$key);
        }
    }

    get showAdd(): boolean{
      return !this.rfaProcess || this.rfaProcess.status === "Complete";
    }

    viewTranscript(processKey: string){
      console.log("cheese");
    }

}
