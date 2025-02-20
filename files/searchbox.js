        function debounce(func, wait) {
            let timeout;
            return function(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        }
        window.onload = function() {
            const searchInput = document.querySelector('#sbox');
            const searchResults = document.getElementById('searchResults');
            const performSearch = debounce(async (query) => {
                if (query.length < 1) {
                    searchResults.style.display = 'none';
                    return;
                }
                try {
                    const response = await fetch(`/articles?rawq=${encodeURIComponent(query)}`);
                    const articles = await response.json();
                    searchResults.innerHTML = articles
                        .slice(0, 10)
                        .map(article => `
                            <div class="result-item" onclick="window.location.href='/articles/${article.id}'">
                                ${article.title}
                            </div>
                        `).join('');
                    searchResults.style.display = articles.length > 0 ? 'block' : 'none';
                } catch (error) {
                    console.error('Search failed:', error);
                }
            }, 300);
            searchInput.addEventListener('input', (e) => performSearch(e.target.value));
            document.addEventListener('click', (e) => {
                if (!searchResults.contains(e.target) && e.target !== searchInput) {
                    searchResults.style.display = 'none';
                }
            });
        }