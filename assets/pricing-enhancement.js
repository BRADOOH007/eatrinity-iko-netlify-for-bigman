/**
 * Trinity Express - Pricing Enhancement & SEO Patch
 * Injects UGX/RWF pricing for Kampala/Rwanda routes + improves SEO runtime
 * Prices provided by operator:
 *  Kampala→Nairobi  Normal 101,500 UGX  VIP 140,000 UGX
 *  Kampala→Kigali   Normal  91,500 UGX  VIP 131,500 UGX
 *  Kampala→Juba     Normal 121,500 UGX  VIP 151,500 UGX
 *  Rwanda→Kampala   Normal  36,500 RWF  VIP  46,500 RWF
 */
(function () {
  const PRICING = [
    { route: "Kampala → Nairobi", from: "Kampala", to: "Nairobi", standard: "UGX 101,500", vip: "UGX 140,000", stdNum: 101500, vipNum: 140000, currency: "UGX" },
    { route: "Kampala → Kigali", from: "Kampala", to: "Kigali", standard: "UGX 91,500", vip: "UGX 131,500", stdNum: 91500, vipNum: 131500, currency: "UGX" },
    { route: "Kampala → Juba", from: "Kampala", to: "Juba", standard: "UGX 121,500", vip: "UGX 151,500", stdNum: 121500, vipNum: 151500, currency: "UGX" },
    { route: "Rwanda → Kampala", from: "Kigali", to: "Kampala", standard: "RWF 36,500", vip: "RWF 46,500", stdNum: 36500, vipNum: 46500, currency: "RWF", alias: "Kigali → Kampala" },
    // Cross-reference existing KES pricing for completeness
    { route: "Nairobi → Kampala", from: "Nairobi", to: "Kampala", standard: "KSh 3,500", vip: "KSh 5,000", currency: "KES" },
    { route: "Nairobi → Kigali", from: "Nairobi", to: "Kigali", standard: "KSh 5,000", vip: "KSh 7,000", currency: "KES" },
  ];

  // Expose globally for debugging
  window.__TRINITY_PRICING__ = PRICING;

  // 1. Inject JSON-LD for pricing if not already present (backup to index.html)
  function injectJsonLd() {
    if (document.querySelector('script[data-pricing-enhancement]')) return;
    var data = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Trinity Express fares - UGX/RWF update 2026",
      "itemListElement": PRICING.slice(0,4).map(function(p, idx){
        return {
          "@type": "ListItem",
          "position": idx+1,
          "item": {
            "@type": "Offer",
            "name": p.route + " - Standard/VIP",
            "price": String(p.stdNum),
            "priceCurrency": p.currency,
            "alternatePrice": String(p.vipNum),
            "description": p.route + " Standard " + p.standard + " VIP " + p.vip
          }
        };
      })
    };
    var s = document.createElement('script');
    s.type = 'application/ld+json';
    s.setAttribute('data-pricing-enhancement','true');
    s.textContent = JSON.stringify(data);
    document.head.appendChild(s);
  }

  // 2. Inject visible pricing banner/table into homepage hero or routes page
  function injectPricingTable() {
    if (document.getElementById('trinity-pricing-table')) return;
    var container = document.querySelector('#root');
    // Wait for React to render
    var attempts = 0;
    var timer = setInterval(function(){
      attempts++;
      // Try to find a good insertion point: after hero or before footer
      var hero = document.querySelector('main, [class*="hero"], [class*="Hero"]');
      var footer = document.querySelector('footer');
      var target = footer ? footer.parentNode : (hero ? hero.parentNode : document.body);
      var anchor = footer || hero;
      // Also try to find route cards container
      var routeSection = Array.from(document.querySelectorAll('section, div')).find(function(el){
        return el.textContent.includes('Nairobi to Kampala') && el.textContent.includes('KSh');
      });

      if ((anchor || routeSection || attempts > 20) && !document.getElementById('trinity-pricing-table')) {
        clearInterval(timer);
        var wrap = document.createElement('section');
        wrap.id = 'trinity-pricing-table';
        wrap.setAttribute('aria-label','Trinity Express bus fares 2026');
        wrap.style.cssText = 'max-width:1120px;margin:32px auto;padding:24px;background:#fff;border:1px solid #e2e8f0;border-radius:16px;box-shadow:0 4px 20px rgba(0,0,0,0.06);font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;';
        wrap.innerHTML = ''
          + '<div style="text-align:center;margin-bottom:16px">'
          + '<h2 style="font-size:22px;font-weight:800;color:#1E3A8A;margin:0 0 6px">2026 Fares — Kampala & Rwanda Origins</h2>'
          + '<p style="color:#64748b;font-size:14px;margin:0">Official Trinity Express pricing. Pay in local currency. VIP = extra legroom + priority boarding.</p>'
          + '</div>'
          + '<div style="overflow-x:auto">'
          + '<table style="width:100%;border-collapse:collapse;font-size:14px">'
          + '<thead><tr style="background:#1E3A8A;color:#fff"><th style="padding:12px;text-align:left;border-radius:8px 0 0 0">Route</th><th style="padding:12px;text-align:right">Standard</th><th style="padding:12px;text-align:right;border-radius:0 8px 0 0">VIP</th></tr></thead>'
          + '<tbody>'
          + '<tr style="border-bottom:1px solid #f1f5f9"><td style="padding:12px;font-weight:600">Kampala → Nairobi</td><td style="padding:12px;text-align:right">UGX 101,500</td><td style="padding:12px;text-align:right;color:#ea580c;font-weight:700">UGX 140,000</td></tr>'
          + '<tr style="border-bottom:1px solid #f1f5f9;background:#f8fafc"><td style="padding:12px;font-weight:600">Kampala → Kigali</td><td style="padding:12px;text-align:right">UGX 91,500</td><td style="padding:12px;text-align:right;color:#ea580c;font-weight:700">UGX 131,500</td></tr>'
          + '<tr style="border-bottom:1px solid #f1f5f9"><td style="padding:12px;font-weight:600">Kampala → Juba</td><td style="padding:12px;text-align:right">UGX 121,500</td><td style="padding:12px;text-align:right;color:#ea580c;font-weight:700">UGX 151,500</td></tr>'
          + '<tr style="background:#f8fafc"><td style="padding:12px;font-weight:600">Rwanda → Kampala <span style="color:#64748b;font-weight:400">(Kigali→Kampala)</span></td><td style="padding:12px;text-align:right">RWF 36,500</td><td style="padding:12px;text-align:right;color:#ea580c;font-weight:700">RWF 46,500</td></tr>'
          + '</tbody></table></div>'
          + '<p style="text-align:center;margin:12px 0 0;font-size:12px;color:#94a3b8">Also available: Nairobi→Kampala KSh 3,500/5,000 VIP · Nairobi→Kigali KSh 5,000/7,000 VIP · Nairobi→Dar KSh 4,500/6,500 VIP</p>'
          + '<div style="text-align:center;margin-top:16px"><a href="/routes" style="display:inline-block;background:linear-gradient(90deg,#F97316,#FB923C);color:#fff;padding:10px 22px;border-radius:10px;text-decoration:none;font-weight:700">Book Now — Daily 07:00</a></div>';
        // Insert before footer if possible, otherwise after routeSection
        if (footer && footer.parentNode) {
          footer.parentNode.insertBefore(wrap, footer);
        } else if (routeSection && routeSection.parentNode) {
          routeSection.parentNode.insertBefore(wrap, routeSection.nextSibling);
        } else {
          (document.querySelector('#root') || document.body).appendChild(wrap);
        }
        // Also annotate any visible KSh prices with UGX equivalent hint
        annotateExistingPrices();
      }
      if (attempts > 30) clearInterval(timer);
    }, 500);
  }

  function annotateExistingPrices() {
    // Add small UGX hint next to KSh 3,500 (Nairobi→Kampala) if not already annotated
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    var nodes = [];
    var n;
    while (n = walker.nextNode()) {
      if (n.nodeValue.includes('KSh 3,500') || n.nodeValue.includes('KSh 5,000')) nodes.push(n);
    }
    // Don't mutate aggressively - just add title tooltip to parent
    nodes.forEach(function(textNode){
      var parent = textNode.parentElement;
      if (parent && !parent.hasAttribute('data-ugx-hint')) {
        if (textNode.nodeValue.includes('KSh 3,500')) {
          parent.setAttribute('data-ugx-hint','Kampala→Nairobi UGX 101,500');
          parent.title = 'From Kampala: UGX 101,500 Standard / 140,000 VIP';
        }
      }
    });
  }

  // 3. Enhance FAQ: if FAQ section exists, append UGX questions dynamically
  function enhanceFAQ() {
    var faqContainer = Array.from(document.querySelectorAll('section, div')).find(function(el){
      return el.textContent.includes('What is the price of a Nairobi to Kampala bus ticket');
    });
    if (faqContainer && !document.getElementById('trinity-faq-ugx')) {
      var extra = document.createElement('div');
      extra.id = 'trinity-faq-ugx';
      extra.style.cssText = 'margin-top:16px;padding:16px;background:#fffbeb;border:1px solid #fed7aa;border-radius:12px';
      extra.innerHTML = '<h3 style="font-weight:800;color:#9a3412;margin:0 0 8px">More fares — from Kampala & Rwanda</h3>'
        + '<details style="margin:6px 0"><summary style="cursor:pointer;font-weight:600">How much is Kampala → Nairobi?</summary><p style="margin:6px 0 0;color:#475569">Standard UGX 101,500, VIP UGX 140,000. Same bus, opposite direction. Daily departures.</p></details>'
        + '<details style="margin:6px 0"><summary style="cursor:pointer;font-weight:600">How much is Kampala → Kigali?</summary><p style="margin:6px 0 0;color:#475569">Standard UGX 91,500, VIP UGX 131,500 via Gatuna/Katuna border.</p></details>'
        + '<details style="margin:6px 0"><summary style="cursor:pointer;font-weight:600">How much is Kampala → Juba?</summary><p style="margin:6px 0 0;color:#475569">Standard UGX 121,500, VIP UGX 151,500. Direct service to South Sudan.</p></details>'
        + '<details style="margin:6px 0"><summary style="cursor:pointer;font-weight:600">How much is Rwanda → Kampala?</summary><p style="margin:6px 0 0;color:#475569">Standard RWF 36,500, VIP RWF 46,500 (Kigali to Kampala).</p></details>';
      faqContainer.appendChild(extra);
    }
  }

  // Init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function(){ injectJsonLd(); injectPricingTable(); setTimeout(enhanceFAQ, 1500); });
  } else {
    injectJsonLd();
    injectPricingTable();
    setTimeout(enhanceFAQ, 1500);
  }
  // Re-run after React route changes (SPA)
  var lastUrl = location.href;
  setInterval(function(){
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      setTimeout(function(){ injectPricingTable(); enhanceFAQ(); }, 800);
    }
  }, 1000);
})();
