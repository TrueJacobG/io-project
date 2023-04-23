const getUsersWithCash = (users: string[], cash: number[]) => {
  let newUsers: any = [];

  users.forEach((u, i) => {
    newUsers.push({ email: u, value: cash[i].toString() });
  });

  return newUsers;
};

export default getUsersWithCash;
