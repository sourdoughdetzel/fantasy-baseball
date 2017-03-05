export type Position = "C" | "1B" | "2B" | "SS" | "3B" | "DH" | "OF" | "P" | "RP";
export type Designation = "CK" | "RFA" | "IP" | "LTK" | "Other";

export interface Player{
    apiId?: number;
    mlbTeamId?: number;
    firstName: string;
    lastName: string;
    positions: Position[];
    designation?: Designation;
    protected?: boolean;
    teamId: number;
    $key: string;
}