import { BrowserModule } from '@angular/platform-browser';
import { NgModule} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {MaterialModule} from "@angular/material";
import { RouterModule, Routes } from '@angular/router';
import 'hammerjs';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { TabsComponent} from "./tabs/tabs.component";
import { TeamSetupComponent } from "./team-setup/team-setup.component";
import { RFAProcessComponent } from "./rfa-process/rfa-process.component";

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
    TeamSetupComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule.forRoot(),
    RouterModule.forRoot(appRoutes, {useHash: true})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
