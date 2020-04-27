/*=========================================================================================
NEW VERSION
=========================================================================================*/

/*=========================================================================================
VARIABLES
=========================================================================================*/

// Track the current page the user is on
let numberOfPrints;
let numberOfItems;

/*-----------------------------------------------------------------------------------------
ELEMENTS
-----------------------------------------------------------------------------------------*/

let checkout = {
  // VARIABLES
  element: {
    heading: {
      cart: undefined, // checkout.element.heading.cart
      shipping: undefined, // checkout.element.heading.shipping
      payment: undefined // checkout.element.heading.payment
    },
    button: {
      cart: {
        next: undefined // checkout.element.button.cart.next
      },
      shipping: {
        back: undefined, // checkout.element.button.shipping.back
        next: undefined // checkout.element.button.shipping.next
      },
      payment: {
        bank: {
          back: undefined, // checkout.element.button.payment.bank.back
          paid: undefined // checkout.element.button.payment.bank.paid
        },
        card: {
          back: undefined, // checkout.element.button.payment.card.back
          pay: undefined // checkout.element.button.payment.card.pay
        }
      }
    },
    validity: {
      cart: undefined, // checkout.element.validity.cart
      shipping: undefined, // checkout.element.validity.shipping
      payment: undefined // checkout.element.validity.payment
    },
    navigation: {
      cart: undefined, // checkout.element.navigation.cart
      shipping: undefined, // checkout.element.navigation.shipping
      payment: undefined // checkout.element.navigation.payment
    },
    windowSize: undefined // checkout.element.windowSize
  },
  // FUNCTIONS
  initialise: undefined, // checkout.initialise
  fetch: undefined, // checkout.fetch
  insert: undefined, // checkout.insert
  load: undefined, // checkout.load
  listener: undefined, // checkout.listener
  validate: undefined, // checkout.validate
  elements: {
    assign: undefined // checkout.elements.assign
  },
  cart: {
    prints: {
      fetch: undefined, // checkout.cart.prints.fetch
      insert: undefined, // checkout.cart.prints.insert
      load: undefined, // checkout.cart.prints.load
      resize: undefined // checkout.cart.prints.resize
    },
    print: {
      create: undefined, // checkout.cart.print.create
      insert: undefined, // checkout.cart.print.insert
      update: undefined, // checkout.cart.print.update
      validate: {
        quantity: undefined // checkout.cart.print.validate.quantity
      },
      delete: undefined // checkout.cart.print.delete
    },
    discounts: {},
    discount: {
      add: undefined, // checkout.cart.discount.add
      insert: undefined, // checkout.cart.discount.insert
      validate: undefined // checkout.cart.discount.validate
    },
    manufacturingSpeed: {
      select: undefined // checkout.cart.manufacturingSpeed.select
    },
    validation: {
      validate: undefined, // checkout.cart.validation.validate
      valid: undefined, // checkout.cart.validation.valid
      invalid: undefined // checkout.cart.validate.invalid
    },
    show: undefined, // checkout.cart.show
    resize: undefined // checkout.cart.resize
  },
  shipping: {
    address: {
      select: undefined, // checkout.shipping.address.select
      selected: undefined,
      saved: {
        create: undefined, // checkout.shipping.address.saved.create
        insert: undefined, // checkout.shipping.address.saved.insert
        show: undefined // checkout.shipping.address.saved.show
      },
      new: {
        update: undefined, // checkout.shipping.address.new.update
        populate: undefined, // checkout.shipping.address.new.populate
        toggleSave: undefined, // checkout.shipping.address.new.toggleSave
        validate: {
          unit: undefined, // checkout.shipping.address.new.validate.unit
          street: {
            number: undefined, // checkout.shipping.address.new.validate.street.number
            name: undefined // checkout.shipping.address.new.validate.street.name
          },
          suburb: undefined, // checkout.shipping.address.new.validate.suburb
          city: undefined, // checkout.shipping.address.new.validate.city
          postcode: undefined, // checkout.shipping.address.new.validate.postcode
          country: undefined, // checkout.shipping.address.new.validate.country
          all: undefined // checkout.shipping.address.new.validate.all
        },
        show: undefined // checkout.shipping.address.new.show
      }
    },
    method: {
      select: undefined // checkout.shipping.method.select
    },
    validation: {
      validate: undefined, // checkout.shipping.validation.validate
      valid: undefined, // checkout.shipping.validation.valid
      invalid: undefined // checkout.shipping.validation.invalid
    },
    show: undefined, // checkout.shipping.show
    resize: undefined // checkout.shipping.resize
  },
  payment: {
    stripe: {
      initialise: undefined, // checkout.payment.stripe.initialise
      element: {
        stripe: undefined, // checkout.payment.stripe.element.stripe
        elements: undefined, // checkout.payment.stripe.element.elements
        card: {
          number: undefined, // checkout.payment.stripe.element.card.number
          expiry: undefined, // checkout.payment.stripe.element.card.expiry
          cvc: undefined // checkout.payment.stripe.element.card.cvc
        }
      },
      errorHandler: undefined // checkout.payment.stripe.errorHandler
    },
    method: {
      select: undefined, // checkout.payment.method.select
      selected: undefined, // checkout.payment.method.selected
      bank: {
        show: undefined, // checkout.payment.method.bank.show
        paid: undefined // checkout.payment.method.bank.paid
      },
      card: {
        paymentIntent: undefined, // checkout.payment.method.card.paymentIntent
        process: undefined, // checkout.payment.method.card.process
        show: undefined, // checkout.payment.method.card.show
        pay: undefined // checkout.payment.method.card.pay
      }
    },
    validation: {
      validate: undefined, // checkout.payment.validation.validate
      valid: undefined, // checkout.payment.validation.valid
      invalid: undefined // checkout.payment.validation.invalid
    },
    show: undefined // checkout.payment.show
  },
  navigation: {
    navigate: undefined, // checkout.navigation.navigate
    changeCSS: {
      page: undefined, // checkout.navigation.changeCSS.page
      navigation: undefined // checkout.navigation.changeCSS.navigation
    }
  },
  load: {
    success: undefined, // checkout.load.success
    load: undefined, // checkout.load.load
    time: undefined // checkout.load.time
  }
};

/*=========================================================================================
FUNCTIONS
=========================================================================================*/

// @FUNC  checkout.initialise
// @TYPE
// @DESC
// @ARGU
checkout.initialise = async () => {
  // Stripe
  checkout.payment.stripe.initialise();
  checkout.elements.assign();
  // LOAD ORDER DETAILS
  try {
    await checkout.load();
  } catch (error) {
    console.log(error);
    return;
  }
  // Event Listener
  checkout.listener();
  // Update Loader
  checkout.load.success("loaded");
};

