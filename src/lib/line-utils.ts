import liff from '@line/liff';

/**
 * Check if the app is running in a Mini App environment
 */
export const isInMiniApp = (): boolean => {
  try {
    return liff.isInClient();
  } catch {
    return false;
  }
};

/**
 * Get the current environment (mini app or browser)
 */
export const getCurrentEnvironment = (): 'mini-app' | 'browser' => {
  return isInMiniApp() ? 'mini-app' : 'browser';
};

/**
 * Share to LINE timeline/chat
 */
export const shareToLine = async (message: string): Promise<void> => {
  try {
    if (!liff.isLoggedIn()) {
      throw new Error('User not logged in');
    }

    await liff.shareTargetPicker([
      {
        type: 'text',
        text: message,
      },
    ]);
  } catch (error) {
    console.error('Share error:', error);
    throw error;
  }
};

/**
 * Send LIFF message
 */
export const sendLiffMessage = async (text: string): Promise<void> => {
  try {
    if (!liff.isLoggedIn()) {
      throw new Error('User not logged in');
    }

    liff.sendMessages([
      {
        type: 'text',
        text: text,
      },
    ]).then(() => {
      console.log('Message sent');
    });
  } catch (error) {
    console.error('Send message error:', error);
    throw error;
  }
};

/**
 * Close LIFF app
 */
export const closeLiffApp = (): void => {
  try {
    liff.closeWindow();
  } catch (error) {
    console.error('Close error:', error);
  }
};

/**
 * Get device information (OS, language, etc.)
 */
export const getDeviceInfo = () => {
  try {
    return {
      os: liff.getOS(),
      language: liff.getLanguage(),
      version: liff.getVersion(),
      isInClient: liff.isInClient(),
    };
  } catch {
    return null;
  }
};
