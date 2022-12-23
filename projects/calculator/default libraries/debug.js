catalogue.debug = {
	_name: "debug",
	_description: "fun nodes",
	_color: "red"
};

catalogue.debug.update_counter = {
	name: "update counter",
	inputs: [{name: "input", val: 0}],
	outputs: [{name: "count"}],
	internal_state: {c: 0},
	calculate(i, state) {
		state.c++;
		return [[state.c], state];
	}
};

catalogue.debug.longg = {
	name: "this node has an absurdly long name and an absurdly large number of inputs, outputs, and buttons",
	inputs: [
		{name: "i1", val: 0},
		{name: "i2", val: 0},
		{name: "i3", val: 0},
		{name: "i4", val: 0},
		{name: "i5", val: 0},
		{name: "i6", val: 0},
		{name: "i7", val: 0},
		{name: "i8", val: 0},
		{name: "i9", val: 0},
		{name: "i10", val: 0},
		{name: "i11", val: 0},
		{name: "i12", val: 0}
	],
	outputs: [
		{name: "o1"},
		{name: "o2"},
		{name: "o3"},
		{name: "o4"},
		{name: "o5"},
		{name: "o6"},
		{name: "o7"},
		{name: "o8"},
		{name: "o9"},
		{name: "o10"},
		{name: "o11"},
		{name: "o12"}
	],
	buttons: [
		{name: "b1", action(i, state) {return state;}},
		{name: "b2", action(i, state) {return state;}},
		{name: "b3", action(i, state) {return state;}},
		{name: "b4", action(i, state) {return state;}},
		{name: "b5", action(i, state) {return state;}},
		{name: "b6", action(i, state) {return state;}},
		{name: "b7", action(i, state) {return state;}},
		{name: "b8", action(i, state) {return state;}},
		{name: "b9", action(i, state) {return state;}},
		{name: "b10", action(i, state) {return state;}},
		{name: "b11", action(i, state) {return state;}},
		{name: "b12", action(i, state) {return state;}}
	],
	calculate(i, state) {
		return [i, state];
	}
};

catalogue.debug.nothing = {
	name: "nothing",
	calculate(i, state) {
		return [i, state];
	}
};

catalogue.debug.always_error = {
	name: "always error",
	inputs: [{name: "i", val: 0}],
	outputs: [{name: "o"}],
	calculate(i, state) {
		let k;
		for (x of 1)
			k = x;
		return [[], state];
	}
};

catalogue.debug.iframe = {
	name: "iframe",
	inputs: [{name: '<span style="font-size: 1.25rem; color: black; background: linear-gradient(cyan, magenta); font-family: serif; line-height: 100%; font-style: italic;">Text is\'nt cleaned before the module is opened. You can put literally whatever html you want in the module definition</span>', val: 0}],
	outputs: [{name: '<iframe style="border: 0; width: 360px; height: 120px;" src="https://bandcamp.com/EmbeddedPlayer/album=275247403/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/artwork=small/transparent=true/" seamless><a href="https://astronomy487.bandcamp.com/album/f-of-x">F of X by Astro</a></iframe><img src="data:image/jpeg;base64,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">'}],
	calculate(i, state) {
		return [i, state];
	}
};

catalogue.debug.make_invisible = {
	name: "Delete everything else module",
	calculate(i, state) {
		for (uuid of Object.keys(nodes))
			remove_node(uuid);
		return [i, state];
	}
};

catalogue.debug.replicate = {
	name: "self-replicating module",
	buttons: [
		{name: "mitosis", action(i, state){
			make_node("debug", "replicate", 100, 100);
		}}
	],
	calculate(i, state) {
		return [i, state];
	}
};

/*catalogue.debug.node_in_node = {
	name: "node in node",
	buttons: [
		{name: `<div class="node" category="math" id="4b7f7c59" style="position: relative;" onmouseup="click_header_up('4b7f7c59')" errored="false" dragging="false"><header onmousedown="click_header_down('4b7f7c59')">trig</header><section><div class="node-inputs"><div class="node-input" connected="false" id="4b7f7c59-input-0"><div onclick="input_circle_click('4b7f7c59', 0)" id="4b7f7c59-input-jack-0">–</div><span onclick="io_click('4b7f7c59', true, 0)">angle</span><label id="4b7f7c59-input-label-0" onfocusin="input_label_focusin('4b7f7c59', 0);" onfocusout="input_label_focusout('4b7f7c59', 0);" contenteditable="true">0</label></div></div><div class="node-outputs"><div class="node-output" id="4b7f7c59-output-0"><span onclick="io_click('4b7f7c59', false, 0)">sine</span><div id="4b7f7c59-output-jack-0">&nbsp;</div><label id="4b7f7c59-output-label-0">0</label></div><div class="node-output" id="4b7f7c59-output-1"><span onclick="io_click('4b7f7c59', false, 1)">cosine</span><div id="4b7f7c59-output-jack-1">&nbsp;</div><label id="4b7f7c59-output-label-1">1</label></div><div class="node-output" id="4b7f7c59-output-2"><span onclick="io_click('4b7f7c59', false, 2)">tangent</span><div id="4b7f7c59-output-jack-2">&nbsp;</div><label id="4b7f7c59-output-label-2">0</label></div></div></section><textarea spellcheck="false" placeholder="module notes..."></textarea></div>`, action(i, state) {return state;}}
	],
	calculate(i, state) {
		return [i, state];
	}
};*/

catalogue.debug.summoner = {
	name: "the summoner",
	buttons: [
		{name: "summon", action(i, state){
			let the_category = Object.keys(catalogue);
			the_category = the_category[Math.floor(Math.random()*the_category.length)];
			let the_module = [];
			for (field of Object.keys(catalogue[the_category])) if (!field.startsWith("_")) the_module.push(field);
			the_module = the_module[Math.floor(Math.random()*the_module.length)];
			make_node(the_category, the_module, 200, 100);
		}}
	],
	calculate(i, state) {
		return [i, state];
	}
};