const console = require('console');

const logger = new console.Console(process.stdout, process.stderr);

let options = { "enable_notifications" : true };

function log(...data) {
  logger.log(...data);
  document.getElementById("log").innerHTML = document.getElementById("log").innerHTML + "\n" + data.join("\n");
}

function filterButtons(dataTestTag, method) {
  // tidal has all it's playback buttons (apart from pause) begin with this
  for (let button of document.querySelectorAll("[class^=whiteIconButton]")) {
    // tidal stores the purpose of a button in the data-test attribute
    if (button.attributes['data-test'].value === dataTestTag) {
      try {
        button[method]();
      } catch (e) {
        console.error(`${e.name}: ${e.message}`);
      }
    }
  }

  return null; // only happens if we don't find a button
}

function previousMedia() {
  if (window.lastKeyLast === undefined || Date.now() - window.lastKeyLast > 200) {
    filterButtons("previous", "click"); // filterButtons returns a dom object of the button we want to click
    window.lastKeyLast = Date.now();
  }
}

function nextMedia() {
  if (window.nextKeyLast === undefined || Date.now() - window.nextKeyLast > 200) {
    filterButtons("next", "click");
    window.nextKeyLast = Date.now();
  }
}

function isPlaying() {
  return !!document.querySelector('[data-test="pause"]');
}

function pauseMedia() {
  if (window.pauseKeyLast === undefined || Date.now() - window.pauseKeyLast > 200) {
    log("MusicPaused");
    document.querySelectorAll("[class^=playbackToggle]")[0].click(); // the pause button is weird, hence the custom filter here
    window.pauseKeyLast = Date.now();
  } else {
    log("RateLimit");
  }
}

function keyDownTextField(e) {
  let keyCode = e.keyCode;
  let actualKey = String.fromCharCode(keyCode);
  let evtObj = window.event ? event : e;

  if (actualKey === " " && evtObj.shiftKey) {
    // pauseMedia();
    // you can uncomment this if for some reason TIDAL doesn't handle it by itself
  } else if (actualKey === "%" && evtObj.ctrlKey) { // control-left gets inputted as ctrl-% to our interface
    previousMedia();
  } else if (actualKey === "'" && evtObj.ctrlKey) { // control-right gets inputted as ctrl-' to our interface
    nextMedia();
  }
}

function getMediaInformation(callback) {
  // we have two footers, both are the same, just the first is the one in the default view
  let toReturn = { "title" : "Unknown", "artist" : "Unknown", "playing_from" : "Unknown" };
  let footer = document.getElementById("footerPlayer") || document.querySelector("[class^=footerPlayer]");
  try {
    if (!footer) {
      return toReturn;
    }

    const titleElement = footer.querySelector('[data-test*="track-title"]');
    const artistElement = footer.querySelector('[data-test*="title-artist"]');

    if (!titleElement || !artistElement) {
      return toReturn;
    }

    toReturn.title = titleElement.textContent;
    toReturn.artist = artistElement.textContent;

    return toReturn;
  } catch (err) {
    log(err);
    // this happens if for some reason the footer isn't present
    if (typeof callback !== 'function') callback = getMediaInformation;
    setTimeout(function() {
      callback();
    }, 1000);
    return toReturn;
  }
}

function checkMediaNotification() {
  if (window.previousState === undefined) {
    window.previousState = getMediaInformation(checkMediaNotification);
    if (window.previousState === undefined) {
      // we're still having issues getting track information (hidden footer?)
      // nothing we can really do, so give up?
      return;
    }
  }

  let currentState = getMediaInformation();

  if (currentState.title !== window.previousState.title) { // song change has occurred
    if (isPlaying()) { // we don't want to send a notification if our user isn't listening
      new Notification(currentState.title, {
        body : currentState.artist
      });
    }
  }
  window.previousState = currentState;
}

function main() {
  let iDiv = document.createElement('div');
  iDiv.id = 'log'; // We can't use console.log with injected code
  iDiv.style = "display: none;";
  iDiv.className = 'block';
  document.getElementsByTagName('body')[0].appendChild(iDiv);
  document.addEventListener("keydown", keyDownTextField, false);

  if (options.enable_notifications) {
    Notification.requestPermission().then((value) => {
      if (value === 'default' || value === 'granted') {
        setInterval(checkMediaNotification, 1000);
      }
    });
  }

  log("Running");
}

main();
