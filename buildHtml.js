
function buildHtml(data) {
    const isSearchResults = Array.isArray(data);
    const title = isSearchResults ? 'Search Results' : data.title;
    const content = isSearchResults 
        ? data.map(article => `
            <div class="article">
                <h2><a href="/articles/${article.id}">${article.title}</a></h2>
                <p>${article.content.substring(0, 200)}...</p>
            </div>
        `).join('')
        : `<div class="article"><p>${data.content}</p></div>`;

    return `
    <html>
    <head>
        <title>${title}</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
            }
            .search-box {
                padding: 20px;
                background: #f5f5f5;
                margin-bottom: 20px;
                position: relative;
            }
            input[type="text"] {
                padding: 8px;
                width: 300px;
            }
            button {
                padding: 8px 16px;
                background: #007bff;
                color: white;
                border: none;
                cursor: pointer;
            }
            #searchResults {
                position: absolute;
                top: 100%;
                left: 20px;
                width: 300px;
                background: white;
                border: 1px solid #ddd;
                border-top: none;
                max-height: 300px;
                overflow-y: auto;
                display: none;
            }
            .result-item {
                padding: 8px;
                cursor: pointer;
            }
            .result-item:hover {
                background: #f0f0f0;
            }
            .article {
                margin-bottom: 30px;
                padding: 20px;
                background: #fff;
                border-radius: 5px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }
            .article h2 {
                margin-top: 0;
                color: #333;
            }
            .article a {
                color: #007bff;
                text-decoration: none;
            }
            .article a:hover {
                text-decoration: underline;
            }
        </style>
        <script>
            function debounce(func, wait) {
                let timeout;
                return function(...args) {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => func.apply(this, args), wait);
                };
            }

            window.onload = function() {
                const searchInput = document.querySelector('input[name="q"]');
                const searchResults = document.getElementById('searchResults');
                
                const performSearch = debounce(async (query) => {
                    if (query.length < 2) {
                        searchResults.style.display = 'none';
                        return;
                    }
                    
                    try {
                        const response = await fetch(\`/articles?q=\${encodeURIComponent(query)}\`);
                        const articles = await response.json();
                        
                        searchResults.innerHTML = articles
                            .slice(0, 10)
                            .map(article => \`
                                <div class="result-item" onclick="window.location.href='/articles/\${article.id}'">
                                    \${article.title}
                                </div>
                            \`).join('');
                        
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
        </script>
    </head>
    <body>
        <div class="search-box">
            <input type="text" name="q" placeholder="Search articles...">
            <div id="searchResults"></div>
        </div>
        <h1>${title}</h1>
        ${content}
    </body>
    </html>
    `;
}

module.exports = buildHtml;
