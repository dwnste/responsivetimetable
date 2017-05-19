//Перевсти время в милисекунды
export const timeToMilli = (n) => (parseInt(n.split(':')[0]) * 60 * 60 + parseInt(n.split(':')[1]) * 60) * 1000;
