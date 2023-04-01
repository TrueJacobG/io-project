const convertTypeToEmoji = (type: string) => {
  switch (type) {
    case "food":
      return "🍕";

    case "shop":
      return "🛒";
  }
  // fun
  return "🎡";
};

export default convertTypeToEmoji;
