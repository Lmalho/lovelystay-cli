export = async function globalTeardown() {
  const pgContainer = global.__POSTGRES__;

  if (pgContainer) {
    await pgContainer.stop();
  }
};
