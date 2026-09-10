import React from 'react';
import type { ColorValue } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

type TabIconName = 'path' | 'chat' | 'evidence' | 'profile';

interface TabBarIconProps {
  name: TabIconName;
  color: ColorValue;
  size?: number;
}

/** Emoji yerine her platformda ayni gorunen, hafif ve metinsiz sekme ikonlari. */
export function TabBarIcon({ name, color, size = 23 }: TabBarIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      {name === 'path' ? (
        <>
          <Path d="M5 19c4.5 0 3-14 8-14 2.4 0 2.8 3.1 6 3.1" stroke={color} strokeWidth={2} strokeLinecap="round" />
          <Circle cx={5} cy={19} r={2} fill={color} />
          <Circle cx={19} cy={8.1} r={2} fill={color} />
        </>
      ) : null}
      {name === 'chat' ? (
        <Path d="M5.2 5.5h13.6v9.7H11l-4.4 3.3v-3.3H5.2V5.5Z" stroke={color} strokeWidth={2} strokeLinejoin="round" />
      ) : null}
      {name === 'evidence' ? (
        <>
          <Path d="M4.5 7.5h15v12h-15v-12Z" stroke={color} strokeWidth={2} strokeLinejoin="round" />
          <Path d="M8 7.5V5h8v2.5M8.5 13l2.1 2.1 4.9-5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </>
      ) : null}
      {name === 'profile' ? (
        <>
          <Circle cx={12} cy={8} r={3.5} stroke={color} strokeWidth={2} />
          <Path d="M5.5 19c.7-3.4 3-5.1 6.5-5.1s5.8 1.7 6.5 5.1" stroke={color} strokeWidth={2} strokeLinecap="round" />
        </>
      ) : null}
    </Svg>
  );
}