// @FUNC  checkout.fetch
// @TYPE
// @DESC
// @ARGU
checkout.fetch = () => {
  return new Promise(async (resolve, reject) => {
    let order;

    try {
      order = (await axios.post("/checkout/order"))["data"];
    } catch (error) {
      reject(error);
    }

    if (order.status == "failed") {
      reject(order.data);
    }

    resolve(order.data);
  });
};

// @FUNC  checkout.insert
// @TYPE
// @DESC
// @ARGU
checkout.insert = object => {
  console.log(object);
  // MAKES
  const makes = object.makes;
  checkout.cart.prints.insert(makes);
  // MANUFACTURING SPEED
  const manufacturingSpeed = object.order.manufacturingSpeed;
  if (manufacturingSpeed == "normal") {
    document.querySelector("#checkout-normal-speed").checked = true;
  } else if (manufacturingSpeed == "urgent") {
    document.querySelector("#checkout-urgent-speed").checked = true;
  }
  // SHIPPING ADDRESS
  let html;
  // Check if there is a saved address
  if (object.order.shipping.address.saved.suburb) {
    // Saved - Populate Element
    html = checkout.shipping.address.saved.create(
      object.order.shipping.address.saved
    );
  } else {
    // Disable click
    document.querySelector("#checkout-address-saved").disabled = true;
    document
      .querySelector("#checkout-address-saved-label")
      .classList.add("disabled");
    // Add error to inform user that there is no saved address
    document.querySelector("#checkout-address-saved-error").innerHTML =
      "No Saved Address";
    document
      .querySelector("#checkout-address-saved-error")
      .classList.remove("checkout-element-hide");
    html = "No Saved Address";
  }
  checkout.shipping.address.saved.insert(html);
  // New
  checkout.shipping.address.new.populate(object.order.shipping.address.new);
  document.querySelector("#checkout-shipping-save-address-input").checked =
    object.order.shipping.address.save;
  // Selection
  checkout.shipping.address.selected = object.order.shipping.address.option;
  if (checkout.shipping.address.selected == "saved") {
    if (object.order.shipping.address.saved.suburb) {
      document.querySelector("#checkout-address-saved").checked =
        object.order.shipping.address.save;
    }
  } else if (checkout.shipping.address.selected == "new") {
    document.querySelector("#checkout-address-new").checked = true;
  }
  checkout.shipping.address.select(checkout.shipping.address.selected);
  // SHIPPING METHOD
  const shippingMethod = object.order.shipping.method;
  if (shippingMethod == "pickup") {
    document.querySelector("#checkout-shpg-mthd-inp-pckp").checked = true;
  } else if (shippingMethod == "tracked") {
    document.querySelector("#checkout-shpg-mthd-inp-trck").checked = true;
  } else if (shippingMethod == "courier") {
    document.querySelector("#checkout-shpg-mthd-inp-crr").checked = true;
  }
  // PAYMENT METHOD
  // Assign the stored payment method to the global variable
  checkout.payment.method.selected = object.order.payment.method;
  // Perform an operation based on the selected method
  checkout.payment.method.select(checkout.payment.method.selected);
};

// @FUNC  checkout.load
// @TYPE
// @DESC
// @ARGU
checkout.load = async () => {
  let object;

  try {
    object = await checkout.fetch();
  } catch (error) {
    console.log(error);
    return;
  }

  checkout.insert(object);

  // Perform Validation
  checkout.validate(object.validity);
  return;
};

// @FUNC  checkout.listener
// @TYPE
// @DESC
// @ARGU
checkout.listener = () => {
  checkout.element.heading.cart.addEventListener("click", checkout.cart.show);
  checkout.element.navigation.cart.addEventListener(
    "click",
    checkout.cart.show
  );
  checkout.element.button.shipping.back.addEventListener(
    "click",
    checkout.cart.show
  );
  checkout.element.button.payment.bank.back.addEventListener(
    "click",
    checkout.shipping.show
  );
  checkout.element.button.payment.card.back.addEventListener(
    "click",
    checkout.shipping.show
  );
  checkout.element.windowSize.addListener(checkout.cart.prints.resize);
  checkout.element.windowSize.addListener(checkout.cart.resize);
  checkout.element.windowSize.addListener(checkout.shipping.resize);
  checkout.element.windowSize.addListener(checkout.payment.resize);
};

// @FUNC  checkout.validate
// @TYPE
// @DESC
// @ARGU
checkout.validate = async validity => {
  checkout.cart.validation.validate(validity);
  checkout.shipping.validation.validate(validity);
  checkout.payment.validation.validate(validity);
};

// @FUNC  checkout.elements.assign
// @TYPE
// @DESC
// @ARGU
checkout.elements.assign = () => {
  checkout.element.heading.cart = document.querySelector("#checkout-cart-hdng");
  checkout.element.heading.shipping = document.querySelector(
    "#checkout-shpg-hdng"
  );
  checkout.element.heading.payment = document.querySelector(
    "#checkout-pymt-hdng"
  );
  checkout.element.navigation.cart = document.querySelector(
    "#checkout-navigation-cart"
  );
  checkout.element.navigation.shipping = document.querySelector(
    "#checkout-navigation-shipping"
  );
  checkout.element.navigation.payment = document.querySelector(
    "#checkout-navigation-payment"
  );
  checkout.element.button.cart.next = document.querySelector("#checkout-cart-next");
  checkout.element.button.shipping.back = document.querySelector(
    "#checkout-element-button-shipping-back"
  );
  checkout.element.button.shipping.next = document.querySelector(
    "#checkout-element-button-shipping-next"
  );
  checkout.element.button.payment.bank.back = document.querySelector(
    "#checkout-element-button-payment-bank-back"
  );
  checkout.element.button.payment.bank.paid = document.querySelector(
    "#checkout-element-button-payment-bank-paid"
  );
  checkout.element.button.payment.card.back = document.querySelector(
    "#checkout-element-button-payment-card-back"
  );
  checkout.element.button.payment.card.pay = document.querySelector(
    "#checkout-element-button-payment-card-pay"
  );
  checkout.element.windowSize = window.matchMedia("(min-width: 850px)");
};

/*-----------------------------------------------------------------------------------------
CART
-----------------------------------------------------------------------------------------*/

// @FUNC  checkout.cart.prints.fetch
// @TYPE  PROMISE ASYNCHRONOUS
// @DESC
// @ARGU
checkout.cart.prints.fetch = () => {
  return new Promise(async (resolve, reject) => {
    let awaitingQuote = [];
    let checkout = [];

    try {
      awaitingQuote = (
        await axios.post("/customer/orders/print/awaiting-quote")
      )["data"];
    } catch (error) {
      reject(error);
    }

    try {
      checkout = (await axios.post("/customer/orders/print/checkout"))["data"];
    } catch (error) {
      reject(error);
    }

    resolve({ awaitingQuote, checkout });
  });
};

