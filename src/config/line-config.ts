// LINE Configuration
export const lineConfig = {
  liffId: import.meta.env.VITE_LINE_LIFF_ID || '',
  channelId: import.meta.env.VITE_LINE_CHANNEL_ID || '',
};

export const validateLineConfig = (): boolean => {
  if (!lineConfig.liffId) {
    console.warn('VITE_LINE_LIFF_ID is not configured');
    return false;
  }
  return true;
};
