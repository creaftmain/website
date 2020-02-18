/*=========================================================================================
VARIABLES
=========================================================================================*/

// Track the current page the user is on
let selectedCheckoutSubPage = 1;
// Track the validity of the checkout process
let checkoutValidity = {
  cart: false,
  shipping: false,
  payment: false
};
let stripe;
let elements;
let numberOfPrints;
let numberOfItems;

/*-----------------------------------------------------------------------------------------
ELEMENTS
-----------------------------------------------------------------------------------------*/

// Headings
let checkoutHeadingCart;
let checkoutHeadingShipping;
let checkoutHeadingPayment;
// Card Details
let cardNumber;
let cardExpiry;
let cardCvc;
// Navigation
let checkoutNavigationCart;
let checkoutNavigationShipping;
let checkoutNavigationPayment;

/*=========================================================================================
FUNCTIONS
=========================================================================================*/

/*-----------------------------------------------------------------------------------------
INITIALISATION
-----------------------------------------------------------------------------------------*/

const checkoutInit = () => {
  // Stripe
  stripe = Stripe("pk_test_cyWnxjuNQGbF42g88sLseXpJ003JGn4TCC");
  elements = stripe.elements();
  cardNumber = elements.create("cardNumber");
  cardNumber.mount("#checkout-card-num");
  cardExpiry = elements.create("cardExpiry");
  cardExpiry.mount("#checkout-card-exp");
  cardCvc = elements.create("cardCvc");
  cardCvc.mount("#checkout-card-cvc");
  // ELEMENTS - Headings
  checkoutHeadingCart = document.querySelector("#checkout-cart-hdng");
  checkoutHeadingShipping = document.querySelector("#checkout-shpg-hdng");
  checkoutHeadingPayment = document.querySelector("#checkout-pymt-hdng");
  // ELEMENTS - Navigation
  checkoutNavigationCart = document.querySelector("#checkout-navigation-cart");
  checkoutNavigationShipping = document.querySelector(
    "#checkout-navigation-shipping"
  );
  checkoutNavigationPayment = document.querySelector(
    "#checkout-navigation-payment"
  );

  // LOAD ORDERS
  checkoutCartLoadPrintOrders();
  checkoutCartLoadMarketplaceOrders();

  // CREATE EVENT LISTENERS
  checkoutNavigationEvent();
};

/*-----------------------------------------------------------------------------------------
CART FUNCTIONS
-----------------------------------------------------------------------------------------*/

// FUNCTION TO GET THE 3D PRINT ORDERS FROM THE DATABASE

const checkoutCartGet3dPrintOrders = () => {
  return new Promise(async (resolve, reject) => {
    let prints = [];
    let printsAwaitingQuote = [];
    let printsCheckout = [];

    try {
      printsAwaitingQuote = (
        await axios.post("/customer/orders/print/awaiting-quote")
      )["data"];
    } catch (error) {
      reject(error);
    }

    try {
      printsCheckout = (await axios.post("/customer/orders/print/checkout"))[
        "data"
      ];
    } catch (error) {
      reject(error);
    }

    prints = printsAwaitingQuote.concat(printsCheckout);

    resolve(prints);
  });
};

// FUNCTION TO GET THE MARKETPLACE ORDERS FROM THE DATABASE

const checkoutCartGetMarketplaceOrders = () => {
  return new Promise(async (resolve, reject) => {
    let items;

    try {
      items = (await axios.post("/customer/orders/marketplace/checkout"))[
        "data"
      ];
    } catch (error) {
      reject(error);
    }

    resolve(items);
  });
};

// FUNCTION TO CREATE THE HTML FOR 3D PRINT ORDERS

