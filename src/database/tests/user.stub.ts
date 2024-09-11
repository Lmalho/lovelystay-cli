import { faker } from "@faker-js/faker";

export const generateUser = () => ({
  login: faker.internet.userName(),
  name: faker.person.firstName(),
  location: faker.location.city(),
  repo_count: faker.number.int({ min: 1, max: 50 }),
  html_url: faker.internet.url(),
});

export const languages = ["Javascript", "Typescript"];
