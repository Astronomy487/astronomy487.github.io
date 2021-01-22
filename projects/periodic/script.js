//set abbreviations and let them inspect
for (i = 1; i < e.length; i++) {
  document.getElementById("e"+i).setAttribute("onclick","inspect("+i+")");
  document.getElementById("e"+i).innerHTML = e[i].abbr;
}

let typeName = {
  alkali: "an alkali metal",
  alkaline: "an alkaline earth metal",
  actinide: "an actinide",
  lanthanide: "a lanthanide",
  transition: "a transiton metal",
  posttransition: "a post-transition metal",
  metalloid: "a metalloid",
  nonmetal: "a nonmetal",
  halogen: "a halogen",
  noble: "a noble gas",
  unknown: "an element of unknown properties"
};

let colors = {};
colors.type = {
  alkali: "D23040",
  alkaline: "F76121",
  actinide: "F79721",
  lanthanide: "F7C921",
  transition: "F7F021",
  posttransition: "C6EA25",
  metalloid: "25EA59",
  nonmetal: "33DAE8",
  halogen: "2B82EE",
  noble: "361CD8",
  unknown: "C0C0C0"
};

document.getElementById("color-mode-type").click();

function setColorMode(mode) {
  for (i = 1; i < e.length; i++) {
    let style = "";
    switch (mode) {
      case "type":
        style = "background-color: #"+colors.type[e[i].type]+";";
        break;
      case "group":
        let a = 10*e[i].group;
        style = "background-color: rgb("+a+","+a+","+a+");";
        break;
      case "period":
        let b = 28*e[i].period;
        style = "background-color: rgb("+b+","+b+","+b+");";
        break;
      case "mass":
        if (e[i].mass != null) {
          style = "background-color: rgb("+0+","+0+","+e[i].mass+");"
        } else {
          style = "background-color: gray;";
        }
        break;
      case "none":
        style = "color: black;";
        break;
    }
    document.getElementById("e"+i).setAttribute("style",style);
  }
  ["type","group","period","mass","none"].forEach(function(item){
    let newClass = "";
    if (item == mode) newClass = "active";
    document.getElementById("color-mode-"+item).setAttribute("class",newClass);
  });
}

function inspect(i) {
  if (i == 0) {
    document.getElementById("inspect").setAttribute("style","opacity: 0;");
    setTimeout(function(){
      document.getElementById("inspect").setAttribute("style","display: none;");
    },200);
  } else {
    console.log(e[i]);
    document.getElementById("inspect").setAttribute("style","");
    let eInfo = "";
    
    eInfo += "<div class=\"column\">";
    eInfo += "<h1>"+e[i].name+"</h1>";
    let discoveryText = "has been known since prehistoric times";
    if (e[i].discovered != 0) discoveryText = "was discovered in "+e[i].discovered;
    eInfo += "<p>"+e[i].name+" ("+e[i].abbr+") is "+typeName[e[i].type]+" in group "+e[i].group+" and period "+e[i].period+" that "+discoveryText+". <a href=\"https://en.wikipedia.org/wiki/"+e[i].name+"\" target=\"_blank\">Read on Wikipedia...</a></p>";
    eInfo += "<p>An atom of "+e[i].name+" contains "+i+" protons, and a neutral atom will contain "+i+" electrons. Its most stable isotope is "+e[i].abbr+"-"+2*i+", which has "+i+" neutrons.</p>";
    let state = "solid";
    if (e[i].melting < 295) state = "liquid";
    if (e[i].boiling < 295) state = "gas";
    eInfo += "<p>At room temperature, it's a "+state+". Its melting point is "+(e[i].melting-273.15).toFixed(1)+"&deg;C, and its boiling point is "+(e[i].boiling-273.15).toFixed(1)+"&deg;C.</p>";
    eInfo += "</div>";
    
    eInfo += "<div class=\"column\">";
    eInfo += "<img src=\"https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Niobium_crystals_and_1cm3_cube.jpg/800px-Niobium_crystals_and_1cm3_cube.jpg\">"
    //eInfo += "<div onclick=\"inspect(0)\" style=\"display: block; width: 100%; background-color: black; color: white; font-size: 24px; padding: 24px; border-radius: 6px; box-sizing: border-box; cursor: pointer; text-align: center;\">Leave</div>";
    eInfo += "</div>";
    
    document.getElementById("inspect-display").innerHTML = eInfo;
  }
}

document.addEventListener("keydown", function(event) {
  switch (event.keyCode) {
    case 27:
      inspect(0);
      break;
  }
});