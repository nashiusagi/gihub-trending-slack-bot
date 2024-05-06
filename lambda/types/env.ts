declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      readonly SLACK_BOT_ACCESS_TOKEN: string;
      readonly SLACK_BOT_ACCESS_CHANNEL: string;
    }
  }
}