// @FUNC  checkout.cart.prints.insert
// @TYPE  SIMPLE
// @DESC
// @ARGU
checkout.cart.prints.insert = object => {
  if (object) {
    const makes = object.awaitingQuote.concat(object.checkout);
    numberOfPrints = makes.length;
    if (numberOfPrints) {
      // If there are prints ordered
      document.querySelector("#checkout-prints").innerHTML = "";
      for (let i = 0; i < numberOfPrints; i++) {
        checkout.cart.print.insert(makes[i]);
      }
    } else {
      // If there are no prints ordered
      document.querySelector("#checkout-prints").innerHTML =
        "<p>No 3D Prints</p>";
    }
  } else {
    if (!numberOfPrints) {
      document.querySelector("#checkout-prints").innerHTML =
        "<p>No 3D Prints</p>";
    } else {
    }
  }
  checkout.cart.prints.resize();
  checkout.cart.resize();
};

// @FUNC  checkout.cart.prints.load
// @TYPE  SIMPLE
// @DESC
// @ARGU
checkout.cart.prints.load = async () => {
  let object;

  try {
    object = await checkout.cart.prints.fetch();
  } catch (error) {
    return error;
  }

  checkout.cart.prints.insert(object);
};

// @FUNC  checkout.cart.prints.resize
// @TYPE
// @DESC
// @ARGU
checkout.cart.prints.resize = () => {
  if (checkout.element.windowSize.matches) {
    if (numberOfPrints) {
      document.querySelector("#checkout-prints").style = `height: ${10 *
        numberOfPrints}vmax`;
    } else {
      document.querySelector("#checkout-prints").style = `height: 10vmax`;
    }
  } else {
    if (numberOfPrints) {
      document.querySelector("#checkout-prints").style = `height: ${16 *
        numberOfPrints}vmax`;
    } else {
      document.querySelector("#checkout-prints").style = `height: 16vmax`;
    }
  }
};

// @FUNC  checkout.cart.print.create
// @TYPE  SIMPLE
// @DESC
// @ARGU
checkout.cart.print.create = print => {
  const printId = String(print._id);
  // Container One
  const icon = `<div class="image"></div>`;
  const containerOne = `<div class="checkout-print-container-1">${icon}</div>`;

  // Container Two
  const fileName = `<a href="/files/download/${print.file.id}">${print.file.name}</a>`;
  const buildType = `<div class="build-type">${print.build}</div>`;
  const colour = `<div class="colour">${print.colour}</div>`;
  const quantity = `<div class="checkout-print-quantity-container">
                      <label>Quantity:</label>
                      <input type="number" name="quantity" id="checkout-print-quantity-${printId}" min="1" value="${print.quantity}"
                        onchange="checkout.cart.print.update(this.value,'${print.quantity}','quantity','${printId}');"/>
                    </div>`;
  const containerTwo = `<div class="checkout-print-container-2">${fileName + buildType + colour + quantity}</div>`;

  // Container Three
  const cancel = `<div class="checkout-print-delete" onclick="checkout.cart.print.delete('${printId}');"></div>`;
  let price;
  if (print.status === "awaitingQuote") {
    price = `<div class="price">awaiting quote</div>`;
  } else {
    const totalPrice = print.price * print.quantity;
    price = `<div class="price">$ ${totalPrice}</div>`;
  }
  const containerThree = `<div class="checkout-print-container-3">${cancel + price}</div>`;

  const containers = containerOne + containerTwo + containerThree;
  return containers;
};

// @FUNC  checkout.cart.print.insert
// @TYPE  SIMPLE
// @DESC
// @ARGU
checkout.cart.print.insert = (print, element) => {
  const containers = checkout.cart.print.create(print);
  if (element) {
    element.innerHTML = containers;
  } else {
    const html = `<div class="print" id="checkout-print-${print._id}">${containers}</div>`;
    document.querySelector("#checkout-prints").insertAdjacentHTML("beforeend", html);
  }
};

// @FUNC  checkout.cart.print.update
// @TYPE  SIMPLE
// @DESC
// @ARGU
checkout.cart.print.update = async (newValue, oldValue, property, printId) => {
  if (!checkout.cart.print.validate[property](newValue, oldValue, printId)) {
    return;
  }

  let print;

  checkout.load.load("updating quantity");

  try {
    print = (
      await axios.post("/orders/print/update", {
        printId,
        quantity: newValue
      })
    )["data"];
  } catch (error) {
    return {
      status: "failed",
      message: error
    };
  }

  checkout.load.success("success");
};

// @FUNC  checkout.cart.print.validate.quantity
// @TYPE  SIMPLE
// @DESC
// @ARGU
checkout.cart.print.validate.quantity = (newValue, oldValue, printId) => {
  if (newValue <= 0) {
    document.querySelector(`#checkout-print-quantity-${printId}`).value = oldValue;
    return false;
  }
  return true;
};

// @FUNC  checkout.cart.print.delete
// @TYPE  ASYNCHRONOUS
// @DESC
// @ARGU
checkout.cart.print.delete = async printId => {
  // Remove the 3D print from the cart
  document.querySelector(`#checkout-print-${printId}`).remove();
  // Reduce the number of 3D prints listed
  numberOfPrints = numberOfPrints - 1;
  checkout.cart.prints.insert();
  // Delete the 3D print from the database
  checkout.load.load("deleting 3D print");
  let object;
  try {
    object = (await axios.post("/checkout/order/delete/print", { printId }))[
      "data"
    ]["data"];
  } catch (error) {
    return { status: "failed", contents: error };
  }
  checkout.load.success("deleted");
  // Perform Validation
  checkout.validate(object.validity);
  return;
};

// @FUNC  checkout.cart.discount.add
// @TYPE
// @DESC
// @ARGU
checkout.cart.discount.add = () => {
  // Fetch the discount code input
  const discountCode = document.querySelector("#checkout-discount-input").value;
  // Perform pre-validation before sending to the backend
  let validation = {
    status: "Success",
    message: ""
  };
  if (!discountCode) {
    // Check if input code exist
    validation.status = "Failed";
    validation.message = "Input Discount Code";
  }
  if (!checkout.cart.discount.validate(validation)) return; // Validation

  /* Send to the backend to perform validation and if successful,
  retrieve the discount object */

  let discount;
  if (!checkout.cart.discount.validate(validation)) return; // Validation
  // Display the discount to the page
  checkout.cart.discount.insert(discount);
};

