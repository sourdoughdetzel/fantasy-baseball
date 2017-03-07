import { Component, OnInit, Input } from '@angular/core';
import {TeamService} from '../../../../services/team.service';
import {RfaService} from '../../../../services/rfa.service';
import {ManagerService} from '../../../../services/manager.service';
import {NominationService} from '../../../../services/nomination.service';
import {BidService} from '../../../../services/bid.service';
import {RfaProcess} from '../../../../models/rfa-process';
import {Team} from '../../../../models/team';
import {Manager} from '../../../../models/manager';
import {Nomination} from '../../../../models/nomination';
import {Player} from '../../../../models/player';
import {Bid, BidTeam} from '../../../../models/bid';
import {Observable} from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'bidding-process',
  templateUrl: './bidding-process.component.html',
  styleUrls: ['./bidding-process.component.scss']
})
export class BiddingProcessComponent {

  constructor(private rfaService: RfaService, 
                private managerService: ManagerService,
                private nominationService: NominationService,
                private teamService: TeamService,
                private bidService: BidService) { 
                    
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

    get lastNomination(): Nomination{
        return this.nominationService.getLastNomination(this.rfaProcess);
    }

    
}
