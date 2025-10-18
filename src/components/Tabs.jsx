import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import theme from '../theme';
import { useColors } from '../theme/hooks';

export default function Tabs({ items = [], value, onChange }) {
  const colors = useColors();
  return (
    <View style={styles.container}>
      <View style={[styles.tabsWrapper, { backgroundColor: colors.surface }]}>
        {items.map((item, index) => {
          const normalized =
            typeof item === 'string'
              ? { key: item, label: item }
              : {
                  key: item?.key ?? String(index),
                  label: item?.label ?? item?.key ?? String(index),
                };
          const isActive = value === normalized.key;
          return (
            <TouchableOpacity 
              key={normalized.key}
              onPress={() => onChange?.(normalized.key, item)}
              style={[styles.tab, isActive && [styles.activeTab, { backgroundColor: colors.card }]]}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, { color: colors.muted }, isActive && [styles.activeTabText, { color: colors.primary }]]}>
                {normalized.label}
              </Text>
              {isActive && <View style={[styles.activeIndicator, { backgroundColor: colors.primary }]} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.md,
  },
  tabsWrapper: { 
    flexDirection: 'row',
    borderRadius: theme.radius.lg,
    padding: 4,
  },
  tab: { 
    flex: 1,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.base,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    position: 'relative',
  },
  activeTab: { ...theme.shadow.sm },
  tabText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
  },
  activeTabText: { 
    fontWeight: theme.fontWeight.bold,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '25%',
    right: '25%',
    height: 3,
    borderRadius: theme.radius.full,
  },
});
