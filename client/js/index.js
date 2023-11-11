
// Inicalizacion
const shopContent = document.getElementById("shopContent");
const cart = [];

// Función para cargar productos de la API y luego renderizarlos
function loadAndDisplayProducts() {
  // Aquí usamos fetch para obtener los productos de tu API
  fetch('/api/products')
    .then(response => response.json())
    .then(productos => {
      // Ahora que tenemos los productos, podemos usar forEach para iterar sobre ellos
      productos.forEach(product => {
        const content = document.createElement("div");
        content.innerHTML = `
        <img src="${product.img}">
        <h3>${product.productName}</h3>
        <p>${product.price} $</p>
        `;
        shopContent.append(content);

        // Boton Agregar al carrito
        const buyButton = document.createElement("button");
        buyButton.innerText = "Agregar al carrito";
        content.append(buyButton);

        buyButton.addEventListener("click", () => {
          const repeat = cart.some((repeatProduct) => repeatProduct.id === product.id);

          if (repeat) {
            cart.map((prod) => {
              if (prod.id === product.id) {
                prod.quanty++;
                displayCarCounter();
              }
            });
          } else {
            cart.push({
              id: product.id,
              productName: product.productName,
              price: product.price,
              quanty: product.quanty,
              img: product.img,
            });
            displayCarCounter();
          }
        });
      });
    })
    .catch(error => {
      console.error('Error al cargar los productos:', error);
    });
}

// Llamamos a la función para cargar y mostrar los productos
loadAndDisplayProducts();
