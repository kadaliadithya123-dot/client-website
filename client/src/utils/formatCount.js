// 1234 -> "1.2K", 1000000 -> "1M", 999 -> "999"
export const formatCount = (n) => {
  if (n == null) return "0";
  if (n >= 1_000_000) {
    const val = n / 1_000_000;
    return (Number.isInteger(val) ? val : val.toFixed(1)) + "M";
  }
  if (n >= 1_000) {
    const val = n / 1_000;
    return (Number.isInteger(val) ? val : val.toFixed(1)) + "K";
  }
  return String(Math.round(n));
};
