/* "Data updated — refresh" banner. Polls version.js; if the build date on the
   server is newer than what this page loaded, prompts the user to refresh.
   Works when hosted over http(s); silently no-ops on local file://. */
(function(){
  var LOADED = (window.DATA_VERSION && window.DATA_VERSION.built) || null;
  if (!LOADED) return;
  var shown = false;

  function isEN(){ return window.SP_LANG ? SP_LANG()==='en' : false; }

  function showBanner(newBuilt){
    if (shown) return; shown = true;
    var en = isEN();
    var b = document.createElement('div');
    b.style.cssText = 'position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:100000;'+
      'display:flex;align-items:center;gap:12px;background:linear-gradient(135deg,#C00000,#8a0000);'+
      'color:#fff;font:600 13px/1 MiSans,PingFang SC,system-ui,sans-serif;padding:11px 14px 11px 16px;'+
      'border-radius:12px;box-shadow:0 12px 40px rgba(0,0,0,.5);letter-spacing:.02em';
    b.innerHTML = '<span>📡 '+(en?'New data available ('+newBuilt+')':'数据已更新（'+newBuilt+'）')+'</span>'+
      '<button id="__refreshBtn" style="border:none;background:#fff;color:#C00000;font-weight:800;'+
      'padding:6px 12px;border-radius:8px;cursor:pointer;font-family:inherit">'+(en?'Refresh':'刷新')+'</button>';
    document.body.appendChild(b);
    document.getElementById('__refreshBtn').addEventListener('click', function(){ location.reload(); });
  }

  function poll(){
    fetch('./assets/version.js?t=' + Date.now(), {cache:'no-store'})
      .then(function(r){ return r.text(); })
      .then(function(txt){
        var m = txt.match(/"built"\s*:\s*"([^"]+)"/);
        if (m && m[1] && m[1] !== LOADED) showBanner(m[1]);
      })
      .catch(function(){ /* file:// or offline — ignore */ });
  }
  // check every 2 minutes, and once shortly after load
  setInterval(poll, 120000);
  setTimeout(poll, 15000);
})();
