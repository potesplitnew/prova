// ============================================================
// users.js — registro account centrale (letto dalla repo "home",
// pubblica, nessun token necessario). Ogni "persona" di un evento è
// ora un username che fa riferimento a un account di questo registro,
// non più un nome libero digitato a mano.
// ============================================================

const Utenti = {
  _cache: null,

  async carica() {
    if (this._cache) return this._cache;
    try {
      const res = await fetch(`https://raw.githubusercontent.com/${CONFIG.homeOwner}/${CONFIG.homeRepo}/${CONFIG.homeBranch}/data/utenti.json?_=${Date.now()}`);
      this._cache = res.ok ? await res.json() : [];
    } catch (e) {
      this._cache = [];
    }
    return this._cache;
  },

  // Nome visualizzato per uno username. Se l'account non è (più) nel registro
  // (es. eliminato dall'admin dopo essere stato aggiunto all'evento), mostra
  // comunque lo username così i dati restano leggibili.
  nome(username) {
    const u = (this._cache || []).find(x => x.username === username);
    return u ? u.nome : username;
  },

  // Account registrati ma non ancora partecipanti a QUESTO evento.
  disponibili(personeEvento) {
    const presenti = new Set(personeEvento);
    return (this._cache || []).filter(u => !presenti.has(u.username));
  }
};
