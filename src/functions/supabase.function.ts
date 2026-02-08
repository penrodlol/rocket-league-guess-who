import supabaseClient from '@/libs/supabase/client';
import supabaseServer from '@/libs/supabase/server';
import { DiscordPlayer } from '@/providers/discord.provider';
import { createClientOnlyFn, createServerFn } from '@tanstack/react-start';

export const GET_AVAILABLE_ROLES_ERROR = 'Failure to retrieve available roles';
export const CREATE_GAME_ERROR = 'Failure to create game';
export const GET_GAME_ERROR = 'Failure to retrieve game';
export const UPDATE_GAME_PLAYER_ROLE_ERROR = 'Failure to update game player role';

export type GetAvailableRolesResponse = NonNullable<Awaited<ReturnType<typeof getAvailableRoles>>['data']>;
export type GetGameResponse = NonNullable<Awaited<ReturnType<typeof getGame>>['data']>;

export const getAvailableRoles = createServerFn({ method: 'POST' }).handler(async () => {
  try {
    const response = await supabaseServer.from('guess_who_roles').select();
    return response.error
      ? { success: false, error: GET_AVAILABLE_ROLES_ERROR }
      : { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: GET_AVAILABLE_ROLES_ERROR };
  }
});

export const createGame = createClientOnlyFn(
  async (props: { instanceId: string; hosting: boolean; players: Array<DiscordPlayer>; roles: Array<string> }) => {
    try {
      const gameResponse = await supabaseClient
        .from('guess_who_games')
        .insert({ discord_instance_id: props.instanceId })
        .select()
        .single();
      if (gameResponse.error) return { success: false, error: CREATE_GAME_ERROR };

      const gameRolesResponse = await supabaseClient
        .from('guess_who_game_roles')
        .insert(props.roles.map((role) => ({ game_id: gameResponse.data.id, role_id: role })));
      if (gameRolesResponse.error) return { success: false, error: CREATE_GAME_ERROR };

      const gamePlayersResponse = await supabaseClient.from('guess_who_game_players').insert(
        props.players.map((player) => ({
          game_id: gameResponse.data.id,
          user_id: player.id,
          user_name: player.username,
          avatar_url: player.avatarUrl,
          host: props.hosting,
        })),
      );
      if (gamePlayersResponse.error) return { success: false, error: CREATE_GAME_ERROR };

      return { success: true };
    } catch (error) {
      return { success: false, error: CREATE_GAME_ERROR };
    }
  },
);

export const getGame = createServerFn({ method: 'POST' })
  .inputValidator((discordInstanceId: string) => discordInstanceId)
  .handler(async ({ data: discordInstanceId }) => {
    try {
      const gameResponse = await supabaseClient
        .from('guess_who_games')
        .select(
          `
            id,
            scoreToWin: score_to_win,
            completed,
            roles: guess_who_game_roles (id, role_id, ...guess_who_roles (name, description)),
            players: guess_who_game_players (
              id,
              userId: user_id,
              username: user_name,
              avatarUrl: avatar_url,
              host,
              carImage: car_image,
              score,
              role: guess_who_game_roles (id, ...guess_who_roles (name, description))
            )
          `,
        )
        .eq('discord_instance_id', discordInstanceId)
        .single();
      return gameResponse.error
        ? { success: false, error: GET_GAME_ERROR }
        : { success: true, data: gameResponse.data };
    } catch (error) {
      return { success: false, error: GET_GAME_ERROR };
    }
  });

export const updateGamePlayerRole = createClientOnlyFn(async (playerId: string, roleId: string) => {
  try {
    const response = await supabaseClient
      .from('guess_who_game_players')
      .update({ game_role_id: roleId })
      .eq('id', playerId)
      .select('id, roleId: game_role_id')
      .single();
    return response.error
      ? { success: false, error: UPDATE_GAME_PLAYER_ROLE_ERROR }
      : { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: UPDATE_GAME_PLAYER_ROLE_ERROR };
  }
});
