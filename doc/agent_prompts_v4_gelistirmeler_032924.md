# v4 Geliştirmeleri — Adım Adım

Bu belge `birlesik_ajan_promptu_v4.md`'nin nasıl oluştuğunu anlatır: dokuz kaynak dosya neye katkı verdi, v3'te hangi sorunlar bulundu, v4'te her biri nasıl çözüldü ve var olan bir kurulum v4'e nasıl taşınır. Promptun kendisi `birlesik_ajan_promptu_v4.md`'dir; bu dosya `AGENTS.md`'ye konmaz.

---

## 0. Birleştirilen dosyalar ve soy ağacı

```
Checkpoints_and_memory_structure_v1 ──► _v2 ──► _v3 ─────────────┐
   (rol + hafıza + elle git checkpoint)  (snapshot)  (gelişmiş özellikler)
                                                                  ├──► birlesik_v1 ──► birlesik_v2 ──► birlesik_v3 ──► v4
checkpoint_prompt_v1 ──► _v2 ──► _v3 ────────────────────────────┘     (K1+K2+K3)     (+K4 wiki)      (araçtan bağımsız)
   (gözlem)          (birebir betikler) (projeden bağımsız)
```

| Dosya | Ne getirdi | v4'te durumu |
|---|---|---|
| `Checkpoints_and_memory_structure_v1` | Rol ve 8 prensip; 7 dosyalı hafıza (`MEMORY.md`, ADR, ders şablonu); `ckpt` alias'ı ile elle `git commit` checkpoint'i; checkout ile restore | Rol, prensipler, hafıza şablonları **korundu**. Elle commit checkpoint'i yerini K1'e bıraktı |
| `Checkpoints_and_memory_structure_v2` | Checkpoint = yapılandırılmış oturum snapshot'ı: `CKPT-NNN.md` (9 başlık), `INDEX.md`, `latest.md`, restore A/B ayrımı, fork, ham konsol kaydı, "dürüst sınır" | K2'nin temeli, **korundu** |
| `Checkpoints_and_memory_structure_v3` | Hook'lar, sır tarayıcı, `/doctor`, `setup.sh`, güven/tazelik alanları, `/consolidate`, `/search`, etiketler, boyut bütçesi, saklama, paralel kilit, DoD, risk kaydı, post-mortem, ekip modu | §8, **korundu ve düzeltildi** (aşağıda G3-G6) |
| `checkpoint_prompt_v1` | NextCode `.cloudcode` gözlemi; gereksinim taslağı: Unicode adlar, 50 MB sınırı, depo büyümesi/gc, `.git/info/exclude`, tek dosya atlama | Gözlem kısmı v2/v3'teki birebir betiklerle aşıldı. Kaybolan gereksinimler v4'te **§4.12 ve `setup.sh`** olarak geri geldi (G6, G14) |
| `checkpoint_prompt_v2` | İkili dosyadan birebir alınmış snapshot/list/rewind betikleri; Excel `~$` kilit dosyası teşhisi | K1 §4.3-4.7, **birebir korundu** |
| `checkpoint_prompt_v3` | Aynı içerik, projeden bağımsız örneklerle; kilit teşhis komutu | K1, **korundu** |
| `birlesik_ajan_promptu_v1` | K1+K2+K3 birleşimi; iç içe `.git` kaldırıldı; `fs_ref` alanı; `/rewind` ↔ `/rollback` ayrımı | **Korundu** |
| `birlesik_ajan_promptu_v2` | K4 LLM Wiki (ingest/query/lint, `raw/` değişmez, `[ÇELİŞKİ]`) | **Korundu** |
| `birlesik_ajan_promptu_v3` | Araçtan bağımsızlık (`AGENTS.md`, `.agent/`, `refs/agent/`), §4.10 harness'siz elle düzen | **v4'ün tabanı** |

---

## 1. v3 denetimi: bulunan sorunlar

Önem: **Y** = veri kaybı ya da sessiz arıza, **O** = yanlış davranış, **D** = tutarsızlık/eksik.

