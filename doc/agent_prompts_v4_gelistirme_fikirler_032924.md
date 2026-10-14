v4'ü daha da geliştirme fikirleri

┌────┬─────────────┬───────────────────────────────────────────────┬──────────────────────────────┬─────────┬───────┐
│ #  │ Alan        │ Geliştirme                                    │ Neden gerekli                │ Öncelik │ Efor  │
├────┼─────────────┼───────────────────────────────────────────────┼──────────────────────────────┼─────────┼───────┤
│ 1  │ Bağlam      │ Promptu bölmek: kısa bir çekirdek AGENTS.md   │ 1245 satırlık prompt her     │ Yüksek  │ Orta  │
│    │             │ (~300 satır: prensipler, protokoller,         │ oturumda bağlamın büyük      │         │       │
│    │             │ yasaklar) + gerektiğinde okunan .agent/docs/  │ kısmını harcıyor; betiklerin │         │       │
│    │             │ dosyaları (betikler, şablonlar, wiki          │ çoğu kurulumdan sonra bir    │         │       │
│    │             │ ayrıntısı)                                    │ daha okunmuyor               │         │       │
├────┼─────────────┼───────────────────────────────────────────────┼──────────────────────────────┼─────────┼───────┤
│ 2  │ Claude Code │ Komutları gerçek slash komutu yapmak:         │ Şu an komutlar yalnızca      │ Yüksek  │ Düşük │
│    │             │ .claude/commands/devir.md, checkpoint.md,     │ "niyet". Gerçek komutta      │         │       │
│    │             │ geri-al.md                                    │ adımlar her seferinde        │         │       │
│    │             │                                               │ eksiksiz uygulanır           │         │       │
├────┼─────────────┼───────────────────────────────────────────────┼──────────────────────────────┼─────────┼───────┤
│ 3  │ Claude Code │ Claude Code'un kendi /rewind özelliğiyle      │ İki ayrı geri alma sistemi   │ Yüksek  │ Düşük │
│    │             │ K1'in ilişkisini netleştirmek: Claude Code'da │ kullanıcıyı şaşırtabilir;    │         │       │
│    │             │ K1 opsiyonel ve elle (§4.10) mi olsun,        │ hangisinin neyi geri aldığı  │         │       │
│    │             │ tamamen kapalı mı                             │ belli değil                  │         │       │
├────┼─────────────┼───────────────────────────────────────────────┼──────────────────────────────┼─────────┼───────┤
│ 4  │ Test        │ selftest.sh: bu oturumda elle yaptığım uçtan  │ Kabul ölçütleri şu an        │ Yüksek  │ Orta  │
│    │             │ uca testi kalıcı hâle getirmek. Geçici        │ yalnızca yazıyla duruyor;    │         │       │
│    │             │ klasörde kurulum, checkpoint, geri alma,      │ prompt her değiştiğinde      │         │       │
│    │             │ fs-keep, hook ve doctor çalışır, sonuç        │ betikler bozulabilir         │         │       │
│    │             │ PASS/FAIL olur                                │                              │         │       │
├────┼─────────────┼───────────────────────────────────────────────┼──────────────────────────────┼─────────┼───────┤
│ 5  │ K2          │ new-snapshot.sh: kilit alır, numarayı verir,  │ Numara çakışması, eksik alan │ Yüksek  │ Düşük │
│    │             │ ön bilgileri (fs_ref, git_commit, dal, tarih, │ ve bayat latest.md hataları  │         │       │
│    │             │ k1_durum) otomatik doldurur. Ajan yalnızca    │ elle yazımdan çıkıyor        │         │       │
│    │             │ içeriği yazar                                 │                              │         │       │
├────┼─────────────┼───────────────────────────────────────────────┼──────────────────────────────┼─────────┼───────┤
│ 6  │ K1          │ Kilitli dosya ön kontrolü: kuru bir git add   │ Tek bir kilitli dosya bütün  │ Orta    │ Orta  │
│    │             │ denemesiyle kilitli dosyaları bulup geçici    │ checkpoint'i düşürüyor;      │         │       │
│    │             │ olarak hariç tutan bir sarmalayıcı            │ Excel dışındaki kilitler     │         │       │
│    │             │                                               │ (veritabanı, log) hâlâ açık  │         │       │
│    │             │                                               │ risk                         │         │       │
├────┼─────────────┼───────────────────────────────────────────────┼──────────────────────────────┼─────────┼───────┤
│ 7  │ Güvenlik    │ Türkiye'ye özgü kişisel veri desenleri: TC    │ Sır tarayıcı yalnızca API    │ Orta    │ Düşük │
│    │             │ kimlik no (11 hane + kontrol), IBAN           │ anahtarlarını arıyor; KVKK   │         │       │
│    │             │ (TR\d{24}), telefon (+90), e-posta            │ açısından kişisel veri daha  │         │       │
│    │             │                                               │ büyük risk                   │         │       │
├────┼─────────────┼───────────────────────────────────────────────┼──────────────────────────────┼─────────┼───────┤
│ 8  │ Güvenlik    │ gitleaks ya da trufflehog kuruluysa onları    │ Regex'in yanlış negatifi     │ Orta    │ Düşük │
│    │             │ kullanmak, kurulu değilse mevcut regex'e      │ yüksek; bu araçlar yüzlerce  │         │       │
│    │             │ düşmek                                        │ anahtar türü tanıyor         │         │       │
├────┼─────────────┼───────────────────────────────────────────────┼──────────────────────────────┼─────────┼───────┤
│ 9  │ K4          │ wiki-lint.sh: kırık [[bağlantı]], yetim       │ /lint şu an tamamen ajanın   │ Orta    │ Düşük │
│    │             │ sayfa, eksik ön bilgi alanı, 200 satırı aşan  │ elle taramasına bağlı        │         │       │
│    │             │ sayfa                                         │                              │         │       │
├────┼─────────────┼───────────────────────────────────────────────┼──────────────────────────────┼─────────┼───────┤
│ 10 │ K4          │ Kaynak manifesti: raw/ dosyalarının sha256    │ "raw/ değişmez" kuralı şu an │ Orta    │ Düşük │
│    │             │ listesi                                       │ doğrulanamıyor; manifestle   │         │       │
│    │             │                                               │ doctor değişikliği yakalar   │         │       │
├────┼─────────────┼───────────────────────────────────────────────┼──────────────────────────────┼─────────┼───────┤
│ 11 │ K3          │ Hafıza kayıtlarına kimlik (D-012, L-007)      │ "Bağla, kopyalama" kuralı    │ Orta    │ Düşük │
│    │             │ verip karar, ders ve wiki arasında bu         │ var ama bağlanacak sabit bir │         │       │
│    │             │ kimliklerle bağlantı kurmak                   │ kimlik yok                   │         │       │
├────┼─────────────┼───────────────────────────────────────────────┼──────────────────────────────┼─────────┼───────┤
│ 12 │ K3          │ Tekrarlayan dersi kurala dönüştürmek: aynı    │ lessons.md birikiyor ama     │ Orta    │ Düşük │
│    │             │ kök neden 2 kez görülürse MEMORY.md kritik    │ davranışı değiştirmiyor      │         │       │
│    │             │ kuralına, test ya da lint kuralına taşımak    │                              │         │       │
├────┼─────────────┼───────────────────────────────────────────────┼──────────────────────────────┼─────────┼───────┤
│ 13 │ K3          │ Doctor'ın Son doğrulama tarihi 30 günü geçen  │ Tazelik kuralı var ama       │ Orta    │ Düşük │
│    │             │ ve güveni tahmin olan kayıtları sayması       │ denetlenmiyor                │         │       │
├────┼─────────────┼───────────────────────────────────────────────┼──────────────────────────────┼─────────┼───────┤
│ 14 │ Paralellik  │ Hafıza yazımı için de kilit ya da yalnızca    │ Kilit şu an yalnızca         │ Orta    │ Düşük │
│    │             │ sona ekleme kuralı                            │ snapshot numarası için var;  │         │       │
│    │             │                                               │ iki oturum aynı anda         │         │       │
│    │             │                                               │ progress.md yazarsa biri     │         │       │
│    │             │                                               │ kaybolur                     │         │       │
├────┼─────────────┼───────────────────────────────────────────────┼──────────────────────────────┼─────────┼───────┤
│ 15 │ Alt ajanlar │ Hafızaya ve snapshot'a yalnızca ana ajan      │ Alt ajanlar ayrı chat-id ile │ Orta    │ Düşük │
│    │             │ yazsın; alt ajanlar bulgularını raporda       │ çalışıyor; hafızaya paralel  │         │       │
│    │             │ versin                                        │ yazım çakışma ve tutarsızlık │         │       │
│    │             │                                               │ doğurur                      │         │       │
├────┼─────────────┼───────────────────────────────────────────────┼──────────────────────────────┼─────────┼───────┤
│ 16 │ K2          │ PreCompact hook'unda transcript'ten son       │ Bağlam sıkıştırıldıktan      │ Orta    │ Orta  │
│    │             │ kullanıcı isteklerini ve son hatayı çekip     │ sonra ajan snapshot'ı        │         │       │
│    │             │ PENDING.md'ye taslak olarak yazmak            │ hafızadan yazmak zorunda     │         │       │
│    │             │                                               │ kalıyor                      │         │       │
├────┼─────────────┼───────────────────────────────────────────────┼──────────────────────────────┼─────────┼───────┤
│ 17 │ K1          │ Eski sohbetlerin ref'lerini ve undo           │ Sınır sohbet başına 500 ref  │ Düşük   │ Düşük │
│    │             │ ref'lerini yaşa göre budamak (ör. 30 gün),    │ ama sohbet sayısı sınırsız;  │         │       │
│    │             │ ardından onaylı gc                            │ depo zamanla şişiyor         │         │       │
├────┼─────────────┼───────────────────────────────────────────────┼──────────────────────────────┼─────────┼───────┤
│ 18 │ K1          │ Doctor'a git fsck --connectivity-only eklemek │ Bozuk nesne, ancak geri      │ Düşük   │ Düşük │
│    │             │                                               │ almaya ihtiyaç duyulduğunda  │         │       │
│    │             │                                               │ fark ediliyor                │         │       │
├────┼─────────────┼───────────────────────────────────────────────┼──────────────────────────────┼─────────┼───────┤
│ 19 │ Platform    │ Git Bash yoksa PowerShell eşdeğerleri         │ Saf Windows ortamında        │ Düşük   │ Orta  │
│    │             │ (setup.ps1, doctor.ps1)                       │ hook'lar ve kurulum          │         │       │
│    │             │                                               │ çalışmıyor                   │         │       │
├────┼─────────────┼───────────────────────────────────────────────┼──────────────────────────────┼─────────┼───────┤
│ 20 │ Kalite      │ Bütün betikleri shellcheck'ten geçirmek       │ Tırnak ve boşluklu yol       │ Düşük   │ Düşük │
│    │             │                                               │ hataları sessizce sorun      │         │       │
│    │             │                                               │ çıkarabilir                  │         │       │
├────┼─────────────┼───────────────────────────────────────────────┼──────────────────────────────┼─────────┼───────┤
│ 21 │ Ekip        │ Kullanıcının git deposuna, .agent/memory ve   │ Ekip modunda hafıza          │ Düşük   │ Düşük │
│    │             │ .agent/wiki commit'lerinde sır tarayıcıyı     │ paylaşılıyor; sır sızarsa    │         │       │
│    │             │ çalıştıran bir pre-commit hook                │ doğrudan uzak depoya gider   │         │       │
├────┼─────────────┼───────────────────────────────────────────────┼──────────────────────────────┼─────────┼───────┤
│ 22 │ Sürüm       │ .agent/VERSION dosyası ve migrate.sh (v3'ten  │ Taşıma şu an 9 elle adım     │ Düşük   │ Orta  │
│    │             │ v4'e, v4'ten v5'e)                            │                              │         │       │
├────┼─────────────┼───────────────────────────────────────────────┼──────────────────────────────┼─────────┼───────┤
│ 23 │ Gözlem      │ /istatistik: atlanan checkpoint, geri alma    │ Sistemin gerçekten işe       │ Düşük   │ Düşük │
│    │             │ sayısı, ders/karar sayısı, en sık kök neden   │ yarayıp yaramadığı           │         │       │
│    │             │                                               │ ölçülmüyor                   │         │       │
├────┼─────────────┼───────────────────────────────────────────────┼──────────────────────────────┼─────────┼───────┤
│ 24 │ Saklama     │ raw/ kayıtlarını retention adımında age ile   │ Şifreleme şu an elle ve      │ Düşük   │ Düşük │
│    │             │ otomatik şifrelemek                           │ isteğe bağlı; ham            │         │       │
│    │             │                                               │ transcript'ler açık metin    │         │       │
│    │             │                                               │ duruyor                      │         │       │
└────┴─────────────┴───────────────────────────────────────────────┴──────────────────────────────┴─────────┴───────┘

İlk yapılacak beşi: 1, 2, 4, 5 ve 3. 1 her oturumun bağlam maliyetini düşürür. 2 ve 3 Claude Code'da sistemi gerçekten çalışır hâle getirir. 4 ve 5 en sık hata kaynaklarını betiğe bağlar; 4 ayrıca bundan sonraki her değişikliği güvenceye alır.