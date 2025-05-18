export function splitArrayByKey<T>(arr: T[], key: keyof T) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]![key] !== arr[0]![key]) {
      return [arr.slice(0, i), arr.slice(i)];
    }
  }
  return [arr, []]; // If the key doesn't change, return the original array and an empty array
}
