import { TPlayer } from "./player.type";
import { TUser } from "./user.type";

export type TTeam = {
    id: string;
    name: string;
    abbrev: string;
    ageGroup?: string;
    genGroup?: string;
    players?: TPlayer[];
    player_count?: number;
    owner?: TUser;
    managers?: TUser[];
    scorekeepers?: TUser[];
    colors?: {
        home: string;
        away: string;
    }
}