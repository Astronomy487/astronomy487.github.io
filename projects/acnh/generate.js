let donation = {
  bug: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  fish: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  deep: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
}

function generate() {
  let currentsetname;
  switch (currentset) {
    case bug:
    currentsetname = "bug";
      break;
    case fish:
    currentsetname = "fish";
      break;
    case deep:
    currentsetname = "deep";
      break;
  }
  let source = currentset;
  let newrow = "";

  newrow += '<tr><th></th><th>Species name</th>';
  if (currentsetname == "deep") {
    newrow += '<th>Motion</th>';
  } else {
    newrow += '<th>Location</th>';
  }
  if (currentsetname != "bug") newrow += '<th>Size</th>'
  newrow += '<th>Selling price</th>';
  if (shownext) {
    newrow += '<th>Next available</th>';
  } else {
    newrow += '<th>Annual availability</th><th>Daily availability</th>';
  }
  newrow += '</tr>';
  document.getElementById("speciesbody").innerHTML = newrow;

  for (let i = 0; i < source.length; i++) {
    newrow = "";
    
    let monthmatch;
    if (!south) {
      monthmatch = source[i].annual[now.getMonth()];
    } else {
      monthmatch = source[i].annual[(now.getMonth()+6)%12];
    }
    
    let nextavailable;
    if (monthmatch && source[i].daily[now.getHours()]) {
      newrow = '<tr class="available';
      nextavailable = "now";
    } else if (monthmatch) {
      newrow = '<tr class="almostavailable';
      findNextAvailable:
      for (a = now.getHours(); a < 30; a = (a+1)%24) {
        if (source[i].daily[a]) {
          nextavailable = hours[a];
          break findNextAvailable;
        }
      }
    } else {
      newrow = '<tr class="unavailable';
      findNextAvailable:
      for (a = now.getMonth(); a < 30; a = (a+1)%12) {
        if (source[i].annual[a]) {
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
    
    let donstat;
    switch (currentsetname) {
      case "bug": donstat = donation.bug[i]; break;
      case "fish": donstat = donation.fish[i]; break;
      case "deep": donstat = donation.deep[i]; break;
    }
    newrow += ' '+donationstages[donstat];
    //console.log(donstat);
    /*switch (donstat) {
      case 0: newrow += ' uncaught'; break;
      case 1: newrow += ' caught'; break;
      case 2: newrow += ' donated'; break;
    }*/
    
    newrow += '">';
    
    let donationText;
    switch (currentsetname) {
      case "bug":
        donationText = donationstages[donation.bug[i]];
        break;
      case "fish":
        donationText = donationstages[donation.fish[i]];
        break;
      case "deep":
        donationText = donationstages[donation.deep[i]];
        break;
    }
    newrow += '<td><button onclick="changeDonationStatus(\''+currentsetname+"\',"+i+')">'+donationText+'</button></td>';
    
    newrow += "<td>"+source[i].name+"</td>"; //name
    newrow += "<td>"+source[i].found+"</td>"; //location
    if (currentsetname != "bug") newrow += "<td>"+source[i].size+"</td>"; //size, if applicable
    newrow += "<td>"+commas(source[i].bells)+" bells</td>"; //price
    
    if (shownext) {
      newrow += "<td>"+nextavailable+"</td>";
    } else {
      newrow += '<td class="timescell"><table class="times" id=""><tr>';
      for (let j = 0; j < 12; j++) {
        let availablethismonth;
        if (!south) {
          availablethismonth = source[i].annual[j];
        } else {
          availablethismonth = source[i].annual[(j+6)%12];
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
        if (source[i].daily[j]) {
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
}