import { Component} from '@angular/core';
import { Manager } from '../../models/manager';
import {ManagerService} from '../../services/manager.service';
import {AdminService} from '../../services/admin.service';
import {FirebaseListObservable } from 'angularfire2';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent{
    public managers: FirebaseListObservable<Manager[]>;
    constructor(private managerService: ManagerService, private adminService: AdminService){
      this.managers = managerService.getLeagueManagers();
      this.adminPwd = this.adminService.curPwd;
    }
    title = "Fantasy Baseball";
    adminPwd = "";

    get manager(): Manager{
      return this.managerService.currentManager;
    }
    get managerDisplay(): string{
      return this.manager ? `What up, ${this.manager.firstName}?` : `Who are you?`;
    }
    setManager(man: Manager): void {
        this.managerService.setCurrentManager(man);
    }

    updatePwd(): void{
      this.adminService.setLocalAdmin(this.adminPwd);
    }
    
}