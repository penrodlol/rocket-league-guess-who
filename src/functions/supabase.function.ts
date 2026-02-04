import supabaseClient from '@/libs/supabase/client';
import supabaseServer from '@/libs/supabase/server';
import { getImagePathURL } from '@/libs/supabase/shared';
import { DiscordPlayer } from '@/providers/discord.provider';
import { createClientOnlyFn, createServerFn } from '@tanstack/react-start';

export const GET_ROLES_ERROR = 'Failure to retrieve roles';
export const CREATE_GAME_ERROR = 'Failure to create game';
export const GET_GAME_ERROR = 'Failure to retrieve game';

export type GetRolesResponse = NonNullable<Awaited<ReturnType<typeof getRoles>>['data']>;
export type GetGameResponse = NonNullable<Awaited<ReturnType<typeof getGame>>['data']>;

export const getRoles = createServerFn({ method: 'POST' }).handler(async () => {
  try {
    const rolesResponse = await supabaseServer.from('guess_who_roles').select();
    if (rolesResponse.error) return { success: false, error: GET_ROLES_ERROR };

    const response = rolesResponse.data.map((role) => {
      const imageUrl = supabaseServer.storage.from('guess_who_roles').getPublicUrl(`${role.name.toLowerCase()}.png`);
      return { ...role, imageUrl: getImagePathURL(imageUrl.data.publicUrl) };
    });

    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: GET_ROLES_ERROR };
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

export const getGame = createClientOnlyFn(async (instanceId: string) => {
  try {
    const gameResponse = await supabaseClient
      .from('guess_who_games')
      .select(
        `
        id,
        discordInstanceId: discord_instance_id,
        scoreToWin: score_to_win,
        completed,  
        roles: guess_who_game_roles (id, role_id, ...guess_who_roles (name, description)),
        players: guess_who_game_players (id, userId: user_id, username: user_name, avatarUrl: avatar_url, host, carImage: car_image, score)
      `,
      )
      .eq('discord_instance_id', instanceId)
      .single();
    if (gameResponse.error) return { success: false, error: GET_GAME_ERROR };

    const response = {
      ...gameResponse.data,
      players: gameResponse.data.players.map((player) => {
        const carImageUrl = supabaseClient.storage.from('guess_who_cars').getPublicUrl(player.carImage ?? 'red');
        return { ...player, carImageUrl: getImagePathURL(carImageUrl.data.publicUrl) };
      }),
    };
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: GET_GAME_ERROR };
  }
});
