// App.js
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Platform, ActivityIndicator, View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import * as SplashScreen from 'expo-splash-screen';
import { useDispatch, useSelector } from 'react-redux';

import QuickPrefsHeaderRight from './src/components/QuickPrefs';
import WelcomeHeaderRight from './src/components/WelcomeHeaderRight';

if (Platform.OS !== 'web') {
  enableScreens(true);
}

// Keep splash visible during hydration
SplashScreen.preventAutoHideAsync().catch(() => {});

// ---------------------- Screens ----------------------
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import SearchResultsScreen from './src/screens/SearchResultsScreen';
import MyCoursesScreen from './src/screens/MyCoursesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import CourseDetailsScreen from './src/screens/CourseDetailsScreen';
import CoursePlayScreen from './src/screens/CoursePlayScreen';
import TeacherProfileScreen from './src/screens/TeacherProfileScreen';
import MessagesScreen from './src/screens/MessagesScreen';

// Admin
import AdminCoursesScreen from './src/screens/admin/AdminCoursesScreen';
import CourseFormScreen from './src/screens/admin/CourseFormScreen';
import AdminUsersScreen from './src/screens/admin/AdminUsersScreen';
import AdminCategoriesScreen from './src/screens/admin/AdminCategoriesScreen';
import AdminSettingsScreen from './src/screens/admin/AdminSettingsScreen';
import AdminDashboardScreen from './src/screens/admin/AdminDashboardScreen';

// Auth (from src/screens/auth)
import WelcomeScreen from './src/screens/auth/WelcomeScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import LogoutScreen from './src/screens/auth/LogoutScreen';

// Redux & Theme
import { loginSuccess, continueAsGuest } from './src/store/userSlice';
import theme from './src/theme';
import { t } from './src/i18n';
import { withStore } from './src/store';
import { setDarkMode, setLocaleUI, setPrimaryColor } from './src/store/uiSlice';
import { openDrawer } from './src/utils/nav';

// ---------------------- Navigators ----------------------
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const user = useSelector((s) => s.user.user);
  const name = (user?.name && String(user.name).trim()) || 'Learner';
  // Fallback greeting to avoid missing i18n key crashes
  const greeting = (() => {
    try {
      const txt = t('hello_name', { name });
      if (typeof txt === 'string' && txt.trim()) return `${txt} 👋`;
    } catch {}
    return `Hello, ${name} 👋`;
  })();

  return (
    <DrawerContentScrollView {...props}>
      <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <Text style={{ fontWeight: '800', fontSize: 16 }}>{greeting}</Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

// ---------------------- Auth Stack ----------------------
function AuthStack() {
  const StackAuth = createNativeStackNavigator();
  return (
    <StackAuth.Navigator
      screenOptions={({ navigation }) => ({
        headerShown: true,
        headerStyle: { backgroundColor: theme.colors.primary },
        headerTintColor: '#fff',
        headerTitleStyle: { color: '#fff', fontWeight: '700' },
        headerRight: () => <QuickPrefsHeaderRight />,
        headerLeft: () => (
          <TouchableOpacity onPress={() => openDrawer(navigation)} style={{ marginLeft: 12 }}>
            <Ionicons name="menu" size={22} color="#fff" />
          </TouchableOpacity>
        ),
      })}
    >
      <StackAuth.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={({ navigation }) => ({
          title: 'Welcome',
          headerRight: () => <WelcomeHeaderRight navigation={navigation} />,
          headerLeft: () => null,
        })}
      />
      <StackAuth.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <StackAuth.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
    </StackAuth.Navigator>
  );
}

// ---------------------- Home Stack ----------------------
function HomeStack() {
  const StackHome = createNativeStackNavigator();
  return (
    <StackHome.Navigator
      screenOptions={({ navigation }) => ({
        headerShown: true,
        headerStyle: { backgroundColor: theme.colors.primary },
        headerTintColor: '#fff',
        headerTitleStyle: { color: '#fff', fontWeight: '700' },
        headerRight: () => <QuickPrefsHeaderRight />,
        headerLeft: () => (
          <TouchableOpacity onPress={() => openDrawer(navigation)} style={{ marginLeft: 12 }}>
            <Ionicons name="menu" size={22} color="#fff" />
          </TouchableOpacity>
        ),
      })}
    >
      <StackHome.Screen name="HomeMain" component={HomeScreen} options={{ headerShown: false }} />
      <StackHome.Screen name="CourseDetails" component={CourseDetailsScreen} options={{ headerShown: false }} />
      <StackHome.Screen name="CoursePlay" component={CoursePlayScreen} options={{ headerShown: false }} />
      <StackHome.Screen name="TeacherProfile" component={TeacherProfileScreen} options={{ headerShown: false }} />
      <StackHome.Screen name="Messages" component={MessagesScreen} options={{ title: t('messages') }} />
    </StackHome.Navigator>
  );
}

// ---------------------- Search Stack ----------------------
function SearchStack() {
  const StackSearch = createNativeStackNavigator();
  return (
    <StackSearch.Navigator
      screenOptions={({ navigation }) => ({
        headerShown: true,
        headerStyle: { backgroundColor: theme.colors.primary },
        headerTintColor: '#fff',
        headerTitleStyle: { color: '#fff', fontWeight: '700' },
        headerRight: () => <QuickPrefsHeaderRight />,
        headerLeft: () => (
          <TouchableOpacity onPress={() => openDrawer(navigation)} style={{ marginLeft: 12 }}>
            <Ionicons name="menu" size={22} color="#fff" />
          </TouchableOpacity>
        ),
      })}
    >
      <StackSearch.Screen name="SearchMain" component={SearchScreen} />
      <StackSearch.Screen name="SearchResults" component={SearchResultsScreen} options={{ title: t('search') }} />
      <StackSearch.Screen name="CourseDetails" component={CourseDetailsScreen} options={{ headerShown: false }} />
      <StackSearch.Screen name="CoursePlay" component={CoursePlayScreen} options={{ headerShown: false }} />
    </StackSearch.Navigator>
  );
}

// ---------------------- Admin Stack ----------------------
function AdminStack() {
  const StackAdmin = createNativeStackNavigator();
  return (
    <StackAdmin.Navigator screenOptions={{ headerShown: false }}>
      <StackAdmin.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <StackAdmin.Screen name="AdminCourses" component={AdminCoursesScreen} />
      <StackAdmin.Screen name="AdminCourseForm" component={CourseFormScreen} />
      <StackAdmin.Screen name="AdminUsers" component={AdminUsersScreen} />
      <StackAdmin.Screen name="AdminCategories" component={AdminCategoriesScreen} />
      <StackAdmin.Screen name="AdminSettings" component={AdminSettingsScreen} />
    </StackAdmin.Navigator>
  );
}

// ---------------------- Main Tabs ----------------------
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
      <Tab.Screen name="MyCourses" component={MyCoursesScreen} options={{ tabBarLabel: t('my_courses') }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: t('profile') }} />
      {isAdmin ? <Tab.Screen name="Admin" component={AdminStack} options={{ tabBarLabel: 'Admin' }} /> : null}
    </Tab.Navigator>
  );
}

