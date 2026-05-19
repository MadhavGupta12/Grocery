import https from 'https';

https.get('https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=400', (res) => {
  console.log('Status code Unsplash:', res.statusCode);
}).on('error', (e) => {
  console.error(e);
});
