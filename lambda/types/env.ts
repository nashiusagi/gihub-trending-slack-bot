declare module "process" {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        readonly SLACK_BOT_ACCESS_TOKEN: string;
        readonly SLACK_BOT_ACCESS_CHANNEL: string;
      }
    }
  }
}
