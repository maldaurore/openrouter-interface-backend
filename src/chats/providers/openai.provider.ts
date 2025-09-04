import { createOpenRouter } from '@openrouter/ai-sdk-provider';

export const OpenRouterProvider = {
  provide: 'OPENROUTER_INSTANCE',
  useFactory: () => {
    return createOpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY,
    });
  },
};
