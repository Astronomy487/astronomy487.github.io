let full = "<table id=\"datatable\">";
full += "<tr><th>Z</th><th>Symbol</th><th>Name</th><th>Type</th><th>Period</th><th>Group</th><th>Mass</th><th>Melting Point</th><th>Boiling Point</th><th>Discovered</th></tr>";
for (i = 1; i < e.length; i++) {
  full += "<tr>";
  full += "<td>"+i+"</td>";
  full += "<td>"+e[i].abbr+"</td>";
  full += "<td>"+e[i].name+"</td>";
  full += "<td>"+e[i].type+"</td>";
  full += "<td>"+e[i].period+"</td>";
  full += "<td>"+e[i].group+"</td>";
  if (e[i].mass != null) {full += "<td>"+e[i].mass+"</td>"} else {full += "<td></td>";}
  if (e[i].melting != null) {full += "<td>"+e[i].melting+"</td>"} else {full += "<td></td>";}
  if (e[i].boiling != null) {full += "<td>"+e[i].boiling+"</td>"} else {full += "<td></td>";}
  if (e[i].discovered != null) {full += "<td>"+e[i].discovered+"</td>"} else {full += "<td></td>";}
  full += "</tr>"
}
full += "</table>"
document.getElementById("body").innerHTML += full;