// @FUNC  checkout.cart.discount.insert
// @TYPE
// @DESC
// @ARGU
checkout.cart.discount.insert = discount => {
  const html = `<div class="checkout-discount"></div>`;
  document
    .querySelector("#checkout-discount-list-cntn")
    .insertAdjacentHTML("beforeend", html);
  document.querySelector("#checkout-discount-input").value = ""; // Clear input
  document.querySelector("#checkout-discount-input-error").innerHTML = ""; // Clear error
};

// @FUNC  checkout.cart.discount.validate
// @TYPE
// @DESC
// @ARGU
checkout.cart.discount.validate = validation => {
  if (validation.status == "Failed") {
    document.querySelector("#checkout-discount-input-error").innerHTML =
      validation.message;
    return false;
  }
  return true;
};

// @FUNC  checkout.cart.manufacturingSpeed.select
// @TYPE
// @DESC
// @ARGU
checkout.cart.manufacturingSpeed.select = async option => {
  // Place Loaders

  // Update the Database
  checkout.load.load("updating order");
  let object;
  try {
    object = (
      await axios.post("/checkout/order/update/manufacturing-speed", {
        option
      })
    )["data"]["data"];
  } catch (error) {
    console.log(error);
    return;
  }
  checkout.load.success("saved");
  // Update Price

  // Perform Validation
  checkout.validate(object.validity);
};

// @FUNC  checkout.cart.validation.validate
// @TYPE  SIMPLE
// @DESC
// @ARGU
checkout.cart.validation.validate = async validity => {
  let valid;

  if (validity) {
    valid = validity.cart;
  } else {
    try {
      valid = (await axios.post("/checkout/order/validate/cart"))["data"][
        "data"
      ];
    } catch (error) {
      console.log(error);
      return;
    }
  }

  checkout.element.validity.cart = valid;

  if (valid) {
    checkout.cart.validation.valid();
  } else {
    checkout.cart.validation.invalid();
  }
};

// @FUNC  checkout.cart.validation.valid
// @TYPE  SIMPLE
// @DESC
// @ARGU
checkout.cart.validation.valid = () => {
  // Add Event Listeners
  checkout.element.heading.shipping.addEventListener(
    "click",
    checkout.shipping.show
  );
  checkout.element.navigation.shipping.addEventListener(
    "click",
    checkout.shipping.show
  );
  checkout.element.button.cart.next.addEventListener(
    "click",
    checkout.shipping.show
  );
  // Update CSS
  checkout.element.heading.shipping.classList.add("valid");
  checkout.element.button.cart.next.classList.add("valid");
  checkout.element.navigation.cart.classList.add("valid");
  checkout.element.navigation.shipping.classList.remove("unavailable");
};

// @FUNC  checkout.cart.validation.invalid
// @TYPE  SIMPLE
// @DESC
// @ARGU
checkout.cart.validation.invalid = () => {
  checkout.element.heading.shipping.removeEventListener(
    "click",
    checkout.shipping.show
  );
  checkout.element.navigation.shipping.removeEventListener(
    "click",
    checkout.shipping.show
  );
  checkout.element.button.cart.next.removeEventListener(
    "click",
    checkout.shipping.show
  );
  // Update CSS
  checkout.element.heading.shipping.classList.remove("valid");
  checkout.element.button.cart.next.classList.remove("valid");
  checkout.element.navigation.cart.classList.remove("valid");
  checkout.element.navigation.shipping.classList.add("unavailable");
  // Return to Cart Page
  checkout.cart.show();
};

// @FUNC  checkout.cart.show
// @TYPE  SIMPLE
// @DESC
// @ARGU
checkout.cart.show = () => {
  checkout.navigation.navigate(0);
};

// @FUNC  checkout.cart.resize
// @TYPE  SIMPLE
// @DESC
// @ARGU
checkout.cart.resize = () => {
  // DESKTOP HEIGHT CALCULATION
  const desktopHeight = {
    heading: 8,
    subHeading: 8 * 4,
    prints: numberOfPrints ? 10 * numberOfPrints : 10,
    discountInput: 9,
    manufacturingSpeed: 8,
    buttons: 12
  };
  const total =
    desktopHeight.heading +
    desktopHeight.subHeading +
    desktopHeight.prints +
    desktopHeight.discountInput +
    desktopHeight.manufacturingSpeed +
    desktopHeight.buttons;
  // SET THE CART PAGE SIZE
  if (checkout.element.windowSize.matches) {
    if (checkoutSelectedPage == 0) {
      document.querySelector("#checkout-cart").style =
        "height: " + total + "vmax;";
    } else {
      document.querySelector("#checkout-cart").style = "height: 6vmax;";
    }
  } else {
    document.querySelector("#checkout-cart").style = "height: 100%;";
  }
};

/*-----------------------------------------------------------------------------------------
SHIPPING
-----------------------------------------------------------------------------------------*/

// @FUNC  checkout.shipping.address.select
// @TYPE
// @DESC
// @ARGU
checkout.shipping.address.select = async (option, update) => {
  checkout.shipping.address.selected = option;
  if (option == "saved") {
    checkout.shipping.address.saved.show(true);
    checkout.shipping.address.new.show(false);
  } else if (option == "new") {
    checkout.shipping.address.saved.show(false);
    checkout.shipping.address.new.show(true);
  }
  checkout.shipping.resize();
  // UPDATE THE DATABASE
  // Place Loaders

  // Update the Database
  if (update) {
    checkout.load.load("updating order");
    let object;
    try {
      object = await axios.post(
        "/checkout/order/update/shipping-address-option",
        {
          option
        }
      );
    } catch (error) {
      console.log(error);
      return;
    }
    checkout.load.success("saved");
    // Update Price

    // Perform Validation
    checkout.validate(object.validity);
  }
};

// @FUNC  checkout.shipping.address.saved.create
// @TYPE
// @DESC
// @ARGU
checkout.shipping.address.saved.create = address => {
  let unit = "";

  if (address.unit) {
    unit = `<div class="checkout-saved-address-line">
            ${address.unit}</div>`;
  }

  const street = `<div class="checkout-saved-address-line">
                  ${address.street.number} ${address.street.name}</div>`;
  const suburb = `<div class="checkout-saved-address-line">
                  ${address.suburb}</div>`;
  const cityPostal = `<div class="checkout-saved-address-line">
                      ${address.city}, ${address.postcode}</div>`;
  const country = `<div class="checkout-saved-address-line">
                    ${address.country}</div>`;

  const html = unit + street + suburb + cityPostal + country;

  return html;
};

// @FUNC  checkout.shipping.address.saved.insert
// @TYPE
// @DESC
// @ARGU
checkout.shipping.address.saved.insert = html => {
  document.querySelector("#checkout-saved-address").innerHTML = html;
};

