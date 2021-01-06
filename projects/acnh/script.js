let months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
let monthsshort = ["J","F","M","A","M","J","J","A","S","O","N","D",];
let hours = ["12 AM","1 AM","2 AM","3 AM","4 AM","5 AM","6 AM","7 AM","8 AM","9 AM","10 AM","11 AM","12 PM","1 PM","2 PM","3 PM","4 PM","5 PM","6 PM","7 PM","8 PM","9 PM","10 PM","11 PM",];
let now = new Date();
document.getElementById("current").innerHTML = hours[now.getHours()]+" in "+months[now.getMonth()];
let donationstages = ["uncaught","caught","donated"];

document.getElementById("menuall").click();
let currentset;
document.getElementById("menubug").click();
let south;
document.getElementById("menunorth").click();
let shownext = true;
document.getElementById("menunexttrue").click();
let showbydonation = false;
document.getElementById("menuavailable").click();

generate();

function commas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  //thank you to this guy from stack overflow
  //https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
}

function setFilter(x) {
  document.getElementById("menuall").setAttribute("class","");
  document.getElementById("menumonth").setAttribute("class","");
  document.getElementById("menucurrent").setAttribute("class","");
  document.getElementById("menuuncaught").setAttribute("class","");
  document.getElementById("menuundonated").setAttribute("class","");
  document.getElementById("menu"+x).setAttribute("class","active");
  
  let newcss;
  switch (x) {
    case "all":
      newcss = "";
      break;
    case "month":
      newcss = ".unavailable {display: none;}";
      break;
    case "current":
      newcss = ".unavailable, .almostavailable {display: none;}";
      break;
    case "uncaught":
      newcss = ".caught, .donated {display: none;}";
      break;
    case "undonated":
      newcss = ".donated {display: none;}";
      break;
  }
  document.getElementById("hiderowsstyle").innerHTML = newcss;
}

function hemi(x) {
  document.getElementById("menunorth").setAttribute("class","");
  document.getElementById("menusouth").setAttribute("class","");
  document.getElementById("menu"+x).setAttribute("class","active");
  south = (x == 'south');
  generate();
}

function openNew(x) {
  document.getElementById("menubug").setAttribute("class","");
  document.getElementById("menufish").setAttribute("class","");
  document.getElementById("menudeep").setAttribute("class","");
  document.getElementById("menu"+x).setAttribute("class","active");
  switch (x) {
    case "bug":
      currentset = bug;
      break;
    case "fish":
      currentset = fish;
      break;
    case "deep":
      currentset = deep;
      break;
  }
  generate(currentset);
}

function showNext(x) {
  document.getElementById("menunexttrue").setAttribute("class","");
  document.getElementById("menunextfalse").setAttribute("class","");
  document.getElementById("menunext"+x.toString()).setAttribute("class","active");
  shownext = x;
  generate();
}

function changeDonationStatus(setname,index) {
  switch (setname) {
    case "bug":
      donation.bug[index] = (donation.bug[index]+1)%3;
      break;
    case "fish":
      donation.fish[index] = (donation.fish[index]+1)%3;
      break;
    case "deep":
      donation.deep[index] = (donation.deep[index]+1)%3;
      break;
  }
  generate();
  //document.getElementById(setname+index.toString()).innerHTML = "test";
}

function setColor(mode) {
  document.getElementById("menuavailable").setAttribute("class","");
  document.getElementById("menudonation").setAttribute("class","");
  document.getElementById("menu"+mode).setAttribute("class","active");
  if (mode == "available") {
    showbydonation = false;
  } else {
    showbydonation = true;
  }
  let newcss;
  switch (showbydonation) {
    case false:
      newcss = ".available {background-color: var(--green);} .almostavailable {background-color: var(--yellow);} .unavailable {background-color: var(--red);}";
      break;
    case true:
      newcss = ".uncaught {background-color: var(--red);} .caught {background-color: var(--yellow);} .donated {background-color: var(--green);}";
      break;
  }
  document.getElementById("setcolorstyle").innerHTML = newcss;
  generate();
}