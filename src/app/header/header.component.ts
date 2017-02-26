import { Component, OnInit} from '@angular/core';
import { IUser } from '../models/user';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{
    title = "Fantasy Baseball";
    user: IUser;

    ngOnInit(){
      this.user = {name: "Eric"};
    }
}