// @FUNC  checkout.shipping.address.saved.show
// @TYPE
// @DESC
// @ARGU
checkout.shipping.address.saved.show = show => {
  if (show) {
    document
      .querySelector("#checkout-saved-address")
      .classList.remove("checkout-element-hide");
  } else {
    document
      .querySelector("#checkout-saved-address")
      .classList.add("checkout-element-hide");
  }
};

// @FUNC  checkout.shipping.address.new.validate.unit
// @TYPE
// @DESC
// @ARGU
checkout.shipping.address.new.validate.unit = () => {
  const unit = document.querySelector("#checkout-new-address-unit").value;
  let status = {
    valid: true,
    input: unit,
    message: ""
  };

  return status;
};

// @FUNC  checkout.shipping.address.new.validate.street.number
// @TYPE
// @DESC
// @ARGU
checkout.shipping.address.new.validate.street.number = () => {
  const streetNumber = document.querySelector("#checkout-new-address-street-number")
    .value;
  let status = {
    valid: true,
    input: streetNumber,
    message: ""
  };

  // Validate if there is anything written
  if (!streetNumber) {
    status.valid = false;
    status.message = "requires input";
  }

  return status;
};

// @FUNC  checkout.shipping.address.new.validate.street.name
// @TYPE
// @DESC
// @ARGU
checkout.shipping.address.new.validate.street.name = () => {
  const streetName = document.querySelector("#checkout-new-address-street-name")
    .value;
  let status = {
    valid: true,
    input: streetName,
    message: ""
  };

  // Validate if there is anything written
  if (!streetName) {
    status.valid = false;
    status.message = "requires input";
  }

  return status;
};

// @FUNC  checkout.shipping.address.new.validate.suburb
// @TYPE
// @DESC
// @ARGU
checkout.shipping.address.new.validate.suburb = () => {
  const suburb = document.querySelector("#checkout-new-address-suburb").value;
  let status = {
    valid: true,
    input: suburb,
    message: ""
  };

  // Validate if there is anything written
  if (!suburb) {
    status.valid = false;
    status.message = "requires input";
  }

  return status;
};

// @FUNC  checkout.shipping.address.new.validate.city
// @TYPE
// @DESC
// @ARGU
checkout.shipping.address.new.validate.city = () => {
  const city = document.querySelector("#checkout-new-address-city").value;
  let status = {
    valid: true,
    input: city,
    message: ""
  };

  // Validate if there is anything written
  if (!city) {
    status.valid = false;
    status.message = "requires input";
  }

  return status;
};

// @FUNC  checkout.shipping.address.new.validate.postcode
// @TYPE
// @DESC
// @ARGU
checkout.shipping.address.new.validate.postcode = () => {
  const postcode = document.querySelector("#checkout-new-address-postcode")
    .value;
  let status = {
    valid: true,
    input: postcode,
    message: ""
  };

  // Validate if there is anything written
  if (!postcode) {
    status.valid = false;
    status.message = "requires input";
  }

  return status;
};

// @FUNC  checkout.shipping.address.new.validate.country
// @TYPE
// @DESC
// @ARGU
checkout.shipping.address.new.validate.country = () => {
  const country = document.querySelector("#checkout-new-address-country").value;
  let status = {
    valid: true,
    input: country,
    message: ""
  };

  // Validate if there is anything written
  if (!country) {
    status.valid = false;
    status.message = "requires input";
  }

  return status;
};

// @FUNC  checkout.shipping.address.new.validate.all
// @TYPE
// @DESC
// @ARGU
checkout.shipping.address.new.validate.all = type => {
  // Collect and Validate Inputs
  const unit = checkout.shipping.address.new.validate.unit();
  const streetNumber = checkout.shipping.address.new.validate.street.number();
  const streetName = checkout.shipping.address.new.validate.street.name();
  const suburb = checkout.shipping.address.new.validate.suburb();
  const city = checkout.shipping.address.new.validate.city();
  const postcode = checkout.shipping.address.new.validate.postcode();
  const country = checkout.shipping.address.new.validate.country();
  // Check Validity
  const valid =
    unit.valid &&
    streetNumber.valid &&
    streetName.valid &&
    suburb.valid &&
    city.valid &&
    postcode.valid &&
    country.valid;
  // Error Handling
  if (type == "unit") {
    document.querySelector("#checkout-shipping-unit-error").innerHTML =
      unit.message;
  } else if (type == "streetNumber") {
    document.querySelector("#checkout-shipping-street-number-error").innerHTML =
      streetNumber.message;
  } else if (type == "streetName") {
    document.querySelector("#checkout-shipping-street-name-error").innerHTML =
      streetName.message;
  } else if (type == "suburb") {
    document.querySelector("#checkout-shipping-suburb-error").innerHTML =
      suburb.message;
  } else if (type == "city") {
    document.querySelector("#checkout-shipping-city-error").innerHTML =
      city.message;
  } else if (type == "postcode") {
    document.querySelector("#checkout-shipping-postcode-error").innerHTML =
      postcode.message;
  } else if (type == "country") {
    document.querySelector("#checkout-shipping-country-error").innerHTML =
      country.message;
  } else {
    document.querySelector("#checkout-shipping-unit-error").innerHTML =
      unit.message;
    document.querySelector("#checkout-shipping-street-number-error").innerHTML =
      streetNumber.message;
    document.querySelector("#checkout-shipping-street-name-error").innerHTML =
      streetName.message;
    document.querySelector("#checkout-shipping-suburb-error").innerHTML =
      suburb.message;
    document.querySelector("#checkout-shipping-city-error").innerHTML =
      city.message;
    document.querySelector("#checkout-shipping-postcode-error").innerHTML =
      postcode.message;
    document.querySelector("#checkout-shipping-country-error").innerHTML =
      country.message;
  }
  if (valid) {
  } else {
  }
  // Create the Address Object
  const address = {
    unit: unit.input,
    street: {
      number: streetNumber.input,
      name: streetName.input
    },
    suburb: suburb.input,
    city: city.input,
    postcode: postcode.input,
    country: country.input
  };

  return address;
};

// @FUNC  checkout.shipping.address.new.populate
// @TYPE
// @DESC
// @ARGU
checkout.shipping.address.new.populate = address => {
  document.querySelector("#checkout-new-address-unit").value = address.unit;
  document.querySelector("#checkout-new-address-street-number").value =
    address.street.number;
  document.querySelector("#checkout-new-address-street-name").value =
    address.street.name;
  document.querySelector("#checkout-new-address-suburb").value = address.suburb;
  document.querySelector("#checkout-new-address-city").value = address.city;
  document.querySelector("#checkout-new-address-postcode").value =
    address.postcode;
  document.querySelector("#checkout-new-address-country").value =
    address.country;
};