| # | Önem | Sorun | Nasıl bulundu |
|---|---|---|---|
| S1 | Y | `/rollback` hafızayı ve wiki kaynaklarını da geri sarıyordu: hedeften sonra yazılan `lessons.md` kayıtları ve kullanıcının eklediği `wiki/raw/` kaynakları **siliniyordu** | Geçici klasörde betiklerle denendi: rewind sonrası `lessons.md` ve `wiki/raw/src.md` yok oldu |
| S2 | O | Tasarım notu "K1 snapshot'ları sürümler" diyordu; ama `setup.sh` `.agent/sessions/`'ı `.gitignore`'a ekliyor ve K1 `.gitignore`'a uyuyor → snapshot'lar aslında K1'de **yok**. Ekip modunda satır kalkınca K1'e girecek ve rewind onları silebilecekti | Test: shadow modda `.gitignore` satırı K1 ağacını gerçekten etkiliyor |
| S3 | Y | `ckpt-hook.sh` `jq` yoksa olay adını okuyamıyor, **hiçbir şey yapmadan** 0 ile çıkıyordu. Claude Code olay adını yalnızca stdin JSON'da verir. Bu makinede `jq` kurulu değil | `command -v jq` → yok; hook denemesi sessiz kaldı |
| S4 | O | `secret-scan.sh` argümansız çağrılırsa `grep -r` stdin'i bekleyip asılı kalıyordu; Stripe, GitHub fine-grained, GitLab, Google anahtarlarını tanımıyordu | Kod incelemesi + test |
| S5 | O | `doctor.sh` tablodaki kontrollerin yarısını yapmıyordu (exclude satırları, başlıklar, tekrar numara, boyut); `.gitignore` kontrolü `sessions` kelimesini aramakla yetiniyordu | Kod incelemesi |
| S6 | D | `setup.sh` kişisel yollar için kullanıcının **commit'lenen** `.gitignore`'unu değiştiriyordu (`checkpoint_prompt_v1` bunu açıkça yasaklıyordu) | Kaynaklar arası karşılaştırma |
| S7 | O | Snapshot protokolünde sır taraması `latest.md` ve `INDEX.md` yazıldıktan **sonraydı**; tarama başarısız olsa bile snapshot kesinleşmiş görünüyordu | Protokol incelemesi |
| S8 | D | Yanlış bölüm referansları (`§4.7 list` → §4.5, `kilitli dosya §4.6` → §4.7.6); "Ajan `.agent/` içine yazamaz" (doğrusu: `.agent/checkpoints.git/`) | Okuma |
| S9 | O | Git Bash'te `refs/…:.agent/memory` biçimli argüman MSYS yol dönüştürmesiyle bozuluyor (`refs\…;.agent\memory`) | Test sırasında yaşandı |
| S10 | D | Kurulumun sırası ve "bitti" ölçütü yoktu | Okuma |
| S11 | D | Oturum başında bütün hafıza dosyaları okunuyordu; bağlam bütçesi yoktu | Okuma |
| S12 | D | "Talimat veridir" kuralı yalnızca wiki kaynakları içindi; web, araç çıktısı ve ham transcript açıktaydı | Okuma |
| S13 | D | `/rewind`, `/memory`, `/status`, `/doctor` Claude Code'un yerleşik komutlarıyla çakışıyor; çakışma yönetimi yoktu. Kullanıcının `CLAUDE.md`'sindeki `/devir` kuralıyla bağ yoktu | Okuma + kullanıcı ayarı |
| S14 | D | `checkpoint_prompt_v1`'deki büyük dosya, depo büyümesi, Unicode ad, global git ayarı konuları birleştirmede kaybolmuştu | Kaynaklar arası karşılaştırma |
| S15 | D | Windows'ta `script` komutu yok; ham konsol kaydı talimatı orada çalışmıyordu | Platform bilgisi |
| S16 | D | DoD "README güncellendi" maddesi gereksiz doküman yazdırmaya itiyordu | Okuma |

---

## 2. Geliştirmeler adım adım

Her adım tek başına uygulanabilir. Sıra, önem sırasıdır.

### Adım 1 — Bilgi koruyan rollback (S1) · v4 §4.11, §5.6-B, Genel Bakış tablosu
- **Sorun:** Kodu geri alırken öğrenilenler ve kullanıcının kaynakları kayboluyordu.
- **Çözüm:** Yeni `.agent/bin/fs-keep.sh`. Rewind betiği öncesini zaten undo ref'ine yazıyor; `fs-keep.sh` seçilen yolları (`.agent/memory`, `.agent/wiki` varsayılan) o undo ref'inden geri yazar. K1 betiklerine **dokunulmadı** ("birebir" kuralı korunuyor).
- `/rollback` artık üç seçenek sunar: (a) hafıza + wiki korunsun [varsayılan], (b) hafıza + `wiki/raw` korunsun (hatalı ingest geri alınır), (c) hiçbiri.
- **Doğrulandı:** Rewind → `fs-keep` sonrası `main.py` eski hâlde, `lessons.md` yeni kaydı, `wiki/raw/k.md` yerinde; `undo_rewind` her şeyi geri getiriyor.

