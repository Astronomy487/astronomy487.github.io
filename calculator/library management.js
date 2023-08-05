//if a b are numbers, do f(a, b)
//otherwise, decompose a and b and return lists of f(a[], b[])
function recursive_binary(a, b, base_function) {
	let a_num = typeof(a)=="number";
	let b_num = typeof(b)=="number";
	if (a_num && b_num) return base_function(a, b);
	let arr = [];
	let len = 99999999999999;
	if (!a_num) len = Math.min(a.length, len);
	if (!b_num) len = Math.min(b.length, len);
	for (let j = 0; j < len; j++) {
		if (a_num) {
			arr.push(recursive_binary(a, b[j], base_function));
		} else if (b_num) {
			arr.push(recursive_binary(a[j], b, base_function));
		} else {
			arr.push(recursive_binary(a[j], b[j], base_function));
		}
	}
	return arr;
}
function recursive_unary(a, base_function) {
	if (typeof(a)=="number") return base_function(a);
	let x = [];
	for (let i = 0; i < a.length; i++)
		x[i] = recursive_unary(a[i], base_function);
	return x;
}
function equals(a, b) { //better equality function that recognizes list content
	let a_list = typeof(a) != "number";
	let b_list = typeof(b) != "number";
	if (a_list != b_list) return false;
	if (!a_list) return a == b;
	if (a.length != b.length) return false;
	for (let i = 0; i < a.length; i++)
		if (!equals(a[i], b[i])) return false;
	return true;
}
function includes(list, item) { //using better quality function
	for (let i = 0; i < list.length; i++)
		if (equals(list[i], item))
			return true;
	return false;
}
function copy(x) {
	if (typeof(x) == "number") return x;
	let k = [];
	for (item of x)
		k.push(copy(item));
	return k;
}
function flatten(list) {
	if (typeof(list) == "number") return [list];
	let v = [];
	for (item of list) {
		if (typeof(item) == "number") v.push(item); else {
			let flattened_contents = flatten(item);
			for (x of flattened_contents) v.push(x);
		}
	}
	return v;
}

//templates from which the actual node objects are constructed in make_node
let catalogue = {};
let loaded_libraries = [];
function load_library(url, success, failure) {
	//open script object
	let el = document.createElement("script");
  el.setAttribute("src", url);
  el.setAttribute("type", "text/javascript");
  el.setAttribute("async", false);
  document.body.appendChild(el);
  el.addEventListener("load", function(){
		loaded_libraries.push(url);
		need_library_css = true;
		try{success();}catch{}
	});
  el.addEventListener("error", function(er){
		try{failure();}catch{}
	});
}
function user_load_library() {
	let textfield = document.getElementById("library-import-textfield");
	if (textfield.value == "") return;
	load_library(textfield.value, function() {
		prompt_addition();
		document.getElementById("library-import-errormessage").style.display = "none";
	}, function(){
		textfield.value = "";
		document.getElementById("library-import-errormessage").style.display = "block";
	});
}
let need_library_css = false;
function create_library_color_css() {
	if (!need_library_css) return;
	let css = "";
	for (category of Object.keys(catalogue)) {
		css += "*[category="+category+"]{--accent:"+catalogue[category]._color+"}";
	}
	document.getElementById("custom-css-colors").innerHTML = css;
	need_library_css = false;
}

let libraries_to_load = "math/lists/random/statistics/constant/logic/sets/polynomial".split("/");
for (let i = 0; i < libraries_to_load.length; i++)
	setTimeout(function(){load_library("default libraries/"+libraries_to_load[i]+".js")}, i*25);