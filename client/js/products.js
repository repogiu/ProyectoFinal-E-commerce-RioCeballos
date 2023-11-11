fetch('http://localhost:8080/api/products')
  .then(response => response.json())
  .then(products => {
    console.log(products);
  })
  .catch(error => {
    console.error('Error al obtener los productos:', error);
  });
