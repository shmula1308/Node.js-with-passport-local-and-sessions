const capFirstLetter = (str) => {
  return str
    .split(" ")
    .map((str) => str[0].toUpperCase() + str.slice(1))
    .join(" ");
};

module.exports = {
  capFirstLetter,
};
