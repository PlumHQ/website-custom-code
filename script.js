//variable declarations
var territory,
  companyName,
  match1,
  match3,
  match5,
  premium1,
  premium3,
  premium5,
  percentage,
  extendedReporting,
  basePremium1,
  basePremium3,
  basePremium5,
  date,
  industryCheck = 1,
  lyrCheck = 1,
  policyCheck = 1,
  claimsCheck = 1,
  dateCheck = 1,
  lol1 = "10000000",
  lol3 = "30000000",
  lol5 = "50000000",
  ChosenLimitOfIndeminity,
  finalBasePremium,
  deductibleSideBCover,
  deductibleSideCCover = "Not covered",
  employmentPracticesCover = "Not covered",
  premiumWithAddons,
  nameGlobal,
  calendlyCheck1 = 0,
  calendlyCheck2 = 0,
  dateOfIncorp,
  emailGlobal;
let children;
var Webflow = Webflow || [];
//saving all the button elements
var slideOneSubmitButton = document.getElementById("slide-one-button"),
  slideTwoSubmitButton = document.getElementById("slide-two-button"),
  slideThreeSubmitButton = document.getElementById("slide-three-button"),
  slideFourSubmitButton = document.getElementById("slide-four-button"),
  slideFiveSubmitButton = document.getElementById("slide-five-button"),
  slideSixSubmitButton = document.getElementById("submit-button1");

var nextSlideButton = document.getElementsByClassName("slider-right-button");

//disabling all buttons
companyName = document.getElementsByClassName("slider-right-button");
[].slice.call(companyName).forEach(function (companyName) {
  Webflow.push(function () {
    companyName.disabled = true;
  });
});

//enabling specifc button function
function enableButton(button) {
  Webflow.push(function () {
    button.disabled = false;
  });
  button.classList.remove("disabled");
}

function disableButton(button) {
  Webflow.push(function () {
    button.disabled = true;
  });
  button.classList.add("disabled");
}

//The gating functionality
const phoneInput = document.getElementById("phone-number");

//slide one check

//verifying phoneNumber
var validPhone = 0;
/* Check if string is a valid indian mobile number */
function checkIfValidIndianMobileNumber(str) {
  // Regular expression to check if string is a Indian mobile number
  const regexExp = /^[6-9]\d{9}$/gi;
  return regexExp.test(str);
}

$("#phone-number").change(function () {
  if (checkIfValidIndianMobileNumber(phoneInput.value)) {
    validPhone = 1;
    console.log("phone number is valid");
  } else {
    validPhone = 0;
    console.log("phone number is invalid");
  }

  if (validPhone && validEmail) {
    enableButton(slideOneSubmitButton);
    callWebHook();
  } else {
    disableButton(slideOneSubmitButton);
  }
});

//verifying the email
var validEmail = 0;
function checkIfValidEmail(str) {
  // Regular expression to check if string is a Indian mobile number
  const regexExp = new RegExp("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$");
  return regexExp.test(str);
}

$("#email").change(function () {
  emailGlobal = document.getElementById("email").value;
  if (checkIfValidEmail(emailGlobal)) {
    validEmail = 1;
    console.log("email is valid");
    if (validPhone && validEmail) enableButton(slideOneSubmitButton);
  } else {
    validEmail = 0;
    console.log("email is invalid");
    disableButton(slideOneSubmitButton);
  }

  //for calendly pre-fill
  sessionStorage.setItem("email", emailGlobal);
  console.log(
    "first session storage variable: " + sessionStorage.getItem("email")
  );
});

$("#name").change(function () {
  nameGlobal = document.getElementById("name").value;
  sessionStorage.setItem("name", nameGlobal);
  console.log(
    "first session storage variable of name: " + sessionStorage.getItem("name")
  );
});

//creating a map of industries:eligibility from the Webflow CMS, and also populating the select field options from the CMS
const industries = new Map();
$(".industry-object").each(function () {
  const s = $(this).children("div.industry-name"); //industry name
  const f = s[0].innerText;
  const v = $(this).children("div.eligibility"); //eligibility status
  const e = v[0].innerText;
  //adding the values into a map
  industries.set(f, e);
  $("#eligible-industry").append(
    `<option value="` + f + `">` + f + `</option>`
  );
});

//creating the map required to calcualte rackRate
const rackRate = new Map();
$(".lol-list").each(function () {
  const s = $(this).children("div.lol-match");
  const f = s[0].innerText;
  const v = $(this).children("div.lol-premium");
  const e = v[0].innerText;
  //adding the values into a map
  rackRate.set(f, e);
});