// ---------------------- Drawer ----------------------
function DrawerNavigator() {
  const isAuthenticated = useSelector((s) => s.user.isAuthenticated);
  const isAdmin = useSelector((s) => s.user.isAdmin);
  return (
    <Drawer.Navigator
      initialRouteName={isAuthenticated ? 'HomeTabs' : 'WelcomeStack'}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: Platform.OS === 'web' ? 'front' : 'slide',
        swipeEnabled: Platform.OS !== 'web',
        lazy: false,
      }}
    >
      <Drawer.Screen name="HomeTabs" component={MainTabs} options={{ title: t('home') }} />
      {!isAuthenticated ? (
        <Drawer.Screen name="WelcomeStack" component={AuthStack} options={{ title: 'Welcome' }} />
      ) : null}
      {isAdmin ? (
        <Drawer.Screen name="AdminPanel" component={AdminStack} options={{ title: t('admin') }} />
      ) : null}
      {isAuthenticated ? (
        <Drawer.Screen name="Logout" component={LogoutScreen} options={{ title: t('logout') }} />
      ) : null}
    </Drawer.Navigator>
  );
}

// ---------------------- AppContent ----------------------
function AppContent() {
  const dispatch = useDispatch();
  const darkMode = useSelector((s) => s.ui.darkMode);
  const locale = useSelector((s) => s.ui.locale);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Load UI prefs
        try {
          const dark = await AsyncStorage.getItem('@elearning_dark_mode');
          if (dark != null) dispatch(setDarkMode(JSON.parse(dark)));
        } catch {}
        try {
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

        // Load user/guest session
        try {
          const raw = await AsyncStorage.getItem('@elearning_auth_state');
          if (raw) {
            const obj = JSON.parse(raw);
            if (obj?.user) dispatch(loginSuccess(obj.user));
            else if (obj?.isGuest) dispatch(continueAsGuest());
          }
        } catch {}
      } finally {
        setIsInitializing(false);
        SplashScreen.hideAsync().catch(() => {});
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
