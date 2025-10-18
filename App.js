import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Platform, I18nManager, ActivityIndicator, View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import QuickPrefsHeaderRight from './src/components/QuickPrefs';
import WelcomeHeaderRight from './src/components/WelcomeHeaderRight';
import AppHeader from './src/components/AppHeader';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import * as SplashScreen from 'expo-splash-screen';
import { useDispatch, useSelector } from 'react-redux';

if (Platform.OS !== 'web') {
  enableScreens(true);
}

// Keep splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import SearchResultsScreen from './src/screens/SearchResultsScreen';
import MyCoursesScreen from './src/screens/MyCoursesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import CourseDetailsScreen from './src/screens/CourseDetailsScreen';
import CoursePlayScreen from './src/screens/CoursePlayScreen';
import TeacherProfileScreen from './src/screens/TeacherProfileScreen';
import MessagesScreen from './src/screens/MessagesScreen';
import AdminCoursesScreen from './src/screens/admin/AdminCoursesScreen';
import CourseFormScreen from './src/screens/admin/CourseFormScreen';
import AdminUsersScreen from './src/screens/admin/AdminUsersScreen';
import AdminCategoriesScreen from './src/screens/admin/AdminCategoriesScreen';
import AdminSettingsScreen from './src/screens/admin/AdminSettingsScreen';
import AdminDashboard from './src/screens/AdminDashboard';
import AdminLiveScreen from './src/screens/admin/AdminLiveScreen';
import AdminScheduleScreen from './src/screens/admin/AdminScheduleScreen';
import LiveNowScreen from './src/screens/LiveNowScreen';
import ScheduleScreen from './src/screens/ScheduleScreen';
import TeachersScreen from './src/screens/TeachersScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import WishlistScreen from './src/screens/WishlistScreen';
import CartScreen from './src/screens/CartScreen';
import WelcomeScreen from './src/screens/auth/WelcomeScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import LogoutScreen from './src/screens/auth/LogoutScreen';

// Auth
import { loginSuccess, logout } from './src/store/userSlice';
import { loadCourses } from './src/store/slices/coursesSlice';
import { loadTeachers } from './src/store/slices/teachersSlice';

import theme from './src/theme';
import { t } from './src/i18n';
import { withStore } from './src/store';
// Auth removed: no user loading
import { setDarkMode, setLocaleUI, setPrimaryColor } from './src/store/uiSlice';
import { openDrawer } from './src/utils/nav';
import { loadUsersMap, loadSession } from './src/services/authStorage';

const Tab = createBottomTabNavigator();
const Stack = Platform.OS === 'web' ? createStackNavigator() : createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const colors = theme.colors;
  const isAuthenticated = useSelector((s) => s.user.isAuthenticated);
  const isAdmin = useSelector((s) => s.user.isAdmin);
  const user = useSelector((s) => s.user.user);
  const name = (user?.name && String(user.name).trim()) || 'Learner';

  return (
    <DrawerContentScrollView {...props}>
      <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <Text style={{ fontWeight: '800', fontSize: 16 }}>{t('hello_name', { name })} 👋</Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

// (Removed inline Login/Register/Logout screens to avoid duplicates; using screens from src/screens/auth)

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ header: (props) => <AppHeader {...props} /> }}>
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={({ navigation }) => ({
          title: 'Welcome',
          headerRight: () => <WelcomeHeaderRight navigation={navigation} />,
          headerLeft: () => null,
        })}
      />
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: t('login') }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ title: t('create_account') || 'Create Account' }} />
    </Stack.Navigator>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ header: (props) => <AppHeader {...props} /> }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} options={{ title: t('home') }} />
      <Stack.Screen name="CourseDetails" component={CourseDetailsScreen} options={{ title: t('course') }} />
      <Stack.Screen name="CoursePlay" component={CoursePlayScreen} options={{ title: t('course') }} />
      <Stack.Screen name="TeacherProfile" component={TeacherProfileScreen} options={{ title: t('teacher_profile') }} />
      <Stack.Screen name="Messages" component={MessagesScreen} options={{ title: t('messages') }} />
    </Stack.Navigator>
  );
}

function SearchStack() {
  return (
    <Stack.Navigator screenOptions={{ header: (props) => <AppHeader {...props} /> }}>
      <Stack.Screen name="SearchMain" component={SearchScreen} options={{ title: t('search') }} />
      <Stack.Screen name="SearchResults" component={SearchResultsScreen} options={{ title: t('search') }} />
      <Stack.Screen name="CourseDetails" component={CourseDetailsScreen} options={{ title: t('course') }} />
      <Stack.Screen name="CoursePlay" component={CoursePlayScreen} options={{ title: t('course') }} />
    </Stack.Navigator>
  );
}