// @FUNC  checkout.shipping.address.new.update
// @TYPE
// @DESC
// @ARGU
checkout.shipping.address.new.update = async type => {
  const address = checkout.shipping.address.new.validate.all(type);

  checkout.load.load("updating order");
  let object;
  try {
    object = (
      await axios.post("/checkout/order/update/new-shipping-address", {
        address
      })
    )["data"]["data"];
  } catch (error) {
    console.log(error);
    return;
  }
  checkout.load.success("saved");
  checkout.validate(object.validity);
};

// @FUNC  checkout.shipping.address.new.toggleSave
// @TYPE
// @DESC
// @ARGU
checkout.shipping.address.new.toggleSave = async save => {
  // Place Loaders

  // Update the Database
  checkout.load.load("updating order");
  let object;
  try {
    object = await axios.post(
      "/checkout/order/update/new-shipping-address-save",
      {
        save
      }
    );
  } catch (error) {
    console.log(error);
    return;
  }
  checkout.load.success("saved");
  // Update Price

  // Perform Validation
  checkout.validate(object.validity);
};

// @FUNC  checkout.shipping.address.new.show
// @TYPE
// @DESC
// @ARGU
checkout.shipping.address.new.show = show => {
  if (show) {
    document
      .querySelector("#checkout-new-address")
      .classList.remove("checkout-element-hide");
  } else {
    document
      .querySelector("#checkout-new-address")
      .classList.add("checkout-element-hide");
  }
};

// @FUNC  checkout.shipping.method.select
// @TYPE
// @DESC
// @ARGU
checkout.shipping.method.select = async option => {
  // Place Loaders

  // Update the Database
  checkout.load.load("updating order");
  let object;
  try {
    object = (
      await axios.post("/checkout/order/update/shipping-method", {
        option
      })
    )["data"]["data"];
  } catch (error) {
    console.log(error);
    return;
  }
  checkout.load.success("saved");
  // Update Price

  // Perform Validation
  checkout.validate(object.validity);
};

// @FUNC  checkout.shipping.validation.validate
// @TYPE  SIMPLE
// @DESC
// @ARGU
checkout.shipping.validation.validate = async validity => {
  let valid;

  if (validity) {
    valid = validity.cart && validity.shipping;
  } else {
    try {
      valid = (await axios.post("/checkout/order/validate/shipping"))["data"][
        "data"
      ];
    } catch (error) {
      console.log(error);
      return;
    }
  }

  checkout.element.validity.shipping = valid;

  if (valid) {
    checkout.shipping.validation.valid();
  } else {
    checkout.shipping.validation.invalid();
  }
};

// @FUNC  checkout.shipping.validation.valid
// @TYPE  SIMPLE
// @DESC
// @ARGU
checkout.shipping.validation.valid = () => {
  checkout.element.heading.payment.addEventListener(
    "click",
    checkout.payment.show
  );
  checkout.element.navigation.payment.addEventListener(
    "click",
    checkout.payment.show
  );
  checkout.element.button.shipping.next.addEventListener(
    "click",
    checkout.payment.show
  );
  // Update CSS
  checkout.element.button.shipping.next.classList.add("valid");
  checkout.element.heading.payment.classList.add("valid");
  checkout.element.navigation.shipping.classList.add("valid");
  checkout.element.navigation.payment.classList.remove("unavailable");
};

// @FUNC  checkout.shipping.validation.invalid
// @TYPE  SIMPLE
// @DESC
// @ARGU
checkout.shipping.validation.invalid = () => {
  checkout.element.heading.payment.removeEventListener(
    "click",
    checkout.payment.show
  );
  checkout.element.navigation.payment.removeEventListener(
    "click",
    checkout.payment.show
  );
  checkout.element.button.shipping.next.removeEventListener(
    "click",
    checkout.payment.show
  );
  // Update CSS
  checkout.element.button.shipping.next.classList.remove(
    "valid"
  );
  checkout.element.navigation.shipping.classList.remove("valid");
  checkout.element.navigation.payment.classList.add("unavailable");
};

// @FUNC  checkout.shipping.show
// @TYPE  SIMPLE
// @DESC
// @ARGU
checkout.shipping.show = () => {
  checkout.navigation.navigate(1);
};

checkout.shipping.resize = () => {
  // DESKTOP HEIGHT CALCULATION
  const heading = 8;
  const subHeading = 8 * 2;
  let address;

  if (checkout.shipping.address.selected == "saved") {
    address = {
      saved: 13,
      new: 3
    };
  } else if (checkout.shipping.address.selected == "new") {
    address = {
      saved: 3,
      new: 41
    };
  } else {
    address = {
      saved: 3,
      new: 3
    };
  }

  const error = 2;

  const method = 3 * 3;
  const buttons = 12;
  const total =
    heading +
    subHeading +
    address.saved +
    address.new +
    error +
    method +
    buttons;

  // SET THE CART PAGE SIZE
  if (checkout.element.windowSize.matches) {
    if (checkoutSelectedPage == 1) {
      document.querySelector("#checkout-shipping").style =
        "height: " + total + "vmax;";
    } else {
      document.querySelector("#checkout-shipping").style =
        "height: 6vmax;";
    }
  } else {
    document.querySelector("#checkout-shipping").style = "height: 100%;";
  }
};

/*-----------------------------------------------------------------------------------------
PAYMENT
-----------------------------------------------------------------------------------------*/

// @FUNC  checkout.payment.stripe.initialise
// @TYPE
// @DESC
// @ARGU
checkout.payment.stripe.initialise = () => {
  checkout.payment.stripe.element.stripe = Stripe(
    "pk_test_cyWnxjuNQGbF42g88sLseXpJ003JGn4TCC"
  );
  checkout.payment.stripe.element.elements = checkout.payment.stripe.element.stripe.elements();
  checkout.payment.stripe.element.card.number = checkout.payment.stripe.element.elements.create(
    "cardNumber"
  );
  checkout.payment.stripe.element.card.number.mount("#checkout-card-num");
  checkout.payment.stripe.element.card.expiry = checkout.payment.stripe.element.elements.create(
    "cardExpiry"
  );
  checkout.payment.stripe.element.card.expiry.mount("#checkout-card-exp");
  checkout.payment.stripe.element.card.cvc = checkout.payment.stripe.element.elements.create(
    "cardCvc"
  );
  checkout.payment.stripe.element.card.cvc.mount("#checkout-card-cvc");
  // ERROR HANDLER
  checkout.payment.stripe.errorHandler();
};

