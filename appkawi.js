/**
 * App Kawi Transliteration Engine & Controller
 * Dapat digunakan secara independen di aplikasi web maupun Node.js/Modul JS lainnya.
 */

// --- KONSTANTA AKSARA KAWI (UNICODE BLOCK 11F00-11F5F) ---
const K = {
    REPHA:'\u{11F02}', CONJ:'\u{11F42}', KILLER:'\u{11F41}', ANUS:'\u{11F01}', VIS:'\u{11F03}',
    A:'\u{11F04}', AA:'\u{11F05}', I:'\u{11F06}', II:'\u{11F07}', U:'\u{11F08}', UU:'\u{11F09}', Rvoc:'\u{11F0A}', Lvoc:'\u{11F0C}', E:'\u{11F0E}', AI:'\u{11F0F}', O:'\u{11F10}',
    KA:'\u{11F12}', KHA:'\u{11F13}', GA:'\u{11F14}', GHA:'\u{11F15}', NGA:'\u{11F16}', CA:'\u{11F17}', CHA:'\u{11F18}', JA:'\u{11F19}', JHA:'\u{11F1A}', NYA:'\u{11F1B}', TTA:'\u{11F1C}', TTHA:'\u{11F1D}', DDA:'\u{11F1E}', DDHA:'\u{11F1F}', NNA:'\u{11F20}', TA:'\u{11F21}', THA:'\u{11F22}', DA:'\u{11F23}', DHA:'\u{11F24}', NA:'\u{11F25}', PA:'\u{11F26}', PHA:'\u{11F27}', BA:'\u{11F28}', BHA:'\u{11F29}', MA:'\u{11F2A}', YA:'\u{11F2B}', RA:'\u{11F2C}', LA:'\u{11F2D}', WA:'\u{11F2E}', SHA:'\u{11F2F}', SSA:'\u{11F30}', SA:'\u{11F31}', HA:'\u{11F32}',
    VS_AA:'\u{11F34}', VS_I:'\u{11F36}', VS_II:'\u{11F37}', VS_U:'\u{11F38}', VS_UU:'\u{11F39}', VS_R:'\u{11F3A}', VS_L:'\u{11F3C}', VS_E:'\u{11F3E}', VS_AI:'\u{11F3F}', VS_EU:'\u{11F40}',
    DANDA:'\u{11F43}', DDANDA:'\u{11F44}',
    DIG:['\u{11F50}','\u{11F51}','\u{11F52}','\u{11F53}','\u{11F54}','\u{11F55}','\u{11F56}','\u{11F57}','\u{11F58}','\u{11F59}']
};
K.VS_O = K.VS_E + K.VS_AA; 
K.VS_AU = K.VS_AI + K.VS_AA;

const WARGA = {
    Kanthya: [K.KA, K.KHA, K.GA, K.GHA, K.NGA, K.HA],
    Talawya: [K.CA, K.CHA, K.JA, K.JHA, K.NYA, K.SHA, K.YA],
    Murdhanya: [K.TTA, K.TTHA, K.DDA, K.DDHA, K.NNA, K.SSA, K.RA],
    Dantya: [K.TA, K.THA, K.DA, K.DHA, K.NA, K.SA, K.LA],
    Osthya: [K.PA, K.PHA, K.BA, K.BHA, K.MA, K.WA]
};

function getWarga(ch) {
    for (let w in WARGA) { if (WARGA[w].includes(ch)) return w; }
    return null;
}
function isSibilant(ch) { return [K.SA, K.SHA, K.SSA].includes(ch); }
function isNasalN(ch) { return [K.NA, K.NYA, K.NNA].includes(ch); }
function isK(ch) { return ch === K.KA; }
function isRA(ch) { return ch === K.RA; }

