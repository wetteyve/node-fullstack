import { z } from 'zod';

export const serverModes = ['production', 'development', 'test'] as const;
export type ServerMode = (typeof serverModes)[number];

const schema = z.object({
  NODE_ENV: z.enum(serverModes).default('development'),
  RS911_CMS_API: z.string().url(),
  RS911_CMS_KEY: z.string().min(1),
  UHT_CMS_API: z.string().url(),
  UHT_CMS_KEY: z.string().min(1),
  UHT_CMS_SERVER_KEY: z.string().min(1),
  UHT_DOWNLOAD_REGISTRATIONS_KEY: z.string().min(1),
});

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof schema> {}
  }
}

export const checkEnvironment = () => {
  const parsed = schema.safeParse(process.env);

  if (parsed.success === false) {
    console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);

    throw new Error('Invalid environment variables');
  }
};

/**
 * @returns all ENV variables used in the app
 */
export const getEnv = () => ({
  MODE: (process.env.NODE_ENV as ServerMode) ?? 'development',
  RS911_CMS_API: process.env.RS911_CMS_API,
  RS911_CMS_KEY: process.env.RS911_CMS_KEY,
  UHT_CMS_API: process.env.UHT_CMS_API,
  UHT_CMS_KEY: process.env.UHT_CMS_KEY,
  UHT_CMS_SERVER_KEY: process.env.UHT_CMS_SERVER_KEY,
  UHT_DOWNLOAD_REGISTRATIONS_KEY: process.env.UHT_DOWNLOAD_REGISTRATIONS_KEY,
});

type ENV = ReturnType<typeof getEnv>;

declare global {
  var ENV: ENV;
  interface Window {
    ENV: ENV;
  }
}
