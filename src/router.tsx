import * as Dialog from '@/components/dialog';
import { Text } from '@/components/text';
import { DiscordProvider } from '@/providers/discord.provider';
import { QueryClient } from '@tanstack/react-query';
import { createRouter } from '@tanstack/react-router';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';
import { AlertCircleIcon } from 'lucide-react';
import Icon from './components/icon';
import Spinner from './components/spinner';
import { routeTree } from './routeTree.gen';

export const getRouter = async () => {
  const queryClient = new QueryClient();
  const router = createRouter({
    routeTree,
    context: { queryClient },
    defaultPreload: 'intent',
    Wrap: (props) => <DiscordProvider {...props} />,
    defaultPendingComponent: () => (
      <Spinner variant="accent" size="5" className="absolute top-1/2 left-1/2 -translate-1/2" />
    ),
    defaultErrorComponent: (error) => (
      <Dialog.Root defaultOpen>
        <Dialog.Content>
          <Dialog.Heading variant="danger">
            <Icon variant="danger" size="3" source={<AlertCircleIcon />} />
            Internal Server Error
          </Dialog.Heading>
          <Text>{error.error.message}. Please try again in a few moments.</Text>
          <Dialog.Close variant="gray-ghost" onClick={() => error.reset()}>
            Retry
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Root>
    ),
  });
  setupRouterSsrQueryIntegration({ router, queryClient });
  return router;
};
