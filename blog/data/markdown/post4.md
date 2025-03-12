## 1. Semantik Sürümleme (Semantic Versioning - SemVer)
En yaygın kullanılan yöntemdir. **`MAJOR.MINOR.PATCH`** formatındadır.

- **MAJOR (Ana Sürüm)** → Geriye dönük uyumsuz büyük değişiklikler (örn: API değişikliği).
- **MINOR (Yan Sürüm)** → Geriye dönük uyumlu yeni özellikler.
- **PATCH (Hata Düzeltme Sürümü)** → Küçük hata düzeltmeleri ve güvenlik güncellemeleri.

### Örnekler:
- `1.0.0` → İlk kararlı sürüm.
- `1.1.0` → Yeni özellik eklendi.
- `1.1.1` → Küçük bir hata düzeltildi.
- `2.0.0` → Büyük değişiklikler yapıldı, eski sürümle uyumsuz olabilir.

---

## 2. Tarih Tabanlı Sürümleme (Date-Based Versioning)
Eğer sürekli güncellenen bir yazılım geliştiriyorsanız, **yıl.ay.gün** formatını kullanabilirsiniz.

### Örnekler:
- `2024.02.26` → 2024 Şubat 26 sürümü.
- `24.02.1` → 2024 Şubat ayındaki ilk sürüm.

Bu yöntem, özellikle **Google Chrome, Ubuntu ve JetBrains** gibi firmalar tarafından kullanılır.

---

## 3. Sürüm Etiketleri ile İsimlendirme
Bazı projeler, sürümlere **ekstra etiketler** ekler:

- **`alpha`** → İlk test aşaması, genellikle kararsızdır.
- **`beta`** → Daha kararlı ama hâlâ test aşamasında.
- **`rc`** → **Release Candidate**, final sürüme çok yakın.
- **`lts`** → **Long-Term Support**, uzun vadeli desteklenen kararlı sürüm.
- **`nightly`** → Günlük olarak oluşturulan test sürümü.
- **`stable`** → Kararlı sürüm.

### Örnekler:
- `1.0.0-alpha` → İlk test sürümü.
- `2.1.0-beta.3` → 3. beta sürüm.
- `3.0.0-rc.1` → Yayın adayı ilk sürüm.
- `1.4.2-lts` → Uzun vadeli desteklenen sürüm.

---

## 4. Git Tabanlı Sürümleme
Eğer **Git kullanıyorsanız**, commit hash veya branch adlarını versiyonlama için kullanabilirsiniz:

- `v1.2.3-g123abc` → Git commit hash ile versiyon.
- `v1.2.3-main` → Ana branch’ten oluşturulan sürüm.
- `v1.2.3-feature-xyz` → Belirli bir özellik geliştirme branch’i ile ilişkilendirilmiş sürüm.

Bu yöntem, **Docker, Kubernetes, CI/CD süreçlerinde** kullanışlı olabilir.

---

## Hangi Sürümleme Yöntemini Kullanmalısınız?
| Kullanım Alanı                  | Önerilen Yöntem          | Örnek |
|---------------------------------|-------------------------|-------|
| **API ve kütüphaneler**        | **SemVer**              | `1.0.0`, `1.1.0`, `1.1.1` |
| **Sürekli güncellenen yazılımlar** | **Tarih tabanlı**       | `2024.02.26`, `24.02.1` |
| **Test sürümleri**             | **Etiket bazlı**        | `alpha`, `beta`, `rc` |
| **CI/CD & Git entegrasyonu**   | **Git hash tabanlı**    | `v1.2.3-g123abc` |

