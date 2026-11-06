// Currency symbols map
export const CURRENCY_SYMBOLS = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

// Format currency value with symbol and comma separation
export const formatCurrency = (amount, currency = 'INR') => {
  const num = Number(amount) || 0;
  const symbol = CURRENCY_SYMBOLS[currency] || '₹';

  if (currency === 'INR') {
    // Indian numbering format
    return `${symbol}${num.toLocaleString('en-IN')}`;
  }
  return `${symbol}${num.toLocaleString('en-US')}`;
};

// Format date in human readable format (e.g. 15 Nov, 2026)
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  const d = new Date(dateString);
  return d.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

// Format short date for charts (e.g. 15 Nov)
export const formatShortDate = (dateString) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  return d.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
  });
};

// Category styling helpers (navy, purple, emerald, amber, rose)
export const CATEGORY_COLORS = {
  'Food & Dining': '#f97316', // Orange
  Shopping: '#ec4899', // Pink
  'Housing & Rent': '#6366f1', // Indigo
  Transportation: '#06b6d4', // Cyan
  'Utilities & Bills': '#eab308', // Amber
  Entertainment: '#a855f7', // Purple
  Healthcare: '#ef4444', // Red
  Education: '#3b82f6', // Blue
  'Personal Care': '#14b8a6', // Teal
  Travel: '#10b981', // Emerald
  Others: '#64748b', // Slate
  // Income categories
  Salary: '#10b981',
  Freelance: '#6366f1',
  Investments: '#06b6d4',
  Business: '#8b5cf6',
  'Part-time': '#f59e0b',
  Allowance: '#ec4899',
  Gifts: '#f43f5e',
  Other: '#64748b',
};

export const getCategoryColor = (category) => {
  return CATEGORY_COLORS[category] || '#6366f1';
};
