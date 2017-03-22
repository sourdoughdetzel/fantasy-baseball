import { Component, OnInit } from '@angular/core';
import {TeamService} from '../../../services/team.service';
import {RfaService} from '../../../services/rfa.service';
import {ManagerService} from '../../../services/manager.service';
import {NominationService} from '../../../services/nomination.service';
import {BidService} from '../../../services/bid.service';
import {RfaProcess} from '../../../models/rfa-process';
import {Team} from '../../../models/team';

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

    get teams(): Team[]{
       return this.teamService.teamsData;
    }

  
}
