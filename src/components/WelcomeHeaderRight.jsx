import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { continueAsGuest } from '../store/userSlice';
import QuickPrefsHeaderRight from './QuickPrefs';
import { t } from '../i18n';

export default function WelcomeHeaderRight({ navigation }) {
  const dispatch = useDispatch();

  const onGuest = async () => {
    dispatch(continueAsGuest());
    try { await AsyncStorage.setItem('@elearning_auth_state', JSON.stringify({ isGuest: true })); } catch {}
    try { navigation.reset({ index: 0, routes: [{ name: 'HomeTabs' }] }); } catch {}
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <QuickPrefsHeaderRight tint="light" />
      <TouchableOpacity onPress={onGuest} activeOpacity={0.8} style={{ marginLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
        <Ionicons name="play-skip-forward" size={20} color={'#fff'} />
        <Text style={{ color: '#fff', fontWeight: '700', marginLeft: 6 }}>
          {t('continue_as_guest') || 'Guest'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