const checkoutCartCreate3dPrintOrderHTML = print => {
  const printId = String(print._id);
  // Container One
  const icon = `<div class="checkout-prnt-cnt-img bgd-clr-wht-2"></div>`;
  const containerOne = `<div class="checkout-prnt-cnt-cntn-1">${icon}</div>`;

  // Container Two
  const fileName = `<div class="checkout-prnt-cnt-file-name sbtl-1 txt-clr-blk-2">${print.fileName}</div>`;
  const buildType = `<div class="checkout-prnt-cnt-bld-type sbtl-1 txt-clr-blk-2">${print.build}</div>`;
  const colour = `<div class="checkout-prnt-cnt-clr sbtl-1 txt-clr-blk-2">${print.colour}</div>`;
  const quantity = `<div class="checkout-prnt-cnt-qnty-cntn">
                      <label
                        class="checkout-prnt-cnt-qnty-lbl sbtl-1 txt-clr-blk-2"
                        >Quantity:</label
                      >
                      <input
                        type="number"
                        name="quantity"
                        id="checkout-prnt-qnty-${printId}"
                        class="checkout-prnt-cnt-qnty inp-txt-2 sbtl-1 txt-clr-blk-2"
                        min="1"
                        value="${print.quantity}"
                        onchange="checkoutCartUpdate3dPrintOrderQuantity(this.value, '${print.quantity}', '${printId}');"
                      />
                    </div>`;
  const containerTwo = `<div class="checkout-prnt-cnt-cntn-2">${fileName +
    buildType +
    colour +
    quantity}</div>`;

  // Container Three
  const cancel = `<div class="checkout-prnt-cnt-cncl" onclick="checkoutCartDelete3dPrintOrder('${printId}');"></div>`;
  let price;
  price = `<div class="checkout-mkpl-cnt-prc sbtl-1 txt-clr-blk-2">
                      $X,XXX.XX
                    </div>`;
  if (print.status === "awaiting quote") {
    price = `<div class="checkout-prnt-cnt-prc sbtl-1 txt-clr-blk-2">awaiting quote</div>`;
  } else {
    price = `<div class="checkout-prnt-cnt-prc sbtl-1 txt-clr-blk-2">${print.price}</div>`;
  }
  const containerThree = `<div class="checkout-prnt-cnt-cntn-3">${cancel +
    price}</div>`;

  const containers = containerOne + containerTwo + containerThree;
  return containers;
};

// FUNCTION TO UPDATE THE HTML FOR 3D PRINT ORDERS

const checkoutCartUpdate3dPrintOrderHTML = print => {
  const containers = checkoutCartCreate3dPrintOrderHTML(print);
  document.querySelector(`#checkout-prnt-${print._id}`).innerHTML = containers;
};

// FUNCTION TO LOAD ORDERS

const checkoutCartLoadPrintOrders = async () => {
  let prints;

  try {
    prints = await checkoutCartGet3dPrintOrders();
  } catch (error) {
    return error;
  }

  numberOfPrints = prints.length;
  checkoutCartPopulate3dPrintOrders(prints);
};

// FUNCTION TO UPDATE THE NUMBER UNITS

const checkoutCartUpdate3dPrintOrderQuantity = async (
  newQuantity,
  quantity,
  printId
) => {
  if (!checkoutCartValidateOrderQuantity(newQuantity, quantity, printId)) {
    return;
  }
  document.querySelector(
    `#checkout-prnt-${printId}`
  ).innerHTML = `<div class="checkout-cart-loading-container">
                  <div class="checkout-cart-loading">
                    <div class="loading-icon">
                      <div class="layer layer-1"></div>
                      <div class="layer layer-2"></div>
                      <div class="layer layer-3"></div>
                    </div>
                  </div>
                </div>`;

  let print;

  try {
    print = (
      await axios.post("/orders/print/update", {
        printId,
        quantity: newQuantity
      })
    )["data"];
  } catch (error) {
    return {
      status: "failed",
      message: error
    };
  }

  const containers = checkoutCartCreate3dPrintOrderHTML(print);

  document.querySelector(`#checkout-prnt-${print._id}`).innerHTML = containers;
};

