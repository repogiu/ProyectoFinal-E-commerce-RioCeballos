// Capturamos los id del html
const modalContainer=document.getElementById("modal-container"); // id modal carrito
const modalOverlay= document.getElementById("modal-overlay"); // id fondo carrito

const cartBtn= document.getElementById("cart-btn"); //  id del boton
const cartCounter= document.getElementById("cart-counter"); // id contador de productos


const displayCart =() =>{
    modalContainer.innerHTML=""; // me limpia el carrito
    modalContainer.style.display="block";
    modalOverlay.style.display="block";

    //Cabecera del modal
    const modalHeader=document.createElement("div");

    const modalClose = document.createElement("div");

    modalClose.innerText="X";
    modalClose.className= "modal-close";
    modalHeader.append(modalClose)

    modalClose.addEventListener("click",()=>{
        modalContainer.style.display="none";
        modalOverlay.style.display="none";
    });

    const modalTitle= document.createElement("div");
    modalTitle.innerText="CARRITO DE COMPRAS";
    modalTitle.className="modal-title";
    modalHeader.append(modalTitle);

    modalContainer.append(modalHeader);

    // Cuerpo del modal
    if (cart.length >0){
    cart.forEach((product) =>{
    const modalBody= document.createElement("div");
    modalBody.className="modal-body";
    modalBody.innerHTML= `
    <div class="product">
        <img class="product-img" src="${product.img}" />
        <div class="product-info">
            <h4>${product.productName}</h4>
        </div>
      <div class="quantity">
            <span class="quantity-btn-decrese">-</span>
            <span class="quantity-input">${product.quanty}</span>
            <span class="quantity-btn-increse">+</span>
      </div>
            <div class="price">${product.price * product.quanty}$</div>
            <div class="delete-product">Quitar</div>
    </div>
    `;
    modalContainer.append(modalBody);

    const decrese = modalBody.querySelector(".quantity-btn-decrese")
    decrese.addEventListener("click",()=>{
        if(product.quanty !== 1){
         product.quanty--;
         displayCart();
        }
        displayCarCounter();
    });
    const increse = modalBody.querySelector(".quantity-btn-increse")
    increse.addEventListener("click",() =>{
        product.quanty++;
        displayCart();
        displayCarCounter();
    });

    // delete
    const deleteProduct= modalBody.querySelector(".delete-product");

    deleteProduct.addEventListener("click",()=>{ // escuchador de eventos
        deleteCartProduct(product.id);

    });
    });



    // modal fotter
    const total = cart.reduce((acc,el) => acc + el.price* el.quanty, 0 );

    const modalFooter= document.createElement("div");
    modalFooter.className="modal-footer"
    modalFooter.innerHTML=`
    <div class="total-price">Total: $ ${total}</div>
    <button class="btn-primary" id="checkout-btn">Ir a pagar</button>
    <div id="button-checkout"></div>

    `;

    modalContainer.append(modalFooter);

    // mercado pago;
    // Add SDK credentials
    // REPLACE WITH YOUR PUBLIC KEY AVAILABLE IN: https://developers.mercadopago.com/panel
    const mercadopago = new MercadoPago("TEST-15e4302f-53c5-4c60-bf9d-6f94ab4bf84e", {
        locale: 'es-AR' // The most common are: 'pt-BR', 'es-AR' and 'en-US'
      });
      
    const checkoutButton=modalFooter.querySelector("#checkout-btn");
  
    checkoutButton.addEventListener("click", function () {

    checkoutButton.remove();
  
    const orderData = {
      quantity: 1,
      description: "Monto de tu compra:",
      price: total,
    };
  
    fetch("http://localhost:8080/create_preference", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (preference) {
        createCheckoutButton(preference.id);
      })
      // Manejo de error
      .catch(function () {
        alert("Unexpected error");
      });
    
    });
  
    function createCheckoutButton(preferenceId) {
      // Initialize the checkout
      const bricksBuilder = mercadopago.bricks();
    
      const renderComponent = async (bricksBuilder) => {
        //if (window.checkoutButton) window.checkoutButton.unmount();
        
        await bricksBuilder.create(
          'wallet',
          'button-checkout', // class/id where the payment button will be displayed
          {
            initialization: {
              preferenceId: preferenceId
            },
            // Manejo de error
            callbacks: {
              onError: (error) => console.error(error),
              onReady: () => {}
            }
          }
        );
      };
      window.checkoutButton =  renderComponent(bricksBuilder);
    }


}   else {
    const modalText=document.createElement("h2");
    modalText.className="modal-body";
    modalText.innerText="El carrito está vacio";
    modalContainer.append(modalText);
   }




  };

cartBtn.addEventListener("click", displayCart)

const deleteCartProduct =(id)=>{
    const foundId = cart.findIndex((element)=>element.id===id)
    cart.splice(foundId,1);
    displayCart();
    displayCarCounter();
};

// Contador de productos 
const displayCarCounter=()=>{
    const cartLength= cart.reduce((acc,el)=>acc + el.quanty,0);
    if(cartLength>0){
        cartCounter.style.display="block"
        cartCounter.innerText=cartLength;
    }else{
        cartCounter.style.display="none";
    }
}

