// LINE Configuration
const liffId = import.meta.env.VITE_LINE_LIFF_ID;
const channelId = import.meta.env.VITE_LINE_CHANNEL_ID;

// Log for debugging
console.log('LINE Config - LIFF ID:', liffId ? '✓ Loaded' : '✗ Not loaded');
console.log('LINE Config - Channel ID:', channelId ? '✓ Loaded' : '✗ Not loaded');

export const lineConfig = {
  liffId: liffId || '',
  channelId: channelId || '',
};

export const validateLineConfig = (): boolean => {
  if (!liffId) {
    console.error(
      'VITE_LINE_LIFF_ID is not configured. Please set it in .env.local file. Current value:',
      liffId
    );
    return false;
  }

  if (!channelId) {
    console.warn('VITE_LINE_CHANNEL_ID is not configured');
  }

  // Verify values are not empty strings
  if (liffId === '') {
    console.error('VITE_LINE_LIFF_ID is empty');
    return false;
  }

  return true;
};
