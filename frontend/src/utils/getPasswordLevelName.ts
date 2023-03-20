import getPasswordStrengthLevel from "./getPasswordStrengthLevel";

// < 5 - week - red
// < 7 - medium - yellow
// < 14 - strong - green
// >= 14 - legendary - rainbow

const getPasswordLevelName = (password: string) => {
  let points = getPasswordStrengthLevel(password);

  if (points < 5) {
    return "Weak";
  }

  if (points < 7) {
    return "Medium";
  }

  if (points < 7) {
    return "Medium";
  }

  if (points < 14) {
    return "Strong";
  }

  return "Legendary";
};

export default getPasswordLevelName;
