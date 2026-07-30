/* Fixed, language-neutral data-version badge shown on every page.
   Lets any colleague confirm at a glance whether their copy is the latest. */
(function(){
  function render(){
    var v = window.DATA_VERSION || {};
    if(document.getElementById('__dataVerBadge')) return;
    var b = document.createElement('div');
    b.id = '__dataVerBadge';
    b.textContent = '🗓 ' + (v.coverage||'—') + ' · build ' + (v.built||'—');
    b.title = 'Data coverage · package build date / 数据覆盖区间 · 生成日期';
    b.style.cssText = 'position:fixed;left:10px;bottom:10px;z-index:9999;'+
      'font:600 11px/1 system-ui,-apple-system,"MiSans","PingFang SC",sans-serif;'+
      'color:#9fb0c8;background:rgba(12,16,26,.82);border:1px solid rgba(255,255,255,.14);'+
      'padding:6px 10px;border-radius:8px;letter-spacing:.02em;backdrop-filter:blur(6px);'+
      'pointer-events:none;user-select:none;white-space:nowrap;';
    document.body.appendChild(b);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();
