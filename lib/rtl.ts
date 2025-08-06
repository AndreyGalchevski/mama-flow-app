import { I18nManager } from 'react-native';

/**
 * RTL Utilities for React Native
 *
 * Note: React Native automatically handles most RTL layout when I18nManager.allowRTL(true) is set.
 * These utilities are for special cases that need manual RTL handling.
 */

/**
 * Get RTL-aware transform style for icons that should flip in RTL
 * Use this for directional icons like arrows, back buttons, etc.
 *
 * Example: <Icon style={getRTLIconTransform()} source="arrow-left" />
 */
export const getRTLIconTransform = () => ({
  transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
});

/**
 * Get RTL-aware text alignment for cases where you need explicit control
 * Note: Most text automatically aligns correctly with React Native's RTL support
 */
export const getRTLTextAlign = (): 'left' | 'right' => {
  return I18nManager.isRTL ? 'right' : 'left';
};
