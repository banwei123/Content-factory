const API_KEYS = {
  wechatMonitor: "JZL68599a78a4216530",
  
};

export const API_KEY_NAMES = {
  WECHAT_MONITOR: "wechatMonitor",
};

/**
 * Fetches API keys from a single place so future integrations can reuse it.
 * @param {keyof typeof API_KEYS} name
 * @returns {string}
 */
export function getApiKey(name = API_KEY_NAMES.WECHAT_MONITOR) {
  const key = API_KEYS[name];

  if (!key) {
    throw new Error(`Missing API key for "${name}"`);
  }

  return key;
}

