export const generateUniqueRandomNumbers = (size) => {
  const numbers = new Set();
  while (numbers.size < size) {
    const num = Math.floor(Math.random() * 10);
    numbers.add(num);
  }
  return Array.from(numbers);
};
