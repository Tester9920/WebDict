
function buildIndexHtml() {
  return `
    <html>
    <head>
      <title>WebDict</title>
      <link rel="stylesheet" href="/seachbox.css">
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
          display: flex;
          align-items: center;
          justify-content: center;
        }
        input[type="text"] {
          width: 500px;
          padding: 15px;
          font-size: 16px;
          border: 1px solid #ddd;
          border-radius: 24px;
          outline: none;
        }
        .lang-selector {
          position: absolute;
          left: -45px;
          top: 5%;
          /*transform: translateY(-50%);*/
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #ccc;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          cursor: pointer;
          background-color: white;
          color: #333;
          font-size: 14px;
          /*z-index: 1;*/
          /*transition: all 0.3s ease;*/
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          background-position: center;
          background-size: cover;
        }
        .lang-selector:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .lang-selector.en {
          /*background-color: #007bff;*/
          color: white;
          /*border-color: #007bff;*/
          background-position: center;
          background-size: cover;
          background-image: url('gb.png');
        }
        .lang-selector.zh {
          /*background-color: #28a745;*/
          color: white;
          /*border-color: #28a745;*/
          background-position: center;
          background-size: cover;
          background-image: url('cn.png');
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
          const searchInput = document.querySelector('#sbox');
          const searchResults = document.getElementById('searchResults');
          const langSelector = document.getElementById('langSelector');
          const langParam = document.getElementById('langParam');
          
          // Set default language (zh)
          let currentLang = localStorage.getItem('preferred_lang') || 'zh';
          updateLangSelector(currentLang);
          
          // Language selector click handler
          if (langSelector) {
              langSelector.addEventListener('click', function() {
                  currentLang = currentLang === 'zh' ? 'en' : 'zh';
                  updateLangSelector(currentLang);
                  localStorage.setItem('preferred_lang', currentLang);
                  langParam.value = currentLang;
                  // Clear search results when switching language
                  searchResults.style.display = 'none';
                  if (searchInput.value.length > 0) {
                      performSearch(searchInput.value);
                  }
              });
          }
          
          function updateLangSelector(lang) {
              //langSelector.textContent = lang === 'zh' ? '🇨🇳' : '🇺🇸';
              langSelector.className = 'lang-selector';
              if (lang === 'en') {
                  langSelector.classList.add('en');
              } else {
                  langSelector.classList.add('zh');
              }
              langParam.value = lang;
          }
          
          const performSearch = debounce(async (query) => {
            if (query.length < 1) {
              searchResults.style.display = 'none';
              return;
            }
            
            try {
              const response = await fetch(\`/articles?rawq=\${encodeURIComponent(query)}&l=\${currentLang}\`);
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
          <form action="./articles" method="get">
            <div id="langSelector" class="lang-selector"></div>
            <input type="text" name="q" placeholder="Search articles..." id="sbox">
            <input type="hidden" name="l" id="langParam" value="zh">
            <div id="searchResults"></div>
          </form>
        </div>
      </div>
    </body>
    </html>
  `;
}

module.exports = buildIndexHtml;
