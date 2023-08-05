let io_selected_input = null;
let io_selected_output = null;
function io_click(uuid, is_input, num) {
	//console.log([uuid, is_input, num]);
	let el = document.getElementById(uuid+"-"+(is_input?"input":"output")+"-"+num);
	if (is_input) {
		//if this is already selected, unselect it. otherwise unselect it
		if (io_selected_input != null && io_selected_input[0] == uuid && io_selected_input[1] == num) {
			io_selected_input = null;
			el.setAttribute("selected", "false");
		} else {
			if (io_selected_input != null) //switching case: let old know it's no longer selected
				document.getElementById(io_selected_input[0]+"-input-"+io_selected_input[1]).setAttribute("selected", "false");
			io_selected_input = [uuid, num];
			el.setAttribute("selected", "true");
		}
	} else {
		//if this is already selected, unselect it. otherwise unselect it
		if (io_selected_output != null && io_selected_output[0] == uuid && io_selected_output[1] == num) {
			io_selected_output = null;
			el.setAttribute("selected", "false");
		} else {
			if (io_selected_output != null) //switching case: let old know it's no longer selected
				document.getElementById(io_selected_output[0]+"-output-"+io_selected_output[1]).setAttribute("selected", "false");
			io_selected_output = [uuid, num];
			el.setAttribute("selected", "true");
		}
	}
	if (io_selected_input != null && io_selected_output != null) {
		document.getElementById(io_selected_input[0]+"-input-"+io_selected_input[1]).setAttribute("selected", "false");
		document.getElementById(io_selected_input[0]+"-input-"+io_selected_input[1]).setAttribute("connected", "true");
		document.getElementById(io_selected_output[0]+"-output-"+io_selected_output[1]).setAttribute("selected", "false");
		connect(io_selected_output[0], io_selected_output[1], io_selected_input[0], io_selected_input[1]);
		io_selected_input = null;
		io_selected_output = null;
	}
}
function input_circle_click(uuid, num) { //for clicking the little adjacent orb
	if (nodes[uuid].inputs[num].source_address != null) {
		/*nodes[uuid].inputs[num].source_address == null;
		nodes[uuid].inputs[num].source_number == null;*/
		remove_connection(uuid, num);
		document.getElementById(uuid+"-input-"+num).setAttribute("connected", "false");
		update(uuid, 100);
	}
}
function button_click(uuid, num) {
	let its_internal_state = nodes[uuid].internal_state;
	let its_inputs = [];
	for (input of nodes[uuid].inputs) {
		if (input.source_address == null)
			its_inputs.push(input.val);
		else
			its_inputs.push(nodes[input.source_address].outputs[input.source_number].val);
	}
	let its_button_action = nodes[uuid].buttons[num].action;
	nodes[uuid].internal_state = its_button_action(its_inputs, its_internal_state);
	update(uuid);
}
let all_lines = {}; //indexed by uuid+"-"+input_num. when link established, hr made. when node moves, recalc all involved lines. when link undone, remove line
function recalibrate_line(destination_uuid, destination_number) {
	let element = all_lines[destination_uuid+"-"+destination_number];
	//stupid element stuff
	let origin_uuid = nodes[destination_uuid].inputs[destination_number].source_address;
	let origin_number = nodes[destination_uuid].inputs[destination_number].source_number;
	if (origin_uuid == null) return; //in case we recalibrate something that shouldnt exist
	let origin_element = document.getElementById(origin_uuid + "-output-jack-" + origin_number);
	let destination_element = document.getElementById(destination_uuid + "-input-jack-" + destination_number);
	//find coordinates
	let origin_rect = origin_element.getBoundingClientRect();
	let destination_rect = destination_element.getBoundingClientRect();
	let origin_x = origin_rect.right-6;
	let origin_y = origin_rect.top-2;
	let destination_x = destination_rect.left+6;
	let destination_y = destination_rect.top-1;
	//set line properties
	let distance = Math.hypot(destination_y-origin_y, destination_x-origin_x);
	let angle = Math.atan2(destination_y-origin_y, destination_x-origin_x);
	let center_x = (origin_x + destination_x) / 2;
	let center_y = (origin_y + destination_y) / 2;
	element.style.width = distance + "px";
	element.style.left = center_x + "px";
	element.style.top = center_y + "px";
	element.style.transform = "translate(-50%, -50%) rotate("+angle+"rad)";
}
let current_dragging = null;
let drag_z_index = 1;
let mouse = {x: 0, y: 0};
function click_header_down(uuid) {
	//if (nodes[uuid].errored) return;
	let element = document.getElementById(uuid);
	let og_x = parseInt(element.style.left);
	let og_y = parseInt(element.style.top);
	if (current_dragging == null) {
		current_dragging = {uuid: uuid, og_x: og_x, og_y: og_y, mouse_x: mouse.x, mouse_y: mouse.y, element: element};
	}
	element.setAttribute("dragging", "true");
	drag_z_index++;
	element.style.zIndex = drag_z_index;
}
function click_header_up(uuid) {
	let element = document.getElementById(uuid);
	current_dragging = null;
	element.setAttribute("dragging", "false");
}
addEventListener('mousemove', (event) => {
	mouse = {x: event.x, y: event.y};
	if (current_dragging != null) {
		//determine change in mouse coords
		let mouse_dx = mouse.x - current_dragging.mouse_x;
		let mouse_dy = mouse.y - current_dragging.mouse_y;
		let node_x = current_dragging.og_x + mouse_dx;
		let node_y = current_dragging.og_y + mouse_dy;
		//enforce changes to node
		current_dragging.element.style.left = node_x + "px";
		current_dragging.element.style.top = node_y + "px";
		//now we have to update lines
		for (node of Object.keys(nodes))
			for (let i = 0; i < nodes[node].inputs.length; i++)
				if (nodes[node].inputs[i].source_address != null)
					recalibrate_line(node, i);
		let danger_box = document.getElementById("delete-zone").getBoundingClientRect();
		if (node_y > danger_box.y) {
			let uuid = current_dragging.element.getAttribute("id");
			current_dragging.element.style.left = current_dragging.og_x + "px";
			current_dragging.element.style.top = current_dragging.og_y + "px";
			let html = "<h2>Delete module</h2>";
			html += '<p>Delete the following module?</p>';
			html += '<div class="node" id="preview-node" category="'+nodes[uuid].category+'" style="left: 50%; transform: translateX(-50%); animation: none; pointer-events: none;">';
			html += document.getElementById(uuid).innerHTML;
			html += "</div>";
			html += '<div class="bottom-buttons">';
			html += '<button onclick="close_modal();">No, keep</button>';
			html += '<button onclick="remove_node(\''+uuid+'\'); close_modal();" class="modal-button-light">Yes, delete</button>';
			html += '</div>';
			open_modal(html);
			document.getElementById("preview-node").getElementsByTagName("textarea")[0].value = document.getElementById(uuid).getElementsByTagName("textarea")[0].value;
			current_dragging = null;
		}
	}
});
function input_label_focusout(uuid, num) {
	let new_text = document.getElementById(uuid+"-input-label-"+num).innerText;
	let val = parse_to_value(new_text);
	nodes[uuid].inputs[num].val = val;
	update(uuid, 100);
}
function input_label_focusin(uuid, num) {
	if (nodes[uuid].inputs[num].source_address != null) return;
	document.getElementById(uuid+"-input-label-"+num).innerText = reformat(nodes[uuid].inputs[num].val, false);
}
//parses any text into Legal values for modules (ie nested lists)
function parse_to_value(text) {
	text = text.trim();
	if (text.startsWith("[") || text.startsWith("{")) {
		text = text.substring(1, text.length-1); //assumes last char is closing bracket
		text += " ";
		let nest_level = 0;
		let accumulate = "";
		let list = [];
		for (let i = 0; i < text.length; i++) {
			let ch = text.charAt(i);
			if (ch == '[' || ch == '{') nest_level++;
			if (ch == ']' || ch == '}') nest_level--;
			if (nest_level == 0 && (ch == " " || ch == ",") && accumulate.length > 0) {
				let new_value = parse_to_value(accumulate);
				if (new_value != null && !Number.isNaN(new_value))
					list.push(new_value);
				accumulate = "";
			}
			accumulate += ch;
		}
		return list;
	} else {
		return Number.parseFloat(text.replace(/[^0-9.-]/g, ''));
	}
}