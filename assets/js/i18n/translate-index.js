// assets/js/translate-index.js
document.addEventListener('DOMContentLoaded', () => {
    const langBtn = document.getElementById('langBtn');
    const translations = {
        tr: {
            BtnNav: '<sup>T</sup>/<sub>K</sub>',
            Btn001: 'Portfolyo',
            Btn002: 'Linkler',
            Btn003: 'Veri Merkezi',
            Btn004: 'Blog',
            Btn005: 'İletişim',
            Name: 'Taner Kavak',
            About001: 'Türkiyede İstanbul şehrinde ikamet etmekteyim. CBS Teknikeri, Coğrafyacıyım. Aynı zamanda Web Tasarım öğrencisiyim.',
            About002: 'Oyun geliştirme konusunda ilgilenmekteyim. Alanımda ve yeni alanlarda gelişmeyi ve yeni projeler oluşturmayı hedeflemekteyim.',
            About003: 'CBS alanında veri toplamak, güncellemek, tematik haritalar oluşturmak ve gerekli analizleri yapmaktır. Coğrafi verileri derleyerek ve gerekli analizleri yaparak haritalar hizmetlerine kullanışlı ve estetik bir görünüm kazandıracaktır.',
            translate: '<i class="bi bi-translate"></i><sub> TR</sub>',
            typedStrings: ['CBS Teknikeri', 'Coğrafyacı', 'Web Tasarım (Öğrenci)', 'Oyun Geliştirici (Amatör)'],
            footer: '© 2025 Tüm Hakları Saklıdır - Taner Kavak',
        },
        en: {
            BtnNav: '<sup>T</sup>/<sub>K</sub>',
            Btn001: 'Portfolio',
            Btn002: 'Links',
            Btn003: 'Data Center',
            Btn004: 'Blog',
            Btn005: 'Contact',
            Name: 'Taner Kavak',
            About001: 'I reside in Istanbul, Turkey. I am a GIS Technician and a Geographer. I am also a Web Design student.',
            About002: 'I am interested in game development. I aim to improve myself in my field and in new areas, and to create new projects.',
            About003: 'In the field of GIS, it is about collecting and updating data, creating thematic maps, and performing necessary analyses. By compiling geographic data and conducting the required analyses, it will give map services a functional and aesthetic appearance.',
            translate: '<i class="bi bi-translate"></i><sub> EN</sub>',
            typedStrings: ['GIS Technician', 'Geographer', 'Web Design (Student)', 'Game Developer (Amateur)'],
            footer: '© 2025 All Rights Reserved - Taner Kavak', 
        }
    };

    let currentLang = 'tr';
    let typedInstance;

    function startTypedAnimation(stringsArray) {
        if (typedInstance) typedInstance.destroy();
        typedInstance = new Typed('#typed', {
            strings: stringsArray,
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 1500,
            loop: true
        });
    }

    // İlk başlatma
    updateTextContent(); // Sayfa yüklenince tüm metinleri çevir
    startTypedAnimation(translations[currentLang].typedStrings); // Typed başlat

    // Dil değiştirme
    langBtn.addEventListener('click', (e) => {
        e.preventDefault();
        currentLang = currentLang === 'tr' ? 'en' : 'tr';
        updateTextContent();
        startTypedAnimation(translations[currentLang].typedStrings);
    });

    // data-i18n içeriğini güncelle
    function updateTextContent() {
        document.querySelectorAll('[data-i18n]').forEach(elem => {
            const key = elem.getAttribute('data-i18n');
            // Sadece #typed olanı atla, çünkü onun içeriğini Typed.js güncelliyor
            if (key === 'typedStrings') return;
            elem.innerHTML = translations[currentLang][key];
        });
        // Butonu ayrıca elle güncelle
        langBtn.innerHTML = translations[currentLang].translate;
    }
});