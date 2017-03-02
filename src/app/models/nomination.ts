import {Bid} from './bid';
export type NominationStatus = "Fail" | "Success";

export interface Nomination{
    playerId: number;
    ownerId: number;
    nominatorId: number;
    bids: Bid[];
    status?: NominationStatus;
    compoensationPlayerId?: number;
    rfaProcessKey: string;
}