// STOP INPUT OF 0 OR LESS QUANTITY

const checkoutCartValidateOrderQuantity = (newQuantity, quantity, printId) => {
  if (newQuantity <= 0) {
    document.querySelector(`#checkout-prnt-qnty-${printId}`).value = quantity;
    return false;
  }
  return true;
};

// @FUNC  checkoutCartPopulate3dPrintOrders
// @TYPE
// @DESC  This function populate the cart
// @ARGU  prints - array - The array of 3D print orders
const checkoutCartPopulate3dPrintOrders = prints => {
  // Process the loaded prints
  if (numberOfPrints) {
    // Set the height of the printing cart depending on the number of items
    document.querySelector("#checkout-prnt-cnts").style = `height: ${16 *
      numberOfPrints}vmax`;
    if (prints) {
      // If there are prints ordered
      document.querySelector("#checkout-prnt-cnts").innerHTML = "";
      for (let i = 0; i < numberOfPrints; i++) {
        const print = prints[i];
        const containers = checkoutCartCreate3dPrintOrderHTML(print);
        const html = `<div class="checkout-prnt-cnt" id="checkout-prnt-${print._id}">${containers}</div>`;
        document
          .querySelector("#checkout-prnt-cnts")
          .insertAdjacentHTML("beforeend", html);
      }
    }
  } else {
    // If there are no prints ordered
    document.querySelector("#checkout-prnt-cnts").innerHTML =
      "<p>No 3D Prints</p>";
  }
};

// @FUNC  checkoutCartDelete3dPrintOrder
// @TYPE
// @DESC  This function removes a 3d print order from the cart and deletes it on the
//        database
// @ARGU  printId - string - The id of the 3d print to be deleted
const checkoutCartDelete3dPrintOrder = async printId => {
  // Remove the 3D print from the cart
  document.querySelector(`#checkout-prnt-${printId}`).remove();
  // Reduce the number of 3D prints listed
  numberOfPrints = numberOfPrints - 1;
  checkoutCartPopulate3dPrintOrders();
  // Delete the 3D print from the database
  let data;
  try {
    data = (await axios.post("/orders/print/delete", { printId }))["data"];
  } catch (error) {
    return { status: "failed", contents: error };
  }
  console.log(data);
  return;
};

// @FUNC  checkoutCartCreateMarketplaceOrderHTML
// @TYPE  SIMPLE
// @DESC  This function creates an HTML for the Marketplace that will be inserted into the
//        page. The components of the HTML is based on a Marketplace order object.
// @ARGU  order - object - the Marketplace order object
const checkoutCartCreateMarketplaceOrderHTML = order => {
  // Create container one HTML
  const icon = `<div class="checkout-mkpl-cnt-img bgd-clr-wht-2"></div>`;
  const containerOne = `<div class="checkout-mkpl-cnt-cntn-1">${icon}</div>`;

  // Create container two HTML
  const itemName = `<div class="checkout-mkpl-cnt-item-name sbtl-1 txt-clr-blk-2">${order.itemName}</div>`;
  const shopName = `<div class="checkout-mkpl-cnt-shop sbtl-1 txt-clr-blk-2">${order.shopName}</div>`;
  const quantity = `<div class="checkout-mkpl-cnt-qnty-cntn">
                      <label
                        class="checkout-mkpl-cnt-qnty-lbl sbtl-1 txt-clr-blk-2"
                        >Quantity:</label
                      >
                      <input
                        type="number"
                        name="quantity"
                        class="checkout-mkpl-cnt-qnty inp-txt-2 sbtl-1 txt-clr-blk-2"
                        min="1"
                        value="${order.quantity}"
                      />
                    </div>`;
  const containerTwo = `<div class="checkout-mkpl-cnt-cntn-2">${itemName +
    shopName +
    quantity}</div>`;

  // Create container three HTML
  const cancel = `<div class="checkout-mkpl-cnt-cncl"></div>`;
  const price = `<div class="checkout-mkpl-cnt-prc sbtl-1 txt-clr-blk-2"></div>`;
  const containerThree = `<div class="checkout-mkpl-cnt-cntn-3">${cancel +
    price}</div>`;

  // Return containers
  const containers = containerOne + containerTwo + containerThree;
  return containers;
};

