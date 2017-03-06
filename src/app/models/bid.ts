import {Team} from './team';

export interface Bid{
    nominationKey: string;
    managerId: number;
    points: number;
    bidDate: number;
    $key?: string;
}

export interface BidTeam{
  bid: Bid;
  team: Team;
}