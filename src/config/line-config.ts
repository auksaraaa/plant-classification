// LINE Configuration
export const lineConfig = {
  liffId: import.meta.env.VITE_LINE_LIFF_ID || '',
  channelId: import.meta.env.VITE_LINE_CHANNEL_ID || '',
};

export const validateLineConfig = (): boolean => {
  const liffId = import.meta.env.VITE_LINE_LIFF_ID;
  const channelId = import.meta.env.VITE_LINE_CHANNEL_ID;

  if (!liffId) {
    console.error(
      'VITE_LINE_LIFF_ID is not configured. Please set it in .env.local file.'
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
