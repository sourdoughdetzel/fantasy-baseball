import {Component, OnInit, Input} from "@angular/core";
import {RfaProcess} from '../../../models/rfa-process';
import {Team} from '../../../models/team';
import {Manager} from '../../../models/manager';
import {RfaService} from '../../../services/rfa.service';

import * as _ from 'lodash';

@Component({
    selector: 'rfa-action-panel',
    templateUrl: './action-panel.component.html',
    styleUrls: ['./action-panel.component.scss']
})
export class RfaActionPanelComponent implements OnInit{
    @Input() rfaProcess: RfaProcess;
    @Input('rfaTeams') teams: Team[];
    @Input() manager: Manager;

    constructor(private rfaService: RfaService){}

    ngOnInit(){
    }

    imReady(): void{
        this.rfaService.managerReady(this.manager.id, this.rfaProcess.$key);
    }

    get processJoinable(): boolean{
        return this.rfaProcess.status === "Created" && _.find(this.rfaProcess.readyManagers, m => {return m === this.manager.id}) == null;
    }

    get readyManagers(): number[]{
        return this.rfaProcess.readyManagers || [];
    }

    get remainingManagers():number{
        return this.teams.length - this.readyManagers.length;
    }

    get remainingManagerText(): string{
        let text: string = `${this.remainingManagers} other assholes`;
        if(this.remainingManagers < 3){
            let lazyBastards = _.map(_.filter(this.teams, t => {
                return _.find(this.readyManagers, rm => {return rm === t.manager.id;}) == null;
            }), "manager.nickName");

            text = lazyBastards.join(" and ");
        }
        
        return `You're in, but we're waiting for ${text} to join`;
    }

    get haventJoinedText(): string{
        return `You and ${this.remainingManagers - 1} other asshole${this.remainingManagers - 1 > 1 ? 's': ''} haven't joined yet.`;
    }

    get startLookingText(): string{
        return `Feel free to start looking through the teams below while we wait for ${this.remainingManagers > 1 ? 'these dickheads' : 'this dickhead'}`;
    }
}