//retrieving the selected option it's eligibility status from the map
$("#eligible-industry").change(function () {
  const p = $("#eligible-industry option:selected").text();
  //console.log("value: " + $("#eligible-industry option:selected").val());
  console.log("industry: " + p);
  var eligibility = industries.get(p);
  console.log("eligibility: " + eligibility);
  if (eligibility !== "Yes") industryCheck = 0;
  else industryCheck = 1;
});

//checking last-years-financial revenue and saving the percentage for turnover
$(".do-radio-wrapper.last-year-revenue").on("click", function () {
  $(this).addClass("checked"); //adding the checked class to apply certain CSS properties
  $(this)
    .siblings(".do-radio-wrapper.last-year-revenue")
    .removeClass("checked");
  children = $(this)[0].childNodes;
  children[1].click();
  const s = $("input:radio[name ='lyr']:checked").val();
  console.log("lyr: " + s);
  //checking for percentage value
  if (s === "<100cr") percentage = 0;
  else if (s === "100-250cr") percentage = 0.1;
  else percentage = 0.265;
  console.log("percentage " + percentage);
  if (s === ">750cr") lyrCheck = 0;
  //if OTC pricing >750cr, then the value is no, otherwise yes.
  else lyrCheck = 1;
  //calculation();
  enableButton(slideFourSubmitButton);
});

//date of incorporation check
$("#date-of-incorp").change(function () {
  date = document.getElementById("date-of-incorp").value;
  const dateDiff = new Date().getFullYear() - date.slice(-4);
  if (dateDiff > 10) dateCheck = 0;
  else dateCheck = 1;
  console.log("this is the datecheck status" + dateCheck);
  //disabling the button
  enableButton(slideTwoSubmitButton);
});

$(".do-radio-wrapper.territory").on("click", function () {
  $(this).addClass("checked");
  $(this).siblings(".do-radio-wrapper.territory").removeClass("checked");
  children = $(this)[0].childNodes;
  children[1].click();
  territory = $("input:radio[name ='Coverage-type']:checked").val();
  console.log(territory);
  //enabling the submit button
  enableButton(slideFiveSubmitButton);
  if (territory === "India only") {
    deductibleSideBCover = "â‚¹50,0000";
    deductibleSideCCover = "Not covered";
    employmentPracticesCover = "â‚¹5,00,000";
  } else if (territory === "Worldwide incl. US & Canada") {
    deductibleSideBCover = "â‚¹1,00,0000";
    deductibleSideCCover = "Not covered";
    employmentPracticesCover = "â‚¹5,00,000";
  } else {
    deductibleSideBCover = "â‚¹2,00,0000";
    deductibleSideCCover = "Not covered";
    employmentPracticesCover = "â‚¹5,00,000";
  }
  console.log("A: " + deductibleSideBCover);
  console.log("B: " + deductibleSideCCover);
  console.log("C: " + employmentPracticesCover);
  getRackRate();
  calculation();
});

function getRackRate() {
  match1 = lol1.concat(territory);
  match3 = lol3.concat(territory);
  match5 = lol5.concat(territory);
  premium1 = rackRate.get(match1);
  premium3 = rackRate.get(match3);
  premium5 = rackRate.get(match5);
}

//checking Prior-policy
$(".do-radio-wrapper.policy").on("click", function () {
  $(this).addClass("checked");
  $(this).siblings(".do-radio-wrapper.policy").removeClass("checked");
  children = $(this)[0].childNodes;
  children[1].click();
  const s = $("input:radio[name ='Policy-type']:checked").val();
  if (s !== "Fresh") policyCheck = 0;
  //if fresh, then yes. otherwise no.
  else policyCheck = 1;
  enableButton(slideThreeSubmitButton);
});

//checking Claims experience
$(".do-radio-wrapper.claims").on("click", function () {
  $(this).addClass("checked");
  $(this).siblings(".do-radio-wrapper.claims").removeClass("checked");
  children = $(this)[0].childNodes;
  children[1].click();
  const p = $("input:radio[name ='Claims-history']:checked").val();
  console.log("calims: " + p);
  if (p !== "Nil claims") claimsCheck = 0;
  //claims-experience should be "nil"
  else claimsCheck = 1;
  //calculating the base premium based on all the values sourced above
  enableButton(slideSixSubmitButton);
});

