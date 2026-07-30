/* Shared access-code gate for every page (blocks deep-link bypass).
   Flagship has its own inline gate (#pwGate) — we defer to it there.
   Same sessionStorage key + same code, so passing any one page unlocks all.
   NOTE: change the code in BOTH this file and flagship.html.  */
(function(){
  var ACCESS_CODE = 'smm12345';
  if (document.getElementById('pwGate')) return;              // flagship handles itself
  if (sessionStorage.getItem('steelPulseAuth') === '1') return;

  var g = document.createElement('div');
  g.id = 'pwGate';
  g.style.cssText = 'position:fixed;inset:0;z-index:99999;background:radial-gradient(900px 600px at 30% 70%,rgba(192,0,0,.10),transparent 60%),radial-gradient(1100px 700px at 70% 25%,rgba(47,111,237,.12),transparent 60%),#090d18;display:flex;align-items:center;justify-content:center';
  g.innerHTML =
    '<div style="width:min(360px,86vw);background:linear-gradient(180deg,rgba(20,28,48,.72),rgba(13,19,34,.7));backdrop-filter:blur(18px);border:1px solid rgba(120,150,210,.2);border-radius:18px;padding:30px 28px;box-shadow:0 30px 80px rgba(0,0,0,.55);font-family:MiSans,PingFang SC,system-ui,sans-serif">'+
      '<div style="font-size:12px;font-weight:800;letter-spacing:.14em;color:#cfd7e6;margin-bottom:14px">SMM · TRADE INTEL</div>'+
      '<div style="font-size:19px;font-weight:850;color:#fff;line-height:1.3">全球钢材贸易<span style="color:#e23b3b">脉搏</span> · Global Steel Trade Pulse</div>'+
      '<div style="font-size:12px;color:#8b97ad;margin:8px 0 18px">Global Steel Trade Intelligence · 请输入访问口令 / Enter access code</div>'+
      '<input id="pwInput2" type="password" placeholder="访问口令 / Access code" autocomplete="off" style="width:100%;padding:11px 13px;border-radius:10px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.06);color:#fff;font-size:14px;outline:none;box-sizing:border-box;font-family:inherit">'+
      '<div id="pwErr2" style="display:none;font-size:11.5px;color:#ff7a6e;margin-top:8px">口令不正确，请重试 / Incorrect code</div>'+
      '<button id="pwBtn2" style="width:100%;margin-top:14px;padding:11px;border:none;border-radius:10px;background:linear-gradient(135deg,#C00000,#8a0000);color:#fff;font-size:14px;font-weight:750;cursor:pointer;font-family:inherit;letter-spacing:.04em">进入平台 / Enter</button>'+
    '</div>';

  function mount(){
    document.body.appendChild(g);
    document.documentElement.style.overflow = 'hidden';
    var inp = document.getElementById('pwInput2');
    function check(){
      if (inp.value === ACCESS_CODE){
        sessionStorage.setItem('steelPulseAuth','1');
        g.remove();
        document.documentElement.style.overflow = '';
      } else {
        document.getElementById('pwErr2').style.display = 'block';
      }
    }
    document.getElementById('pwBtn2').addEventListener('click', check);
    inp.addEventListener('keydown', function(e){ if(e.key==='Enter') check(); });
    inp.focus();
  }
  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);
})();