const MAP = {
    'ng':K.NGA, 'ny':K.NYA, 'kh':K.KHA, 'gh':K.GHA, 'ch':K.CHA, 'jh':K.JHA, 'th':K.THA, 'dh':K.DHA, 'ph':K.PHA, 'bh':K.BHA, 'sh':K.SHA, 'sy':K.SHA, 'tt':K.TTA, 'dd':K.DDA, 'tth':K.TTHA, 'ddh':K.DDHA, 'nn':K.NNA, 'ss':K.SSA,
    'k':K.KA, 'g':K.GA, 'c':K.CA, 'j':K.JA, 't':K.TA, 'd':K.DA, 'n':K.NA, 'p':K.PA, 'b':K.BA, 'm':K.MA, 'y':K.YA, 'r':K.RA, 'l':K.LA, 'w':K.WA, 's':K.SA, 'h':K.HA,
    'T':K.TTA, 'D':K.DDA, 'N':K.NNA, 'S':K.SSA, 'Tt':K.TTA, 'Dd':K.DDA, 'Nn':K.NNA, 'Ss':K.SSA, 'Tth':K.TTHA, 'Ddh':K.DDHA, 'Th':K.TTHA, 'Dh':K.DDHA, 'Ph':K.PHA, 'Bh':K.BHA, 'Sh':K.SHA, 'Sy':K.SHA
};

function mC(s, i) {
    let s3 = s.substr(i, 3); if (MAP[s3]) return { ch: MAP[s3], len: 3, k: s3.toLowerCase() };
    let s3l = s3.toLowerCase(); if (MAP[s3l]) return { ch: MAP[s3l], len: 3, k: s3l };
    let s2 = s.substr(i, 2); if (MAP[s2]) return { ch: MAP[s2], len: 2, k: s2.toLowerCase() };
    let s2l = s2.toLowerCase(); if (MAP[s2l]) return { ch: MAP[s2l], len: 2, k: s2l };
    let s1 = s.substr(i, 1); if (MAP[s1]) return { ch: MAP[s1], len: 1, k: s1.toLowerCase() };
    let s1l = s1.toLowerCase(); if (MAP[s1l]) return { ch: MAP[s1l], len: 1, k: s1l };
    return null;
}

function mV(s, i) {
    let two = s.substr(i, 2);
    let twoLow = two.toLowerCase();
    if (twoLow === "e'" || twoLow === "e’" || twoLow === 'ex') return { v: two, len: 2 };
    let s2 = s.substr(i, 2);
    let s2Low = s2.toLowerCase();
    if (['aa', 'ii', 'uu', 'ai', 'au', 're', 'le'].includes(s2Low)) return { v: s2, len: 2 };
    let s1 = s.substr(i, 1);
    if (['a', 'i', 'u', 'e', 'o', 'é', 'è', 'ê'].includes(s1.toLowerCase()) || s1 === 'E' || s1 === 'O') return { v: s1, len: 1 };
    return null;
}

function isCapitalVowel(v) {
    if (!v) return false;
    let first = v[0];
    return first.toUpperCase() === first && first.toLowerCase() !== first;
}

function sand(v) {
    let l = v.toLowerCase();
    if (l === 'a') return '';
    if (l === 'aa') return K.VS_AA;
    if (l === 'i') return K.VS_I;
    if (l === 'ii') return K.VS_II;
    if (l === 'u') return K.VS_U;
    if (l === 'uu') return K.VS_UU;
    if (l === 'e') return K.VS_EU;
    if (l === "e'" || l === 'ex' || l === 'é' || l === 'è' || l === 'ê') return K.VS_E;
    if (l === 'o') return K.VS_O;
    if (l === 'ai') return K.VS_AI;
    if (l === 'au') return K.VS_AU;
    if (l === 're') return K.VS_R;
    if (l === 'le') return K.VS_L;
    return '';
}

function inde(v) {
    let l = v.toLowerCase();
    if (l === 'aa') return K.AA;
    if (l === 'ii') return K.II;
    if (l === 'uu') return K.UU;
    if (l === 'ai') return K.AI;
    if (l === 'au') return K.O + K.VS_AA;
    if (l === 're') return K.Rvoc;
    if (l === 'le') return K.Lvoc;
    if (l === 'a') return K.A;
    if (l === 'i') return K.I;
    if (l === 'u') return K.U;
    if (l === 'e') return K.A + K.VS_EU;
    if (l === "e'" || l === 'ex' || l === 'é' || l === 'è') return K.E;
    if (l === 'o') return K.O;
    return K.A;
}

