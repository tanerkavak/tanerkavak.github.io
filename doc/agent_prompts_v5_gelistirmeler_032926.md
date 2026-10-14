# v5 Geliştirmeleri

`birlesik_ajan_promptu_v5.md` bir **yapı promptudur**: ajana verilir, ajan 51 dosyayı oluşturup sistemi kurar. Kurulumdan sonra her oturumda okunan prompt, o dosyanın A bölümündeki `AGENTS.md`'dir. Bu belge, v4'ten sonra önerilen 24 geliştirmenin v5'te nereye karşılık geldiğini ve nasıl doğrulandığını anlatır.

## 1. v4 → v5 yapı değişikliği

| | v4 | v5 |
|---|---|---|
| Biçim | Tek parça 1245 satırlık prompt; betikler metnin içinde | Yapı promptu: çekirdek `AGENTS.md` (~200 satır) + 5 ayrıntı belgesi + 18 betik + 10 skill + şablonlar |
| Her oturumda okunan | 1245 satır | ~200 satır çekirdek + ~150 satır başlangıç bütçesi; belgeler ihtiyaç anında |
| Elle yapılan iş | Numara, kilit, INDEX, latest, kimlik, tarama: ajan elle | Betik: `new-snapshot.sh`, `mem-append.sh` … |
| Doğrulama | Yazılı kabul ölçütleri | `selftest.sh`: 13 bölüm, 83 test |

## 2. 24 madde → v5 karşılığı

| # | Geliştirme | v5'te | Test |
|---|---|---|---|
| 1 | Promptu bölmek | `AGENTS.md` + `.agent/docs/{k1-checkpoint,k2-snapshot,k3-hafiza,k4-wiki,isletim}.md`; §15 belge haritası | — |
| 2 | Gerçek slash komutları | `.claude/skills/` altında 10 skill: `checkpoint`, `restore`, `geri-al`, `ajan-devir`, `durum`, `saglik`, `k1`, `ingest`, `sor`, `istatistik`. Adlar Claude Code yerleşik komutlarıyla çakışmıyor (`/doctor`, `/status`, `/memory`, `/rewind`, `/diff`, `/fork`, `/stats` …); `geri-al` yalnızca kullanıcı çağırır | Kurulum testi |
| 3 | Claude Code `/rewind` ↔ K1 | Belgeyle doğrulandı: yerleşik checkpoint bash değişikliklerini, alt ajan düzenlemelerini ve dış değişiklikleri izlemiyor. Karar: küçük düzenlemeler için `/rewind`, bash'li/geniş/yıkıcı işler için K1 + `/geri-al` (AGENTS.md §0, §5) | — |
| 4 | Kabul testi | `.agent/tests/selftest.sh` | 83/83 |
| 5 | `new-snapshot.sh` | `new` (kilit, numara, `fs_ref`, `k1_durum`, git bilgisi) / `finalize` (`<doldur>`, 9 başlık, 150 satır, sır taraması, INDEX, latest) | 8 test, paralellik dahil |
| 6 | Kilitli dosya ön kontrolü | `fs-preflight.sh` (kuru `git add --ignore-errors`; `--exclude` ile kalıcı hariç tutma); `doctor.sh` de çalıştırır | Gerçek Windows dosya kilidiyle 3 test |
| 7 | Türkiye'ye özgü kişisel veri | `secret-scan.sh`: TC kimlik (kontrol hanesi doğrulamalı), IBAN, cep telefonu, e-posta (beyaz listeli); `AGENT_PII=off` | 8 test |
| 8 | gitleaks | Kuruluysa ikinci görüş, raw hariç kopya üzerinde | **Test edilmedi** (gitleaks kurulu değil) |
| 9 | Wiki denetim betiği | `wiki-lint.sh` | 4 test |
| 10 | Kaynak manifesti | `raw-manifest.sh update/check` → `.agent/wiki/raw.sha256`; doctor denetler | 4 test |
| 11 | Hafıza kimlikleri | `{ID}` → `D-/L-/R-/M-NNN` (`mem-append.sh`) | Test var |
| 12 | Dersten kurala | `Terfi:` alanı; `stats.sh` tekrarlayan kök nedeni gösterir; k3-hafiza.md §5 | Test var |
| 13 | Tazelik denetimi | doctor: 30 günden eski `Son doğrulama` ve `Güven: tahmin` sayısı | — |
| 14 | Hafıza yazım kilidi | `mem-append.sh` (kilit + sona ekleme + sır taraması) | 5 paralel ekleme |
| 15 | Alt ajan kuralı | Hafıza/snapshot/wiki'ye yalnızca ana ajan yazar (AGENTS.md §10) | — |
| 16 | PreCompact taslağı | Hook, transcript'ten son 5 kullanıcı isteğini çıkarır; sır taramasından geçerse `PENDING.md`'ye ekler; `source=compact` hatırlatması | Test var (Türkçe karakter dahil) |
| 17 | K1 budama | `k1-prune.sh`: sohbet bazında (commit zinciri yüzünden tek ref silmek yer açmaz), varsayılan kuru, `--apply/--gc` | 3 test |
| 18 | fsck | `doctor.sh --deep` | Test var |
| 19 | PowerShell | `setup.ps1`, `doctor.ps1` (BOM'lu; `cmd /c` ile git stderr'i) | 5 test |
| 20 | shellcheck | Birebir K1 betikleri error düzeyinde, diğerleri warning düzeyinde temiz | 2 test |
| 21 | pre-commit | `pre-commit.sh`: `sessions/raw`, `locks` engeli + sahnelenen içerik taraması | 3 test |
| 22 | Sürüm ve taşıma | `.agent/VERSION`; `install.sh` (kur/güncelle/taşı; yabancı `AGENTS.md`'yi korur; eski `AGENTS.md`'yi yedekler) | 4 test |
| 23 | İstatistik | `stats.sh`, `/istatistik` | 2 test |
| 24 | Otomatik şifreleme | `retention.sh --encrypt` (age) + `--dry-run` | Silme yolu test edildi; **age yolu test edilmedi** (age kurulu değil) |

