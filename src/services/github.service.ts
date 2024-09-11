import axios, { AxiosRequestConfig, Method } from "axios";

export type GithubUserInfo = {
  login: string;
  name: string;
  location: string;
  html_url: string;
};

export type GithubRepo = {
  id: number;
  name: string;
};

export type GithubRepoLanguages = {
  [key: string]: number;
};

const getUserInfo = async (username: string, token?: string) => {
  return executeRequest<GithubUserInfo>(
    "GET",
    `https://api.github.com/users/${username}`,
    token,
  );
};

const getUserRepos = async (username: string, token?: string) => {
  return executeRequest<GithubRepo[]>(
    "GET",
    `https://api.github.com/users/${username}/repos`,
    token,
  );
};

const getRepoLanguages = async (
  username: string,
  repoName: string,
  token?: string,
) => {
  return executeRequest<GithubRepoLanguages>(
    "GET",
    `https://api.github.com/repos/${username}/${repoName}/languages`,
    token,
  );
};

const executeRequest = async <T>(
  method: Method,
  url: string,
  token?: string,
) => {
  try {
    const requestConfig: AxiosRequestConfig = {
      method,
      url,
    };
    if (token && token.length > 0) {
      requestConfig.headers = {
        Authorization: `Bearer ${token}`,
      };
    }
    const response = await axios.request<T>(requestConfig);

    return response.data as T;
  } catch (error) {
    return new Error(`Error fetching data from github: ${error}`);
  }
};

export const githubService = {
  getUserInfo,
  getUserRepos,
  getRepoLanguages,
};
