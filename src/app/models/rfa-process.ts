import {Nomination} from './nomination';

export type RfaProcessStatus = "Scheduled" | "InProgress" | "Complete";

export interface RfaProcess{
    $key?: string;
    status: RfaProcessStatus;
    endDate?: Date;
    nominations: Nomination[];
}