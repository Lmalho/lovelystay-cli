import axios, { AxiosRequestConfig, Method } from "axios";

export type GithubUserInfo = {
  login: string;
  name: string;
  location: string;
  html_url: string;
  repos_url: string;
};

export type GithubRepo = {
  id: number;
  name: string;
};

export type GithubRepoLanguages = {
  [key: string]: number;
};

export const getGithubUserInfo = async (username: string, token?: string) => {
  return executeRequest<GithubUserInfo>(
    "GET",
    `https://api.github.com/users/${username}`,
    token,
  );
};

export const getGithubUserRepos = async (username: string, token?: string) => {
  return executeRequest<GithubRepo[]>(
    "GET",
    `https://api.github.com/users/${username}/repos`,
    token,
  );
};

export const getGithubRepoLanguages = async (
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
      headers: {},
    };

    if (token) {
      requestConfig.headers = {
        Authorization: `Bearer ${token}`,
      };
    }
    const response = await axios.request<T>({
      method,
      url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data as T;
  } catch (error) {
    console.error("Error fetching data from github:", error);
    return null;
  }
};