function tokenize(s) {
    let t = []; let cur = '';
    for (let i = 0; i < s.length; i++) {
        let c = s[i];
        if (/[a-zA-ZéèêÉÈÊ'0-9\-_]/.test(c)) cur += c;
        else { if (cur) { t.push({ w: cur }); cur = ''; } t.push({ s: c }); }
    }
    if (cur) t.push({ w: cur });
    return t;
}

/**
 * Fungsi Utama Transliterasi Latin ke Aksara Kawi
 * @param {string} raw - Teks Latin yang akan diubah ke Aksara Kawi
 * @returns {string} - Hasil konversi Aksara Kawi
 */
function transliterate(raw) {
    if (!raw) return '';

    // Penanganan Makro Tanda Baca & Simbol Kawi (Tanpa Bentrokan Karakter Latin)
    raw = raw
        .replace(/\$\$/g, '\u{11F4F}')    // CLOSING SPIRAL (11F4F)
        .replace(/\$/g, '\u{11F4E}')     // SPIRAL (11F4E)
        .replace(/~~/g, '\u{11F00}')     // CANDRABINDU (11F00)
        .replace(/~/g, '\u{11F00}')      // CANDRABINDU (11F00)
        .replace(/\+/g, '\u{11F5A}')     // NUKTA (11F5A)
        .replace(/\|\|/g, '\u{11F45}')   // SECTION MARKER (11F45)
        .replace(/\|=/g, '\u{11F46}')    // ALTERNATE SECTION MARKER (11F46)
        .replace(/\*/g, '\u{11F47}')     // FLOWER (11F47)
        .replace(/=/g, '\u{11F48}')      // SPACE FILLER (11F48)
        .replace(/::/g, '\u{11F4B}')     // TRIPLE DOT (11F4B)
        .replace(/%/g, '\u{11F49}')      // DOT (11F49)
        .replace(/:/g, '\u{11F4A}')      // DOUBLE DOT (11F4A)
        .replace(/##/g, '\u{11F4D}')     // FILLED CIRCLE (11F4D)
        .replace(/#/g, '\u{11F4C}');     // CIRCLE (11F4C)

    // Otomatisasi Apitan Angka dengan KAWI PUNCTUATION DOUBLE DOT (11F4A)
    raw = raw.replace(/\d+/g, '\u{11F4A}$&' + '\u{11F4A}');

    let toks = tokenize(raw);
    let out = '';
    let pending = null;
    let prevVowel = false;

    for (let ti = 0; ti < toks.length; ti++) {
        let tk = toks[ti];
        if (tk.s !== undefined) {
            let ch = tk.s;
            if (ch === ' ') { continue; }
            if (ch === '\n') { out += '\n'; continue; }
            
            if (ch === '.') {
                if (pending) {
                    if (pending.type === 'ng') out += K.ANUS;
                    else if (pending.type === 'h') out += K.VIS;
                    else if (pending.ch === K.RA) out += K.RA + K.KILLER;
                    else out += pending.ch + K.KILLER;
                    pending = null;
                }
                out += K.DDANDA; prevVowel = false; continue;
            }
            if (ch === ',' || ch === '|' || ch === '/') {
                if (pending) {
                    if (pending.type === 'ng') out += K.ANUS;
                    else if (pending.type === 'h') out += K.VIS;
                    else if (pending.ch === K.RA) out += K.RA + K.KILLER;
                    else out += pending.ch + K.KILLER;
                    pending = null;
                }
                out += K.DANDA; continue;
            }
            out += ch; continue;
        }

        let word = tk.w;
        let lastConsonant = null;

        if (pending) {
            let fc = mC(word, 0);
            let fv = mV(word, 0);
            let isFvReLeTaling = false;
            
            if (fv) {
                let lowTmp = fv.v.toLowerCase();
                if (lowTmp === 're' || lowTmp === 'le') {
                    let afterTmp = fv.len;
                    let nextTmp = word[afterTmp] || '';
                    if (nextTmp === "'" || nextTmp === "’" || word.substr(afterTmp, 1).toLowerCase() === 'x' || ["é", "è", "ê"].includes(nextTmp.toLowerCase())) {
                        isFvReLeTaling = true;
                    }
                }
            }

            if (fv && !isFvReLeTaling) {
                let low = fv.v.toLowerCase();
                if (low === 're' || low === 'le') {
                    if (pending.type === 'normal') {
                        if (pending.ch === K.RA) {
                            out += K.REPHA + (low === 're' ? K.Rvoc : K.Lvoc);
                        } else if (low === 'le') {
                            out += pending.ch + K.CONJ + K.LA + K.VS_EU;
                        } else {
                            out += pending.ch + K.VS_R;
                        }
                    } else if (pending.type === 'ng') {
                        out += K.ANUS + (low === 're' ? K.Rvoc : K.Lvoc);
                    } else if (pending.type === 'h') {
                        out += K.VIS + (low === 're' ? K.Rvoc : K.Lvoc);
                    } else {
                        out += inde(fv.v);
                    }
                    word = word.substr(fv.len);
                    pending = null; prevVowel = true; if (!word) continue;
                } else {
                    let isCap = isCapitalVowel(fv.v);
                    if (isCap) {
                        if (pending.type === 'normal') {
                            out += pending.ch + K.KILLER + inde(fv.v);
                        } else if (pending.type === 'ng') {
                            out += K.ANUS + inde(fv.v);
                        } else if (pending.type === 'h') {
                            out += K.VIS + inde(fv.v);
                        } else if (pending.ch === K.RA) {
                            out += K.RA + K.KILLER + inde(fv.v);
                        } else {
                            out += inde(fv.v);
                        }
                    } else {
                        if (pending.ch === K.RA && low === 'e') {
                            out += K.Rvoc;
                        } else if (pending.ch === K.LA && low === 'e') {
                            out += K.Lvoc;
                        } else if (pending.type === 'ng') { out += K.NGA + sand(fv.v); }
                        else if (pending.type === 'h') { out += K.HA + sand(fv.v); }
                        else { out += pending.ch + sand(fv.v); }
                    }
                    word = word.substr(fv.len);
                    pending = null; prevVowel = true; if (!word) continue;
                }
            } else if (fc) {
                if (pending.type === 'ng') { out += K.ANUS; }
                else if (pending.type === 'h') { out += K.VIS; }
                else if (pending.ch === K.RA) {
                    out += K.REPHA;
                    let after = fc.len;
                    while (word[after] === '-' || word[after] === '_') after++;
                    let vAfter = mV(word, after);
                    let fChRA = fc.ch;
                    if (isNasalN(fChRA)) fChRA = K.NNA;
                    if (isSibilant(fChRA)) fChRA = K.SSA;
                    if (vAfter) {
                        out += fChRA + sand(vAfter.v);
                        word = word.substr(after + vAfter.len);
                    } else {
                        out += fChRA + K.CONJ;
                        word = word.substr(after);
                    }
                    pending = null; prevVowel = !!vAfter; lastConsonant = fChRA; if (!word) continue;
                } else {
                    let after = fc.len;
                    while (word[after] === '-' || word[after] === '_') after++;
                    let vAfter = mV(word, after);
                    
                    let pCh = pending.ch; let fCh = fc.ch;
                    if (isSibilant(pCh)) {
                        let w = getWarga(fCh);
                        if (w === 'Talawya') pCh = K.SHA;
                        else if (w === 'Murdhanya') pCh = K.SSA;
                        else if (w === 'Dantya') pCh = K.SA;
                        else if (w === 'Kanthya' || w === 'Osthya') pCh = K.SA;
                    }
                    if (isNasalN(pCh)) {
                        let w = getWarga(fCh);
                        if (w === 'Talawya') pCh = K.NYA;
                        else if (w === 'Murdhanya') pCh = K.NNA;
                        else if (w === 'Dantya') pCh = K.NA;
                    }
                    if (isK(pCh) && isSibilant(fCh)) {
                        fCh = K.SSA;
                    }
                    if (isRA(pCh)) {
                        if (isNasalN(fCh)) fCh = K.NNA;
                        if (isSibilant(fCh)) fCh = K.SSA;
                    }
                    
                    if (vAfter) {
                        let lowAfter = vAfter.v.toLowerCase();
                        if (lowAfter === 're' || lowAfter === 'le') {
                            let afterVAfter = after + vAfter.len;
                            while (word[afterVAfter] === '-' || word[afterVAfter] === '_') afterVAfter++;
                            let nextCAfter = word[afterVAfter] || '';
                            let isTalingAfterVAfter = (nextCAfter === "'" || nextCAfter === "’" || word.substr(afterVAfter, 1).toLowerCase() === 'x' || ["é", "è", "ê"].includes(nextCAfter.toLowerCase()));
                            if (isTalingAfterVAfter) {
                                let raOrLa = (lowAfter === 're' ? K.RA : K.LA);
                                out += pCh + K.CONJ + fCh + K.CONJ + raOrLa + K.VS_E;
                                word = word.substr(afterVAfter + 1);
                                pending = null; prevVowel = true; if (!word) continue;
                            } else {
                                if (lowAfter === 'le') {
                                    out += pCh + K.CONJ + fCh + K.CONJ + K.LA + K.VS_EU;
                                } else {
                                    out += pCh + K.CONJ + fCh + sand(vAfter.v);
                                }
                                word = word.substr(after + vAfter.len);
                                lastConsonant = fCh;
                            }
                        } else {
                            out += pCh + K.CONJ + fCh + sand(vAfter.v);
                            word = word.substr(after + vAfter.len);
                        }
                    } else {
                        out += pCh + K.CONJ + fCh + K.CONJ;
                        word = word.substr(after);
                        lastConsonant = fCh;
                    }
                    pending = null; prevVowel = !!vAfter; if (!word) continue;
                }
                if (pending && (pending.type === 'ng' || pending.type === 'h' || pending.ch === K.RA)) {
                    pending = null; prevVowel = false;
                }
            } else {
                if (pending.type === 'ng') out += K.ANUS;
                else if (pending.type === 'h') out += K.VIS;
                else if (pending.ch === K.RA) out += K.RA + K.KILLER;
                else out += pending.ch + K.KILLER;
                pending = null;
            }
        } else if (prevVowel) {
            let fv = mV(word, 0);
            if (fv) {
                let lowFv = fv.v.toLowerCase();
                if (lowFv === 'le') {
                    out += K.Lvoc;
                    word = word.substr(fv.len);
                    prevVowel = true; if (!word) continue;
                } else if (lowFv === 're') {
                    out += K.Rvoc;
                    word = word.substr(fv.len);
                    prevVowel = true; if (!word) continue;
                } else {
                    let isCap = isCapitalVowel(fv.v);
                    if (isCap) {
                        out += inde(fv.v);
                    } else {
                        out += K.HA + sand(fv.v);
                    }
                    word = word.substr(fv.len);
                    prevVowel = true; if (!word) continue;
                }
            }
        }

        let i = 0; let localV = false; let lastVowel = null; let lastTransformedNc = null; let lastTransformedNcLen = 0;
        while (i < word.length) {
            if (word[i] === '-' || word[i] === '_') { i++; continue; }
            if (word[i] >= '0' && word[i] <= '9') { out += K.DIG[parseInt(word[i])]; i++; localV = true; continue; }

            let vowAtI = mV(word, i);
            if (vowAtI) {
                let low = vowAtI.v.toLowerCase();
                if (low === 're' || low === 'le') {
                    let after = i + vowAtI.len;
                    while (word[after] === '-' || word[after] === '_') after++;
                    let nextChar = word[after] || '';
                    let isTalingAfter = (nextChar === "'" || nextChar === "’" || word.substr(after, 1).toLowerCase() === 'x' || ["é", "è", "ê"].includes(nextChar.toLowerCase()));
                    if (!isTalingAfter) {
                        out += inde(vowAtI.v);
                        i += vowAtI.len; localV = true; lastVowel = vowAtI.v; lastConsonant = (low === 're' ? K.RA : K.LA); continue;
                    }
                }
            }

            let cons = null;
            if (lastTransformedNc) {
                cons = { ch: lastTransformedNc, len: lastTransformedNcLen, k: '' };
                lastTransformedNc = null;
                lastTransformedNcLen = 0;
            } else {
                cons = mC(word, i);
            }
            
            if (cons) {
                if (lastConsonant && isRA(lastConsonant)) {
                    if (isNasalN(cons.ch)) { cons.ch = K.NNA; }
                    if (isSibilant(cons.ch)) { cons.ch = K.SSA; }
                }
                
                let nxt = i + cons.len;
                while (word[nxt] === '-' || word[nxt] === '_') nxt++;
                
                if (cons.k === 'r') {
                    let nc = mC(word, nxt);
                    if (nc) {
                        let after = nxt + nc.len;
                        while (word[after] === '-' || word[after] === '_') after++;
                        let vAfter = mV(word, after);
                        let ncCh = nc.ch;
                        if (isNasalN(ncCh)) ncCh = K.NNA;
                        if (isSibilant(ncCh)) ncCh = K.SSA;
                        
                        // === Pengecualian KHUSUS kata "rwa" ===
                        if (word.toLowerCase() === 'rwa' && i === 0) {
                            out += K.RA + K.CONJ;
                            if (vAfter) { out += ncCh + sand(vAfter.v); i = after + vAfter.len; lastVowel = vAfter.v; lastConsonant = ncCh; }
                            else { out += ncCh + K.CONJ; i = after; lastVowel = null; lastConsonant = ncCh; }
                            localV = !!vAfter; continue;
                        }

                        // === Pengecualian KHUSUS kata "rsi" ===
                        if (word.toLowerCase() === 'rsi' && i === 0) {
                            out += K.Rvoc + K.CONJ + K.SSA + K.VS_I;
                            i = word.length;
                            localV = true; lastVowel = 'i'; lastConsonant = K.SSA;
                            continue;
                        }

                        out += K.REPHA;
                        if (vAfter) { out += ncCh + K.CONJ + ncCh + sand(vAfter.v); i = after + vAfter.len; lastVowel = vAfter.v; lastConsonant = ncCh; }
                        else { out += ncCh + K.CONJ + ncCh + K.CONJ; i = after; lastVowel = null; lastConsonant = ncCh; }
                        localV = !!vAfter; continue;
                    }
                }
                
                let v = mV(word, nxt);
                if (v) {
                    let vLow = v.v.toLowerCase();
                    if (vLow === 're' || vLow === 'le') {
                        let afterV = nxt + v.len;
                        while (word[afterV] === '-' || word[afterV] === '_') afterV++;
                        let nextC = word[afterV] || '';
                        let isTalingAfterV = (nextC === "'" || nextC === "’" || word.substr(afterV, 1).toLowerCase() === 'x' || ["é", "è", "ê"].includes(nextC.toLowerCase()));
                        if (isTalingAfterV) {
                            let raOrLa = (vLow === 're' ? K.RA : K.LA);
                            out += cons.ch + K.CONJ + raOrLa + K.VS_E;
                            i = afterV + 1; localV = true; lastVowel = "e'"; continue;
                        }
                    }
                    
                    if (vLow === 'le') {
                        if (cons.k === 'r') {
                            out += K.REPHA + K.Lvoc;
                        } else {
                            out += cons.ch + K.CONJ + K.LA + K.VS_EU;
                        }
                        i = nxt + v.len; localV = true; lastVowel = v.v; lastConsonant = K.LA; continue;
                    }

                    if (vLow === 're') {
                        if (cons.k === 'r') {
                            out += K.REPHA + K.Rvoc;
                        } else {
                            out += cons.ch + sand(v.v);
                        }
                        i = nxt + v.len; localV = true; lastVowel = v.v; lastConsonant = K.RA; continue;
                    }

                    if ((cons.k === 'r' || cons.k === 'l') && ["e'", "e’", "ex", "é", "è", "ê"].includes(vLow)) {
                        out += cons.ch + K.VS_E;
                        i = nxt + v.len; localV = true; lastVowel = v.v; lastConsonant = cons.ch; continue;
                    }
                    out += cons.ch + sand(v.v);
                    i = nxt + v.len; localV = true; lastVowel = v.v; lastConsonant = cons.ch; continue;
                } else {
                    let nc = mC(word, nxt);
                    if (nc) {
                        let cCh = cons.ch; let nCh = nc.ch;
                        if (isSibilant(cCh)) {
                            let w = getWarga(nCh);
                            if (w === 'Talawya') cCh = K.SHA;
                            else if (w === 'Murdhanya') cCh = K.SSA;
                            else if (w === 'Dantya') cCh = K.SA;
                            else if (w === 'Kanthya' || w === 'Osthya') cCh = K.SA;
                        }
                        if (isNasalN(cCh)) {
                            let w = getWarga(nCh);
                            if (w === 'Talawya') cCh = K.NYA;
                            else if (w === 'Murdhanya') cCh = K.NNA;
                            else if (w === 'Dantya') cCh = K.NA;
                        }
                        if (isK(cCh) && isSibilant(nCh)) {
                            nCh = K.SSA;
                        }
                        if (isRA(cCh)) {
                            if (isNasalN(nCh)) nCh = K.NNA;
                            if (isSibilant(nCh)) nCh = K.SSA;
                        }
                        out += cCh + K.CONJ;
                        lastTransformedNc = nCh;
                        lastTransformedNcLen = nc.len;
                        i = nxt; localV = false; lastConsonant = cCh; continue;
                    } else {
                        if (cons.k === 'ng') { pending = { ch: K.NGA, type: 'ng' }; }
                        else if (cons.k === 'h') { pending = { ch: K.HA, type: 'h' }; }
                        else { pending = { ch: cons.ch, type: 'normal' }; }
                        i = nxt; break;
                    }
                }
            }
            
            let vow = mV(word, i);
            if (vow) {
                if (localV && lastVowel) {
                    let prevLow = lastVowel.toLowerCase();
                    let pangCons = null;
                    if (prevLow === 'a' || prevLow === 'aa' || prevLow === 'e') {
                        pangCons = K.HA;
                    } else if (prevLow === 'i' || prevLow === 'ii' || prevLow === "e'" || prevLow === 'ex' || prevLow === 'é' || prevLow === 'è' || prevLow === 'ê' || prevLow.startsWith('i') || prevLow.startsWith("e'") || prevLow.startsWith('é') || prevLow.startsWith('è') || prevLow.startsWith('ê')) {
                        pangCons = K.YA;
                    } else if (prevLow === 'u' || prevLow === 'uu' || prevLow === 'o' || prevLow.startsWith('u') || prevLow.startsWith('o')) {
                        pangCons = K.WA;
                    } else if (prevLow.startsWith('a')) {
                        pangCons = K.HA;
                    } else {
                        pangCons = K.HA;
                    }
                    
                    out += pangCons + sand(vow.v);
                    i += vow.len; localV = true; lastVowel = vow.v; lastConsonant = null; continue;
                }
                
                let low = vow.v.toLowerCase();
                if (low === 're' || low === 'le') {
                    out += inde(vow.v);
                    lastConsonant = (low === 're' ? K.RA : K.LA);
                } else {
                    if (isCapitalVowel(vow.v)) {
                        out += inde(vow.v);
                    } else {
                        out += K.HA + sand(vow.v);
                    }
                }
                i += vow.len; localV = true; lastVowel = vow.v; lastConsonant = null; continue;
            }
            out += word[i]; i++;
        }
        if (pending) prevVowel = false; else prevVowel = localV;
    }

    if (pending) {
        if (pending.type === 'ng') out += K.ANUS;
        else if (pending.type === 'h') out += K.VIS;
        else if (pending.ch === K.RA) out += K.RA + K.KILLER;
        else out += pending.ch + K.KILLER;
    }
    return out;
}

// --- EKSPORE UNTUK APLIKASI LAIN / MODUL ---
if (typeof window !== 'undefined') {
    window.transliterateKawi = transliterate;
    window.Kawi = { transliterate, K, WARGA, MAP };
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { transliterate, K, WARGA, MAP };
}

// --- INISIALISASI TAMPILAN (DOM INTEGRATION) ---
document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('textInput');
    const previewOutput = document.getElementById('previewOutput');
    const fontSizeRange = document.getElementById('fontSizeRange');
    const fontSizeVal = document.getElementById('fontSizeVal');
    const lineHeightRange = document.getElementById('lineHeightRange');
    const lineHeightVal = document.getElementById('lineHeightVal');
    const charCount = document.getElementById('charCount');
    const copyBtn = document.getElementById('copyBtn');
    const clearBtn = document.getElementById('clearBtn');

    if (textInput && previewOutput) {
        function updatePreview() {
            const latinText = textInput.value;
            const kawiText = transliterate(latinText);
            previewOutput.textContent = kawiText;
            if (charCount) charCount.textContent = `Jumlah Karakter: ${kawiText.length}`;
        }

        textInput.addEventListener('input', updatePreview);

        if (fontSizeRange && fontSizeVal) {
            fontSizeRange.addEventListener('input', (e) => {
                const size = e.target.value;
                fontSizeVal.textContent = size;
                previewOutput.style.fontSize = size + 'px';
            });
        }

        if (lineHeightRange && lineHeightVal) {
            lineHeightRange.addEventListener('input', (e) => {
                const height = e.target.value;
                lineHeightVal.textContent = height;
                previewOutput.style.lineHeight = height;
            });
        }

        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                const textToCopy = previewOutput.textContent;
                if (!textToCopy) return;
                navigator.clipboard.writeText(textToCopy).then(() => {
                    alert('Aksara Kawi berhasil disalin ke papan klip.');
                });
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                textInput.value = '';
                updatePreview();
                textInput.focus();
            });
        }

        updatePreview();
    }
});
