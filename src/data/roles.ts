export type Role = { name: string; description: string };
export type Roles = Array<Role>;

export const roles = [
  { name: 'Agent', description: 'Participate in 3+ goals' },
  { name: 'Detonator', description: 'Get 3+ Demos' },
  { name: 'Fool', description: "Make everyone guess you're a something different" },
  { name: 'Guardian', description: 'Make 3+ Saves' },
  { name: 'King', description: "Teammate can't score. Must win game" },
  { name: 'Mafia', description: 'Lose the game' },
  { name: 'Pacifist', description: "Can't score goals. Must win" },
  { name: 'Villager', description: 'Win the game' },
] as const satisfies Roles;
