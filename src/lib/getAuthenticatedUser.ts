interface UserAccount {
  email: string;
  userId: number;
  username: string;
  roles: string[];
  administrator: boolean;
  name: string;
}

export function getAuthenticatedUser() {
  const authenticatedUser: UserAccount = {
    email: "admin@gmail.com",
    userId: 4,
    username: "sendist",
    roles: [],
    administrator: true,
    name: "",
  };

  return {authenticatedUser};
}