function AdminStack() {
  return (
    <Stack.Navigator screenOptions={{ header: (props) => <AppHeader {...props} /> }}>
      <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{ title: t('admin') }} />
      <Stack.Screen name="AdminCourses" component={AdminCoursesScreen} options={{ title: t('admin') }} />
      <Stack.Screen name="AdminCourseForm" component={CourseFormScreen} options={{ title: t('course') }} />
      <Stack.Screen name="AdminUsers" component={AdminUsersScreen} options={{ title: t('admin') }} />
      <Stack.Screen name="AdminCategories" component={AdminCategoriesScreen} options={{ title: 'Categories' }} />
      <Stack.Screen name="AdminSettings" component={AdminSettingsScreen} options={{ title: 'Settings' }} />
      <Stack.Screen name="AdminLive" component={AdminLiveScreen} options={{ title: t('live_now') || 'Live Now' }} />
      <Stack.Screen name="AdminSchedule" component={AdminScheduleScreen} options={{ title: t('schedule') || 'Schedule' }} />
    </Stack.Navigator>
  );
}

function MessagesStack() {
  return (
    <Stack.Navigator screenOptions={{ header: (props) => <AppHeader {...props} /> }}>
      <Stack.Screen name="MessagesMain" component={MessagesScreen} options={{ title: t('messages') }} />
    </Stack.Navigator>
  );
}

function LiveStack() {
  return (
    <Stack.Navigator screenOptions={{ header: (props) => <AppHeader {...props} /> }}>
      <Stack.Screen name="LiveNowMain" component={LiveNowScreen} options={{ title: t('live_now') || 'Live Now' }} />
    </Stack.Navigator>
  );
}

function ScheduleStack() {
  return (
    <Stack.Navigator screenOptions={{ header: (props) => <AppHeader {...props} /> }}>
      <Stack.Screen name="ScheduleMain" component={ScheduleScreen} options={{ title: t('schedule') || 'Schedule' }} />
    </Stack.Navigator>
  );
}

function TeachersStack() {
  return (
    <Stack.Navigator screenOptions={{ header: (props) => <AppHeader {...props} /> }}>
      <Stack.Screen name="TeachersMain" component={TeachersScreen} options={{ title: 'Teachers' }} />
    </Stack.Navigator>
  );
}

function FavoritesStack() {
  return (
    <Stack.Navigator screenOptions={{ header: (props) => <AppHeader {...props} /> }}>
      <Stack.Screen
        name="FavoritesMain"
        component={FavoritesScreen}
        options={{ title: t('favorites') || 'Favorites' }}
      />
    </Stack.Navigator>
  );
}

function WishlistStack() {
  return (
    <Stack.Navigator screenOptions={{ header: (props) => <AppHeader {...props} /> }}>
      <Stack.Screen
        name="WishlistMain"
        component={WishlistScreen}
        options={{ title: t('wishlist') || 'Wishlist' }}
      />
    </Stack.Navigator>
  );
}

function CartStack() {
  return (
    <Stack.Navigator screenOptions={{ header: (props) => <AppHeader {...props} /> }}>
      <Stack.Screen
        name="CartMain"
        component={CartScreen}
        options={{ title: t('cart') || 'Cart' }}
      />
    </Stack.Navigator>
  );
}

// MessagesScreen is provided from src/screens/MessagesScreen

