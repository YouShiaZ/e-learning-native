import { StyleSheet, Platform } from 'react-native';
import theme from '../theme';

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 120,
  },
  coverContainer: {
    position: 'relative',
    width: '100%',
    height: 280,
  },
  cover: { 
    width: '100%', 
    height: '100%',
  },
  coverGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: theme.spacing.base,
    width: 40,
    height: 40,
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookmarkButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    right: theme.spacing.base,
    width: 40,
    height: 40,
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCard: {
    backgroundColor: theme.colors.card,
    marginTop: -theme.spacing.xxl,
    marginHorizontal: theme.spacing.base,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    ...theme.shadow.lg,
  },
  title: { 
    fontSize: theme.fontSize.xl, 
    fontWeight: theme.fontWeight.extrabold, 
    color: theme.colors.text,
    lineHeight: 28,
  },
  author: { 
    color: theme.colors.muted, 
    marginTop: theme.spacing.xs,
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.medium,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.base,
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  metaText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginStart: 4,
  },
  metaSubtext: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.muted,
    marginStart: 2,
  },
  metaDivider: {
    width: 1,
    height: 20,
    backgroundColor: theme.colors.border,
    marginHorizontal: theme.spacing.sm,
  },
  tabsContainer: {
    marginTop: theme.spacing.base,
  },
  contentContainer: {
    padding: theme.spacing.base,
  },
  
  // Teacher Card
  teacherCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    padding: theme.spacing.base,
    borderRadius: theme.radius.lg,
    marginBottom: theme.spacing.base,
    ...theme.shadow.card,
  },
  teacherAvatar: { 
    width: 60, 
    height: 60, 
    borderRadius: theme.radius.full,
    borderWidth: 3,
    borderColor: theme.colors.primary,
  },
  teacherInfo: {
    flex: 1,
    marginStart: theme.spacing.md,
  },
  teacherName: { 
    fontWeight: theme.fontWeight.bold, 
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
  },
  teacherRole: { 
    color: theme.colors.muted, 
    marginTop: 2,
    fontSize: theme.fontSize.sm,
  },
  teacherStats: {
    flexDirection: 'row',
    marginTop: theme.spacing.xs,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginEnd: theme.spacing.md,
  },
  statText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.muted,
    marginStart: 4,
  },
  followBtn: { 
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    ...theme.shadow.sm,
  },
  followText: { 
    color: '#fff', 
    fontWeight: theme.fontWeight.bold,
    fontSize: theme.fontSize.sm,
  },
  
  // Sections
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: { 
    fontWeight: theme.fontWeight.bold, 
    color: theme.colors.text,
    fontSize: theme.fontSize.lg,
    marginBottom: theme.spacing.md,
  },
  desc: { 
    color: theme.colors.textSecondary,
    lineHeight: 24,
    fontSize: theme.fontSize.base,
  },
  
  // Benefits
  benefitsGrid: {
    gap: theme.spacing.md,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
  },
  benefitIcon: {
    width: 24,
    height: 24,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginEnd: theme.spacing.sm,
  },
  benefitText: { 
    flex: 1,
    color: theme.colors.text,
    fontSize: theme.fontSize.base,
    lineHeight: 20,
  },
  
  // Similar Courses
  similarCoursesScroll: {
    paddingVertical: theme.spacing.sm,
  },
  
  // Lessons
  lessonBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.radius.sm,
  },
  freeBadge: {
    backgroundColor: theme.colors.successLight,
  },
  lessonBadgeText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.muted,
    marginLeft: 4,
    fontWeight: theme.fontWeight.medium,
  },
  freeBadgeText: {
    color: theme.colors.success,
  },
  
  // Reviews
  ratingSummary: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    marginBottom: theme.spacing.base,
    ...theme.shadow.card,
  },
  ratingLeft: {
    alignItems: 'center',
    paddingEnd: theme.spacing.lg,
    borderEndWidth: 1,
    borderEndColor: theme.colors.border,
  },
  ratingValue: { 
    fontSize: theme.fontSize.display, 
    fontWeight: theme.fontWeight.extrabold, 
    color: theme.colors.text,
  },
  ratingCount: { 
    color: theme.colors.muted,
    marginTop: theme.spacing.xs,
    fontSize: theme.fontSize.sm,
  },
  ratingBars: {
    flex: 1,
    paddingStart: theme.spacing.lg,
    justifyContent: 'center',
  },
  ratingBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  starLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    width: 12,
    fontWeight: theme.fontWeight.medium,
  },
  ratingBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.full,
    marginStart: theme.spacing.xs,
    overflow: 'hidden',
  },
  ratingBarFill: {
    height: '100%',
    backgroundColor: theme.colors.star,
    borderRadius: theme.radius.full,
  },
  reviewCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.base,
    marginBottom: theme.spacing.md,
    ...theme.shadow.card,
  },
  reviewHeader: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
  },
  reviewAvatar: { 
    width: 44, 
    height: 44, 
    borderRadius: theme.radius.full,
  },
  reviewHeaderInfo: {
    flex: 1,
    marginStart: theme.spacing.md,
  },
  reviewName: { 
    fontWeight: theme.fontWeight.bold, 
    color: theme.colors.text,
    fontSize: theme.fontSize.base,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  reviewDate: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.muted,
    marginStart: theme.spacing.sm,
  },
  reviewText: { 
    color: theme.colors.textSecondary,
    lineHeight: 20,
    fontSize: theme.fontSize.base,
  },
  
  // Bottom Bar
  bottomBarGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: theme.spacing.xl,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.base,
    backgroundColor: theme.colors.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
    ...theme.shadow.lg,
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.muted,
    fontWeight: theme.fontWeight.medium,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  price: { 
    fontWeight: theme.fontWeight.extrabold, 
    color: theme.colors.primary, 
    fontSize: theme.fontSize.xxl,
  },
  discount: { 
    color: theme.colors.muted, 
    textDecorationLine: 'line-through',
    marginStart: theme.spacing.sm,
    fontSize: theme.fontSize.base,
  },
});
