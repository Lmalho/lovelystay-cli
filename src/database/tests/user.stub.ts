import { faker } from "@faker-js/faker";

export const generateUser = () => ({
  login: faker.internet.userName(),
  name: faker.person.firstName(),
  location: faker.location.city(),
  html_url: faker.internet.url(),
  repos_url: faker.internet.url(),
});

export const languages = ["Javascript", "Typescript"];
