import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import theme from '../theme';
import { useColors } from '../theme/hooks';
import {
  selectAll as selectAllCart,
  selectCount as selectCartCount,
  selectTotal as selectCartTotal,
  removeItem as removeCartItem,
  clear as clearCart,
} from '../store/slices/cartSlice';
import { CourseCardVertical } from '../components/CourseCard';

export default function CartScreen({ navigation }) {
  const colors = useColors();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectAllCart);
  const cartCount = useSelector(selectCartCount);
  const cartTotal = useSelector(selectCartTotal);

  const openCourse = (courseId) => {
    if (!courseId) return;
    const target = {
      screen: 'Home',
      params: {
        screen: 'CourseDetails',
        params: { courseId },
      },
    };

    let rootNav = navigation;
    let parent = navigation?.getParent?.();
    while (parent) {
      rootNav = parent;
      parent = parent.getParent?.();
    }

    if (rootNav?.navigate) {
      rootNav.navigate('HomeTabs', target);
    } else {
      navigation.navigate('CourseDetails', { courseId });
    }
  };

  const proceedToCheckout = () => {
    if (!cartItems.length) return;
    // Placeholder for future checkout integration
    openCourse(cartItems[0]?.id);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerRow}>
        <Text style={[styles.screenTitle, { color: colors.text }]}>Cart</Text>
        {cartItems.length > 0 ? (
          <TouchableOpacity onPress={() => dispatch(clearCart())} activeOpacity={0.7}>
            <Text style={[styles.clearText, { color: colors.muted }]}>Clear cart</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyTitle, { color: colors.muted, textAlign: 'center' }]}>
            Your cart is empty {'\uD83D\uDED2'}
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.muted, textAlign: 'center' }]}>
            Add courses to your cart with the shopping cart icon.
          </Text>
        </View>
      ) : (
        <>
          {cartItems.map((item) => (
            <View key={item.id} style={styles.cardWrapper}>
              <CourseCardVertical course={item} onPress={() => openCourse(item.id)} />
              <View style={styles.infoRow}>
                <Text style={[styles.quantityText, { color: colors.muted }]}>
                  Quantity: {item.quantity || 1}
                </Text>
                <Text style={[styles.quantityText, { color: colors.text }]}>
                  Line total: ${((Number(item.price) || 0) * (item.quantity || 1)).toFixed(2)}
                </Text>
              </View>
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    { backgroundColor: colors.primary, borderColor: colors.primary },
                  ]}
                  onPress={() => openCourse(item.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.actionButtonPrimaryText}>View details</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    { borderColor: colors.border, backgroundColor: colors.card },
                  ]}
                  onPress={() => dispatch(removeCartItem(item.id))}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.actionButtonText, { color: colors.muted }]}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.muted }]}>Items</Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>{cartCount}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.muted }]}>Total</Text>
              <Text style={[styles.totalValue, { color: colors.primary }]}>${cartTotal.toFixed(2)}</Text>
            </View>
            <TouchableOpacity
              style={[styles.checkoutBtn, { backgroundColor: colors.primary }]}
              activeOpacity={0.7}
              onPress={proceedToCheckout}
            >
              <Text style={styles.checkoutText}>Proceed to checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  screenTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.extrabold,
  },
  clearText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  emptyTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
  },
  emptySubtitle: {
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    columnGap: theme.spacing.sm,
    rowGap: theme.spacing.xs,
    marginTop: theme.spacing.sm,
  },
  actionButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadow.none,
  },
  actionButtonPrimaryText: {
    color: '#fff',
    fontWeight: theme.fontWeight.bold,
  },
  actionButtonText: {
    fontWeight: theme.fontWeight.semibold,
  },
  summaryCard: {
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    ...theme.shadow.card,
    marginBottom: 32,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
  },
  summaryValue: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
  },
  totalValue: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.extrabold,
  },
  checkoutBtn: {
    marginTop: 12,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
  },
  checkoutText: {
    color: '#fff',
    fontWeight: theme.fontWeight.bold,
    fontSize: theme.fontSize.md,
  },
  cardWrapper: {
    marginBottom: theme.spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.xs,
  },
  quantityText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
  },
});











