import {buildNativefierApp} from 'nativefier';
import colors from 'colors/safe.js';

// we use nativefier, and just inject code, because that's all we need really
const options = {
  name: 'TIDAL',
  targetUrl: 'https://listen.tidal.com', // required
  out: 'build/',
  icon: './icon.png',
  bounce: false,
  width: 1920,
  height: 1080,
  showMenuBar: false,
  fastQuit: false,
  honest: false,
  conceal: false,
  zoom: 1.0,
  singleInstance: true,
  clearCache: false,
  tray: true,
  verbose: true,
  electronVersion: "13.1.4",
  inject: ["./custom.js"],
  globalShortcuts: "shortcuts.json",
  widevine: true,
};

buildNativefierApp(options).then((appPath) => {
  console.log(colors.bold(colors.green('TIDAL is ready to start. cd to "'+appPath+'", and run ./TIDAL')));
}).catch((error) => {
  console.log(colors.red(error));
});
