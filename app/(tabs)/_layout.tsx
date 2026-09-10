import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components';
import { colors } from '@/theme';

/** Alt navigasyon: Yol, Konus, Kanitlar, Profil (README bolum 12). */
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.onSurfaceFaint,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '700' },
      }}
    >
      <Tabs.Screen
        name="path"
        options={{ title: 'Yol', tabBarIcon: ({ color }) => <TabBarIcon name="path" color={color} /> }}
      />
      <Tabs.Screen
        name="chat"
        options={{ title: 'Konuş', tabBarIcon: ({ color }) => <TabBarIcon name="chat" color={color} /> }}
      />
      <Tabs.Screen
        name="evidence"
        options={{ title: 'Kanıtlar', tabBarIcon: ({ color }) => <TabBarIcon name="evidence" color={color} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profil', tabBarIcon: ({ color }) => <TabBarIcon name="profile" color={color} /> }}
      />
    </Tabs>
  );
}
