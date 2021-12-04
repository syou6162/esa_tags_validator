import { AxiosInstance } from 'axios';
import { IncomingWebhook } from '@slack/webhook';

import { EsaConfig, Tag, EsaTags, getEsaConfig, createAxiosClient } from './esa'

async function getEsaTags(
  axios: AxiosInstance,
  esaConfig: EsaConfig,
): Promise<EsaTags> {
  const response = await axios.get<EsaTags>(`/v1/teams/${esaConfig.teamName}/tags`);
  return response.data;
}

const env = process.env
const url = env.SLACK_WEBHOOK || ""
const webhook = new IncomingWebhook(url);

const esaConfig = getEsaConfig();
const axios = createAxiosClient(esaConfig.accessToken);

const tags_by_normalized_tag_name: { [key: string]: Tag[] } = {}

getEsaTags(axios, esaConfig).then((result: EsaTags) => {
  result.tags.forEach((tag: Tag) => {
    const name = tag.name.toLocaleLowerCase()
    if (name in tags_by_normalized_tag_name) {
      tags_by_normalized_tag_name[name].push(tag);
    } else {
      tags_by_normalized_tag_name[name] = [tag];
    }
  })
  Object.keys(tags_by_normalized_tag_name).forEach(name => {
    const tags = tags_by_normalized_tag_name[name];
    if (tags.length >= 2) {
      let text = ""
      text += `esaのチーム \`${esaConfig.teamName}\` のタグ \`${name}\` には曖昧性があります。どれかに統一しませんか?\n`;
      tags.forEach((tag: Tag) => {
        text += `- <https://${esaConfig.teamName}.esa.io/posts?q=tag%3A${tag.name}|${tag.name}>: ${tag.posts_count}個\n`;
      });
      (async () => {
        await webhook.send({
          text: text
        });
      })().catch(err => {
        console.log(err);
        process.exit(1);
      });
    }
  });
}).catch(err => {
  console.log(err);
  process.exit(1);
})