import { BrowserModule } from '@angular/platform-browser';
import { NgModule} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {MaterialModule} from "@angular/material";
import { RouterModule, Routes } from '@angular/router';
import { LocalStorageModule } from 'angular-2-local-storage';
import { AngularFireModule } from 'angularfire2';
import {DndModule} from 'ng2-dnd';
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

const appRoutes: Routes = [
  { path: 'rfa', component: RFAProcessComponent },
  { path: 'teams',      component: TeamSetupComponent },
  { path: '',
    redirectTo: '/rfa',
    pathMatch: 'full'
  }
];

export const firebaseConfig = {
    apiKey: "AIzaSyDcbfYSIzslAOQOfo_uR9-Dg16BFfoJCWk",
    authDomain: "fantasy-baseball-76422.firebaseapp.com",
    databaseURL: "https://fantasy-baseball-76422.firebaseio.com",
    storageBucket: "fantasy-baseball-76422.appspot.com",
    messagingSenderId: "159655341050"
};

export const fireBaseToken = "yJ14mCj1YID5awjlv36DyieUvm930zhP";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    TabsComponent,
    RFAProcessComponent,
    TeamSetupComponent,
    AddPlayerDialog,
    RosterComponent
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
        }),
    AngularFireModule.initializeApp(firebaseConfig),
    DndModule.forRoot(),
  ],
  entryComponents:[
    AddPlayerDialog
  ],
  providers: [ManagerService, TeamService],
  bootstrap: [AppComponent]
})
export class AppModule { }
