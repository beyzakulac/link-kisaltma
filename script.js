// HTML'den gerekli elementleri al
const btn = document.getElementById("kisa"); // Kısalt butonunu al
const input = document.getElementById("original-link"); // Orjinal link inputunu al
const shortLinkText = document.getElementById("short-link"); // Kısa link metni gösterecek elementi al
const kisaltilanlarDiv = document.getElementById("kisaltilanlar"); // Kısaltılan linklerin gösterileceği bölümü al

function shortLink(url) {
  return fetch(`https://api.shrtco.de/v2/shorten?url=${url}`)
    .then((response) => response.json())
    .then((data) => (data.ok ? data.result.short_link : ""));
}

// Kısaltılan linkleri saklamak için bir dizi tanımla, localstorage'dan veriyi al veya boş dizi oluştur
let kisaltilanlar = JSON.parse(localStorage.getItem("kisaltilanlar")) || [];

// Kısalt butonuna tıklama olayını ekle
btn.addEventListener("click", () => {
  // Orjinal linki al
  const url = input.value;
  // Orjinal linki kısaltan fonksiyonu çağır
  shortLink(url)
    .then((shortLink) => {
      // Kısa link başarılı bir şekilde elde edildiyse
      if (shortLink) {
        // Kısa linki kisaltilanlar dizisine ekle
        kisaltilanlar.push({ originalLink: url, shortLink: shortLink });
        // Kısaltılan linkleri localstorage'a kaydet
        localStorage.setItem("kisaltilanlar", JSON.stringify(kisaltilanlar));
        // Kısaltılan linkleri gösteren bölümü güncelle
        showKisaltilanlar();
        // Orjinal link inputunu temizle
        input.value = "";
      } else {
        // Kısa link alınamadıysa, hata mesajı göster
        alert(
          "Link kısaltma işlemi başarısız oldu. Lütfen geçerli bir link girin."
        );
      }
    })
    .catch((error) => {
      // Kısaltma işlemi sırasında hata oluşursa, hata mesajı göster
      console.error("Hata oluştu:", error);
      alert("Link kısaltma işlemi başarısız oldu. Lütfen tekrar deneyin.");
    });
});

// Kısaltılan linkleri gösteren fonksiyon
function showKisaltilanlar() {
  // Kısaltılan linkleri gösteren bölümü temizle
  kisaltilanlarDiv.innerHTML = "";

  // Kısaltılan her link için bir div oluştur ve içine link bilgilerini ekle
  kisaltilanlar.forEach((link, index) => {
    const linkDiv = document.createElement("div");
    linkDiv.classList.add("kisaltilan-link"); // Oluşturulan div'e CSS sınıfını ekle
    linkDiv.innerHTML = `
      <p class="link-text"><a href="${link.shortLink}" target="_blank">${link.shortLink}</a></p>
      <i class="fas fa-copy icon" title="Kopyala" onclick="copyLink(${index})"></i>
      <i class="fas fa-trash-alt icon" title="Sil" onclick="deleteLink(${index})"></i>
    `;
    // Oluşturulan div'i kısaltılan linkler bölümüne ekle
    kisaltilanlarDiv.appendChild(linkDiv);
  });

  // Animasyon için opacity'yi 0'dan 1'e ayarla
  kisaltilanlarDiv.style.opacity = 1;
}

// Kısa linki kopyalayan fonksiyon
function copyLink(index) {
  const shortLink = kisaltilanlar[index].shortLink;
  // Kısa linki panoya kopyala
  navigator.clipboard
    .writeText(shortLink)
    .then(() => {
      // Kısa link kopyalandığında kullanıcıya bildirim göster
      alert("Link kopyalandı: " + shortLink);
    })
    .catch((error) => {
      // Kopyalama işlemi sırasında hata oluşursa, hata mesajı göster
      console.error("Kopyalama hatası:", error);
    });
}

// Kısa linki silen fonksiyon
function deleteLink(index) {
  // İlgili kısa linki kisaltilanlar dizisinden sil
  kisaltilanlar.splice(index, 1);
  // Güncellenmiş kısaltılan linkleri localstorage'a kaydet
  localStorage.setItem("kisaltilanlar", JSON.stringify(kisaltilanlar));
  // Kısaltılan linkleri gösteren bölümü güncelle
  showKisaltilanlar();
}

// Veriler yüklendikten sonra kısaltılan linkleri göster
document.addEventListener("DOMContentLoaded", () => {
  showKisaltilanlar();
});
