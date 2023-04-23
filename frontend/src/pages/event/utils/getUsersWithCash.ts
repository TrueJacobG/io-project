const getUsersWithCash = (users: string[], cash: number[]) => {
  let newUsers: any = [];

  users.forEach((u, i) => {
    newUsers.push({ email: u, value: cash[i] });
  });

  return newUsers;
};

export default getUsersWithCash;
