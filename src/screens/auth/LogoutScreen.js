import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout } from '../../store/userSlice';
import theme from '../../theme';

export default function LogoutScreen({ navigation }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const run = async () => {
      try {
        dispatch(logout());
        await AsyncStorage.removeItem('@elearning_auth_state');
        navigation.reset({ index: 0, routes: [{ name: 'WelcomeStack' }] });
      } catch (e) {
        console.log('Logout error:', e);
      }
    };
    run();
  }, [dispatch, navigation]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
      }}
    >
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
}
