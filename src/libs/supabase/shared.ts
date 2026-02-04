export function getImagePathURL(imageUrl: string) {
  return typeof window === 'undefined'
    ? imageUrl.replace(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_DISCORD_PATH!)
    : imageUrl.replace(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_DISCORD_PATH);
}
