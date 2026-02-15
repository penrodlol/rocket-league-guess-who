import supabase from '@/libs/supabase/server';
import { DiscordPlayer } from '@/providers/discord.provider';
import { createServerFn } from '@tanstack/react-start';

export const GET_AVAILABLE_ROLES_ERROR = 'Failure to retrieve available roles';
export const GET_GAME_ERROR = 'Failure to retrieve game';
export const CREATE_GAME_ERROR = 'Failure to create game';
export const SUBMIT_PLAYER_ROLE_ERROR = 'Failure to submit player role';
export const SUBMIT_GUESSES_ERROR = 'Failure to submit guesses';

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

      const payload = { ...response.data, ready: response.data.players.every((player) => !!player.role?.id) };
      return { success: true, data: payload };
    } catch (error) {
      return { success: false, error: GET_GAME_ERROR };
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
      return response.error ? { success: false, error: response.error.message } : { success: true };
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
      return response.error ? { success: false, error: response.error.message } : { success: true };
    } catch (error) {
      return { success: false, error: SUBMIT_GUESSES_ERROR };
    }
  });
