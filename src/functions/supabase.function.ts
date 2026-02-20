import supabase from '@/libs/supabase/server';
import { DiscordPlayer } from '@/providers/discord.provider';
import { createServerFn } from '@tanstack/react-start';

export const GET_AVAILABLE_ROLES_ERROR = 'Failure to retrieve available roles';
export const GET_GAME_ERROR = 'Failure to retrieve game';
export const GET_GAME_PLAYERS_GUESSES_ERROR = 'Failure to retrieve game players guesses';
export const CREATE_GAME_ERROR = 'Failure to create game';
export const SUBMIT_PLAYER_ROLE_ERROR = 'Failure to submit player role';
export const SUBMIT_GUESSES_ERROR = 'Failure to submit guesses';
export const SUBMIT_GAME_NEXT_ROUND_ERROR = 'Failure to submit next round';

export type CreateGameProps = {
  instanceId: string;
  hosting: boolean;
  players: Array<Pick<DiscordPlayer, 'id' | 'username' | 'avatarUrl'>>;
  roles: Array<string>;
};
export type SubmitPlayerRoleProps = { playerId: string; roleId: string };
export type SubmitGuessesProps = {
  gameId: string;
  playerId: string;
  completed: boolean;
  guesses: Array<{ playerId: string; roleId: string }>;
};

export type GetAvailableRolesResponse = NonNullable<Awaited<ReturnType<typeof getAvailableRoles>>['data']>;
export type GetGameResponse = NonNullable<Awaited<ReturnType<typeof getGame>>['data']>;
export type GetGamePlayersGuessesResponse = NonNullable<Awaited<ReturnType<typeof getGamePlayersGuesses>>['data']>;

export const getAvailableRoles = createServerFn({ method: 'POST' }).handler(async () => {
  try {
    const response = await supabase.from('guess_who_roles').select();
    return response.error
      ? { success: false, error: GET_AVAILABLE_ROLES_ERROR }
      : { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: GET_AVAILABLE_ROLES_ERROR };
  }
});

export const getGame = createServerFn({ method: 'POST' })
  .inputValidator((discordInstanceId: string) => discordInstanceId)
  .handler(async ({ data: discordInstanceId }) => {
    try {
      const response = await supabase
        .from('guess_who_games')
        .select(
          `
            id,
            scoreToWin: score_to_win,
            completed,
            roles: guess_who_game_roles (id, role_id, ...guess_who_roles (name, description, special)),
            players: guess_who_game_players (
              id,
              userId: user_id,
              username: user_name,
              avatarUrl: avatar_url,
              hosting,
              carImage: car_image,
              score,
              role: guess_who_game_roles (id, ...guess_who_roles (name, description, special))
            )
          `,
        )
        .eq('discord_instance_id', discordInstanceId)
        .single();
      if (response.error) return { success: false, error: GET_GAME_ERROR };

      const payload = { ...response.data, playersReady: response.data.players.every((player) => !!player.role?.id) };
      return { success: true, data: payload };
    } catch (error) {
      return { success: false, error: GET_GAME_ERROR };
    }
  });

export const getGamePlayersGuesses = createServerFn({ method: 'POST' })
  .inputValidator((props: string) => props)
  .handler(async ({ data: gameId }) => {
    try {
      const response = await supabase
        .from('guess_who_game_players')
        .select(
          `
            id,
            userId: user_id,
            username: user_name,
            avatarUrl: avatar_url,
            completed,
            role: guess_who_game_roles!game_role_id (...guess_who_roles (name)),
            guesses: guess_who_game_guesses!game_player_id (
              id,
              correct,
              role: guess_who_game_roles!guessed_game_role_id (...guess_who_roles (name)),
              player: guess_who_game_players!target_game_player_id (
                id,
                userId: user_id,
                username: user_name,
                role: guess_who_game_roles!game_role_id (...guess_who_roles (name))
              )
            )
          `,
        )
        .eq('game_id', gameId);
      return response.error
        ? { success: false, error: GET_GAME_PLAYERS_GUESSES_ERROR }
        : { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: GET_GAME_PLAYERS_GUESSES_ERROR };
    }
  });

export const createGame = createServerFn({ method: 'POST' })
  .inputValidator((props: CreateGameProps) => props)
  .handler(async ({ data: { instanceId, hosting, players, roles } }) => {
    try {
      const response = await supabase.rpc('guess_who_game_create_fn', {
        p_discord_instance_id: instanceId,
        p_hosting: hosting,
        p_players: players.map((p) => ({ user_id: p.id, user_name: p.username, avatar_url: p.avatarUrl })),
        p_roles: roles,
      });
      return response.error ? { success: false, error: CREATE_GAME_ERROR } : { success: true };
    } catch (error) {
      return { success: false, error: CREATE_GAME_ERROR };
    }
  });

export const submitPlayerRole = createServerFn({ method: 'POST' })
  .inputValidator((props: SubmitPlayerRoleProps) => props)
  .handler(async ({ data: { playerId, roleId } }) => {
    try {
      const response = await supabase.rpc('guess_who_game_player_submit_role_fn', {
        p_id: playerId,
        p_game_role_id: roleId,
      });
      return response.error ? { success: false, error: SUBMIT_PLAYER_ROLE_ERROR } : { success: true };
    } catch (error) {
      return { success: false, error: SUBMIT_PLAYER_ROLE_ERROR };
    }
  });

export const submitPlayerGuesses = createServerFn({ method: 'POST' })
  .inputValidator((props: SubmitGuessesProps) => props)
  .handler(async ({ data: { gameId, playerId, completed, guesses } }) => {
    try {
      const response = await supabase.rpc('guess_who_game_player_submit_guesses_fn', {
        p_game_id: gameId,
        p_player_id: playerId,
        p_completed: completed,
        p_guesses: guesses.map((guess) => ({ player_id: guess.playerId, role_id: guess.roleId })),
      });
      return response.error ? { success: false, error: SUBMIT_GUESSES_ERROR } : { success: true };
    } catch (error) {
      return { success: false, error: SUBMIT_GUESSES_ERROR };
    }
  });

export const submitGameNextRound = createServerFn({ method: 'POST' })
  .inputValidator((gameId: string) => gameId)
  .handler(async ({ data: gameId }) => {
    try {
      const response = await supabase.rpc('guess_who_game_submit_next_round_fn', { p_game_id: gameId });
      return response.error ? { success: false, error: SUBMIT_GAME_NEXT_ROUND_ERROR } : { success: true };
    } catch (error) {
      return { success: false, error: SUBMIT_GAME_NEXT_ROUND_ERROR };
    }
  });
