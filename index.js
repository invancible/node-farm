const http = require('http');
const fs = require('fs');
const url = require('url');

const replaceTemplate = require('./util');

//* I use synchronous here to load all the files from the start
//* to avoid load time for user, making it much more efficient

// Read the data.json
const products = fs.readFileSync(`${__dirname}/data/data.json`, 'utf8');
const productsObj = JSON.parse(products);

// Read all the templates
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);

// Create a server and handle routes for every request
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true); // parse url

  // Overview
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-Type': 'text/html' });

    // Transform HTML template
    const productCards = productsObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');

    const output = tempOverview.replace(/{%PRODUCT_CARDS%}/g, productCards);
    res.end(output);

    // Product
  } else if (pathname === '/product') {
    res.writeHead(200, { 'Content-Type': 'text/html' });

    const product = productsObj[query.id];
    const output = replaceTemplate(tempProduct, product); // transform HTML template
    res.end(output);

    // API
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(products);

    // Page not found
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 Page not found.</h1>');
  }
});

// Listen to the PORT the server is running
server.listen(8000, '127.0.0.1', (err) => {
  console.log('listening on port 8000');
});
