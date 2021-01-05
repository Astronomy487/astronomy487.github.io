function generate(set) {
let source = set;
let newrow = "";

console.log("beginning generation");

newrow += '<tr><th>Species Name</th>';
if (source[0][0] == "Seaweed") {
  newrow += '<th>Motion</th>';
} else {
  newrow += '<th>Location</th>';
}
if (source[0][5] != "bug") newrow += '<th>Size</th>'
newrow += '<th>Selling price</th>';
console.log(shownext);
if (shownext) {
  newrow += '<th>Next Available</th>';
} else {
  newrow += '<th>Annual Availability</th><th>Daily Availability</th>';
}
newrow += '</tr>';
document.getElementById("speciesbody").innerHTML = newrow;

for (let i = 0; i < source.length; i++) {
  newrow = "";
  
  let monthmatch;
  if (!south) {
    monthmatch = source[i][3][now.getMonth()];
  } else {
    monthmatch = source[i][3][(now.getMonth()+6)%12];
  }
  
  let nextavailable;
  if (monthmatch && source[i][4][now.getHours()]) {
    newrow = '<tr class="available">';
    nextavailable = "now";
  } else if (monthmatch) {
    newrow = '<tr class="almostavailable">';
    findNextAvailable:
    for (a = now.getHours(); a < 30; a = (a+1)%24) {
      if (source[i][4][a]) {
        nextavailable = hours[a];
        break findNextAvailable;
      }
    }
  } else {
    newrow = '<tr class="unavailable">'
    findNextAvailable:
    for (a = now.getMonth(); a < 30; a = (a+1)%12) {
      if (source[i][3][a]) {
        //next available month is found (a)
        if (!south) {
          nextavailable = months[a];
        } else {
          nextavailable = months[(a+6)%12];
        }
        break findNextAvailable;
      }
    }
  }
  
  newrow += "<td>"+source[i][0]+"</td>"; //name
  newrow += "<td>"+source[i][1]+"</td>"; //location
  if (source[i][5] != "bug") newrow += "<td>"+source[i][5]+"</td>"; //size, if applicable
  newrow += "<td>"+commas(source[i][2])+" bells</td>"; //price
  
  if (shownext) {
    newrow += "<td>"+nextavailable+"</td>";
  } else {
    newrow += '<td class="timescell"><table class="times" id=""><tr>';
    for (let j = 0; j < 12; j++) {
      let availablethismonth;
      if (!south) {
        availablethismonth = source[i][3][j];
      } else {
        availablethismonth = source[i][3][(j+6)%12];
      }
      if (availablethismonth) {
        newrow += '<td class="yes">'+monthsshort[j]+'</td>';
      } else {
        newrow += '<td class="no"></td>';
      }
    }
    newrow += '</tr></table></td>';
    
    newrow += '<td class="timescell"><table class="times" id=""><tr>';
    for (let j = 0; j < 24; j++) {
      if (source[i][4][j]) {
        newrow += '<td class="yes">'+j+'</td>';
      } else {
        newrow += '<td class="no"></td>';
      }
    }
    newrow += '</tr></table></td>';
  }
  
  newrow += "</tr>";
  document.getElementById("speciesbody").innerHTML += newrow;
}

console.log("generation complete");

}