import {IMenu} from "./IMenu";

export interface IRoom {
    id: number;
    invitationCode: string;
    name: string;
    hasVotingSession: boolean;
    currentVotingUserCnt: number;
    todayPick: IMenu;
}
