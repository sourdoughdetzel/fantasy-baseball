import {Nomination} from './nomination';

export type RfaProcessStatus = "NotStarted" | "Created" | "Bidding" | "RosterFilling" | "Complete";

export interface RfaProcess{
    $key?: string;
    status: RfaProcessStatus;
    endDate?: Number;
    nominations: Nomination[];
    readyManagers: number[];
}
