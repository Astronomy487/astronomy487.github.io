let nodes = {}; //master list that you always have to reference

//instead of memory address pointers, everything is uuids
let occupied_uuids = [];
function get_uuid() {
	let txt = "";
	for (let i = 0; i < 8; i++)
		txt += ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"][Math.floor(Math.random()*16)];
	if (occupied_uuids.includes(txt)) txt = get_uuid();
	occupied_uuids.push(txt);
	return txt;
}

//preparations for before-input before-output
function update(uuid, recursion_level) {
	if (recursion_level < 0) {
		prompt_toomuchrecursion();
		return;
	}
	//find its old outputs
	let old_outputs = [];
	for (output of nodes[uuid].outputs) old_outputs.push(output.val);
	//first, fetch its inputs into i
	let inputs = [];
	for (let i = 0; i < nodes[uuid].inputs.length; i++) {
		if (nodes[uuid].inputs[i].source_address == null) {
			inputs.push(nodes[uuid].inputs[i].val);
		} else {
			inputs.push(nodes[nodes[uuid].inputs[i].source_address].outputs[nodes[uuid].inputs[i].source_number]);
		}
	}
	//next, call its calculate function
	let outputs;
	try {
		outputs = nodes[uuid].calculate(inputs, nodes[uuid].internal_state);
		nodes[uuid].internal_state = outputs[1];
		outputs = outputs[0];
	} catch {
		document.getElementById(uuid).setAttribute("errored", "true");
		nodes[uuid].errored = true;
		return;
	}
	document.getElementById(uuid).setAttribute("errored", "false");
	nodes[uuid].errored = false;
	//then, return those o[] into the output variables
	for (let i = 0; i < nodes[uuid].outputs.length; i++) {
		nodes[uuid].outputs[i] = outputs[i];
		document.getElementById(uuid+"-output-label-"+i).innerText = reformat(outputs[i], true);
	}
	//propagate to anyone else
	for (let i = 0; i < nodes[uuid].recipients.length; i++) {
		update(nodes[uuid].recipients[i], recursion_level-1); //TODO: only propagate if our outputs had any meaningful changes lol
	}
	//update our labels
	for (let i = 0; i < nodes[uuid].inputs.length; i++) {
		document.getElementById(uuid+"-input-label-"+i).innerText = reformat(inputs[i], true);
		document.getElementById(uuid+"-input-"+i).setAttribute("connected", nodes[uuid].inputs[i].source_address != null);
	}
	for (let i = 0; i < nodes[uuid].outputs.length; i++)
		document.getElementById(uuid+"-output-label-"+i).innerText = reformat(outputs[i], true);
}
function reformat(val, truncate) {
	if (typeof(val) == "number") {
		if (Math.abs(val) < 0.0000001) val = 0;
		val = ""+val;
	} else {
		let txt = "[";
		for (let i = 0; i < val.length; i++) {
			if (i >0) txt += ", ";
			txt += reformat(val[i], truncate);
		}
		txt += "]";
		val = txt;
	}
	if (truncate && val.length > 12)
		return val.substring(0, 9) + "...";
	return val;
}

