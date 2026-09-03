/* Simple inline SVG circuit diagrams for equation detail panels */
window.CIRCUIT_DIAGRAMS = {
  dc: '<svg viewBox="0 0 260 100" xmlns="http://www.w3.org/2000/svg" aria-label="DC circuit diagram">' +
    '<text x="130" y="18" text-anchor="middle" font-size="11" font-weight="700" fill="#0f2942">DC CIRCUIT</text>' +
    '<line x1="30" y1="55" x2="55" y2="55" stroke="#1e5a8a" stroke-width="2"/>' +
    '<line x1="55" y1="45" x2="55" y2="65" stroke="#1e5a8a" stroke-width="3"/>' +
    '<line x1="60" y1="45" x2="60" y2="65" stroke="#1e5a8a" stroke-width="2"/>' +
    '<text x="45" y="42" font-size="10" fill="#1e5a8a">+</text>' +
    '<text x="45" y="78" font-size="10" fill="#1e5a8a">−</text>' +
    '<text x="45" y="92" font-size="9" fill="#5c6b7a">DC Supply</text>' +
    '<line x1="60" y1="55" x2="110" y2="55" stroke="#0f2942" stroke-width="2"/>' +
    '<rect x="110" y="42" width="50" height="26" fill="none" stroke="#0f2942" stroke-width="2"/>' +
    '<text x="135" y="92" font-size="9" fill="#5c6b7a">Load (R)</text>' +
    '<line x1="160" y1="55" x2="230" y2="55" stroke="#0f2942" stroke-width="2"/>' +
    '<text x="195" y="48" font-size="10" fill="#c45d1e">I</text>' +
    '<text x="85" y="48" font-size="10" fill="#c45d1e">V</text>' +
    '</svg>',

  ac_single: '<svg viewBox="0 0 260 100" xmlns="http://www.w3.org/2000/svg" aria-label="Single-phase AC circuit diagram">' +
    '<text x="130" y="18" text-anchor="middle" font-size="11" font-weight="700" fill="#0f2942">SINGLE-PHASE AC</text>' +
    '<circle cx="45" cy="55" r="22" fill="none" stroke="#1e5a8a" stroke-width="2"/>' +
    '<path d="M33 55 Q45 38 57 55 Q45 72 33 55" fill="none" stroke="#1e5a8a" stroke-width="2"/>' +
    '<text x="45" y="92" font-size="9" fill="#5c6b7a">AC Source</text>' +
    '<line x1="67" y1="55" x2="115" y2="55" stroke="#0f2942" stroke-width="2"/>' +
    '<text x="112" y="46" text-anchor="end" font-size="8" fill="#c45d1e">V · I · cos θ</text>' +
    '<rect x="115" y="42" width="50" height="26" fill="none" stroke="#0f2942" stroke-width="2"/>' +
    '<text x="140" y="92" font-size="9" fill="#5c6b7a">Load</text>' +
    '<line x1="165" y1="55" x2="230" y2="55" stroke="#0f2942" stroke-width="2"/>' +
    '</svg>',

  ac_three: '<svg viewBox="0 0 260 120" xmlns="http://www.w3.org/2000/svg" aria-label="Three-phase AC diagram">' +
    '<text x="130" y="18" text-anchor="middle" font-size="11" font-weight="700" fill="#0f2942">THREE-PHASE AC</text>' +
    '<line x1="40" y1="50" x2="90" y2="50" stroke="#1e5a8a" stroke-width="2.5"/>' +
    '<line x1="40" y1="70" x2="90" y2="70" stroke="#16a34a" stroke-width="2.5"/>' +
    '<line x1="40" y1="90" x2="90" y2="90" stroke="#c45d1e" stroke-width="2.5"/>' +
    '<text x="25" y="54" font-size="10" fill="#1e5a8a">L1</text>' +
    '<text x="25" y="74" font-size="10" fill="#16a34a">L2</text>' +
    '<text x="25" y="94" font-size="10" fill="#c45d1e">L3</text>' +
    '<rect x="100" y="45" width="60" height="50" rx="4" fill="#e8f1f8" stroke="#1e5a8a" stroke-width="1.5"/>' +
    '<text x="130" y="68" text-anchor="middle" font-size="10" font-weight="600" fill="#0f2942">3φ</text>' +
    '<text x="130" y="82" text-anchor="middle" font-size="9" fill="#5c6b7a">Load</text>' +
    '<line x1="160" y1="55" x2="220" y2="55" stroke="#0f2942" stroke-width="1.5"/>' +
    '<line x1="160" y1="70" x2="220" y2="70" stroke="#0f2942" stroke-width="1.5"/>' +
    '<line x1="160" y1="85" x2="220" y2="85" stroke="#0f2942" stroke-width="1.5"/>' +
    '<text x="195" y="110" text-anchor="middle" font-size="9" fill="#5c6b7a">V_L · I_L</text>' +
    '</svg>',

  inductor: '<svg viewBox="0 0 260 80" xmlns="http://www.w3.org/2000/svg" aria-label="Inductor circuit">' +
    '<text x="130" y="18" text-anchor="middle" font-size="11" font-weight="700" fill="#0f2942">INDUCTOR (L)</text>' +
    '<line x1="30" y1="45" x2="70" y2="45" stroke="#0f2942" stroke-width="2"/>' +
    '<path d="M75 45 q8 -18 16 0 q8 18 16 0 q8 -18 16 0 q8 18 16 0" fill="none" stroke="#1e5a8a" stroke-width="2.5"/>' +
    '<line x1="139" y1="45" x2="230" y2="45" stroke="#0f2942" stroke-width="2"/>' +
    '<text x="107" y="68" text-anchor="middle" font-size="9" fill="#5c6b7a">Opposes AC current</text>' +
    '</svg>',

  capacitor: '<svg viewBox="0 0 260 80" xmlns="http://www.w3.org/2000/svg" aria-label="Capacitor circuit">' +
    '<text x="130" y="18" text-anchor="middle" font-size="11" font-weight="700" fill="#0f2942">CAPACITOR (C)</text>' +
    '<line x1="30" y1="45" x2="95" y2="45" stroke="#0f2942" stroke-width="2"/>' +
    '<line x1="100" y1="32" x2="100" y2="58" stroke="#1e5a8a" stroke-width="3"/>' +
    '<line x1="110" y1="32" x2="110" y2="58" stroke="#1e5a8a" stroke-width="3"/>' +
    '<line x1="115" y1="45" x2="230" y2="45" stroke="#0f2942" stroke-width="2"/>' +
    '<text x="105" y="68" text-anchor="middle" font-size="9" fill="#5c6b7a">Opposes AC current</text>' +
    '</svg>',

  star: '<svg viewBox="0 0 280 240" xmlns="http://www.w3.org/2000/svg" aria-label="Star wye three-phase connection">' +
    '<rect x="8" y="4" width="264" height="28" rx="8" fill="#1e5a8a"/>' +
    '<text x="140" y="23" text-anchor="middle" font-size="12" font-weight="700" fill="#fff">STAR (WYE) CONNECTION</text>' +
    '<circle cx="140" cy="130" r="10" fill="#1e5a8a"/>' +
    '<text x="140" y="134" text-anchor="middle" font-size="9" font-weight="700" fill="#fff">N</text>' +
    '<text x="140" y="158" text-anchor="middle" font-size="9" fill="#5c6b7a">Neutral</text>' +
    '<circle cx="140" cy="55" r="14" fill="#e8f1f8" stroke="#1e5a8a" stroke-width="2.5"/>' +
    '<text x="140" y="59" text-anchor="middle" font-size="11" font-weight="700" fill="#0f2942">L1</text>' +
    '<circle cx="70" cy="185" r="14" fill="#e8f1f8" stroke="#1e5a8a" stroke-width="2.5"/>' +
    '<text x="70" y="189" text-anchor="middle" font-size="11" font-weight="700" fill="#0f2942">L2</text>' +
    '<circle cx="210" cy="185" r="14" fill="#e8f1f8" stroke="#1e5a8a" stroke-width="2.5"/>' +
    '<text x="210" y="189" text-anchor="middle" font-size="11" font-weight="700" fill="#0f2942">L3</text>' +
    '<line x1="140" y1="69" x2="140" y2="120" stroke="#1e5a8a" stroke-width="3"/>' +
    '<line x1="128" y1="138" x2="82" y2="172" stroke="#1e5a8a" stroke-width="3"/>' +
    '<line x1="152" y1="138" x2="198" y2="172" stroke="#1e5a8a" stroke-width="3"/>' +
    '<line x1="126" y1="55" x2="84" y2="175" stroke="#c45d1e" stroke-width="2.5" stroke-dasharray="6 4"/>' +
    '<line x1="154" y1="55" x2="196" y2="175" stroke="#c45d1e" stroke-width="2.5" stroke-dasharray="6 4"/>' +
    '<line x1="84" y1="185" x2="196" y2="185" stroke="#c45d1e" stroke-width="2.5" stroke-dasharray="6 4"/>' +
    '<rect x="82" y="84" width="52" height="22" rx="5" fill="#1e5a8a"/>' +
    '<text x="108" y="99" text-anchor="middle" font-size="12" font-weight="700" fill="#fff">V_Ph</text>' +
    '<rect x="188" y="96" width="46" height="22" rx="5" fill="#c45d1e"/>' +
    '<text x="211" y="111" text-anchor="middle" font-size="12" font-weight="700" fill="#fff">V_L</text>' +
    '<line x1="24" y1="206" x2="44" y2="206" stroke="#1e5a8a" stroke-width="3"/>' +
    '<text x="50" y="210" font-size="10" font-weight="600" fill="#0f2942">V_Ph — phase to neutral</text>' +
    '<line x1="24" y1="222" x2="44" y2="222" stroke="#c45d1e" stroke-width="2.5" stroke-dasharray="5 3"/>' +
    '<text x="50" y="226" font-size="10" font-weight="600" fill="#0f2942">V_L — between phases</text>' +
    '</svg>',

  star_current: '<svg viewBox="0 0 280 240" xmlns="http://www.w3.org/2000/svg" aria-label="Star connection current paths">' +
    '<rect x="8" y="4" width="264" height="28" rx="8" fill="#1e5a8a"/>' +
    '<text x="140" y="23" text-anchor="middle" font-size="12" font-weight="700" fill="#fff">STAR (WYE) CONNECTION</text>' +
    '<circle cx="140" cy="130" r="10" fill="#1e5a8a"/>' +
    '<text x="140" y="134" text-anchor="middle" font-size="9" font-weight="700" fill="#fff">N</text>' +
    '<circle cx="140" cy="55" r="14" fill="#e8f1f8" stroke="#1e5a8a" stroke-width="2.5"/>' +
    '<text x="140" y="59" text-anchor="middle" font-size="11" font-weight="700" fill="#0f2942">L1</text>' +
    '<circle cx="70" cy="185" r="14" fill="#e8f1f8" stroke="#1e5a8a" stroke-width="2.5"/>' +
    '<text x="70" y="189" text-anchor="middle" font-size="11" font-weight="700" fill="#0f2942">L2</text>' +
    '<circle cx="210" cy="185" r="14" fill="#e8f1f8" stroke="#1e5a8a" stroke-width="2.5"/>' +
    '<text x="210" y="189" text-anchor="middle" font-size="11" font-weight="700" fill="#0f2942">L3</text>' +
    '<line x1="140" y1="69" x2="140" y2="120" stroke="#1e5a8a" stroke-width="3"/>' +
    '<line x1="128" y1="138" x2="82" y2="172" stroke="#1e5a8a" stroke-width="3"/>' +
    '<line x1="152" y1="138" x2="198" y2="172" stroke="#1e5a8a" stroke-width="3"/>' +
    '<polygon points="140,78 136,90 144,90" fill="#c45d1e"/>' +
    '<polygon points="118,152 106,158 112,166" fill="#c45d1e"/>' +
    '<polygon points="162,152 174,158 168,166" fill="#c45d1e"/>' +
    '<rect x="168" y="88" width="88" height="22" rx="5" fill="#c45d1e"/>' +
    '<text x="212" y="103" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">I_L = I_Ph</text>' +
    '<text x="140" y="228" text-anchor="middle" font-size="10" font-weight="600" fill="#5c6b7a">Same current in line and phase</text>' +
    '</svg>',

  delta: '<svg viewBox="0 0 280 240" xmlns="http://www.w3.org/2000/svg" aria-label="Delta three-phase connection">' +
    '<rect x="8" y="4" width="264" height="28" rx="8" fill="#c45d1e"/>' +
    '<text x="140" y="23" text-anchor="middle" font-size="12" font-weight="700" fill="#fff">DELTA (Δ) CONNECTION</text>' +
    '<circle cx="140" cy="55" r="14" fill="#fef3e8" stroke="#c45d1e" stroke-width="2.5"/>' +
    '<text x="140" y="59" text-anchor="middle" font-size="11" font-weight="700" fill="#0f2942">L1</text>' +
    '<circle cx="70" cy="185" r="14" fill="#fef3e8" stroke="#c45d1e" stroke-width="2.5"/>' +
    '<text x="70" y="189" text-anchor="middle" font-size="11" font-weight="700" fill="#0f2942">L2</text>' +
    '<circle cx="210" cy="185" r="14" fill="#fef3e8" stroke="#c45d1e" stroke-width="2.5"/>' +
    '<text x="210" y="189" text-anchor="middle" font-size="11" font-weight="700" fill="#0f2942">L3</text>' +
    '<line x1="128" y1="62" x2="82" y2="172" stroke="#c45d1e" stroke-width="3"/>' +
    '<line x1="152" y1="62" x2="198" y2="172" stroke="#c45d1e" stroke-width="3"/>' +
    '<line x1="84" y1="185" x2="196" y2="185" stroke="#c45d1e" stroke-width="3"/>' +
    '<g transform="translate(105,117) rotate(112.6)"><path d="M-16 0 L-12 -5 L-8 5 L-4 -5 L0 5 L4 -5 L8 5 L12 -5 L16 0" fill="none" stroke="#0f2942" stroke-width="2.5" stroke-linecap="round"/></g>' +
    '<g transform="translate(175,117) rotate(67.4)"><path d="M-16 0 L-12 -5 L-8 5 L-4 -5 L0 5 L4 -5 L8 5 L12 -5 L16 0" fill="none" stroke="#0f2942" stroke-width="2.5" stroke-linecap="round"/></g>' +
    '<g transform="translate(140,185)"><path d="M-16 0 L-12 -5 L-8 5 L-4 -5 L0 5 L4 -5 L8 5 L12 -5 L16 0" fill="none" stroke="#0f2942" stroke-width="2.5" stroke-linecap="round"/></g>' +
    '<rect x="158" y="88" width="98" height="22" rx="5" fill="#c45d1e"/>' +
    '<text x="207" y="103" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">V_L = V_Ph</text>' +
    '<path d="M24 206 L28 202 L32 210 L36 202 L40 210 L44 206" fill="none" stroke="#0f2942" stroke-width="2"/>' +
    '<text x="50" y="210" font-size="10" font-weight="600" fill="#0f2942">= Load on each phase winding</text>' +
    '<text x="140" y="226" text-anchor="middle" font-size="10" font-weight="600" fill="#5c6b7a">No neutral point in delta</text>' +
    '</svg>',

  delta_current: '<svg viewBox="0 0 280 240" xmlns="http://www.w3.org/2000/svg" aria-label="Delta connection current paths">' +
    '<rect x="8" y="4" width="264" height="28" rx="8" fill="#c45d1e"/>' +
    '<text x="140" y="23" text-anchor="middle" font-size="12" font-weight="700" fill="#fff">DELTA (Δ) CONNECTION</text>' +
    '<circle cx="140" cy="55" r="14" fill="#fef3e8" stroke="#c45d1e" stroke-width="2.5"/>' +
    '<text x="140" y="59" text-anchor="middle" font-size="11" font-weight="700" fill="#0f2942">L1</text>' +
    '<circle cx="70" cy="185" r="14" fill="#fef3e8" stroke="#c45d1e" stroke-width="2.5"/>' +
    '<text x="70" y="189" text-anchor="middle" font-size="11" font-weight="700" fill="#0f2942">L2</text>' +
    '<circle cx="210" cy="185" r="14" fill="#fef3e8" stroke="#c45d1e" stroke-width="2.5"/>' +
    '<text x="210" y="189" text-anchor="middle" font-size="11" font-weight="700" fill="#0f2942">L3</text>' +
    '<line x1="128" y1="62" x2="82" y2="172" stroke="#c45d1e" stroke-width="3"/>' +
    '<line x1="152" y1="62" x2="198" y2="172" stroke="#c45d1e" stroke-width="3"/>' +
    '<line x1="84" y1="185" x2="196" y2="185" stroke="#c45d1e" stroke-width="3"/>' +
    '<g transform="translate(105,117) rotate(112.6)"><path d="M-16 0 L-12 -5 L-8 5 L-4 -5 L0 5 L4 -5 L8 5 L12 -5 L16 0" fill="none" stroke="#0f2942" stroke-width="2.5" stroke-linecap="round"/></g>' +
    '<g transform="translate(175,117) rotate(67.4)"><path d="M-16 0 L-12 -5 L-8 5 L-4 -5 L0 5 L4 -5 L8 5 L12 -5 L16 0" fill="none" stroke="#0f2942" stroke-width="2.5" stroke-linecap="round"/></g>' +
    '<g transform="translate(140,185)"><path d="M-16 0 L-12 -5 L-8 5 L-4 -5 L0 5 L4 -5 L8 5 L12 -5 L16 0" fill="none" stroke="#0f2942" stroke-width="2.5" stroke-linecap="round"/></g>' +
    '<g transform="translate(92,95) rotate(112.6)"><polygon points="0,-6 -6,4 6,4" fill="#1e5a8a"/></g>' +
    '<g transform="translate(188,95) rotate(67.4)"><polygon points="0,-6 -6,4 6,4" fill="#1e5a8a"/></g>' +
    '<g transform="translate(115,185)"><polygon points="0,-6 -6,4 6,4" fill="#1e5a8a"/></g>' +
    '<rect x="88" y="88" width="48" height="22" rx="5" fill="#1e5a8a"/>' +
    '<text x="112" y="103" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">I_Ph</text>' +
    '<rect x="14" y="118" width="108" height="22" rx="5" fill="#c45d1e"/>' +
    '<text x="68" y="133" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">I_L = √3·I_Ph</text>' +
    '<text x="140" y="228" text-anchor="middle" font-size="10" font-weight="600" fill="#5c6b7a">Line current greater than phase</text>' +
    '</svg>'
};
