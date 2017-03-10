import { Component } from '@angular/core';
import {ManagerService} from './services/manager.service';
import {RfaService} from './services/rfa.service';
import {NominationService} from './services/nomination.service';
import {TeamService} from './services/team.service';
import {BidService} from './services/bid.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private rfaService: RfaService, 
                private managerService: ManagerService,
                private nominationService: NominationService,
                private teamService: TeamService,
                private bidService: BidService){

                }
}
