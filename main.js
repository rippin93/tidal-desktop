var nativefier = require('nativefier').default;
var fs = require('fs');
var colors=require('colors');
// we use nativefier, and just inject code, because that's all we need really

var options = {
    name: 'TIDAL',
    targetUrl: 'https://listen.tidal.com', // required
    out: 'build/',
    asar: false, // we don't need to package our code in an archive
    icon: './icon.png',
    bounce: false,
    width: 1280,
    height: 800,
    showMenuBar: false,
    fastQuit: false,
    honest: false,
    conceal: false,
    zoom: 1.0,
    singleInstance: true,
    clearCache: false,
    tray: true,
    verbose: true,
    electronVersion: "5.0.11-wvvmp",
    inject: ["./custom.js"],
    globalShortcuts: "shortcuts.json",
};

nativefier(options, function(error, appPath) {
    if (error) {
        console.log(error.red);
        return;
    }
    // we now need to ensure that nativefier.json is set right (sometimes the name option doesn't pass correctly)
    var rawdata = fs.readFileSync(appPath+'/resources/app/nativefier.json');  
    var packageData = JSON.parse(rawdata);
    packageData.name = "TIDAL";
    // parts of our README ask people to change this file, so indenting it is polite
    var to_write = JSON.stringify(packageData, null, 4); 
    fs.writeFile(appPath+'/resources/app/nativefier.json', to_write, function(error) {
        if(error) throw error;
    });
    console.log(("TIDAL is ready to start. cd to \""+appPath+"\", and run ./tidal").bold.green);
});
