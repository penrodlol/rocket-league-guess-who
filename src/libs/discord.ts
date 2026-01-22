import { DiscordSDK } from '@discord/embedded-app-sdk';

const discordGlobal = globalThis as typeof globalThis & { discord?: DiscordSDK };

export default discordGlobal.discord ??= new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID);