// @FUNC  checkout.payment.stripe.errorHandler
// @TYPE
// @DESC
// @ARGU
checkout.payment.stripe.errorHandler = () => {
  // CARD NUMBER
  checkout.payment.stripe.element.card.number.addEventListener(
    "change",
    ({ error }) => {
      const element = document.querySelector("#checkout-card-number-error");
      if (error) {
        element.textContent = "invalid";
      } else {
        element.textContent = "";
      }
    }
  );
  // CARD NAME
  checkout.payment.stripe.element.card.expiry.addEventListener(
    "change",
    ({ error }) => {
      const element = document.querySelector("#checkout-card-expiry-error");
      if (error) {
        element.textContent = "invalid";
      } else {
        element.textContent = "";
      }
    }
  );
  // CARD CVC
  checkout.payment.stripe.element.card.cvc.addEventListener(
    "change",
    ({ error }) => {
      const element = document.querySelector("#checkout-card-cvc-error");
      if (error) {
        element.textContent = "invalid";
      } else {
        element.textContent = "";
      }
    }
  );
};

// @FUNC  checkout.payment.method.select
// @TYPE
// @DESC
// @ARGU
checkout.payment.method.select = async (option, update) => {
  checkout.payment.method.selected = option;
  if (option === "bankTransfer") {
    document.querySelector(
      "#checkout-payment-method-bank-transfer"
    ).checked = true;
    checkout.payment.method.bank.show(true);
    checkout.payment.method.card.show(false);
  } else if (option === "card") {
    document.querySelector("#checkout-payment-method-card").checked = true;
    checkout.payment.method.bank.show(false);
    checkout.payment.method.card.show(true);
  }
  checkout.payment.resize();

  // UPDATE THE DATABASE
  // Place Loaders

  if (update) {
    checkout.load.load("updating order");
    // Update the Database
    let object;
    try {
      object = await axios.post("/checkout/order/update/payment-method", {
        option
      });
    } catch (error) {
      console.log(error);
      return;
    }
    // Update Price

    // Perform Validation
    checkout.validate(object.validity);
    checkout.load.success("saved");
  }
};

// @FUNC  checkout.payment.method.bank.show
// @TYPE
// @DESC
// @ARGU
checkout.payment.method.bank.show = show => {
  if (show) {
    document
      .querySelector("#checkout-pymt-bank-tsfr-cntn")
      .classList.remove("checkout-element-hide");
  } else {
    document
      .querySelector("#checkout-pymt-bank-tsfr-cntn")
      .classList.add("checkout-element-hide");
  }
};

checkout.payment.method.bank.paid = async () => {
  // PREPARE PAGE USING LOADING ICON
  document
    .querySelector("#checkout-complete-container")
    .classList.remove("checkout-element-hide");
  document.querySelector("#checkout-complete-text").textContent =
    "Processing Your Order...";
  // PROCESS THE ORDER
  try {
    await axios.post("/checkout/order/paid");
  } catch (error) {
    console.log(error);
    return;
  }
  // COMPLETE PROCESSING
  document.querySelector(
    "#checkout-complete-loading-icon"
  ).innerHTML = `<svg class="checkmark-2" viewBox="0 0 52 52">
                    <circle
                      class="checkmark__circle-2"
                      cx="26"
                      cy="26"
                      r="25"
                      fill="none"
                    ></circle>
                    <path
                      class="checkmark__check-2"
                      fill="none"
                      d="M14.1 27.2l7.1 7.2 16.7-16.8"
                    ></path>
                  </svg>`;
  document.querySelector("#checkout-complete-text").textContent =
    "Successfully Processed Your Order!";
  setTimeout(() => {
    window.location.href = "/";
  }, 2000);
};

// @FUNC  checkout.payment.method.card.pay
// @TYPE
// @DESC
// @ARGU
checkout.payment.method.card.pay = async () => {
  // PREPARE PAGE USING LOADING ICON
  document
    .querySelector("#checkout-complete-container")
    .classList.remove("checkout-element-hide");
  document.querySelector("#checkout-complete-text").textContent =
    "Processing Your Order...";
  // PROCESS THE CARD PAYMENT
  let clientSecret;
  let payment;

  try {
    clientSecret = await checkout.payment.method.card.paymentIntent();
  } catch (error) {
    return console.log(error);
  }

  console.log(clientSecret);

  try {
    payment = await checkout.payment.method.card.process(clientSecret);
  } catch (error) {
    return console.log(error);
  }

  // Update Order
  try {
    await axios.post("/checkout/order/paid");
  } catch (error) {
    console.log(error);
    return;
  }

  console.log(payment["status"]);
  // COMPLETE PROCESSING
  document.querySelector(
    "#checkout-complete-loading-icon"
  ).innerHTML = `<svg class="checkmark-2" viewBox="0 0 52 52">
                    <circle
                      class="checkmark__circle-2"
                      cx="26"
                      cy="26"
                      r="25"
                      fill="none"
                    ></circle>
                    <path
                      class="checkmark__check-2"
                      fill="none"
                      d="M14.1 27.2l7.1 7.2 16.7-16.8"
                    ></path>
                  </svg>`;
  document.querySelector("#checkout-complete-text").textContent =
    "Successfully Processed Your Order!";
  setTimeout(() => {
    window.location.href = "/";
  }, 2000);
};

// @FUNC  checkout.payment.method.card.paymentIntent
// @TYPE
// @DESC
// @ARGU
checkout.payment.method.card.paymentIntent = () => {
  return new Promise(async (resolve, reject) => {
    let clientSecret;

    try {
      clientSecret = (await axios.post("/checkout/payment-intent", "Pay"))[
        "data"
      ];
    } catch (error) {
      reject(error);
    }

    resolve(clientSecret);
  });
};

