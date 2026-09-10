module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Worklets eklentisi Reanimated 4'te en sonda olmalıdır.
      'react-native-worklets/plugin',
    ],
  };
};
