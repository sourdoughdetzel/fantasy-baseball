import {Component, OnInit} from '@angular/core';
import {Tab} from '../models/tab';

@Component({
  selector: 'tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit{
    constructor(){
    }
    tabs: Tab[];
    activeLinkIndex: number;
    ngOnInit(){
        this.tabs = [{text: "RFA Process", url: "/rfa"}, {text: "Team Set-up", url: "/teams"}];
        
    }
}