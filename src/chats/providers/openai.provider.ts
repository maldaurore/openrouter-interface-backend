import OpenAI from "openai"

export const OpenAIProvider = {
  provide: 'OPENAI_INSTANCE',
  useFactory: () => {
    return new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  },
};