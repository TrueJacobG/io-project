const getUsersWithCash = (members: any[], users: string[], cash: number[]) => {
  let newUsers: any = [];

  let userIndex = 0;
  for (let i = 0; i < cash.length; i++) {
    if (cash[i] === 0) {
      newUsers.push({ email: members[i].email, value: cash[i].toString() });
    } else {
      newUsers.push({ email: users[userIndex], value: cash[i].toString() });
      userIndex++;
    }
  }

  return newUsers;
};

export default getUsersWithCash;
