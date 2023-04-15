const getUsersWithCashBySplitType = (users: string[], cash: number, splitType: string) => {
  if (splitType !== "equal") {
    // TODO !
    return [];
  }

  let newUsers: any = [];

  let perUserCash = cash / users.length;

  users.forEach((u) => {
    newUsers.push({ email: u, value: perUserCash });
  });

  return newUsers;
};

export default getUsersWithCashBySplitType;
