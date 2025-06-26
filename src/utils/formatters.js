export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatNumber = (number) => {
  return new Intl.NumberFormat('en-US').format(number);
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatRelativeDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
};

export const formatSquareFeet = (sqft) => {
  if (!sqft) return 'N/A';
  return `${formatNumber(sqft)} sqft`;
};

export const formatAddress = (address) => {
  return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`;
};

export const formatShortAddress = (address) => {
  return `${address.city}, ${address.state}`;
};

export const calculatePricePerSqft = (price, squareFeet) => {
  if (!squareFeet || squareFeet === 0) return 0;
  return Math.round(price / squareFeet);
};

export const formatPricePerSqft = (price, squareFeet) => {
  const pricePerSqft = calculatePricePerSqft(price, squareFeet);
  return pricePerSqft > 0 ? `$${formatNumber(pricePerSqft)}/sqft` : 'N/A';
};