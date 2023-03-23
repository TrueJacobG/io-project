// 1 special char
// 1 number
// 1 big letter
// 1 small letter
// 2 -> > 8
// 1 -> > 12
// 1 -> > 16
// 10 -> > 30

const getPasswordStrengthLevel = (password: string) => {
  let points: number = 0;

  ".?!-_=+".split("").every((l) => {
    if (password.includes(l)) {
      points++;
      return false;
    }

    return true;
  });

  "0123456789".split("").every((l) => {
    if (password.includes(l)) {
      points++;
      return false;
    }

    return true;
  });

  password.split("").every((l) => {
    if (l === l.toUpperCase()) {
      points++;
      return false;
    }

    return true;
  });

  password.split("").every((l) => {
    if (l === l.toLowerCase()) {
      points++;
      return false;
    }

    return true;
  });

  if (password.length >= 8) {
    points += 2;
  }

  if (password.length >= 12) {
    points++;
  }

  if (password.length >= 16) {
    points++;
  }

  if (password.length >= 30) {
    points += 10;
  }

  return points;
};

export default getPasswordStrengthLevel;
