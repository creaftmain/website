/* ========================================================================================
VARIABLES
======================================================================================== */

let market = {
  // VARIABLES
  words: ["COMING SOON", "MARKETPLACE"],
  // FUNCTIONS
  initialise: undefined,
  subscription: undefined,
  subscribe: undefined
}

/* ========================================================================================
FUNCTIONS
======================================================================================== */

// @func  market.initialise
// @desc  
market.initialise = async () => {
  /*updateSessionPage();
  // GET LOGIN STATUS 
  let data;
  try {
    data = (await axios.get("/login-status"))["data"];
  } catch (error) {
    return console.log(error);
  }
  const login = data.status;*/
  // LOAD SYSTEMS
  try {
    //await global.initialise(true, true, login);
    await global.initialise();
  } catch (error) {
    return console.log(error);
  }
  // REMOVE STARTUP LOADER
  removeLoader();
  // LOAD SESSION
  //session.initialise();
  // ADD THE DYNAMIC WORDS EFFECT
  textSequence(0, market.words, "change-text");
  //market.subscription(login);
  market.subscription();
}

// @func  market.subscription
// @desc  
market.subscription = (login = false) => {
  // INPUT FIELD DISPLAY
  if (login) {
    document.querySelector("#subscribe-field").classList.add("hide");
  }
  // BUTTON ATTRIBUTE
  document.querySelector("#subscribe-main").setAttribute("onclick", `market.subscribe(${login});`);
}

// @func  market.subscribe
// @desc  
market.subscribe = async () => {
  document.querySelector("#subscribe-email-error").innerHTML = "";
  // DISABLE
  document.querySelector("#subscribe-main").setAttribute("disabled", "");
  // COLLECT
  const email = (!login) ? document.querySelector("#subscribe-email-input").value : "";
  // VALIDATE
  let emailRE = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (email === "") {
    document.querySelector("#subscribe-email-error").innerHTML = "An email is required";
    return document.querySelector("#subscribe-main").removeAttribute("disabled"); // ENABLE
  } else if (!emailRE.test(String(email).toLowerCase())) {
    document.querySelector("#subscribe-email-error").innerHTML = "Invalid email";
    return document.querySelector("#subscribe-main").removeAttribute("disabled"); // ENABLE
  }
  // SUBMIT
  try {
    await global.subscribeToMailingList(email);
  } catch (error) {
    return document.querySelector("#subscribe-main").removeAttribute("disabled"); // ENABLE
  }
  return document.querySelector("#subscribe-main").removeAttribute("disabled"); // ENABLE
}

/* ========================================================================================
END
======================================================================================== */