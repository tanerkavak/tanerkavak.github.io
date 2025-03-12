// JSON dosyasını yükle
fetch('content/posts.json')
    .then(response => response.json())
    .then(posts => {
        // Kategorileri ve yazıları yükle
        loadCategories(posts);
        loadPosts(posts);
    })
    .catch(error => console.error('JSON dosyası yüklenirken hata oluştu:', error));

// Kategorileri yükle
function loadCategories(posts) {
    const categoriesContainer = document.getElementById('categories');
    const categories = {};

    // Kategorileri grupla
    posts.forEach(post => {
        if (!categories[post.category]) {
            categories[post.category] = [];
        }
        categories[post.category].push(post);
    });

    // Kategorileri ekrana ekle
    for (const category in categories) {
        const categoryItem = document.createElement('li');
        categoryItem.innerHTML = `<strong>${category}</strong>`;
        categoriesContainer.appendChild(categoryItem);

        // Kategori altındaki yazıları ekle
        categories[category].forEach(post => {
            const postItem = document.createElement('li');
            postItem.innerHTML = `<a href="#" data-file="${post.file}">${post.title}</a>`;
            categoriesContainer.appendChild(postItem);
        });
    }

    // Yazıya tıklandığında içeriği yükle
    categoriesContainer.addEventListener('click', event => {
        if (event.target.tagName === 'A') {
            event.preventDefault();
            const file = event.target.getAttribute('data-file');
            loadPostContent(file);
        }
    });
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