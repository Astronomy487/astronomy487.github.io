let months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
let monthsshort = ["J","F","M","A","M","J","J","A","S","O","N","D",];
let hours = ["12 AM","1 AM","2 AM","3 AM","4 AM","5 AM","6 AM","7 AM","8 AM","9 AM","10 AM","11 AM","12 PM","1 PM","2 PM","3 PM","4 PM","5 PM","6 PM","7 PM","8 PM","9 PM","10 PM","11 PM",];
let now = new Date();
document.getElementById("current").innerHTML = hours[now.getHours()]+" in "+months[now.getMonth()];

document.getElementById("menuall").click();
let currentset;
document.getElementById("menubugs").click();
let south;
document.getElementById("menunorth").click();
let shownext = true;
document.getElementById("menunexttrue").click();

generate(currentset);

function commas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  //thank you to this guy from stack overflow
  //https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
}

function setDisplay(x) {
  document.getElementById("menuall").setAttribute("class","");
  document.getElementById("menumonth").setAttribute("class","");
  document.getElementById("menucurrent").setAttribute("class","");
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
  }
  document.getElementById("hiderowsstyle").innerHTML = newcss;
}

function hemi(x) {
  document.getElementById("menunorth").setAttribute("class","");
  document.getElementById("menusouth").setAttribute("class","");
  document.getElementById("menu"+x).setAttribute("class","active");
  south = (x == 'south');
  generate(currentset);
}

function openNew(x) {
  document.getElementById("menubugs").setAttribute("class","");
  document.getElementById("menufish").setAttribute("class","");
  document.getElementById("menudeep").setAttribute("class","");
  document.getElementById("menu"+x).setAttribute("class","active");
  switch (x) {
    case "bugs":
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
  generate(currentset);
}