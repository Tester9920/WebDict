
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
    
    // Set default language (zh)
    let currentLang = localStorage.getItem('preferred_lang') || 'zh';
    updateLangSelector(currentLang);
    
    // Language selector click handler
    if (langSelector) {
        langSelector.addEventListener('click', function() {
            currentLang = currentLang === 'zh' ? 'en' : 'zh';
            updateLangSelector(currentLang);
            localStorage.setItem('preferred_lang', currentLang);
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
            const response = await fetch(`/articles?rawq=${encodeURIComponent(query)}&l=${currentLang}`);
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
