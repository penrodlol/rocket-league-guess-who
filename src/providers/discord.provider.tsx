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
  user: DiscordUser | null;
  players: Array<DiscordPlayer>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<DiscordUser | null>>;
  setPlayers: React.Dispatch<React.SetStateAction<Array<DiscordPlayer>>>;
};

export const DiscordContext = createContext<DiscordContextValue | null>(null);

export function useDiscord() {
  const context = use(DiscordContext);
  if (!context) throw new Error('useDiscord must be used within a DiscordProvider');
  return context;
}

export function useDiscordLoading() {
  const { loading } = useDiscord();
  return loading;
}

export function useDiscordUser() {
  const { user } = useDiscord();
  if (!user) throw new Error('No Discord user found in context');
  return user;
}

export function useDiscordPlayers() {
  const { players } = useDiscord();
  return players;
}

export function DiscordProvider({ children }: { children: React.ReactNode }) {
  const isDiscordSetup = useRef(false);
  const [loading, setLoading] = useState(true);
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
    <DiscordContext.Provider value={{ loading, user, players, setLoading, setUser, setPlayers }}>
      {children}
    </DiscordContext.Provider>
  );
}