// @FUNC  checkoutCartCreateMarketplaceNoOrderHTML
// @TYPE  SIMPLE
// @DESC  This function creates an HTML for the Marketplace that will be inserted into the
//        page. The HTML created is for no items scenario.
// @ARGU
const checkoutCartCreateMarketplaceNoOrderHTML = () => {
  const html = "<p>No Items</p>";
  return html;
};

// @FUNC  checkoutCartLoadMarketplaceOrders
// @TYPE  ASYNCHRONOUS
// @DESC  This function loads the marketplace orders
// @ARGU
const checkoutCartLoadMarketplaceOrders = async () => {
  let items;

  try {
    items = await checkoutCartGetMarketplaceOrders();
  } catch (error) {
    return error;
  }

  numberOfItems = items.length;
  checkoutCartPopulateMarketplaceOrders(items);
};

// @FUNC  checkoutCartPopulateMarketplaceOrders
// @TYPE
// @DESC  This function populate the cart
// @ARGU  items - array - The array of Marketplace orders
const checkoutCartPopulateMarketplaceOrders = items => {
  // Process the loaded items
  if (numberOfItems) {
    document.querySelector("#checkout-mkpl-cnts").style = `height: ${16 *
      numberOfItems}vmax`;
    if (items) {
      // If there are items ordered
      document.querySelector("#checkout-mkpl-cnts").innerHTML = "";
      for (let i = 0; i < numberOfItems; i++) {
        const item = items[i];
        const containers = checkoutCartCreateMarketplaceOrderHTML(item);
        const html = `<div class="checkout-mkpl-cnt" id="checkout-mkpl-${item._id}">${containers}</div>`;
        document
          .querySelector("#checkout-mkpl-cnts")
          .insertAdjacentHTML("beforeend", html);
      }
    }
  } else {
    // If there are no items ordered
    const html = checkoutCartCreateMarketplaceNoOrderHTML();
    document.querySelector("#checkout-mkpl-cnts").innerHTML = html;
  }
};

// @FUNC  checkoutCartDeleteMarketplaceOrder
// @TYPE
// @DESC  This function removes a marketplace order from the cart and deletes it on the
//        database
// @ARGU  itemId - string - The id of the item to be deleted
const checkoutCartDeleteMarketplaceOrder = async itemId => {
  // Remove the item from the cart
  document.querySelector(`#checkout-prnt-${itemId}`).remove();
  // Reduce the number of items listed
  numberOfItems = numberOfItems - 1;
  checkoutCartPopulate3dPrintOrders();
  // Delete the item from the database
};

// @FUNC  checkoutCartCreateDiscountHTML
// @TYPE
// @DESC
// @ARGU
const checkoutCartCreateDiscountHTML = discount => {
  const html = `<div class="checkout-dsct sbtl-2 txt-clr-blk-3"></div>`;
  return html;
};

/*-----------------------------------------------------------------------------------------
CREATE PAYMENT INTENT AND GET CLIENT SECRET
-----------------------------------------------------------------------------------------*/

const checkoutPaymentIntent = () => {
  return new Promise(async (resolve, reject) => {
    let clientSecret;

    try {
      clientSecret = await axios.post("/checkout/payment-intent", "Pay");
      resolve(clientSecret.data);
    } catch (error) {
      reject(error);
    }
  });
};

/*-----------------------------------------------------------------------------------------
PROCESS PAYMENT
-----------------------------------------------------------------------------------------*/

