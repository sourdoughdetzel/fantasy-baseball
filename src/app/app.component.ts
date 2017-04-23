import { Component, ViewContainerRef } from '@angular/core';
import {ManagerService} from './services/manager.service';
import {RfaService} from './services/rfa.service';
import {NominationService} from './services/nomination.service';
import {TeamService} from './services/team.service';
import {BidService} from './services/bid.service';
import {SearchService} from './services/search.service';
import {AdminService} from './services/admin.service';
import { MdDialogConfig, MdDialog } from '@angular/material';
import {ManagerDialogComponent } from './components/manager-dialog/manager-dialog.component';

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
                private bidService: BidService,
                private searchService: SearchService,
                private adminService: AdminService,
                private viewContainerRef: ViewContainerRef,
                private dialog: MdDialog){
                  if(!this.managerService.currentManager){
                    this.getManager();
                  }
                }
  
    private getManager(): void{
        let config = new MdDialogConfig();
        config.viewContainerRef = this.viewContainerRef;
        let dialogRef = this.dialog.open(ManagerDialogComponent, config);
    }
}
