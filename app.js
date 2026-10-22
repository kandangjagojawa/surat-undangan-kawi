let templateData = null;

const BULAN_INDO = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

document.addEventListener("DOMContentLoaded", () => {
  fetch('undangan.json')
    .then(res => res.json())
    .then(data => { templateData = data; })
    .catch(err => console.error("Gagal memuat undangan.json:", err));
  
  toggleDocTypeFields();
});

function toggleDocTypeFields() {
  const docType = document.getElementById('docType').value;
  document.getElementById('undanganFields').style.display = (docType === 'undangan') ? 'block' : 'none';
  document.getElementById('suratFields').style.display = (docType === 'surat') ? 'block' : 'none';
}

function formatInputTransliterasi(teks) {
  if (!teks) return "";
  
  const bulanVokal = ["april", "agustus", "oktober"];

  return String(teks).replace(/(«[^»]+»|<<[^>]+>>|\b[A-Z]{2,}(?::[1-4])?\b)|([a-zA-ZÀ-ÿéèêÉÈÊ]+)/g, function(match, singkatan, kata) {
    if (singkatan) return singkatan;

    if (kata) {
      if (/^[A-Z]{2,}$/.test(kata)) {
        return kata;
      }

      const kataLower = kata.toLowerCase();
      if (bulanVokal.includes(kataLower)) {
        return kataLower.charAt(0).toUpperCase() + kataLower.slice(1);
      }

      return kataLower;
    }
    return match;
  });
}

function formatTanggalAksara(dateString, transliterateFn) {
  if (!dateString) return "";
  const d = new Date(dateString);
  const dayNum = d.getDate();
  const monthName = BULAN_INDO[d.getMonth()];
  const yearNum = d.getFullYear();

  const dayAksara = transliterateFn(String(dayNum));
  
  const firstChar = monthName.charAt(0);
  const isVowelStart = /^[AIEOUaieou]/.test(firstChar);
  const formattedMonth = isVowelStart 
    ? firstChar.toUpperCase() + monthName.slice(1).toLowerCase() 
    : monthName.toLowerCase();

  const monthAksara = transliterateFn(formattedMonth);
  const yearAksara = transliterateFn(String(yearNum));

  return `${dayAksara} ${monthAksara} ${yearAksara}`;
}

function getRandomText(array) {
  if (!array || array.length === 0) return "";
  const idx = Math.floor(Math.random() * array.length);
  return array[idx];
}

document.getElementById('docForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const docType = document.getElementById('docType').value;
  const rawTransliterateFn = window.transliterateKawi;

  if (typeof rawTransliterateFn !== 'function') {
    alert("Fungsi transliterasi Kawi (appkawi.js) tidak ditemukan.");
    return;
  }

  const t = function(text) {
    if (!text) return "";
    return rawTransliterateFn(formatInputTransliterasi(text));
  };

  const pdfContainer = document.getElementById('pdfContainer');
  pdfContainer.className = 'a4-page font-kawi';

  // 1. Kota & Tanggal Surat
  const kota = document.getElementById('inputKota').value;
  const tglSurat = document.getElementById('inputTanggalSurat').value;
  const kotaAksara = t(kota);
  const tglSuratAksara = formatTanggalAksara(tglSurat, t);
  document.getElementById('previewKotaTanggal').innerText = `${kotaAksara}, ${tglSuratAksara}`;

  // 2. Tujuan
  const penerima = document.getElementById('inputPenerima').value;
  const labelTujuan = "Kagem: Bapak/Ibu/Sadhérék";
  document.getElementById('previewTujuanLabel').innerText = t(labelTujuan);
  document.getElementById('previewPenerimaNama').innerText = t(penerima);

  // 3. Isi Dokumen
  if (docType === 'undangan') {
    document.getElementById('previewDetailAcara').style.display = 'block';
    document.getElementById('previewIsiSuratText').style.display = 'none';

    if (templateData && (templateData.jawa || templateData.indonesia)) {
      const templateGroup = templateData.jawa || templateData.indonesia;
      const pengantarRaw = getRandomText(templateGroup.pengantar);
      const penutupRaw = getRandomText(templateGroup.penutup);
      document.getElementById('previewPengantar').innerText = t(pengantarRaw);
      document.getElementById('previewPenutup').innerText = t(penutupRaw);
    }

    const tglAcara = document.getElementById('inputTanggalAcara').value;
    const jamAcara = document.getElementById('inputJamAcara').value;
    const tempatAcara = document.getElementById('inputTempatAcara').value;
    const namaAcara = document.getElementById('inputNamaAcara').value;

    document.getElementById('lblHariTanggal').innerText = t("Hari, Tanggal");
    document.getElementById('lblJam').innerText = t("Jam");
    document.getElementById('lblTempat').innerText = t("Tempat");
    document.getElementById('lblAcara').innerText = t("Acara");

    document.getElementById('previewHariTanggal').innerText = formatTanggalAksara(tglAcara, t);
    document.getElementById('previewJam').innerText = t(jamAcara);
    document.getElementById('previewTempat').innerText = t(tempatAcara);
    document.getElementById('previewNamaAcara').innerText = t(namaAcara);

  } else {
    document.getElementById('previewDetailAcara').style.display = 'none';
    document.getElementById('previewIsiSuratText').style.display = 'block';
    document.getElementById('previewPengantar').innerText = "";
    document.getElementById('previewPenutup').innerText = "";

    const isiSuratRaw = document.getElementById('inputIsiSurat').value;
    document.getElementById('previewIsiSuratText').innerText = t(isiSuratRaw);
  }

  // 4. Pengirim
  const pengirim = document.getElementById('inputPengirim').value;
  const labelPengirim = "Ingkang ngaturi:";
  document.getElementById('previewPengirimLabel').innerText = t(labelPengirim);
  document.getElementById('previewPengirimNama').innerText = t(pengirim);

  // Tampilkan Section Preview
  document.getElementById('formSection').style.display = 'none';
  document.getElementById('previewSection').style.display = 'block';
  document.getElementById('previewActions').style.display = 'flex';
  document.getElementById('postDownloadMenu').style.display = 'none';
});

function editForm() {
  document.getElementById('formSection').style.display = 'block';
  document.getElementById('previewSection').style.display = 'none';
}

function downloadPDF() {
  window.print();

  setTimeout(() => {
    document.getElementById('previewActions').style.display = 'none';
    document.getElementById('postDownloadMenu').style.display = 'block';
  }, 500);
}

function resetForm() {
  document.getElementById('docForm').reset();
  toggleDocTypeFields();
  document.getElementById('formSection').style.display = 'block';
  document.getElementById('previewSection').style.display = 'none';
}
