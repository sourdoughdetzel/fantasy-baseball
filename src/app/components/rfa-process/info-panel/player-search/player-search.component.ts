import { Component, OnInit } from '@angular/core';
import {SearchService} from '../../../../services/search.service';

@Component({
  selector: 'player-search',
  templateUrl: './player-search.component.html',
  styleUrls: ['./player-search.component.scss']
})
export class PlayerSearchComponent implements OnInit {

  constructor(private searchService: SearchService) { }

  ngOnInit() {
  }

  get searchText(): string{
    return this.searchService.searchText;
  }

  set searchText(text: string){
    this.searchService.searchText = text;
  }
}
