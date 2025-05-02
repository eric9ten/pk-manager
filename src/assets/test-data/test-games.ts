import { TGame } from '@customTypes/game.type';
import { teams } from './test-teams';
import { users } from './test-users';

export const games: TGame[] = Array.from({ length: 20 }).map((_, i) => {
    const teamA = teams[i % teams.length];
    const teamB = teams[(i + 1) % teams.length];
  
    return {
      _id: `game-${i + 1}`,
      teamA,
      teamB,
      homeTeam: i % 2 === 0 ? teamA.name : teamB.name,
      gameDate: new Date(2025, 4, i + 1, 15, 30), // Dates in May 2025
      location: `Field ${((i % 5) + 1)} - Complex ${String.fromCharCode(65 + (i % 3))}`,
      owner: users[0],
      scorekeeper: i % 2 === 0 ? [users[1]] : [users[2]]
    };
  });