const processCardPayment = clientSecret => {
  return new Promise(async (resolve, reject) => {
    let result;

    try {
      result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumber,
          billing_details: {
            name: "test test"
          }
        }
      });

      if (result.error) {
        reject(result.error.message);
      } else {
        resolve(result.paymentIntent);
      }
    } catch (error) {
      reject(error);
    }
  });
};

/*-----------------------------------------------------------------------------------------
PROCEED WITH PAYMENT
-----------------------------------------------------------------------------------------*/

const checkoutPay = async () => {
  let clientSecret;
  let payment;

  try {
    clientSecret = await checkoutPaymentIntent();
  } catch (error) {
    return console.log(error);
  }

  try {
    payment = await processCardPayment(clientSecret);
  } catch (error) {
    return console.log(error);
  }

  console.log(payment["status"]);
};

/*-----------------------------------------------------------------------------------------
NAVIGATION
-----------------------------------------------------------------------------------------*/

let checkoutPages = ["cart", "shipping", "payment"];
let checkoutSelectedPage = 0;

// @FUNC  checkoutNavigationEvent
// @TYPE  SIMPLE
// @DESC  This function adds an event listener to the navigation
// @ARGU
const checkoutNavigationEvent = () => {
  checkoutNavigationCart.addEventListener("click", () => checkoutShowPage(0));
  checkoutNavigationShipping.addEventListener("click", () =>
    checkoutShowPage(1)
  );
  checkoutNavigationPayment.addEventListener("click", () =>
    checkoutShowPage(2)
  );
};

// @FUNC  checkoutShowPage
// @TYPE  SIMPLE
// @DESC  This function switches the page
// @ARGU
const checkoutShowPage = nextPage => {
  // Check if we are currently on the same page
  if (nextPage == checkoutSelectedPage) return;
  // Update the navigation CSS
  checkoutChangeNavigationCSS(nextPage);
  checkoutChangePageCSS(nextPage);
  // Update the current selected page
  checkoutSelectedPage = nextPage;
};

// @FUNC  checkoutChangeNavigationCSS
// @TYPE  SIMPLE
// @DESC  This function changes the CSS of the navigation
// @ARGU
const checkoutChangeNavigationCSS = nextPage => {
  const nextPageName = checkoutPages[nextPage];
  const currentPageName = checkoutPages[checkoutSelectedPage];
  document
    .querySelector(`#checkout-navigation-${nextPageName}`)
    .classList.add("checkout-navigation-icon-container-selected");
  document
    .querySelector(`#checkout-navigation-${currentPageName}`)
    .classList.remove("checkout-navigation-icon-container-selected");
};

// @FUNC  checkoutChangePageCSS
// @TYPE  SIMPLE
// @DESC  This function changes the CSS of the pages
// @ARGU
const checkoutChangePageCSS = nextPage => {
  const nextPageName = checkoutPages[nextPage];
  if (nextPage > checkoutSelectedPage) {
    document
      .querySelector(`#checkout-sub-pg-${nextPageName}`)
      .classList.remove("checkout-sub-pg-right");
    for (let i = checkoutSelectedPage; i < nextPage; i++) {
      const currentPageName = checkoutPages[i];
      document
        .querySelector(`#checkout-sub-pg-${currentPageName}`)
        .classList.remove("checkout-sub-pg-right");
      document
        .querySelector(`#checkout-sub-pg-${currentPageName}`)
        .classList.add("checkout-sub-pg-left");
    }
  } else {
    document
      .querySelector(`#checkout-sub-pg-${nextPageName}`)
      .classList.remove("checkout-sub-pg-left");
    for (let i = checkoutSelectedPage; i > nextPage; i--) {
      const currentPageName = checkoutPages[i];
      document
        .querySelector(`#checkout-sub-pg-${currentPageName}`)
        .classList.remove("checkout-sub-pg-left");
      document
        .querySelector(`#checkout-sub-pg-${currentPageName}`)
        .classList.add("checkout-sub-pg-right");
    }
  }
};

/*=========================================================================================
END
=========================================================================================*/
