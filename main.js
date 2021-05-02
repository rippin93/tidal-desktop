const nativefier = require('nativefier').default;
const fs = require('fs');
const colors = require('colors/safe');

// we use nativefier, and just inject code, because that's all we need really
const options = {
    name: 'TIDAL',
    targetUrl: 'https://listen.tidal.com', // required
    out: 'build/',
    asar: false, // we don't need to package our code in an archive
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
    electronVersion: "12.0.6-wvvmp",
    inject: ["./custom.js"],
    globalShortcuts: "shortcuts.json",
};

nativefier(options, function(error, appPath) {
    if (error) {
        console.log(colors.red(error));
        return;
    }

    // we now need to ensure that nativefier.json is set right (sometimes the name option doesn't pass correctly)
    const rawData = fs.readFileSync(appPath+'/resources/app/nativefier.json').toString();
    const packageData = JSON.parse(rawData);
    packageData.name = "TIDAL";
    // parts of our README ask people to change this file, so indenting it is polite
    const data = JSON.stringify(packageData, null, 4);
    fs.writeFile(appPath+'/resources/app/nativefier.json', data, function(error) {
        if(error) throw error;
    });
    console.log(colors.bold(colors.green('TIDAL is ready to start. cd to "'+appPath+'", and run ./tidal')));
});