function DrawerNavigator() {
  const isAuthenticated = useSelector((s) => s.user?.isAuthenticated);
  const isAdmin = useSelector((s) => s.user?.isAdmin);
  return (
    <Drawer.Navigator
      initialRouteName={isAuthenticated ? 'HomeTabs' : 'WelcomeStack'}
      useLegacyImplementation={false}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: Platform.OS === 'web' ? 'front' : 'slide',
        drawerPosition: I18nManager.isRTL ? 'right' : 'left',
        drawerStyle: { width: Platform.OS === 'web' ? 320 : 280 },
        drawerContentStyle: { flex: 1, justifyContent: 'flex-start' },
        overlayColor: 'rgba(0,0,0,0.3)',
        swipeEnabled: Platform.OS !== 'web',
        lazy: false,
      }}
    >
      <Drawer.Screen name="HomeTabs" component={MainTabs} options={{ title: t('home') }} />
      <Drawer.Screen name="Messages" component={MessagesStack} options={{ title: t('messages') }} />
      <Drawer.Screen name="LiveNow" component={LiveStack} options={{ title: t('live_now') || 'Live Now' }} />
      <Drawer.Screen name="Schedule" component={ScheduleStack} options={{ title: t('schedule') || 'Schedule' }} />
      <Drawer.Screen name="Teachers" component={TeachersStack} options={{ title: 'Teachers' }} />
      <Drawer.Screen name="Favorites" component={FavoritesStack} options={{ title: t('favorites') || 'Favorites' }} />
      <Drawer.Screen name="Wishlist" component={WishlistStack} options={{ title: t('wishlist') || 'Wishlist' }} />
      <Drawer.Screen name="Cart" component={CartStack} options={{ title: t('cart') || 'Cart' }} />
      {!isAuthenticated ? (
        <Drawer.Screen name="WelcomeStack" component={AuthStack} options={{ title: 'Welcome' }} />
      ) : null}
      <Drawer.Screen
        name="AdminPanel"
        component={AdminStack}
        options={{
          title: t('admin'),
          drawerItemStyle: isAdmin ? undefined : { display: 'none' },
        }}
      />
      {isAuthenticated ? (
        <Drawer.Screen name="Logout" component={LogoutScreen} options={{ title: t('logout') }} />
      ) : null}
    </Drawer.Navigator>
  );
}

function MainTabs() {
  const isAdmin = useSelector((s) => s.user?.isAdmin);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.muted,
        tabBarStyle: { height: 58, paddingBottom: 6 },
        tabBarIcon: ({ color, size, focused }) => {
          const map = {
            Home: focused ? 'home' : 'home-outline',
            Search: focused ? 'search' : 'search-outline',
            MyCourses: focused ? 'book' : 'book-outline',
            Profile: focused ? 'person' : 'person-outline',
            Admin: focused ? 'settings' : 'settings-outline',
          };
          const name = map[route.name] || 'ellipse-outline';
          return <Ionicons name={name} color={color} size={size} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} options={{ tabBarLabel: t('home') }} />
      <Tab.Screen name="Search" component={SearchStack} options={{ tabBarLabel: t('search') }} />
      <Tab.Screen name="MyCourses" component={MyCoursesScreen} options={{ headerShown: false, tabBarLabel: t('my_courses') }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false, tabBarLabel: t('profile') }} />
      {isAdmin ? (
        <Tab.Screen name="Admin" component={AdminStack} options={{ headerShown: false, tabBarLabel: 'Admin' }} />
      ) : null}
    </Tab.Navigator>
  );
}

function AppContent() {
  const dispatch = useDispatch();
  const darkMode = useSelector((s) => s.ui.darkMode);
  const locale = useSelector((s) => s.ui.locale);
  const isAuthenticated = useSelector((s) => s.user.isAuthenticated);
  const isGuest = useSelector((s) => s.user.isGuest);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await loadUsersMap();
        // Load UI preferences (dark mode + locale)
        try {
          const dark = await AsyncStorage.getItem('@elearning_dark_mode');
          if (dark != null) dispatch(setDarkMode(JSON.parse(dark)));
          const lc = await AsyncStorage.getItem('@elearning_locale');
          if (lc) {
            dispatch(setLocaleUI(lc));
            try { require('./src/i18n').setLocale(lc); } catch {}
          }
        } catch {}
        try {
          const uc = await AsyncStorage.getItem('@elearning_user_primary_color');
          if (uc) dispatch(setPrimaryColor(uc));
        } catch {}
        try {
          const storedUser = await loadSession();
          if (storedUser) {
            dispatch(loginSuccess(storedUser));
          }
        } catch {}
        dispatch(loadCourses());
        dispatch(loadTeachers());
      } catch (error) {
        // ignore initialization errors
      } finally {
        setIsInitializing(false);
        SplashScreen.hideAsync();
      }
    };

    initializeApp();
  }, [dispatch]);

  const navTheme = darkMode ? DarkTheme : {
    ...DefaultTheme,
    colors: { ...DefaultTheme.colors, background: theme.colors.background },
  };

  if (isInitializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: darkMode ? '#111' : theme.colors.background }}>
      <NavigationContainer theme={navTheme} key={locale || 'en'}>
        <StatusBar style={darkMode ? 'light' : 'dark'} />
        <DrawerNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

function App() {
  return <AppContent />;
}

export default withStore(App);


