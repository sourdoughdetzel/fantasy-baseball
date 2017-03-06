import {Component,Input} from "@angular/core";
import {RfaProcess} from '../../../models/rfa-process';
import {RfaService} from '../../../services/rfa.service';

import * as _ from 'lodash';

@Component({
    selector: 'rfa-action-panel',
    templateUrl: './action-panel.component.html',
    styleUrls: ['./action-panel.component.scss']
})
export class RfaActionPanelComponent{

    constructor(private rfaService: RfaService){}
    
    get rfaProcess(): RfaProcess{
        return this.rfaService.currentRfaProcessData;
    }

}