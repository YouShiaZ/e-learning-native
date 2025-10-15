import React, { useEffect } from 'react';
import { View, ActivityIndicator, ScrollView } from 'react-native';
import theme from '../../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LogoutScreen({ navigation }) {
  useEffect(() => {
    (async () => {
      try { await AsyncStorage.removeItem('@elearning_auth_state'); } catch {}
      navigation.goBack();
    })();
  }, [navigation]);
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

