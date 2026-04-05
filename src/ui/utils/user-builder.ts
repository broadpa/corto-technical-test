export type BookStoreUserCredentials = {
  userName: string;
  password: string;
};

export function buildUniqueBookStoreUser(): BookStoreUserCredentials {
  const suffix = `${Date.now()}${Math.floor(Math.random() * 1000)}`
    .slice(-8);

  return {
    userName: `corto_user_${suffix}`,
    password: `ValidP@ss1${suffix}`,
  };
}