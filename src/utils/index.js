export function isDevEnv() {
  return process.env.NODE_ENV === "development";
}

export function isTestEnv() {
  return process.env.NODE_ENV === "test";
}
