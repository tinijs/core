export function isClass(input: unknown) {
  return (
    typeof input === 'function' &&
    /^class\s/.test(Function.prototype.toString.call(input))
  );
}
