
function getCurrentTimeStamp() {
	var currentTimeStamp = Date.now();
    //console.log(currentTimeStamp);
    return currentTimeStamp;
}

function getHashParams() {
  var hashParams = {};
  var e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
  while ( e = r.exec(q)) {
     hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}

function millisToMinSecs(millis) {
  var millisOutput = (millis % 1000);
  var minutes = Math.floor(millis / 60000) % 3600;
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  var hours = Math.floor((millis % 60000) / 3600) % 24;
  return (hours < 10 ? '0' : '') + hours + ":" + (minutes < 10 ? '0' : '') + minutes + ":" + (seconds < 10 ? '0' : '') + seconds + ":" + (millisOutput < 10 ? '0' : '') + millisOutput;
}

function timestampTranslation(millis) {
  var date = new Date(millis);
  return (date.getHours() < 10 ? '0' : '') + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() + ":" + (date.getSeconds() < 10 ? '0' : '') + date.getSeconds() + ":" + (date.getMilliseconds() < 10 ? '0' : '') + date.getMilliseconds();
}

function timeSinceTokenUpdate (timestampBigger,timestampSmaller) {
  var difference = timestampBigger - timestampSmaller;
  return difference;
}
// saving id of playlist//storing in DB//fetching from DB// If playlist with A "x name" is stored in DB, dont create new playlist