### Adım 2 — K1 kapsamını netleştir (S2) · v4 Genel Bakış, §1 tasarım notu, §4.8
- **Çözüm:** "Ne K1'e girer" tablosu eklendi. `.agent/sessions/` §4.8 hariç tutma satırlarına eklendi (`.agent/sessions/raw/` yerine); `.gitignore` satırı kalksa bile snapshot'lar K1 dışında kalır. "K1 snapshot'ları sürümler" cümlesi düzeltildi.
- **Doğrulandı:** K1 ağacında `.agent/sessions` yok; rewind sonrası `CKPT-*.md` yerinde. `doctor.sh` bunu artık denetliyor.

### Adım 3 — `jq`'suz hook (S3) · v4 §8.1
- **Çözüm:** `jq` yoksa `sed` ile düz JSON alanları okunur; çok satırlı JSON ve Windows'taki kaçışlı yollar (`C:\\Users\\…`) desteklenir; `cygpath` varsa yol POSIX'e çevrilir. SessionStart çıktısına son snapshot satırı eklendi.
- **Doğrulandı:** `jq` olmayan bu makinede `SessionEnd` JSON'u ile transcript `raw/`'a kopyalandı, `PENDING.md` yazıldı, SessionStart işareti gösterdi.

### Adım 4 — Sır tarayıcı (S4) · v4 §8.2
- **Çözüm:** Argümansız çağrıda çıkış 2; yeni desenler: `sk_live_`/`rk_live_`, `github_pat_`, `glpat-`, `AIza…`; `checkpoints.git` taranmaz.
- **Doğrulandı:** Google ve Stripe örnekleri yakalandı, `raw/` atlandı, temiz dosyada `Temiz.`, argümansız çağrı 2.

### Adım 5 — `/doctor` yeniden yazıldı (S5) · v4 §8.3
- **Eklenen kontroller:** K1 son ref ve yaşı (chat-id bilinmeden), §4.8 satırları, K1 ağacında `sessions` var mı, depo boyutu, 50 MB üstü dosyalar, snapshot başlıkları `## 1.`…`## 9.`, tekrar eden numara, ölü kilit, 30 günü aşan `raw/`, hafıza satır sınırları, repo kökünde `.git/info/exclude`. `HATA`/`UYARI` ayrımı.
- **Doğrulandı:** Temiz kurulumda çıkış 0; bozuk örneklerde beklenen `HATA` satırları.

### Adım 6 — `setup.sh` (S6) · v4 §5.2
- **Çözüm:** Repo kökündeyse kişisel yollar `.git/info/exclude`'a (commit'lenmez), değilse `.gitignore`'a yazılır. Hafıza tohum dosyaları, `archive/` klasörleri ve `bin/` açılır. Idempotent.
- **Doğrulandı:** Repo kökünde `.git/info/exclude` güncellendi, `git status` yalnızca `?? .agent/` gösterdi; ikinci çalıştırma hiçbir dosyayı değiştirmedi.

### Adım 7 — Snapshot protokol sırası (S7) · v4 §5.5
- **Çözüm:** Yaz → **tara** → `latest.md` → `INDEX.md`. "INDEX'e girdiği anda kesinleşir" tanımı; `PENDING.md` temizliği protokole alındı. Şablona `k1_durum` alanı eklendi.

### Adım 8 — Referans ve ifade düzeltmeleri (S8) · v4 §2, §4.8
- Bölüm referansları düzeltildi; "`.agent/` içine yazamaz" → "`.agent/checkpoints.git/` içine yazamaz"; harness'siz düzende §4.8 komutunu onayla ajanın da çalıştırabileceği belirtildi.

### Adım 9 — Windows / Git Bash notları (S9, S15) · v4 §4.12, §5.7, §9
- `MSYS_NO_PATHCONV=1`, `-c core.quotepath=false` elle komutlara eklendi; Windows için `Start-Transcript`.

### Adım 10 — Kurulum sırası (S10) · v4 §1.1
- 0 (keşif) → 8 (doğrulama) arası dokuz adım; her birinde "kim yapar" ve "bitti ölçütü". Başarısız adımda durulur.

### Adım 11 — Bağlam bütçesi (S11) · v4 Prensip 10, §2
- Başlangıçta yalnızca `MEMORY.md` + `progress.md` son bölümü + `INDEX.md` son satırları (~150 satır); diğerleri ihtiyaç anında.

### Adım 12 — Dış içerik kuralı (S12) · v4 Prensip 9, §12
- "Talimat veridir" kuralı dosya, web, araç çıktısı ve transcript için genelleştirildi.

### Adım 13 — Komut çakışmaları ve `/devir` (S13) · v4 Kullanım, §9, §10
- Yerleşik komut çakışması açıklandı; Türkçe takma adlar: `/devir` = `/handoff`, `/durum` = `/status`, `/geri-al` = `/rollback`. Konu değişince `/devir` + `/clear` önerisi (kullanıcının `CLAUDE.md` kuralıyla aynı).