## 3. Yol boyunca bulunup düzeltilen sorunlar

- **Kişisel `/devir` çakışması:** Kullanıcının `~/.claude/skills/devir` skill'i var. Kişisel skill aynı adlı proje skill'ini ezdiği için v5'in devri `/ajan-devir` oldu; v4'teki "`/devir` = `/handoff`" takma adı kaldırıldı.
- **Windows'ta Python çıktısı:** cp1254 kodlaması Türkçe karakterleri bozuyordu → `PYTHONIOENCODING=utf-8`.
- **PowerShell 5.1:** `ErrorActionPreference=Stop` altında git'in stderr'i hata sayılıyordu → `cmd /c … 2>nul`. BOM'suz `.ps1` dosyaları Türkçeyi bozuyordu → BOM'lu kayıt. Konsol kodlaması → UTF-8.
- **Doctor:** arşivlenen snapshot'ı "dosya yok" hatası sayıyordu → `sessions/archive/` da aranıyor.
- **İstatistik:** şablondaki örnek başlık karar sayısına giriyordu → yalnızca tarihli başlıklar sayılıyor.

## 4. Doğrulama

- Kit önce gerçek dosyalarla kuruldu, `selftest.sh` 83/83 geçti (Windows, Git Bash, `jq` yok, Python ve PowerShell var, shellcheck geçici kuruldu).
- `birlesik_ajan_promptu_v5.md` bu dosyalardan üretildi. Md'den geri çıkarılan 51 dosya özgün dosyalarla bayt bayt aynı çıktı ve çıkarılan kopya da 83/83 geçti. Yani yapı promptundaki içerik eksiksiz ve çalışır durumda.
- Kurulum klasörü (`v5/`) yalnızca bu doğrulama için kullanıldı ve kaldırıldı; teslim edilen şey yalnızca md dosyalarıdır.

## 5. Bilinen sınırlar

- gitleaks ve age yolları test edilmedi.
- Claude Code dışındaki araçlarda (Codex, Gemini CLI, Cursor) skill'ler ve hook kaydı denenmedi; bu araçlarda komutlar sohbette niyet olarak yazılır, hook olay adları elle eşlenir.
- Hook taslağı Claude Code transcript biçimine göre yazıldı. Gerçek bir Claude Code transcript'iyle değil, belgedeki biçime uygun örnek veriyle test edildi.
- NextCode gibi otomatik K1 sunan bir harness'te çalışma denenmedi; yalnızca betik düzeyi test edildi.
