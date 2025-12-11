export const formatQty = (qty: number, unit?: string) => `${qty % 1 === 0 ? qty.toFixed(0) : qty.toFixed(2)}${unit ? ' ' + unit : ''}`;
