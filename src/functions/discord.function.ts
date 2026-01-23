import discord from '@/libs/discord';
import { createClientOnlyFn, createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

export const WAIT_FOR_DISCORD_CONNECTION_ERROR = 'Discord Connection Failed';
export const GET_DISCORD_AUTHORIZATION_CODE_ERROR = 'Authorization Token Retrieval Failed';
export const GET_DISCORD_ACCESS_TOKEN_ERROR = 'Access Token Retrieval Failed';
export const GET_DISCORD_USER_ERROR = 'User Retrieval Failed';
export const GET_DISCORD_PLAYERS_ERROR = 'Players Retrieval Failed';

export const waitForDiscordConnection = createClientOnlyFn(async () => {
  try {
    await discord.ready();
    return { success: true };
  } catch (error) {
    return { success: false, error: WAIT_FOR_DISCORD_CONNECTION_ERROR };
  }
});

export const getDiscordAuthorizationCode = createClientOnlyFn(async () => {
  try {
    const response = await discord.commands.authorize({
      client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
      response_type: 'code',
      state: '',
      prompt: 'none',
      scope: import.meta.env.VITE_DISCORD_SCOPES.split('|'),
    });
    return !response.code
      ? { success: false, error: GET_DISCORD_AUTHORIZATION_CODE_ERROR }
      : { success: true, data: response.code };
  } catch (error) {
    return { success: false, error: GET_DISCORD_AUTHORIZATION_CODE_ERROR };
  }
});

export const getDiscordAccessToken = createServerFn({ method: 'POST' })
  .inputValidator((code: string) => code)
  .handler(async ({ data: code }) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_DISCORD_BASE_URL}/oauth2/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
          client_secret: process.env.DISCORD_CLIENT_SECRET,
          grant_type: 'authorization_code',
          code,
        }),
      });
      if (!response.ok) return { success: false, error: GET_DISCORD_ACCESS_TOKEN_ERROR };

      const payload = await z.object({ access_token: z.string() }).safeParseAsync(await response.json());
      return !payload.success
        ? { success: false, error: GET_DISCORD_ACCESS_TOKEN_ERROR }
        : { success: true, data: { accessToken: payload.data.access_token } };
    } catch (error) {
      return { success: false, error: GET_DISCORD_ACCESS_TOKEN_ERROR };
    }
  });

export const getDiscordUser = createClientOnlyFn(async (accessToken: string) => {
  try {
    const auth = await discord.commands.authenticate({ access_token: accessToken });
    if (!auth.user) return { success: false, error: GET_DISCORD_USER_ERROR };

    const username = getDiscordUserName(auth.user.global_name, auth.user.username, auth.user.discriminator);
    const avatarUrl = getDiscordUserAvatarUrl(auth.user.id, auth.user.avatar);

    return { success: true, data: { ...auth.user, username, avatarUrl } };
  } catch (error) {
    return { success: false, error: GET_DISCORD_USER_ERROR };
  }
});

export const getDiscordPlayers = createClientOnlyFn(async () => {
  try {
    const response = await discord.commands.getInstanceConnectedParticipants();
    const paylod = response.participants.map((participant) => ({
      ...participant,
      username: getDiscordUserName(participant.global_name, participant.username, participant.discriminator),
      avatarUrl: getDiscordUserAvatarUrl(participant.id, participant.avatar),
    }));
    return { success: true, data: paylod };
  } catch (error) {
    return { success: false, error: GET_DISCORD_PLAYERS_ERROR };
  }
});

export const getDiscordUserName = createClientOnlyFn(
  (globalname: string | null | undefined, username: string, discriminator: string) =>
    globalname ?? `${username}#${discriminator}`,
);

export const getDiscordUserAvatarUrl = createClientOnlyFn((userId: string, avatar: string | null | undefined) =>
  avatar
    ? `${import.meta.env.VITE_DISCORD_CDN_BASE_URL}/avatars/${userId}/${avatar}.png?size=256`
    : `${import.meta.env.VITE_DISCORD_CDN_BASE_URL}/embed/avatars/${(BigInt(userId) >> 22n) % 6n}.png`,
);
