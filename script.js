 
// Global Emergency Number Finder - Frontend Only (ES5 compatible)
(function() {
  var FALLBACK_DATA = [
    { country: "Nepal", code: "NP", police: "100", ambulance: "102", fire: "101", women: "1145", disaster: "1155", akhtiyar: "107", embassy: "+977-1-4200180" },
    { country: "India", code: "IN", police: "100", ambulance: "102", fire: "101", women: "181", disaster: "108", akhtiyar: "1064", embassy: "+91-11-23011127" },
    { country: "United States", code: "US", police: "911", ambulance: "911", fire: "911", women: "1-800-799-7233", disaster: "FEMA: +1-800-621-3362", akhtiyar: "FBI: 1-800-225-5324", embassy: "DoS: +1-202-647-4000" },
    { country: "United Kingdom", code: "UK", police: "999 / 112", ambulance: "999 / 112", fire: "999 / 112", women: "0808 2000 247", disaster: "999 / 112", akhtiyar: "Action Fraud: 0300 123 2040", embassy: "+44-20-7008-1500" },
    { country: "Japan", code: "JP", police: "110", ambulance: "119", fire: "119", women: "#8103 (Tokyo) / local", disaster: "171 (voice) / 171@web", akhtiyar: "03-3581-9111 (MOJ)", embassy: "+81-3-3580-3311" },
    { country: "Australia", code: "AU", police: "000", ambulance: "000", fire: "000", women: "1800 737 732", disaster: "SES: 132 500", akhtiyar: "Crime Stoppers: 1800 333 000", embassy: "+61-2-6261-1111" },
    { country: "Canada", code: "CA", police: "911", ambulance: "911", fire: "911", women: "1-800-387-5437", disaster: "1-800-661-0486", akhtiyar: "RCMP: +1-613-993-7267", embassy: "+1-613-944-4000" },
    { country: "Germany", code: "DE", police: "110", ambulance: "112", fire: "112", women: "08000 116 016", disaster: "BBK: 112", akhtiyar: "+49-30-18-580-0 (BKA)", embassy: "+49-30-1817-0" },
    { country: "France", code: "FR", police: "17 / 112", ambulance: "15 / 112", fire: "18 / 112", women: "3919", disaster: "112", akhtiyar: "+33-1-53-73-22-22 (OCLCIFF)", embassy: "+33-1-43-17-53-53" },
    { country: "United Arab Emirates", code: "AE", police: "999", ambulance: "998", fire: "997", women: "800 7283 (EWA'A)", disaster: "999", akhtiyar: "800 7888", embassy: "+971-2-800-4444" },
    { country: "China", code: "CN", police: "110", ambulance: "120", fire: "119", women: "12338", disaster: "121 (weather)", akhtiyar: "12388", embassy: "+86-10-12308" },
    { country: "Brazil", code: "BR", police: "190", ambulance: "192", fire: "193", women: "180", disaster: "199", akhtiyar: "Denúncia: 181", embassy: "+55-61-2030-8800" },
    { country: "South Africa", code: "ZA", police: "10111", ambulance: "10177", fire: "10177", women: "0800 428 428", disaster: "107 (Cape Town)", akhtiyar: "Crime Stop: 08600 10111", embassy: "+27-12-351-1000" },
    { country: "Singapore", code: "SG", police: "999", ambulance: "995", fire: "995", women: "1800-777-0000", disaster: "999 / 995", akhtiyar: "1800-2255-782", embassy: "+65-6377-8000" },
    { country: "New Zealand", code: "NZ", police: "111", ambulance: "111", fire: "111", women: "0800 456 450", disaster: "1737 (mental) / 111", akhtiyar: "0800 555 111", embassy: "+64-4-439 8000" }
  ];

  var state = { data: [], loaded: false };

  function $(id) { return document.getElementById(id); }
  function setYear() { var y = new Date().getFullYear(); var el = $("year"); if (el) el.textContent = y; }
  function setThemeFromStorage() {
    var pref = localStorage.getItem('theme');
    if (pref === 'dark') document.documentElement.setAttribute('data-theme','dark');
  }

  function toggleTheme() {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    var next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next === 'dark' ? 'dark' : '');
    if (next === 'dark') localStorage.setItem('theme','dark'); else localStorage.removeItem('theme');
  }

  function safeText(val) { return (val && typeof val === 'string') ? val : 'N/A'; }

  function renderCountry(country) {
    var container = $('result');
    container.innerHTML = '';
    if (!country) {
      container.innerHTML = '<p class="text-muted">Country not found. Try another name.</p>';
      return;
    }

    var card = document.createElement('div');
    card.className = 'result-card fade-in';

    var name = document.createElement('div');
    name.className = 'country-name';
    name.textContent = country.country;
    card.appendChild(name);

    var grid = document.createElement('div');
    grid.className = 'emergency-grid';

  function makeItem(icon, label, value) {
    var item = document.createElement('div');
    item.className = 'emergency-item';

      var type = document.createElement('div');
      type.className = 'emergency-type';
      var iconEl = document.createElement('span'); iconEl.setAttribute('aria-hidden', 'true'); iconEl.textContent = icon;
      var labelEl = document.createElement('span'); labelEl.textContent = label;
      type.appendChild(iconEl);
      type.appendChild(labelEl);

      var num = document.createElement('div');
      num.className = 'emergency-number';
      num.textContent = safeText(value);

      var btn = document.createElement('button');
      btn.className = 'btn btn-secondary copy-btn';
      btn.type = 'button';
      btn.textContent = 'Copy';
      btn.addEventListener('click', function() {
        copyToClipboard(value);
        var old = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(function(){ btn.textContent = old; }, 1200);
      });

      item.appendChild(type);
      item.appendChild(num);
      item.appendChild(btn);
      return item;
    }

    grid.appendChild(makeItem('🚓', 'Police', country.police));
    grid.appendChild(makeItem('🚑', 'Ambulance', country.ambulance));
    grid.appendChild(makeItem('🔥', 'Fire', country.fire));
    grid.appendChild(makeItem('👩', 'Women’s Helpline', country.women));
    grid.appendChild(makeItem('🆘', 'Disaster/Rescue', country.disaster));
    grid.appendChild(makeItem('🏛️', 'CIAA (Akhtiyar) / Anti-Corruption', country.akhtiyar));
    grid.appendChild(makeItem('🏢', 'Embassy (Foreign Affairs)', country.embassy));

    card.appendChild(grid);
    container.appendChild(card);
  }

  function loadData() {
    return fetch('data.json')
      .then(function(resp) { return resp.json(); })
      .then(function(json) {
        if (Object.prototype.toString.call(json) === '[object Array]' && json.length) {
          state.data = json; state.loaded = true;
          populateDatalist(json);
          populateSelect(json);
          populatePopular(["Nepal","India","United States","United Kingdom","Japan"]);
          return json;
        }
        throw new Error('Empty JSON');
      })
      .catch(function() {
        state.data = FALLBACK_DATA; state.loaded = true;
        populateDatalist(FALLBACK_DATA);
        populateSelect(FALLBACK_DATA);
        populatePopular(["Nepal","India","United States","United Kingdom","Japan"]);
        var help = $('searchHelp');
        if (help) help.textContent = 'Offline mode: using built-in emergency numbers.';
        return FALLBACK_DATA;
      });
  }

  function populateDatalist(list) {
    var dl = $('countryList');
    if (!dl) return;
    dl.innerHTML = '';
    for (var i = 0; i < list.length; i++) {
      var c = list[i];
      var opt = document.createElement('option');
      opt.value = c.country;
      dl.appendChild(opt);
    }
  }

  function populateSelect(list) {
    var sel = $('countrySelect');
    if (!sel) return;
    sel.innerHTML = '<option value="">Select a country...</option>';
    for (var i = 0; i < list.length; i++) {
      var c = list[i];
      var opt = document.createElement('option');
      opt.value = c.country;
      opt.textContent = c.country;
      sel.appendChild(opt);
    }
  }

  function populatePopular(names) {
    var wrap = $('popularList');
    if (!wrap) return;
    wrap.innerHTML = '';
    for (var i = 0; i < names.length; i++) {
      (function(n){
        var chip = document.createElement('button');
        chip.className = 'chip';
        chip.type = 'button';
        chip.textContent = n;
        chip.addEventListener('click', function() {
          var input = $('countryInput');
          if (input) input.value = n;
          onFind();
        });
        wrap.appendChild(chip);
      })(names[i]);
    }
  }

  function findMatch(query) {
    var q = String(query || '').trim().toLowerCase();
    if (!q) return null;
    var i;
    for (i = 0; i < state.data.length; i++) {
      if (String(state.data[i].country || '').toLowerCase() === q) return state.data[i];
    }
    for (i = 0; i < state.data.length; i++) {
      if (String(state.data[i].country || '').toLowerCase().indexOf(q) !== -1) return state.data[i];
    }
    return null;
  }

  function copyToClipboard(text) {
    var val = String(text || '').trim();
    if (!val) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(val).catch(function(){ legacyCopy(val); });
      } else {
        legacyCopy(val);
      }
    } catch (e) {
      legacyCopy(val);
    }
  }

  function legacyCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
  }

  function onFind() {
    var input = $('countryInput');
    var match = findMatch(input ? input.value : '');
    renderCountry(match);
  }

  function bindEvents() {
    var input = $('countryInput');
    var btn = $('searchBtn');
    if (input) { input.focus(); input.addEventListener('keydown', function(e) { if (e.key === 'Enter') onFind(); }); }
    if (btn) btn.addEventListener('click', onFind);
    var sel = $('countrySelect');
    if (sel) sel.addEventListener('change', function() { var v = sel.value; var inputEl = $('countryInput'); if (inputEl) inputEl.value = v; onFind(); });
    var toggle = $('themeToggle');
    if (toggle) toggle.addEventListener('click', toggleTheme);
  }

  document.addEventListener('DOMContentLoaded', function() {
    setYear();
    setThemeFromStorage();
    bindEvents();
    loadData();
  });
})();