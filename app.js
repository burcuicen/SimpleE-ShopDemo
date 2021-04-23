/* get cart total and empty cart from session on load */
emptyCart();
updateCartTotal();



document.getElementById("emptycart").addEventListener("click", emptyCart);
var btns = document.getElementsByClassName('addtocart');
for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener('click', function () { addToCart(this); });
}

/* ADD TO CART functions */

function addToCart(elem) {

    var sibs = [];
    var getprice;
    var getproductName;
    var cart = [];
    var stringCart;
    //cycles siblings for product info near the add button
    while (elem = elem.previousSibling) {
        if (elem.nodeType === 3) continue; // text node
        if (elem.className == "price") {
            getprice = elem.innerText;
        }
        if (elem.className == "productname") {
            getproductName = elem.innerText;
        }
        sibs.push(elem);
    }
    //create product object
    var product = {
        productname: getproductName,
        price: getprice
    };
    //convert product data to JSON for storage
    var stringProduct = JSON.stringify(product);
    /*send product data to session storage */

    if (!sessionStorage.getItem('cart')) {
        //append product JSON object to cart array
        cart.push(stringProduct);
        //cart to JSON
        stringCart = JSON.stringify(cart);
        //create session storage cart item
        sessionStorage.setItem('cart', stringCart);
        addedToCart(getproductName);
        updateCartTotal();
    }
    else {
        //get existing cart data from storage and convert back into array
        cart = JSON.parse(sessionStorage.getItem('cart'));
        //append new product JSON object
        cart.push(stringProduct);
        //cart back to JSON
        stringCart = JSON.stringify(cart);
        //overwrite cart data in sessionstorage 
        sessionStorage.setItem('cart', stringCart);
        addedToCart(getproductName);
        updateCartTotal();
    }
}
/* Calculate Cart Total */
function updateCartTotal() {
    //init
    var total = 0;
    var price = 0;
    var items = 0;
    var productname = "";
    var carttable = "";
    if (sessionStorage.getItem('cart')) {
        //get cart data & parse to array
        var cart = JSON.parse(sessionStorage.getItem('cart'));
        //get no of items in cart 
        items = cart.length;
        //loop over cart array
        for (var i = 0; i < items; i++) {
            //convert each JSON product in array back into object
            var x = JSON.parse(cart[i]);
            //get property value of price
            price = parseFloat(x.price.split('$')[1]);
            productname = x.productname;
            //add price to total
            carttable += "<tr><td>" + productname + "</td><td>$" + price.toFixed(2) + "</td></tr>";
            total += price;
        }

    }
    //update total on website HTML
    document.getElementById("total").innerHTML = total.toFixed(2);
    //insert saved products to cart table
    document.getElementById("carttable").innerHTML = carttable;
    //update items in cart on website HTML
    document.getElementById("itemsquantity").innerHTML = items;
    document.getElementById("cart_payment").innerHTML = carttable;


    document.getElementById("paymentTotal").innerText = total.toFixed(2);

}
//user feedback
function addedToCart(pname) {
    var message = pname + " was added to the cart";
    var alerts = document.getElementById("alerts");
    alerts.innerHTML = message;
    if (!alerts.classList.contains("message")) {
        alerts.classList.add("message");
    }
}
/* User Manually empty cart */
function emptyCart() {
    //remove cart session storage object & refresh cart totals
    if (sessionStorage.getItem('cart')) {
        sessionStorage.removeItem('cart');
        updateCartTotal();

        var alerts = document.getElementById("alerts");
        alerts.innerHTML = "";
        if (alerts.classList.contains("message")) {
            alerts.classList.remove("message");
        }
    }
}
//shows the checkout action
document.getElementById("checkout").addEventListener("click", function () {

    document.getElementById("checkoutWindow").style.display = "inherit";


});
//shows the payment options according to selected payment method
document.getElementById("continue").addEventListener("click", function () {

    var credits = document.getElementById("credit").checked;
    var wire = document.getElementById("wire-transfer").checked;
    var displayCredit = document.getElementById("credit-cart-pay");
    var displayWire = document.getElementById("wire-transfer-pay");

    if (wire) {
        displayCredit.style.display = "none";
        displayWire.style.display = "block";
    }
    if (credits) {

        displayWire.style.display = "none";
        displayCredit.style.display = "block";
    }

});
