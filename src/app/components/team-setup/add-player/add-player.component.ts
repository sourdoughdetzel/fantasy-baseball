import { MdDialogRef } from '@angular/material';
import { Component, OnInit} from '@angular/core';
import {Player, Position, Designation} from '../../../models/player';
import * as _ from 'lodash';

@Component({
    selector: 'add-player',
    templateUrl: './add-player.component.html',
    styleUrls: ['./add-player.component.scss']
})
export class AddPlayerDialog implements OnInit {
    player: Player;
    positions: any[];
    designations: Designation[];
    constructor(public dialogRef: MdDialogRef<AddPlayerDialog>) {
       
    }
    
    ngOnInit(){
        this.player = (this.dialogRef.config.data ? this.dialogRef.config.data.player : {}) as Player;
        this.positions = [{p: "C", c: false}, {
            p:"1B", c: false}, 
            {p:"2B", c:false}, 
            {p:"SS", c:false}, 
            {p:"3B", c:false},
            {p:"DH", c:false},
            {p:"OF", c:false},
            {p:"P", c:false},
            {p:"RP", c:false}];
        if(this.player.positions){
             _.forEach(this.positions, (p) => {
                 p.c = !!(_.find(this.player.positions, po => po === p.p));
             });
        }

        this.designations = ["CK", "RFA", "IP", "LTK", "Other"];
    }

    addPlayer(): void{   
        this.player.positions = _.map(_.filter(this.positions, (p) => p.c), 'p') as Position[];
        this.dialogRef.close(this.player);
    }

    get titleText(): string{
        return `${this.dialogRef.config.data ? "Edit" : "Add"} Player`;
    }
    get actionText(): string{
        return this.dialogRef.config.data ? "SAVE" : "ADD";
    }
}