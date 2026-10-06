// GastroConnect — async Tech Cards loader (menu pages)
// Loads the big tech-cards JSON after the page is painted, instead of
// blocking the browser on a 12 MB JS parse.
var GC_TECH_CARDS = null;
function gcFetchTechCards() {
  if (GC_TECH_CARDS) return Promise.resolve(GC_TECH_CARDS);
  return fetch('/tech-cards.json?v=20261006')
    .then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function (d) {
      GC_TECH_CARDS = Array.isArray(d) ? d : [];
      return GC_TECH_CARDS;
    })
    .catch(function (e) {
      console.warn('GastroConnect: tech cards not loaded (' + e + ')');
      GC_TECH_CARDS = [];
      return GC_TECH_CARDS;
    });
}