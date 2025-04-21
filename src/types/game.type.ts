import { TTeam } from "./team.type";
import { TUser } from "./user.type";

export type TGame = {
    _id?: any;
    teamA?: TTeam;
    teamB?: TTeam;
    homeTeam?: string;
    gameDate: Date;
    location?: string;
    owner?: TUser;
    scorekeeper?: TUser[];
}