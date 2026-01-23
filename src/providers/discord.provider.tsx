import {
  getDiscordAccessToken,
  getDiscordAuthorizationCode,
  getDiscordPlayers,
  getDiscordUser,
  getDiscordUserAvatarUrl,
  getDiscordUserName,
  waitForDiscordConnection,
} from '@/functions/discord.function';
import discord from '@/libs/discord';
import { Events, Types } from '@discord/embedded-app-sdk';
import { createContext, use, useEffect, useRef, useState } from 'react';

export type DiscordUser = NonNullable<Awaited<ReturnType<typeof getDiscordUser>>['data']>;
export type DiscordPlayer = NonNullable<Awaited<ReturnType<typeof getDiscordPlayers>>['data']>[0];
export type DiscordContextValue = {
  loading: boolean;
  instanceId: string | null;
  user: DiscordUser | null;
  players: Array<DiscordPlayer>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setInstanceId: React.Dispatch<React.SetStateAction<string | null>>;
  setUser: React.Dispatch<React.SetStateAction<DiscordUser | null>>;
  setPlayers: React.Dispatch<React.SetStateAction<Array<DiscordPlayer>>>;
};

export const DiscordContext = createContext<DiscordContextValue | null>(null);

export function useDiscord() {
  const context = use(DiscordContext);
  if (!context) throw new Error('useDiscord must be used within a DiscordProvider');
  return context;
}

export function DiscordProvider({ children }: { children: React.ReactNode }) {
  const isDiscordSetup = useRef(false);
  const [loading, setLoading] = useState<DiscordContextValue['loading']>(true);
  const [instanceId, setInstanceId] = useState<DiscordContextValue['instanceId'] | null>(null);
  const [user, setUser] = useState<DiscordContextValue['user'] | null>(null);
  const [players, setPlayers] = useState<DiscordContextValue['players']>([]);

  useEffect(() => {
    if (isDiscordSetup.current) return;
    else isDiscordSetup.current = true;

    const setup = async () => {
      try {
        const connectionResponse = await waitForDiscordConnection();
        if (connectionResponse.error) throw new Error(connectionResponse.error);

        const authorizationCodeResponse = await getDiscordAuthorizationCode();
        if (authorizationCodeResponse.error) throw new Error(authorizationCodeResponse.error);

        const accessTokenResponse = await getDiscordAccessToken({ data: authorizationCodeResponse.data! });
        if (accessTokenResponse.error) throw new Error(accessTokenResponse.error);

        const userResponse = await getDiscordUser(accessTokenResponse.data.accessToken);
        if (userResponse.error) throw new Error(userResponse.error);

        const playersResponse = await getDiscordPlayers();
        if (playersResponse.error) throw new Error(playersResponse.error);

        setInstanceId(discord.instanceId);
        setUser(userResponse.data!);
        setPlayers(playersResponse.data!);
        setLoading(false);

        const updatePlayers = ({ participants }: Types.GetActivityInstanceConnectedParticipantsResponse) =>
          setPlayers(
            participants.map((participant) => ({
              ...participant,
              username: getDiscordUserName(participant.global_name, participant.username, participant.discriminator),
              avatarUrl: getDiscordUserAvatarUrl(participant.id, participant.avatar),
            })),
          );

        discord.subscribe(Events.ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE, updatePlayers);
        return () => {
          discord.unsubscribe(Events.ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE, updatePlayers);
        };
      } catch (error) {
        console.error('Error during Discord setup:', error);
        return setLoading(false);
      }
    };

    let setupListener: Awaited<ReturnType<typeof setup>>;
    setup().then((listener) => (setupListener = listener));
    return () => {
      if (setupListener) setupListener();
    };
  }, []);

  return (
    <DiscordContext.Provider
      value={{ loading, instanceId, user, players, setLoading, setInstanceId, setUser, setPlayers }}
    >
      {children}
    </DiscordContext.Provider>
  );
}
