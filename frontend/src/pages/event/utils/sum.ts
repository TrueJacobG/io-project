const sum = (cash: number[]) => {
  let s = 0;

  cash.forEach((c) => {
    s += c;
  });

  return s;
};

export default sum;
