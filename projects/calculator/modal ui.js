//stuff for adding elements.
document.addEventListener?document.addEventListener("contextmenu",function(t){if (document.getElementById("modal-container").getAttribute("active")!="true")prompt_addition(),t.preventDefault()},!1):document.attachEvent("oncontextmenu",function(){if (document.getElementById("modal-container").getAttribute("active")!="true")prompt_addition(),window.event.returnValue=!1});
function prompt_addition() {
	if (mouse.x == 0 && mouse.y == 0) return;
	let mouse_x = mouse.x - 128;
	let mouse_y = mouse.y - 16;
	create_library_color_css();
	let html = "<h2>add module</h2>";
	html += '<input type="text" id="library-search-textfield" placeholder="search for module or library" oninput="catalogue_search_filter()">';
	html += "<table>";
	html += '<tr style="--accent: black;"><td>name</td><td>inputs</td><td>outputs</td><td>buttons</td></tr>';
	for (category of Object.keys(catalogue)) {
		html += '<tr category="'+category+'" id="catalogue-div-'+category+'" style="background-color: var(--accent);"><td colspan="4" style="padding: 1rem; padding-top: 1.5rem; text-transform: lowercase;">';
		html += '<h3 style="margin: 0; font-size: 1.5rem; margin-bottom: 0.25rem;">'+catalogue[category]._name+'</h3>'+catalogue[category]._description;
		html += '</td></tr>';
		//html += '<p>'+catalogue[category]._name.toUpperCase()+'<span>: '+catalogue[category]._description.toLowerCase()+'</span></p>';
		for (node of Object.keys(catalogue[category])) { if (node.startsWith("_")) continue;
			let entry = catalogue[category][node];
			let input_list = []; let output_list = []; let button_list = [];
			if (entry.inputs != undefined) for (input of entry.inputs) input_list.push(input.name);
			if (entry.outputs != undefined) for (output of entry.outputs) output_list.push(output.name);
			if (entry.buttons != undefined) for (button of entry.buttons) button_list.push(button.name);
			html += '<tr onclick="close_modal(); make_node(\''+category+'\', \''+node+'\', '+mouse_x+', '+mouse_y+')" id="catalogue-button-'+category+'-'+node+'" category="'+category+'">';
			//html += "<td>"+category+"</td>";
			html += "<td>"+entry.name+"</td>";
			html += "<td>"+input_list.join("<br>")+"</td>";
			html += "<td>"+output_list.join("<br>")+"</td>";
			html += "<td>"+button_list.join("<br>")+"</td>";
			html += '</tr>';
		}
	}
	html += '</table>';
	html += '<p id="catalogue-search-noresults"><span>No results</span></p>';
	html += '<h2>import library</h2>'
	html += '<input type="text" id="library-import-textfield" placeholder="import library via url"><button onclick="user_load_library()" id="library-import-button">Add</button>';
	html += '<p id="library-import-errormessage" style="display: none;"><span>that url doesn\'t work</span></p>';
	html += '<p>Already loaded libraries</p><ul>';
	for (url of loaded_libraries)
		html += '<li><a target="_blank" href="'+url+'">'+url+'</a></li>';
	html += '</ul>';
	open_modal(html);
	document.getElementById("library-search-textfield").focus();
	catalogue_search_filter();
}
function catalogue_search_filter() {
	let textfield = document.getElementById("library-search-textfield");
	let to_find = textfield.value;
	let any_results = false;
	for (category of Object.keys(catalogue)) {
		let in_category_name = catalogue[category]._name.includes(to_find);
		let in_any_node_name = false;
		for (node of Object.keys(catalogue[category])) { if (node.startsWith("_")) continue;
			let in_node_name = catalogue[category][node].name.includes(to_find);
			in_any_node_name = in_any_node_name || in_node_name;
			document.getElementById("catalogue-button-"+category+"-"+node).style.display = (in_node_name||in_category_name ? "table-row" : "none");
		}
		document.getElementById("catalogue-div-"+category).style.display = in_category_name||in_any_node_name ? "table-row" : "none";
		any_results = any_results || in_category_name || in_any_node_name;
	}
	document.getElementById("catalogue-search-noresults").style.display = any_results ? "none" : "block";
}
function open_modal(html) {
	document.getElementById('modal').style.animation = 'modal-enter 0.3s';
	document.getElementById('modal-container').style.animation = 'modal-container-enter 0.3s';
	document.getElementById("modal-container").style.display = "block";
	document.getElementById('modal').innerHTML = html;
	for (el of document.getElementById('modal').getElementsByTagName('table')) el.style.animation = 'catalogue-div-enter 0.5s';
}
function close_modal() {
	document.getElementById('modal').style.animation = 'modal-exit 0.2s';
	document.getElementById('modal-container').style.animation = 'modal-container-exit 0.2s';
	for (el of document.getElementById('modal').getElementsByTagName('table')) el.style.animation = 'catalogue-div-exit 0.2s';
	setTimeout(function(){
		document.getElementById('modal').innerHTML = '';
	document.getElementById("modal-container").style.display = "none";
	}, 100);
}
function prompt_info() {
	let html = "<h2>About this project</h2>";
	html += "<p>Hi!</p>";
	html += '<p>This is a modular calculator. It is inspired by modular synthesis software, graphing calculators, and some mathy ideas that have been floating around in my head.</p>';
	html += '<p>The principal idea is that all functions are encapsulated into modules, of which the user only sees its inputs and outputs. You can chain outputs of one module into the inputs of another to create complicated behavior.</p>';
	html += '<p>Wanna try it out? Close this popup and start using it!</p>';
	html += '<hr><p style="text-align: center;"><span>Made by <a target="_blank" href="https://astronomy487.github.io/">Astro</a></span></p>';
	open_modal(html);
}
function prompt_toomuchrecursion() {
	let html = "<h2>Recursion</h2>";
	html += "<p>You just formed an infinite loop.</p>";
	html += "<p>I'm going to undo that change.</p>";
	remove_connection(last_connection_made.uuid, last_connection_made.num);
	open_modal(html);
}
let settings = [
	{name: "Module notes", description: "Shows a small notepad under each module", values: ["show", "hide"], current: "hide", on_update(new_value) {
		document.getElementById("custom-css-notes").innerHTML = ".node textarea {display: "+(new_value=="show" ? "block" : "none")+";}";
	}},
	{name: "Library labels", description: "Shows the library of origin above each module", values: ["show", "hide"], current: "hide", on_update(new_value) {
		document.getElementById("custom-css-categorylabels").innerHTML = ".node header div {display: "+(new_value=="show" ? "block" : "none")+";}";
	}}
];
function prompt_settings() {
	let html = "<h2>Settings</h2>";
	for (let i = 0; i < settings.length; i++) {
		let setting = settings[i];
		html += '<p>'+setting.name+'<span>: '+setting.description+'</span></p>';
		for (let j = 0; j < setting.values.length; j++) {
			let setting_value = setting.values[j];
			html += '<button onclick="update_setting('+i+', '+j+')" '
			if (setting_value == setting.current) html += 'class="modal-button-light"';
			html += '>'+setting_value+'</button>';
		}
	}
	open_modal(html);
}
function update_setting(setting_number, value_number) {
	settings[setting_number].current = settings[setting_number].values[value_number];
	settings[setting_number].on_update(settings[setting_number].current);
	prompt_settings();
}