function calculation() {
  var turnover1, turnover3, turnover5;
  turnover1 = percentage * premium1;
  turnover3 = percentage * premium3;
  turnover5 = percentage * premium5;
  console.log(" ");
  console.log("-----calculation()-----");
  console.log("percentage: " + percentage);
  console.log("premium1: " + premium1);
  console.log("turnover1: " + turnover1);
  console.log("premium3: " + premium3);
  console.log("turnover3: " + turnover3);
  console.log("premium5: " + premium5);
  console.log("turnover5: " + turnover5);

  basePremium1 = parseFloat(turnover1) + parseFloat(premium1);
  basePremium3 = parseFloat(turnover3) + parseFloat(premium3);
  basePremium5 = parseFloat(turnover5) + parseFloat(premium5);
  console.log("-----base premiums-----");
  console.log("basePremium1: " + basePremium1);
  console.log("basePremium3: " + basePremium3);
  console.log("basePremium5: " + basePremium5);
  premiumWithAddons = basePremium1; //setting the base for the premiumWithAddons variable
  gst = Math.round(basePremium1 * 0.18);
  grandTotal = Math.round(premiumWithAddons + gst);

  document.getElementById("total").innerHTML =
    "â‚¹" + basePremium1.toLocaleString("en-IN"); //assinging the default total as the 1cr option
  grandTotalElement.innerHTML = "â‚¹" + grandTotal.toLocaleString("en-IN");
  gstElement.innerHTML = "â‚¹" + gst.toLocaleString("en-IN");
  document.getElementById("sideB").innerHTML = deductibleSideBCover;
  document.getElementById("sideC").innerHTML = deductibleSideCCover;
  document.getElementById("employmentPractices").innerHTML =
    employmentPracticesCover;
}

//UPDATING THE FRONTEND ELEMENTS
$(document).on("click", "#submit-button1", function () {
  //firing calendly
  if (!calendlyCheck1) {
    Calendly.initInlineWidget({
      url: "https://calendly.com/akshatakumar/30min",
      parentElement: document.getElementById("calendly-div"),
      utm: {},
      prefill: {
        email: emailGlobal,
        name: nameGlobal,
      },
    });
  }
  calendlyCheck1 = 1;

  //----session storage variables----
  nameGlobal = document.getElementById("name").value;
  emailGlobal = document.getElementById("email").value;
  sessionStorage.setItem("email", emailGlobal);
  console.log("session storage variable: " + sessionStorage.getItem("email"));

  finalBasePremium = basePremium1;
  callWebHook();
  console.log("----check----");
  console.log("indsutry: " + industryCheck);
  console.log("lyr: " + lyrCheck);
  console.log("policyCheck: " + policyCheck);
  console.log("claimsCheck: " + claimsCheck);
  console.log("dateCheck: " + dateCheck);
  calculation();
  //updating the UI
  companyName = document.getElementsByClassName("company-name");
  [].slice.call(companyName).forEach(function (companyName) {
    companyName.innerHTML = document.getElementById("company-name").value;
  });
  //base premium
  document.getElementById("final-base-premium-1").innerHTML =
    "â‚¹" + basePremium1.toLocaleString("en-IN") + "/year";
  document.getElementById("final-base-premium-3").innerHTML =
    "â‚¹" + basePremium3.toLocaleString("en-IN") + "/year";
  document.getElementById("final-base-premium-5").innerHTML =
    "â‚¹" + basePremium5.toLocaleString("en-IN") + "/year";

  //updating the first fold elements
  document.getElementById("final-industry").innerHTML = $(
    "#eligible-industry option:selected"
  ).text();
  document.getElementById("final-revenue").innerHTML = $(
    "input:radio[name ='lyr']:checked"
  ).val();
  document.getElementById("final-date").innerHTML =
    document.getElementById("date-of-incorp").value;

  //indeminity
  document.getElementById("final-indemnity-1").innerHTML = "â‚¹1,00,00,000";
  document.getElementById("final-indemnity-2").innerHTML = "â‚¹3,00,00,000";
  document.getElementById("final-indemnity-3").innerHTML = "â‚¹5,00,00,000";

  //last-year-revenue
  //getting the elements with combo class of lyf and changing the innerHTML to the last year financial revenue.
  var element = document.getElementsByClassName("do-plans lyf");
  [].slice.call(element).forEach(function (element) {
    element.innerHTML = $("input:radio[name ='lyr']:checked").val();
  });

  //coverageType
  element = document.getElementsByClassName("do-plans coverage-type");
  [].slice.call(element).forEach(function (element) {
    element.innerHTML = $("input:radio[name ='Coverage-type']:checked").val();
  });

  //policy
  element = document.getElementsByClassName("do-plans policy");
  [].slice.call(element).forEach(function (element) {
    element.innerHTML = $("input:radio[name ='Policy-type']:checked").val();
  });

  element = document.getElementsByClassName("do-plans claims");
  [].slice.call(element).forEach(function (element) {
    element.innerHTML = $("input:radio[name ='Claims-history']:checked").val();
  });
});

