import http from 'http';

http.get('http://localhost:5000/images/potato_image_1.png', (res) => {
  console.log('Status code:', res.statusCode);
}).on('error', (e) => {
  console.error(e);
});
