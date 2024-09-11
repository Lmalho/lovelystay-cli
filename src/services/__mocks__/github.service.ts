import { generateUser } from "../../database/tests/user.stub";

export const githubService = {
  getUserInfo: jest
    .fn()
    .mockResolvedValue({ ...generateUser(), login: "mockUser" }),
  getUserRepos: jest.fn().mockResolvedValue([
    {
      id: 1,
      name: "mockRepo1",
      full_name: "mockUser/mockRepo1",
    },
    {
      id: 2,
      name: "mockRepo2",
      full_name: "mockUser/mockRepo2",
    },
  ]),
  getRepoLanguages: jest.fn().mockResolvedValue({
    Java: 10000,
    Shell: 50000,
  }),
};