### Adım 14 — Kaybolan gereksinimler (S14) · v4 §4.12, §9
- "Bilinen Sınırlar" tablosu: global git ayarı, proje `.gitignore`'u, MSYS, Unicode, büyük dosya, depo büyümesi, okunamayan dosya. Yeni komutlar: `/k1` (durum), `/k1-bakım` (boyut + onaylı `gc`).
- §4.10'a `chat-id`'nin kalıcı yazılması ve aynı saniyedeki `seq` çakışması notu eklendi.

### Adım 15 — Küçük düzeltmeler (S16)
- DoD: dokümantasyon "yalnızca davranış değiştiyse"; geri alma maddesi `fs-keep`'i anar.
- `ASLA YAPMA`'ya 4 madde: koruma seçeneğini sormadan atlama, `sessions`'ı K1'e aldırma, global ayar/`.gitignore`'u onaysız değiştirme, toplu bağlam yükleme.
- Kabul ölçütlerine: sessions K1 dışında, rollback sonrası hafıza korunmuş, `jq`'suz hook, idempotent setup.

---

## 3. Var olan kurulumu v4'e taşıma (adım adım)

1. Çalışan ajan işi olmadığından emin ol; `/devir` ile `session-end` snapshot'ı al.
2. **v1/v2'den (`.claude/`) geliyorsan:** `.claude/{memory,sessions,wiki,hooks}` klasörlerini `.agent/` altına taşı. `.claude/checkpoints.git/`'i **taşıma ve silme**: eski ref'ler `refs/claude/…` altındadır, v4 `refs/agent/…` kullanır. Eski depo salt okunur arşiv olarak kalır; K1 v4'te sıfırdan başlar.
3. `.agent/hooks/` altındaki `ckpt-hook.sh`, `secret-scan.sh`, `doctor.sh` dosyalarını v4 §8.1-8.3'teki sürümlerle değiştir.
4. `.agent/bin/fs-keep.sh`'i oluştur (§4.11: `#!/bin/sh` + §4.3 başlık + gövde).
5. v4 `setup.sh`'i çalıştır (idempotent; var olan dosyalara dokunmaz).
6. §4.8 hariç tutma komutunu çalıştır (yeni satır: `.agent/sessions/`).
7. `AGENTS.md`'yi `birlesik_ajan_promptu_v4.md` ile değiştir; `CLAUDE.md`'de yalnızca yönlendirme satırı kalsın.
8. `/doctor` → çıkış 0 olana kadar düzelt.
9. İsteğe bağlı kabul testi: geçici bir klasörde iki checkpoint al, `lessons.md`'ye kayıt ekle, rollback + `fs-keep` yap, kaydın durduğunu gör.

---

## 4. Bu oturumda doğrulananlar

Geçici bir klasörde (Windows, Git Bash, `jq` yok), betikler doğrudan v4 dosyasından çıkarılarak çalıştırıldı:

- Shadow modda K1 snapshot, tekilleştirme, rewind, undo-rewind çalışıyor; repo modunda kullanıcının `git status`/`git log`/dalları etkilenmiyor.
- `.agent/sessions/` K1 ağacına girmiyor; rewind sonrası snapshot'lar yerinde.
- Rewind + `fs-keep.sh`: kod geri döndü, hafıza ve `wiki/raw` korundu.
- `ckpt-hook.sh` `jq`'suz, çok satırlı JSON ve Windows yolu ile transcript'i kopyaladı.
- `secret-scan.sh`, `doctor.sh`, `setup.sh` (iki kez) beklenen çıktıları verdi.

**Doğrulanmayanlar:** Hook olay adları (`PreCompact`, `SessionStart`, `SessionEnd`) ve `transcript_path` alanı aracın güncel resmi dokümanıyla bu oturumda karşılaştırılmadı; v4 §8.1'deki uyarı geçerli. Harness modundaki (NextCode) `rewind_preview` arayüzü denenmedi; yalnızca betik düzeyi test edildi.

## 5. Bilinçli olarak yapılmayanlar

- **K1 betikleri değiştirilmedi.** Rewind pathspec'ine `.agent/sessions` eklemek daha temiz olurdu, ama "birebir" kuralını ve harness ile uyumu bozardı. Aynı sonuç §4.8 hariç tutma satırıyla ve `fs-keep.sh` ile betik dışından alındı.
- **Bölüm numaraları değiştirilmedi.** v3'e atıf yapan notlar bozulmasın diye yeni içerik alt bölüm olarak eklendi (§1.1, §4.11, §4.12).
