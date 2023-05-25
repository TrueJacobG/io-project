import { MemberType } from "../../../types/MemberType";
import { UserWithCash } from "../../../types/UserWithCash";

const getUsersWithCash = (members: MemberType[], users: string[], cash: number[]): UserWithCash[] => {
  let newUsers: UserWithCash[] = [];

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
