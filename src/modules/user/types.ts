export type Leaderboard = {
  list: LeaderboardProfile[];
  me: LeaderboardProfile;
};

export type LeaderboardProfile = {
  id: string;
  place: number;
  giftsReceived: number;
  user: {
    id: string;
    name: string;
    avatarUrl: string;
  };
};
