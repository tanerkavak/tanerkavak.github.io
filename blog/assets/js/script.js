// JSON dosyalarını yükle
Promise.all([
    fetch('data/_categories-config_.json').then(response => response.json()),
    fetch('data/markdown/_markdown-config_.json').then(response => response.json())
])
    .then(([categories, posts]) => {
        // Kategorileri ve postları birleştir
        const categorizedData = organizeData(categories, posts);
        // Kategorileri ve postları yükle
        loadCategories(categorizedData);
    })
    .catch(error => console.error('JSON dosyaları yüklenirken hata oluştu:', error));

// Kategorileri ve postları organize et
function organizeData(categories, posts) {
    const categoryMap = new Map();

    // Kategorileri haritaya ekle
    categories.forEach(category => {
        categoryMap.set(category.id, {
            ...category,
            posts: [],
            subcategories: []
        });
    });

    // Postları ilgili kategorilere ekle
    posts.forEach(post => {
        const category = categoryMap.get(post.categoryId);
        if (category) {
            category.posts.push(post);
        }
    });

    // Alt kategorileri organize et
    categories.forEach(category => {
        if (category.parentId) {
            const parentCategory = categoryMap.get(category.parentId);
            if (parentCategory) {
                parentCategory.subcategories.push(categoryMap.get(category.id));
            }
        }
    });

    // Ana kategorileri döndür
    return Array.from(categoryMap.values()).filter(category => !category.parentId);
}

// Kategorileri yükle
function loadCategories(categories) {
    const categoriesContainer = document.getElementById('categories');

    // Kategorileri hiyerarşik sıraya göre sırala
    categories.sort((a, b) => compareOrder(a.order, b.order));

    categories.forEach(category => {
        // Ana kategoriyi ekle
        const categoryItem = document.createElement('li');
        categoryItem.innerHTML = `<strong>${category.name}</strong>`;
        categoriesContainer.appendChild(categoryItem);

        // Alt kategoriler varsa ekle
        if (category.subcategories.length > 0) {
            const subcategoryList = document.createElement('ul');
            category.subcategories.sort((a, b) => compareOrder(a.order, b.order)).forEach(subcategory => {
                const subcategoryItem = document.createElement('li');
                subcategoryItem.innerHTML = `<strong>${subcategory.name}</strong>`;
                subcategoryList.appendChild(subcategoryItem);

                // Alt kategori postlarını ekle
                if (subcategory.posts.length > 0) {
                    const postList = document.createElement('ul');
                    subcategory.posts.sort((a, b) => compareOrder(a.order, b.order)).forEach(post => {
                        const postItem = document.createElement('li');
                        postItem.innerHTML = `<a href="#" data-file="${post.file}">${post.title}</a>`;
                        postList.appendChild(postItem);
                    });
                    subcategoryItem.appendChild(postList);
                }
            });
            categoryItem.appendChild(subcategoryList);
        }

        // Ana kategori postlarını ekle
        if (category.posts.length > 0) {
            const postList = document.createElement('ul');
            category.posts.sort((a, b) => compareOrder(a.order, b.order)).forEach(post => {
                const postItem = document.createElement('li');
                postItem.innerHTML = `<a href="#" data-file="${post.file}">${post.title}</a>`;
                postList.appendChild(postItem);
            });
            categoryItem.appendChild(postList);
        }
    });

    // Yazıya tıklandığında içeriği yükle
    categoriesContainer.addEventListener('click', event => {
        if (event.target.tagName === 'A') {
            event.preventDefault();
            const file = event.target.getAttribute('data-file');
            loadPostContent(file);
        }
    });
}

// Hiyerarşik order değerlerini karşılaştır
function compareOrder(a, b) {
    const aParts = (a || '').split('-').map(Number);
    const bParts = (b || '').split('-').map(Number);

    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
        const aVal = aParts[i] || 0;
        const bVal = bParts[i] || 0;
        if (aVal < bVal) return -1;
        if (aVal > bVal) return 1;
    }
    return 0;
}

// Yazı içeriğini yükle
function loadPostContent(file) {
    fetch(file)
        .then(response => response.text())
        .then(markdown => {
            // Markdown'u HTML'e dönüştür
            const htmlContent = marked.parse(markdown);

            // İçeriği ekrana ekle
            const postsContainer = document.getElementById('posts');
            postsContainer.innerHTML = `
                <div class="post">
                    <div>${htmlContent}</div>
                </div>
            `;
        })
        .catch(error => console.error('Markdown dosyası yüklenirken hata oluştu:', error));
}