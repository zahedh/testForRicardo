const plugins = [
  // This needs to be the last plugin
  'react-native-worklets/plugin',
];

module.exports = function (api) {
  api.cache(true);

  // Gonna deal with this later
  // if (
  //   process.env.NX_TASK_TARGET_TARGET === "build" ||
  //   process.env.NX_TASK_TARGET_TARGET?.includes("storybook")
  // ) {
  //   return {
  //     presets: [
  //       [
  //         "@nx/react/babel",
  //         {
  //           runtime: "automatic",
  //         },
  //       ],
  //     ],
  //     plugins,
  //   };
  // }

  return {
    presets: [
      [
        'babel-preset-expo',
        {useTransformReactJSX: true, jsxImportSource: 'nativewind'},
      ],
    ],
    plugins,
  };
};
