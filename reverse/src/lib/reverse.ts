// special dumb reverse function
export const reverse = <T>(a: readonly T[]): T[] => {
  const r: T[] = [];
  for (let i = a.length - 1; i >= 0; i--) {
    r.push(a[i]);
  }
  return r;
}
