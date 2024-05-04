export type Bindings = {
  SLACK_BOT_ACCESS_TOKEN: string;
  SLACK_BOT_ACCESS_CHANNEL: string;
};

export type Attachment = {
  title: string;
  text: string;
  author_name: string;
  color: string;
};

export type Payload = {
  channel: string;
  attachments: Attachment[];
};
