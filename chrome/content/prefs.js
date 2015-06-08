function loadPrefs(e)
{
  var prefs = Components.classes["@mozilla.org/preferences-service;1"]
    .getService(Components.interfaces.nsIPrefBranch);

  // load tab preview size selection (default to percent)
  try {
    document.getElementById("SizePreview").value = prefs.getIntPref("tabpreview.SizePreview");
  }
  catch(ex) {
    document.getElementById("SizePreview").value = 2;
  }

  // load tab preview percent size (default to 40%)
  try {
    document.getElementById("PreviewPercent").value = prefs.getIntPref("tabpreview.PreviewPercent");
  }
  catch(ex) {
    document.getElementById("PreviewPercent").value = 40;
  }

  // load tab preview pixel size (default to 200)
  try {
    document.getElementById("PreviewPixel").value = prefs.getIntPref("tabpreview.PreviewPixel");
  }
  catch(ex) {
    document.getElementById("PreviewPixel").value = 200;
  }

  // load tab preview delay setting (default to OFF)
  try {
    document.getElementById("DelayPreview").checked = prefs.getBoolPref("tabpreview.DelayPreview");
  }
  catch(ex) {
    document.getElementById("DelayPreview").checked = false;
  }

  // load tab preview delay time (default to .5 seconds)
  try {
    document.getElementById("PreviewDelay").value = prefs.getIntPref("tabpreview.PreviewDelay");
  }
  catch(ex) {
    document.getElementById("PreviewDelay").value = 500;
  }

  // load tab preview scrolling position (default to using scrolled position)
  try {
    document.getElementById("ScrollingPreview").value = prefs.getIntPref("tabpreview.ScrollingPreview");
  }
  catch(ex) {
    document.getElementById("ScrollingPreview").value = 1;
  }
}

function savePrefs(e)
{
  
  try {
    var prefs = Components.classes["@mozilla.org/preferences-service;1"]
      .getService(Components.interfaces.nsIPrefBranch);
    prefs.setIntPref("tabpreview.SizePreview",document.getElementById("SizePreview").value);
    prefs.setIntPref("tabpreview.PreviewPercent",document.getElementById("PreviewPercent").value);
    prefs.setIntPref("tabpreview.PreviewPixel",document.getElementById("PreviewPixel").value);
    prefs.setBoolPref("tabpreview.DelayPreview",document.getElementById("DelayPreview").checked);
    prefs.setIntPref("tabpreview.PreviewDelay",document.getElementById("PreviewDelay").value);
    prefs.setIntPref("tabpreview.ScrollingPreview",document.getElementById("ScrollingPreview").value);
  }
  catch(ex) { dump(ex + "\n"); }
}
