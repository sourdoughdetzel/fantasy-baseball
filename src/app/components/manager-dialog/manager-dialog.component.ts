import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import {ManagerService} from '../../services/manager.service';
import {Manager} from '../../models/manager';
import {FirebaseListObservable } from 'angularfire2';

@Component({
  selector: 'manager-dialog',
  templateUrl: './manager-dialog.component.html',
  styleUrls: ['./manager-dialog.component.scss']
})
export class ManagerDialogComponent{
  public managers: FirebaseListObservable<Manager[]>;
  public manager: Manager;
  constructor(public dialogRef: MdDialogRef<ManagerDialogComponent>,
            private managerService: ManagerService) {
              this.managers = managerService.getLeagueManagers();
  }

   setManager(): void {
        this.managerService.setCurrentManager(this.manager);
        this.dialogRef.close();
    }
}
