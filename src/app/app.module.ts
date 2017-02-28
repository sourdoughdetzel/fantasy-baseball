import { BrowserModule } from '@angular/platform-browser';
import { NgModule} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {MaterialModule} from "@angular/material";
import { RouterModule, Routes } from '@angular/router';
import { LocalStorageModule } from 'angular-2-local-storage';

import 'hammerjs';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { TabsComponent} from "./components/tabs/tabs.component";
import { TeamSetupComponent } from "./components/team-setup/team-setup.component";
import { RFAProcessComponent } from "./components/rfa-process/rfa-process.component";
import { ManagerService } from "./services/manager.service";
import { TeamService } from "./services/team.service";
import { AddPlayerDialog} from './components/team-setup/add-player/add-player.component';
import { RosterComponent } from './components/team-setup/roster/roster.component';
import { RfaSetupComponent } from './components/team-setup/rfa-setup/rfa-setup.component';

const appRoutes: Routes = [
  { path: 'rfa', component: RFAProcessComponent },
  { path: 'teams',      component: TeamSetupComponent },
  { path: '',
    redirectTo: '/rfa',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    TabsComponent,
    RFAProcessComponent,
    TeamSetupComponent,
    AddPlayerDialog,
    RosterComponent,
    RfaSetupComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule.forRoot(),
    RouterModule.forRoot(appRoutes, {useHash: true}),
    LocalStorageModule.withConfig({
            prefix: 'fantasy-baseball-app',
            storageType: 'localStorage'
        })
  ],
  entryComponents:[
    AddPlayerDialog
  ],
  providers: [ManagerService, TeamService],
  bootstrap: [AppComponent]
})
export class AppModule { }
