/**
 * convert an array into an array of arries/pages containing the data
 * @param arr array to be converted
 * @param index the number of elements per page
 * @returns 
 * Example; paginate([1, 2, 3, 4], 2)
 * output: [[1, 2], [3, 4]]
 */
export async function paginate<T>(input: T[], index: number): Promise<T[][]> {
  let arr = [...input];
  let result = [];
  while (arr.length) result = [...result, arr.splice(0, index)];
  return result;
}

/**
 * remove duplicates from an array
 * Example; removeDuplicate([1, 1, 2, 3, 3, 4, 5])
 * output: [1, 2, 3, 4, 5]
 */
export async function removeDuplicate<T>(arr: T[]): Promise<T[]> {
  let result = [];
  for (let i of arr) {
    if (result.indexOf(i) === -1) result.push(i);
  }
  return result;
}