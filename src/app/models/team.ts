import {Player} from './player';
import {Manager} from './manager';
export interface Team{
    players: Player[];
    name: string;
    rank: number;
    id: number;
    manager: Manager;
    bidPoints: number;
    $key: string;
}