var TabPreview = {
  currentTab: null,
  SizePreview: 2,
  PreviewPercent: 40,
  PreviewPixel: 200,
  DelayPreview: false,
  PreviewDelay: 500,
  ScrollingPreview: 1,
  PreviewTimeout: null,

  onLoad: function() {
    // initialization code
    var b = getBrowser();
    b.tabContainer.addEventListener("mousemove", this.mouseMove, false);
    b.tabContainer.addEventListener("mouseout", this.hidePreview, false);
    b.tabContainer.addEventListener("mousedown", this.hidePreview, false);
    window.addEventListener("unload", this.onUnload, false);

    // hide tooltips on tabbrowser tabs.  this is so ghetto.
var anon = document.getAnonymousElementByAttribute(b, 'class', 'tabbrowser-strip');
    if(anon)
      anon.tooltip = "";
    
    // check our prefs, and register observers
    var prefs = Components.classes["@mozilla.org/preferences-service;1"]
      .getService(Components.interfaces.nsIPrefBranch);
    var pbi = prefs.QueryInterface(Components.interfaces.nsIPrefBranchInternal);
    
    if (prefs.getPrefType("tabpreview.SizePreview") == prefs.PREF_INT)
      this.SizePreview = this.getIntPref(prefs, "tabpreview.SizePreview");
    
    if (prefs.getPrefType("tabpreview.PreviewPercent") == prefs.PREF_INT)
      this.PreviewPercent = this.getIntPref(prefs, "tabpreview.PreviewPercent");
    
    if (prefs.getPrefType("tabpreview.PreviewPixel") == prefs.PREF_INT)
      this.PreviewPixel = this.getIntPref(prefs, "tabpreview.PreviewPixel");
    
    if (prefs.getPrefType("tabpreview.DelayPreview") == prefs.PREF_BOOL)
      this.DelayPreview = this.getBoolPref(prefs, "tabpreview.DelayPreview");
    
    if (prefs.getPrefType("tabpreview.PreviewDelay") == prefs.PREF_INT)
      this.PreviewDelay = this.getIntPref(prefs, "tabpreview.PreviewDelay");
    
    if (prefs.getPrefType("tabpreview.ScrollingPreview") == prefs.PREF_INT)
      this.ScrollingPreview = this.getIntPref(prefs, "tabpreview.ScrollingPreview");
    
    pbi.addObserver("tabpreview.SizePreview", TabPreview, false);
    pbi.addObserver("tabpreview.PreviewPercent", TabPreview, false);
    pbi.addObserver("tabpreview.PreviewPixel", TabPreview, false);
    pbi.addObserver("tabpreview.DelayPreview", TabPreview, false);
    pbi.addObserver("tabpreview.PreviewDelay", TabPreview, false);
    pbi.addObserver("tabpreview.ScrollingPreview", TabPreview, false);

  },

  onUnload: function() {
    this.currentTab = null;
    var b = getBrowser();
    b.tabContainer.removeEventListener("mousemove", this.mouseMove, false);
    b.tabContainer.removeEventListener("mouseout", this.hidePreview, false);
    b.tabContainer.removeEventListener("mousedown", this.hidePreview, false);
    
    // remove pref observers
    var prefs = Components.classes["@mozilla.org/preferences-service;1"]
      .getService(Components.interfaces.nsIPrefBranch);
    var pbi = prefs.QueryInterface(Components.interfaces.nsIPrefBranchInternal); 
    
    pbi.removeObserver("tabpreview.SizePreview", TabPreview, false);
    pbi.removeObserver("tabpreview.PreviewPercent", TabPreview, false);
    pbi.removeObserver("tabpreview.PreviewPixel", TabPreview, false);
    pbi.removeObserver("tabpreview.DelayPreview", TabPreview, false);
    pbi.removeObserver("tabpreview.PreviewDelay", TabPreview, false);
    pbi.removeObserver("tabpreview.ScrollingPreview", TabPreview, false);
  },

  // pref branch observers
  observe: function(subject, topic, data) {
    var prefs = Components.classes["@mozilla.org/preferences-service;1"]
        .getService(Components.interfaces.nsIPrefBranch);
    if(data == "tabpreview.SizePreview") {
      this.SizePreview = this.getIntPref(prefs, "tabpreview.SizePreview");
    }
    else if(data == "tabpreview.PreviewPercent") {
      this.PreviewPercent = this.getIntPref(prefs, "tabpreview.PreviewPercent");
    }
    else if(data == "tabpreview.PreviewPixel") {
      this.PreviewPixel = this.getIntPref(prefs, "tabpreview.PreviewPixel");
    }
    else if(data == "tabpreview.DelayPreview") {
      this.DelayPreview = this.getBoolPref(prefs, "tabpreview.DelayPreview");
    }
    else if(data == "tabpreview.PreviewDelay") {
      this.PreviewDelay = this.getIntPref(prefs, "tabpreview.PreviewDelay");
    }
    else if(data == "tabpreview.ScrollingPreview") {
      this.ScrollingPreview = this.getIntPref(prefs, "tabpreview.ScrollingPreview");
    }
  },

  getBoolPref : function(pb, p)
  {
    try {
      return pb.getBoolPref(p);
    }
    catch(ex) { dump(ex + "\n"); }
    return false;
  },

  getIntPref : function(pb, p)
  {
    try {
      return pb.getIntPref(p);
    }
    catch(ex) { dump(ex + "\n"); }
    return false;
  },

  mouseMove: function(e)
  {
    if(e.target instanceof XULElement && e.target.localName == "tab") {
      var b = getBrowser();
      var tp = document.getElementById("tabpreview");
      if(e.target != TabPreview.currentTab) {
        TabPreview.currentTab = e.target;
        // don't show preview for the current tab, obviously
        if(TabPreview.currentTab == b.selectedTab) {
          tp.hidePopup();
        }
        else {
          // if user has set preference to delay preview display
          if (TabPreview.DelayPreview) {
            // if there's already a timer set, clear it
            if (TabPreview.PreviewTimeout)
              clearTimeout(TabPreview.PreviewTimeout);
              
            // set the timer to show the preview using the ms delay set in the preference
            TabPreview.PreviewTimeout = setTimeout(TabPreview.showPreview, TabPreview.PreviewDelay);
          }
          // if user has not selected preference to delay preview display
          else
            TabPreview.showPreview();
        }
      }
    }
    else {
      // not over a tab
      TabPreview.currentTab = null;
      document.getElementById("tabpreview").hidePopup();
    }
  },

  hidePreview: function(e)
  {
    //if there's a timer set to show the preview, clear the timer
    if (TabPreview.PreviewTimeout)
      clearTimeout(TabPreview.PreviewTimeout);
      
    TabPreview.currentTab = null;
    document.getElementById("tabpreview").hidePopup();
  },

  getPreviewSize: function(tab, win)
  {
    // tab is the tab we're over
    // win is the content window we'll be displaying a thumbnail of
    // window is the browser window
    var scale, useHeight;
    var useWidth = 0;
    
    //if user has set preference for preview size to tab width 
    if(TabPreview.SizePreview == 1) {
      // for some reason boxObject.width doesn't agree with
      // the real width.  get the computed style value instead.
      useWidth = document.defaultView.getComputedStyle(tab, "width")
        .width.replace(/px$/, '');
    }
    // if user has set preference for preview size to percent of browser
    else if(TabPreview.SizePreview == 2) {
      useWidth  = Math.floor(window.innerWidth * TabPreview.PreviewPercent/100);
    }
    // if user has set preference for preview size exact pixel
    else if(TabPreview.SizePreview == 3) {
      useWidth  = TabPreview.PreviewPixel;
    }
    
    // for some reason, the popup won't get bigger than 440px wide
    useWidth  = Math.min(useWidth, 440);
    
    scale = win.innerHeight / win.innerWidth;
    useHeight = useWidth * scale;
    return { w: useWidth, h: useHeight };
  },

  updatePreview: function(win, size)
  {
    var w = win.innerWidth;
    var h = win.innerHeight;
    var canvas = document.getElementById("tabpreviewcanvas");
    var canvasW = size.w;
    var canvasH = size.h - 5;
    
    // set the preview initially for top left
    var xScroll = 0;
    var yScroll = 0;
    var fudge = 0;
    
    // if user has set preference for scrolled preview, get the scrolled position
    if (TabPreview.ScrollingPreview == 1) {
      xScroll = win.scrollX;
      yScroll = win.scrollY;
    }
    else {
      // bug 313178
      fudge = win.scrollMaxY;
    }
    
    canvas.style.width = canvasW+"px";
    canvas.style.height = canvasH+"px";
    canvas.width = canvasW;
    canvas.height = canvasH;
    try {
      //var d = new Date().getTime();
      var ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvasW, canvasH);
      ctx.save();
      ctx.scale(canvasW/w, canvasH/h);
      ctx.drawWindow(win, xScroll, yScroll, w, h+fudge, "rgb(255,255,255)");
      ctx.restore();
      //d = (new Date().getTime()) - d;
      //dump("Took " + d + " ms\n");
    }
    catch(e) { dump('TabPreview Error: ' + e.message + '\n'); }
  },

  showPreview: function()
  {
    var b = getBrowser();
    var tp = document.getElementById("tabpreview");
    var win = b.getBrowserForTab(TabPreview.currentTab).contentWindow;
    var size = TabPreview.getPreviewSize(TabPreview.currentTab, win);
    // draw preview
    TabPreview.updatePreview(win, size);
  
    // get the width of the border around the browser window
    var windowBorder = (window.outerWidth - window.innerWidth)/2;
    // set the width of the vertical scrollbar
    var scrollbarWidth = 19;
       
    var x;
    // if user has set preference for preview size to tab width 
    if(TabPreview.SizePreview == 1) {
      //align it with the tab
      x = TabPreview.currentTab.boxObject.screenX;
    }
    // if user has set preference for any preview size except tab width 
    else {
      // try to offset it so the preview is centered on the tab
      x = TabPreview.currentTab.boxObject.screenX - 
        (size.w - TabPreview.currentTab.boxObject.width) / 2;
      // don't let it run off either side of the browser inner window, though
      x = Math.min(Math.max(x, window.screenX + windowBorder),
                   window.screenX + window.innerWidth - size.w - windowBorder - scrollbarWidth); 
    }
    // it looks like we get offset by the tab's height automatically.
    var y = TabPreview.currentTab.boxObject.screenY;

    // are we running off the bottom of the window?
    // this shouldn't happen unless the tabs are on the bottom
    if(y + size.h + TabPreview.currentTab.boxObject.height >
       window.screenY + window.outerHeight) {
      y -= size.h + TabPreview.currentTab.boxObject.height;
    }
    // have to use "tooltip" so we don't steal focus
    tp.showPopup(TabPreview.currentTab, x, y, "tooltip");
  }
};

window.addEventListener("load", function(e) { TabPreview.onLoad(e); }, false); 

