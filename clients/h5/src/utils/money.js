/**
 *金额保留N位有效小数
 * @param {*} n，需要被处理的数字
 * @param {*} decimal 需要保留的位数，默认2
 * @param {*} least 为true至少两位有效小数
 * @returns 返回转换之后的结果【字符串】
 */
export const moneyFixed = function(n, decimal = 2) {
  const n2 = Number(n);
  const nn = 1e-14;

  if (n2.toFixed && !isNaN(n2)) {
    return (n2 + nn).toFixed(decimal);
  }
  return n;
};

/**
 * 将数字转换成千分位
 * @param {*} n 需要被处理的数字
 * @param {*} decimal 保留的小数位数，默认为3
 */
export const money2thousands = function(n, decimal = 3) {
  const money = moneyFixed(n, decimal);

  return `${money}`.replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
};
