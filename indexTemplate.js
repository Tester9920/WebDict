
function buildIndexHtml() {
  return `
    <html>
    <head>
      <title>WebDict</title>
      <style>
        body {
          margin: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          font-family: Arial, sans-serif;
          background-color: #f5f5f5;
        }
        .container {
          text-align: center;
        }
        .logo {
          font-size: 48px;
          color: #333;
          margin-bottom: 20px;
          font-weight: bold;
        }
        .search-box {
          position: relative;
        }
        input[type="text"] {
          width: 500px;
          padding: 15px;
          font-size: 16px;
          border: 1px solid #ddd;
          border-radius: 24px;
          outline: none;
        }
        #searchResults {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          width: 500px;
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          margin-top: 8px;
          max-height: 300px;
          overflow-y: auto;
          display: none;
          text-align: left;
        }
        .result-item {
          padding: 10px 15px;
          cursor: pointer;
        }
        .result-item:hover {
          background: #f0f0f0;
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
      <div class="container">
        <div class="logo">WebDict</div>
        <div class="search-box">
          <input type="text" name="q" placeholder="Search articles...">
          <div id="searchResults"></div>
        </div>
      </div>
    </body>
    </html>
  `;
}

module.exports = buildIndexHtml;
