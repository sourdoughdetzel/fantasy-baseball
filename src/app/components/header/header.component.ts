import { Component} from '@angular/core';
import { Manager } from '../../models/manager';
import {ManagerService} from '../../services/manager.service';
import {FirebaseListObservable } from 'angularfire2';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent{
    public managers: FirebaseListObservable<Manager[]>;
    constructor(private managerService: ManagerService){
      this.managers = managerService.getLeagueManagers();
    }
    title = "Fantasy Baseball";

    get manager(): Manager{
      return this.managerService.getCurrentManager();
    }
    get managerDisplay(): string{
      return this.manager ? `What up, ${this.manager.firstName}?` : `Who are you?`;
    }
    setManager(man: Manager): void {
        this.managerService.setCurrentManager(man);
    }
}