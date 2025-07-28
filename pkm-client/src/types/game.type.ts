import { TGameStats } from "./gameStats.type";
import { TTeam } from "./team.type";
import { TUser } from "./user.type";

export type TGame = {
    _id?: any;
    teamA?: string;
    teamAInfo?: TTeam;
    teamB?: string;
    teamBInfo?: TTeam;
    homeTeam?: string;
    gameDate: Date;
    location?: string;
    teamAStats?: TGameStats;
    teamBStats?: TGameStats;
    owner?: TUser;
    scorekeeper?: TUser[];
}