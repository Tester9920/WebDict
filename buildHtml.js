const buildHtml = {
    body: function(article) {
        return `
        <a href="./articles/${article.id}"><h1>${article.title}</h1><a>
        <p>${article.content}</p>
        <hr />
        `;
    },
    
    oneArticle: function(article) {
        return `
            <html>
            <head>
            <link rel="stylesheet" href="../searchbox.css">
            <script src="../searchbox.js"></script>
            </head>
            <body>
                <div class="search-box">
                    <form action="" method="get">
                    <input type="text" name="q" placeholder="Search articles..." id="sbox">
                    <div id="searchResults"></div>
                </div>
            <div class="article">
                <a href="./articles/${article.id}"><h1>${article.title}</h1><a>
                <p>${article.content}</p>
            </div>
            </body>
            </html> `;
    },

    
    manyArticles: function(articles) {
        return `
        <html>
        <head>
        <link rel="stylesheet" href="./searchbox.css">
        <script src="./searchbox.js"></script>
        </head>
        <body>
            <div class="search-box">
                <form action="" method="get">
                <input type="text" name="q" placeholder="Search articles..." id="sbox">
                <div id="searchResults"></div>
            </div>
            <div class="articles">
                ${articles.map(articles => buildHtml.body(articles)).join('')}
            </div>
        </body>
        </html> `;
    }
};

module.exports = buildHtml;
