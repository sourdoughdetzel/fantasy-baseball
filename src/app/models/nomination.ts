import {Bid} from './bid';
export type NominationStatus = "Fail" | "InProgress" | "Success";

export interface Nomination{
    playerId: number;
    ownerId: number;
    nominatorId: number;
    bids: Bid[];
    status?: NominationStatus;
    compensationPlayerId?: number;
    rfaProcessKey: string;
    nominationDate: Date;
    $key: string;
}