// @FUNC  checkout.payment.method.card.process
// @TYPE
// @DESC
// @ARGU
checkout.payment.method.card.process = async clientSecret => {
  return new Promise(async (resolve, reject) => {
    let result;

    try {
      result = await checkout.payment.stripe.element.stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: checkout.payment.stripe.element.card.number,
            billing_details: {
              name: "test test"
            }
          }
        }
      );

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

// @FUNC  checkout.payment.method.card.show
// @TYPE
// @DESC
// @ARGU
checkout.payment.method.card.show = show => {
  if (show) {
    document
      .querySelector("#checkout-pymt-card-cntn")
      .classList.remove("checkout-element-hide");
  } else {
    document
      .querySelector("#checkout-pymt-card-cntn")
      .classList.add("checkout-element-hide");
  }
};

// @FUNC  checkout.payment.validation.validate
// @TYPE  SIMPLE
// @DESC
// @ARGU
checkout.payment.validation.validate = async validity => {
  let valid;

  if (validity) {
    // Check if the validity object is provided
    valid = validity.cart && validity.shipping && validity.payment;
  } else {
    // Fetch Validity from Backend if Validity Object is NOT provided
    try {
      valid = (await axios.post("/checkout/order/validate/payment"))["data"][
        "data"
      ];
    } catch (error) {
      console.log(error);
      return;
    }
  }

  checkout.element.validity.payment = valid;

  if (valid) {
    checkout.payment.validation.valid();
  } else {
    checkout.payment.validation.invalid();
  }
};

// @FUNC  checkout.payment.validation.valid
// @TYPE  SIMPLE
// @DESC
// @ARGU
checkout.payment.validation.valid = () => {
  // Event Listeners
  checkout.element.button.payment.bank.paid.addEventListener(
    "click",
    checkout.payment.method.bank.paid
  );
  checkout.element.button.payment.card.pay.addEventListener(
    "click",
    checkout.payment.method.card.pay
  );
  // CSS
  checkout.element.button.payment.bank.paid.classList.add(
    "valid"
  );
  checkout.element.button.payment.card.pay.classList.add(
    "valid"
  );
  checkout.element.navigation.payment.classList.add("valid");
};

// @FUNC  checkout.payment.validation.invalid
// @TYPE  SIMPLE
// @DESC
// @ARGU
checkout.payment.validation.invalid = () => {
  // Event Listeners
  checkout.element.button.payment.bank.paid.removeEventListener(
    "click",
    checkout.payment.method.bank.paid
  );
  checkout.element.button.payment.card.pay.removeEventListener(
    "click",
    checkout.payment.method.card.pay
  );
  // CSS
  checkout.element.button.payment.bank.paid.classList.remove(
    "valid"
  );
  checkout.element.button.payment.card.pay.classList.remove(
    "valid"
  );
  checkout.element.navigation.payment.classList.remove("valid");
};

// @FUNC  checkout.payment.show
// @TYPE  SIMPLE
// @DESC
// @ARGU
checkout.payment.show = () => {
  checkout.navigation.navigate(2);
};

// @FUNC  checkout.payment.resize
// @TYPE  SIMPLE
// @DESC
// @ARGU
checkout.payment.resize = () => {
  // DESKTOP HEIGHT CALCULATION
  const heading = 8;
  let buttons = 0;
  let method = 0;
  if (checkout.payment.method.selected == "bankTransfer") {
    buttons = 12;
    method = 26.5;
  } else if (checkout.payment.method.selected == "card") {
    buttons = 12;
    method = 7.5;
  }

  const bonus = 2;
  const option = 3 * 2;
  const total = heading + buttons + method + bonus + option;

  // SET THE CART PAGE SIZE
  if (checkout.element.windowSize.matches) {
    if (checkoutSelectedPage === 2) {
      document.querySelector("#checkout-payment").style =
        "height: " + total + "vmax;";
    } else {
      document.querySelector("#checkout-payment").style =
        "height: 6vmax;";
    }
  } else {
    document.querySelector("#checkout-payment").style = "height: 100%;";
  }
};

/*-----------------------------------------------------------------------------------------
NAVIGATION
-----------------------------------------------------------------------------------------*/

let checkoutPages = ["cart", "shipping", "payment", "complete"];
let checkoutSelectedPage = 0;

// @FUNC  checkout.navigation.navigate
// @TYPE
// @DESC
// @ARGU
checkout.navigation.navigate = nextPage => {
  // Check if we are currently on the same page
  if (nextPage == checkoutSelectedPage) return;
  // Update the navigation CSS
  checkout.navigation.changeCSS.navigation(nextPage, "select");
  checkout.navigation.changeCSS.page(nextPage);
  // Update the current selected page
  checkoutSelectedPage = nextPage;
  checkout.cart.resize();
  checkout.shipping.resize();
  checkout.payment.resize();
};

// @FUNC  checkout.navigation.changeCSS.navigation
// @TYPE
// @DESC
// @ARGU
checkout.navigation.changeCSS.navigation = (nextPage, type) => {
  const nextPageName = checkoutPages[nextPage];
  const currentPageName = checkoutPages[checkoutSelectedPage];
  document
    .querySelector(`#checkout-navigation-${nextPageName}`)
    .classList.add("checkout-navigation-icon-container-selected");
  document
    .querySelector(`#checkout-navigation-${nextPageName}`)
    .classList.remove("checkout-navigation-icon-container-deselected");
  document
    .querySelector(`#checkout-navigation-${currentPageName}`)
    .classList.remove("checkout-navigation-icon-container-selected");
  document
    .querySelector(`#checkout-navigation-${currentPageName}`)
    .classList.add("checkout-navigation-icon-container-deselected");
};

// @FUNC  checkout.navigation.changeCSS.page
// @TYPE
// @DESC
// @ARGU
checkout.navigation.changeCSS.page = nextPage => {
  const nextPageName = checkoutPages[nextPage];
  if (nextPage > checkoutSelectedPage) {
    document
      .querySelector(`#checkout-${nextPageName}`)
      .classList.remove("right");
    for (let i = checkoutSelectedPage; i < nextPage; i++) {
      const currentPageName = checkoutPages[i];
      document
        .querySelector(`#checkout-${currentPageName}`)
        .classList.remove("right");
      document
        .querySelector(`#checkout-${currentPageName}`)
        .classList.add("left");
    }
  } else {
    document
      .querySelector(`#checkout-${nextPageName}`)
      .classList.remove("left");
    for (let i = checkoutSelectedPage; i > nextPage; i--) {
      const currentPageName = checkoutPages[i];
      document
        .querySelector(`#checkout-${currentPageName}`)
        .classList.remove("left");
      document
        .querySelector(`#checkout-${currentPageName}`)
        .classList.add("right");
    }
  }
};

checkout.load.success = message => {
  clearTimeout(checkout.load.time);
  document.querySelector(
    "#checkout-loading-display-load"
  ).innerHTML = `<svg class="checkmark" viewBox="0 0 52 52">
  <circle
    class="checkmark__circle"
    cx="26"
    cy="26"
    r="25"
    fill="none"
  ></circle>
  <path
    class="checkmark__check"
    fill="none"
    d="M14.1 27.2l7.1 7.2 16.7-16.8"
  ></path>
</svg>`;
  document.querySelector("#checkout-loading-display-text").innerHTML = message;
  checkout.load.time = setTimeout(() => {
    document.querySelector("#checkout-loading-display").classList.add("hide");
  }, 1300);
};

checkout.load.load = message => {
  document.querySelector(
    "#checkout-loading-display-load"
  ).innerHTML = `<div class="load-2">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>`;
  document.querySelector("#checkout-loading-display-text").innerHTML = message;
  document.querySelector("#checkout-loading-display").classList.remove("hide");
};

/*=========================================================================================
END
=========================================================================================*/