//creates a node from catalogue
function make_node(library_string, node_string, x, y) {
	let catalogue_entry = catalogue[library_string][node_string];
	//create an actual node object from catalogue_entry
	let node = {};
	node.category = library_string; //this is used for category="" attributes. NOT necessarily same as the display name
	node.name = catalogue_entry.name;
	node.inputs = [];
	if (catalogue_entry.inputs != undefined) for (input of catalogue_entry.inputs) {
		node.inputs.push({name: input.name, val: input.val, source_address: null, source_number: null});
	}
	node.outputs = [];
	if (catalogue_entry.outputs != undefined) for (output of catalogue_entry.outputs) {
		node.outputs.push({name: output.name, val: undefined});
	}
	node.buttons = [];
	if (catalogue_entry.buttons != undefined) for (button of catalogue_entry.buttons) {
		node.buttons.push({name: button.name, action: button.action});
	}
	node.calculate = catalogue_entry.calculate; //steal their function definition :3
	node.recipients = [];
	node.errored = false;
	node.internal_state = (catalogue_entry.internal_state == null) ? {} : JSON.parse(JSON.stringify(catalogue_entry.internal_state)); //free for each node implementation to use
	//establish uuid
	let uuid = get_uuid();
	node.uuid = uuid;
	nodes[uuid] = node;
	//make element
	let html = '<div class="node" category="'+node.category+'" id="'+uuid+'" style="top: '+y+'px; left: '+x+'px;" onmouseup="click_header_up(\''+uuid+'\')">';
	html += '<header onmousedown="click_header_down(\''+uuid+'\')"><div>'+node.category+'</div>'+node.name+'</header>';
	html += '<section class="inputs-outputs"><div class="node-inputs">';
	for (let i = 0; i < node.inputs.length; i++) {
		html += '<div class="node-input" connected="false" id="'+uuid+'-input-'+i+'"><div onclick="input_circle_click(\''+uuid+'\', '+i+')" id="'+uuid+'-input-jack-'+i+'">–</div><span onclick="io_click(\''+uuid+'\', true, '+i+')">'+node.inputs[i].name+'</span><label id="'+uuid+'-input-label-'+i+'" contenteditable="true" onfocusin="input_label_focusin(\''+uuid+'\', '+i+');" onfocusout="input_label_focusout(\''+uuid+'\', '+i+');"></label></div>';
	}
	html += '</div><div class="node-outputs">';
	for (let i = 0; i < node.outputs.length; i++) {
		html += '<div class="node-output" id="'+uuid+'-output-'+i+'"><span onclick="io_click(\''+uuid+'\', false, '+i+')">'+node.outputs[i].name+'</span><div id="'+uuid+'-output-jack-'+i+'">&nbsp;</div><label id="'+uuid+'-output-label-'+i+'"></label></div>';
	}
	html += '</div></section>';
	if (node.buttons.length > 0) {
		html += "<section class=\"buttons\">";
		for (let i = 0; i < node.buttons.length; i++) {
			html += '<button onclick="button_click(\''+uuid+'\', '+i+')">'+node.buttons[i].name+'</button>';
		}
		//html += '</div>';
		html += "</section>";
	}
	html += '<textarea spellcheck="false" placeholder="module notes..."></textarea>';
	html += '</div>';
	document.getElementById("main").insertAdjacentHTML("beforeend", html);
	document.getElementById(uuid).style.zIndex = drag_z_index; drag_z_index++;
	update(uuid, 100);
	document.getElementById("special-message").style.display = "none";
	return uuid;
}
//establishes output-to-input connection
let last_connection_made = {uuid: null, num: null};
function connect(origin_uuid, origin_number, destination_uuid, destination_number) {
	//store in case of infinite loop
	last_connection_made = {uuid: destination_uuid, num: destination_number};
	//setup number links
	nodes[destination_uuid].inputs[destination_number].source_address = origin_uuid;
	nodes[destination_uuid].inputs[destination_number].source_number = origin_number;
	nodes[origin_uuid].recipients.push(destination_uuid);
	update(destination_uuid, 100);
	//create visual line
	if (all_lines[destination_uuid+"-"+destination_number] != undefined) {
		all_lines[destination_uuid+"-"+destination_number].remove();
		delete all_lines[destination_uuid+"-"+destination_number];
	}
	let line_element = document.createElement("hr");
	line_element.id = destination_uuid + "-hr-" + destination_number;
	document.getElementById("hr-container").appendChild(line_element);
	line_element.setAttribute("onclick", "remove_connection('"+destination_uuid+"', "+destination_number+")");
	all_lines[destination_uuid + "-" + destination_number] = line_element;
	recalibrate_line(destination_uuid, destination_number);
		document.getElementById(destination_uuid+"-input-label-"+destination_number).setAttribute("contenteditable", "false");
}
//removes a connection by the wire's destination. returns input to using default
function remove_connection(destination_uuid, destination_number) {
	if (nodes[destination_uuid].inputs[destination_number].source_address != null) {
		document.getElementById(destination_uuid+"-input-label-"+destination_number).setAttribute("contenteditable", "true");
		let origin_uuid = nodes[destination_uuid].inputs[destination_number].source_address;
		let origin_number = nodes[destination_uuid].inputs[destination_number].source_number;
		nodes[destination_uuid].inputs[destination_number].source_address = null;
		nodes[destination_uuid].inputs[destination_number].source_number = null;
		nodes[origin_uuid].recipients = nodes[origin_uuid].recipients.filter(function(val, index, arr){return val != destination_uuid;});
		if (all_lines[destination_uuid+"-"+destination_number] != undefined) {
			all_lines[destination_uuid+"-"+destination_number].remove();
			delete all_lines[destination_uuid+"-"+destination_number];
		}
		update(destination_uuid, 100);
	}
}
//removes a NODE
function remove_node(uuid) {
	//if anyone cares about us, just remove their input source and update them
	//nodes[uuid].recipients.push(uuid);
	for (recipient of nodes[uuid].recipients) {
		for (let i = 0; i < nodes[recipient].inputs.length; i++) {
			if (nodes[recipient].inputs[i].source_address == uuid) {
				remove_connection(recipient, i);
			}
		}
		update(recipient, 99);
	}
	for (let i = 0; i < nodes[uuid].inputs.length; i++) if (nodes[uuid].inputs[i].source_address != null) remove_connection(uuid, i);
	document.getElementById(uuid).remove();
	delete nodes[uuid];
	if (Object.keys(nodes).length == 0) document.getElementById("special-message").style.display = "block";
}