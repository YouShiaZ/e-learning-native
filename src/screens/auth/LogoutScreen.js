import React, { useEffect } from 'react';
import { ActivityIndicator, ScrollView } from 'react-native';
import theme from '../../theme';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/userSlice';
import { clearSession } from '../../services/authStorage';

export default function LogoutScreen({ navigation }) {
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      await clearSession();
      dispatch(logout());
      const rootNav = navigation.getParent?.() || navigation;
      rootNav.reset({ index: 0, routes: [{ name: 'WelcomeStack' }] });
    })();
  }, [dispatch, navigation]);
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
      showsVerticalScrollIndicator={false}
    >
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </ScrollView>
  );
}
