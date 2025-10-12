import * as Localization from 'expo-localization';
import { I18nManager, Platform } from 'react-native';
// Use CommonJS build and instantiate I18n to ensure `t` exists
// eslint-disable-next-line @typescript-eslint/no-var-requires
const I18nLib = require('i18n-js');
const { I18n } = I18nLib;
import en from './en.json';
import ar from './ar.json';

const i18n = new I18n({ en, ar });
// Enable fallback to default locale
i18n.enableFallback = true;

// Auto-translate missing keys at runtime using MyMemory API (minimal + lazy)
const BASE_LOCALE = 'en';
const _pendingTranslations = new Set();

function _setNested(obj, path, value) {
  if (!obj) return;
  const parts = path.split('.');
  let o = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    if (!o[p] || typeof o[p] !== 'object') o[p] = {};
    o = o[p];
  }
  o[parts[parts.length - 1]] = value;
}

function _hasNested(obj, path) {
  if (!obj) return false;
  const parts = path.split('.');
  let o = obj;
  for (let i = 0; i < parts.length; i++) {
    o = o?.[parts[i]];
    if (o === undefined) return false;
  }
  return true;
}

function _getNested(obj, path) {
  if (!obj) return undefined;
  const parts = path.split('.');
  let o = obj;
  for (let i = 0; i < parts.length; i++) {
    o = o?.[parts[i]];
    if (o === undefined) return undefined;
  }
  return o;
}

async function _myMemoryTranslate(text, from, to) {
  // Disable remote translation in production to avoid runtime network dependency
  if (!__DEV__) return text;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 6000);
  try {
    const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`,
      { signal: controller.signal }
    );
    const data = await res.json();
    const translated = data?.responseData?.translatedText;
    return translated || text;
  } catch (_e) {
    if (__DEV__) console.warn('i18n remote translate failed:', _e?.message || _e);
    return text;
  } finally {
    clearTimeout(id);
  }
}

async function _translateAndCacheMissing(key, baseText, from, to) {
  const cacheKey = `${to}|${key}`;
  if (_pendingTranslations.has(cacheKey)) return;
  _pendingTranslations.add(cacheKey);
  const translated = await _myMemoryTranslate(baseText, from, to);
  if (!i18n.translations[to]) i18n.translations[to] = {};
  _setNested(i18n.translations[to], key, translated);
  _pendingTranslations.delete(cacheKey);
}

// Register a custom missing translation behavior instead of overriding the object
i18n.missingTranslation.register('lazyBase', (inst, scope, options = {}) => {
  const key = Array.isArray(scope) ? scope.join(inst.defaultSeparator) : scope;
  const current = options.locale || inst.locale || BASE_LOCALE;
  const baseFromDict = _getNested(inst.translations?.[BASE_LOCALE], key);
  const baseText = typeof baseFromDict === 'string' ? baseFromDict : key;
  if (__DEV__ && current !== BASE_LOCALE && typeof baseText === 'string') {
    _translateAndCacheMissing(key, baseText, BASE_LOCALE, current);
  }
  return baseText;
});
i18n.missingBehavior = 'lazyBase';

// Initialize with device locale, default to English
i18n.locale = (Localization?.locale || 'en').startsWith('ar') ? 'ar' : 'en';
// Sync RTL and document direction on startup
try {
  const wantRTL = i18n.locale.startsWith('ar');
  if (Platform.OS !== 'web') {
    I18nManager.allowRTL(true);
    if (I18nManager.isRTL !== wantRTL) {
      I18nManager.forceRTL(wantRTL);
    }
  } else if (typeof document !== 'undefined') {
    document?.documentElement?.setAttribute('dir', wantRTL ? 'rtl' : 'ltr');
  }
} catch (e) {}

export function setLocale(locale) {
  i18n.locale = locale;
  // Apply RTL when Arabic is selected
  try {
    const wantRTL = locale.startsWith('ar');
    if (Platform.OS !== 'web') {
      I18nManager.allowRTL(true);
      if (I18nManager.isRTL !== wantRTL) {
        I18nManager.forceRTL(wantRTL);
      }
    } else if (typeof document !== 'undefined') {
      document?.documentElement?.setAttribute('dir', wantRTL ? 'rtl' : 'ltr');
    }
  } catch (e) {}
}

export function t(key, options) {
  const out = i18n.t(key, options);
  const current = i18n.locale || BASE_LOCALE;
  // If current locale lacks this key (falling back to en), fetch translation lazily
  if (__DEV__ && current !== BASE_LOCALE) {
    const hasInLocale = _hasNested(i18n.translations[current], key);
    if (!hasInLocale) {
      const baseFromDict = _getNested(i18n.translations?.[BASE_LOCALE], key);
      const baseText = typeof baseFromDict === 'string' ? baseFromDict : key;
      if (typeof baseText === 'string' && baseText) {
        _translateAndCacheMissing(key, baseText, BASE_LOCALE, current);
      }
    }
  }
  return out;
}

export function getLocale() {
  return i18n.locale;
}
