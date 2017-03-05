import {Bid} from './bid';
export type NominationStatus = "Fail" | "InProgress" | "Success";

export interface Nomination{
    playerKey: string;
    ownerKey: number;
    nominatorKey: number;
    bids: Bid[];
    status?: NominationStatus;
    compensationPlayerKey?: string;
    rfaProcessKey: string;
    nominationDate: number;
    $key?: string;
}