//--------end of submit button-------

var gstElement = document.getElementById("gst-total"),
  gst,
  grandTotalElement = document.getElementById("grand-total");
var grandTotal;

//updating the limit of indeminity on the final screen
$("#limit-of-indeminity").change(function () {
  uncheckAddons();
  var lol = document.getElementById("limit-of-indeminity").value;
  console.log(lol);
  if (lol === "10000000") {
    finalBasePremium = basePremium1;
    premiumWithAddons = basePremium1;
    gstCalculation(basePremium1);
    updateFinalPrice(basePremium1);
    if ($("#extended-report:checked").val())
      console.log("extended reporting value is still on");
    else console.log("extended reporting value is off");
  } else if (lol === "30000000") {
    finalBasePremium = basePremium3;
    premiumWithAddons = basePremium3;
    gstCalculation(basePremium3);
    if ($("#extended-report:checked").val())
      console.log("extended reporting value is still on");
    else console.log("extended reporting value is off");
    updateFinalPrice(basePremium3);
  } else {
    finalBasePremium = basePremium5;
    premiumWithAddons = basePremium5;
    gstCalculation(basePremium5);
    updateFinalPrice(basePremium5);
  }
});

//addons calculation
//extended reporting period
var extendedReportingAmount;
var extendedReportingExists = 0;
premiumWithAddons = 0;

function getExtendedReportingAmount() {
  if ($("#extended-report:checked").val()) {
    extendedReportingExists = 1;
    console.log("---extended reporting initiating addition---");
    extendedReportingAmount = finalBasePremium * 0.5; //temp is holding the amount to be added
    console.log("extended amount" + extendedReportingAmount);
    console.log(
      "before addition extended reporting premiumWithAddons value: " +
        premiumWithAddons
    );
    premiumWithAddons += extendedReportingAmount; //temp1 is holding the value added into the base premium
    console.log("added to premium" + premiumWithAddons);
    gstCalculation(premiumWithAddons);
    updateFinalPrice(premiumWithAddons); //updated the price
  } else {
    extendedReportingExists = 0;
    console.log("---initiating subtraction---");
    console.log("before minus" + premiumWithAddons);
    premiumWithAddons = premiumWithAddons - extendedReportingAmount; //temp1 is now holding the value minused the amount
    console.log("minused from premium to premium" + premiumWithAddons);
    gstCalculation(premiumWithAddons);
    updateFinalPrice(premiumWithAddons);
  }
}

$("#extended-report").change(function () {
  console.log("extended report check fired");
  getExtendedReportingAmount();
});

var extendedReportCheckbox = document.getElementById("extended-report");
var newOfferingCheckbox = document.getElementById("new-offering");

function uncheckAddons() {
  console.log("recognised the change");

  if (extendedReportingExists) {
    //$("#extended-report").prop("checked", false);
    extendedReportingExists = 0;
    extendedReportCheckbox.click();
  }
  if (newOfferingExists) {
    //$("#new-offering").prop("checked", false);
    newOfferingExists = 0;
    newOfferingCheckbox.click();
  }
  //premiumWithAddons = 0;
}

//newOfferingAmoununt calculation
var newOfferingAmount;
var newOfferingExists = 0;
function getNewOfferingAmount() {
  newOfferingExists = 1;
  if ($("#new-offering:checked").val()) {
    console.log("---new offering initiating addition---");
    console.log("base premium used for multi " + finalBasePremium);
    newOfferingAmount = finalBasePremium * 0.1; // this is the new offering amount to be added
    console.log("new offering amount" + newOfferingAmount);
    console.log("new offering premiumWithAddons value: " + premiumWithAddons);
    premiumWithAddons += newOfferingAmount; //now I've added the new offering amount to temp1 which is holding the base+extended amount
    console.log("added to the premium" + premiumWithAddons);
    gstCalculation(premiumWithAddons);
    updateFinalPrice(premiumWithAddons);
  } else {
    newOfferingExists = 0;
    console.log("---initiating subtraction---");
    console.log("before minus" + premiumWithAddons);
    premiumWithAddons = premiumWithAddons - newOfferingAmount; //newOffering amount is not present in new flow
    console.log("after minus" + premiumWithAddons);
    gstCalculation(premiumWithAddons);
    updateFinalPrice(premiumWithAddons);
  }
}

