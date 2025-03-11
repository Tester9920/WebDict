const buildHtml = {
    body: function(article) {
        return `
        <a href="./articles/${article.id}"><h1>${article.title}</h1><a>
        <p>${article.content}</p>
        <hr />
        `;
    },

    en_body: function(article) {
        return `
        <a href="./articles/${article.title}"><h1>${article.title}</h1><a>
        <p>${article.content}</p>
        <hr />
        `;
    },

    oneZhArticle: function(article) {
        return `
            <html>
            <head>
            <link rel="stylesheet" href="../searchbox.css">
            <script src="../searchbox.js"></script>
            </head>
            <body>
                <div class="search-box">
                    <form action="/articles" method="get">
                    <div id="langSelector" class="lang-selector"></div>
                    <input type="text" name="q" placeholder="Search articles..." id="sbox">
                    <input type="hidden" name="l" id="langParam" value="zh">
                    <div id="searchResults"></div>
                </div>
            <div class="article">
                <a href="./articles/${article.id}"><h1>${article.title}</h1><a>
                <p>${article.content}</p>
            </div>
            </body>
            </html> `;
    },

    oneEnArticle: function(article) {
        return `
            <html>
            <head>
            <link rel="stylesheet" href="../searchbox.css">
            <script src="../searchbox.js"></script>
            </head>
            <body>
                <div class="search-box">
                    <form action="/articles" method="get">
                    <div id="langSelector" class="lang-selector"></div>
                    <input type="text" name="q" placeholder="Search articles..." id="sbox">
                    <input type="hidden" name="l" id="langParam" value="en">
                    <div id="searchResults"></div>
                </div>
            <div class="article">
                <a href="./articles/${article.title}"><h1>${article.title}</h1><a>
                <p>${article.content}</p>
            </div>
            </body>
            </html> `;
    },


    manyZhArticles: function(articles) {
        return `
        <html>
        <head>
        <link rel="stylesheet" href="./searchbox.css">
        <script src="./searchbox.js"></script>
        </head>
        <body>
            <div class="search-box">
                <form action="/articles" method="get">
                <div id="langSelector" class="lang-selector"></div>
                <input type="text" name="q" placeholder="Search articles..." id="sbox">
                <input type="hidden" name="l" id="langParam" value="zh">
                <div id="searchResults"></div>
                </form>
            </div>
            <div class="articles">
                ${articles.map(articles => buildHtml.body(articles)).join('')}
            </div>
        </body>
        </html> `;
    },

    manyEnArticles: function(articles) {
        return `
        <html>
        <head>
        <link rel="stylesheet" href="./searchbox.css">
        <script src="./searchbox.js"></script>
        </head>
        <body>
            <div class="search-box">
                <form action="/articles" method="get">
                <div id="langSelector" class="lang-selector"></div>
                <input type="text" name="q" placeholder="Search articles..." id="sbox">
                <input type="hidden" name="l" id="langParam" value="en">
                <div id="searchResults"></div>
                </form>
            </div>
            <div class="articles">
                ${articles.map(articles => buildHtml.en_body(articles)).join('')}
            </div>
        </body>
        </html> `;
    }
};

module.exports = buildHtml;