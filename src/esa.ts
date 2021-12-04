import { AxiosInstance } from 'axios';
import axios from 'axios';

export type EsaConfig = {
  teamName: string;
  accessToken: string;
}

export type Tag = {
  name: string;
  posts_count: number; // eslint-disable-line camelcase
}

export type EsaTags = {
  tags: Tag[]
}

const env = process.env
const teamName = env.ESA_TEAM_NAME || ""
const accessToken = env.ESA_ACCESS_TOKEN || ""

export function getEsaConfig(): EsaConfig {
  const config: EsaConfig = { teamName, accessToken };
  return config;
}

export function createAxiosClient(accessToken: string): AxiosInstance {
  return axios.create({
    baseURL: 'https://api.esa.io',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    responseType: 'json',
  });
}