$("#new-offering").change(function () {
  getNewOfferingAmount();
});

function gstCalculation(premium) {
  gst = premium * 0.18;
}

function updateFinalPrice(price) {
  document.getElementById("total").innerHTML =
    "â‚¹" + price.toLocaleString("en-IN");
  gstElement.innerHTML = "â‚¹" + gst.toLocaleString("en-IN");
  grandTotal = parseFloat(price) + parseFloat(gst);
  grandTotalElement.innerHTML = "â‚¹" + grandTotal.toLocaleString("en-IN");
}
//This piece of code allows us to move between slides
const l = document.getElementById("left-arrow");
const r = document.getElementById("right-arrow");

$(document).on("click", "#talk-to-an-expert", function () {
  $("div.w-round div:nth-child(8)").trigger("click");
});

$(document).on("click", ".do-card-link .book-meeting", function () {
  $("div.w-round div:nth-child(9)").trigger("click");
});

$(document).on("click", ".slider-right-button", function (e) {
  if (industryCheck && lyrCheck && policyCheck && claimsCheck && dateCheck) {
    r.click();
  } else {
    if (!calendlyCheck2) {
      Calendly.initInlineWidget({
        url: "https://calendly.com/akshatakumar/30min",
        parentElement: document.getElementById("calendly-div-2"),
        utm: {},
        prefill: {
          email: emailGlobal,
          name: nameGlobal,
        },
      });
    }
    calendlyCheck2 = 1;
    console.log("skipping screens");
    e.preventDefault();
    $("div.w-round div:nth-child(9)").trigger("click");
  }
});

$(document).on("click", ".do-plan-button", function (e) {
  r.click();
});

$(document).on("click", ".slider-left-button", function () {
  l.click();
});
$(document).on("click", "#go-back-button", function () {
  //estimate page back button
  l.click();
});

$(document).on("click", "#final-go-back", function (e) {
  //estimate page back button
  e.preventDefault();
  $("div.w-round div:nth-child(1)").trigger("click");
  industryCheck = 1;
  lyrCheck = 1;
  policyCheck = 1;
  claimsCheck = 1;
  dateCheck = 1;
});

//input validation on Slide one
// const slideOneSubmitButton = document.getElementById("slide-one-button");

// let formElements = document.forms("wf-form-cms-jobs").elements;

// formElements.forEach((input) => {
//   input.setAttribute("onKeyUp", checkForm());
// });

// function checkForm() {

//   console.log("checkForm fired");
//   const validInputs = inputs.filter((input) => input.value !== "");
//   console.log(validInputs);

//   if (validInputs !== [] && validInputs.length === inputs.length)
//     slideOneSubmitButton.classList.remove("disabled");
//   else slideOneSubmitButton.classList.add("disabled");
// }

//calling webhook

function callWebHook() {
  console.log("---webhook called---");
  var company = document.getElementById("company-name").value,
    phoneNumber = document.getElementById("phone-number").value,
    industry = $("#eligible-industry option:selected").text(),
    dateOfIncorp = document.getElementById("date-of-incorp").value,
    policyType = $("input:radio[name ='Policy-type']:checked").val(),
    claimsHistory = $("input:radio[name ='Claims-history']:checked").val(),
    lastFinYearRev = $("input:radio[name ='lyr']:checked").val(),
    coverageTypes = $("input:radio[name ='Coverage-type']:checked").val();

  var data = {
    name: nameGlobal,
    email: emailGlobal,
    phone: phoneNumber,
    company: company,
    industry: industry,
    dateOfIncorp: dateOfIncorp,
    policyType: policyType,
    claims: claimsHistory,
    lastFinYearRev: lastFinYearRev,
    coverageTypes: territory,
    limitOfIndeminity: ChosenLimitOfIndeminity,
  };

  console.log("webhook data: " + JSON.stringify(data));

  $.ajax({
    url: "https://script.google.com/macros/s/AKfycbztlUCd7OimtUQicnIUnXcSIjPqfOyEYQi7-cgtvsfMGOzQXNDsqhInUNNkppc2-XF7gA/exec",
    method: "POST",
    crossDomain: true,
    data: JSON.stringify(data),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    success: function (response) {
      console.log(response);
      console.log("sent to webhook successfully");
    },
  });
}
