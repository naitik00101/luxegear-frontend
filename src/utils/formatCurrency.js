export const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);

export const getDiscountPercent = (price, originalPrice) =>
    Math.round(((originalPrice - price) / originalPrice) * 100);

export const truncateText = (text, maxLength = 100) =>
    text.length <= maxLength ? text : `${text.slice(0, maxLength).trimEnd()}...`;
