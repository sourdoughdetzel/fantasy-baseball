import {Component, Input} from '@angular/core';
import {Player, Designation} from '../../../../models/player';

@Component({
    selector: 'player-card',
    templateUrl: './player.component.html',
    styleUrls: ['./player.component.scss']
})
export class PlayerComponent {
    @Input()player: Player;
    @Input()biddable: boolean;
}