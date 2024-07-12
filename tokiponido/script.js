let counter = 0; //for naming arguments a,b,c,d,e
let usedPredicateShortNames = {}; //when a predicate names itself, put it in here. eg F F2 F3
let globalVariablePhoneticToArgument = {};

function unique(v, i, a) {
  return a.indexOf(v) === i;
}
function fixParens(x) {
	while (x.startsWith("(") && x.endsWith(")")) x = x.substring(1, x.length-1);
	return x;
}
function alphabetize(a) {
	return a.concat([]).sort((x,y) => x.toString().localeCompare(y.toString()));
}

/*

lets say you have

exists x [Pxy] and [Qxy]

when you have to insert quantification for y, you're putting it inside the Component for this exists proposition
EVEN THOUGH THIS VARIABLE GETS USED IN THE CONDITION TOO

in these cases, you need to
- combine the condition and component into an actual thing
- quantify before this combined construct

This prevents the possibility of the in-set shorthand But that is perfectly fine Because that shorthand is already impossible in these cases

*/

class Argument {
	constructor() {
		this.texPrefix = "";
	}
	toString() {
		if (!this.text) {
			this.text = "abcdefghijklmnopqrstuvwxyz".charAt(counter%26);
			if (counter >= 26) this.text += "_{" + (Math.floor(counter/26)+1) + "}";
			counter++;
		}
		return this.texPrefix + " " + this.text;
	}
}

class GlobalArgument extends Argument {
	constructor(t) {
		super();
		this.phonetic = t;
		globalVariablePhoneticToArgument[this.phonetic] = this;
		this.texPrefix = "\\bar";
	}
}

class Proposition {
	removeUsedArgumentOnce(x) {
		this.usedArguments = this.usedArguments.filter(a => a != x);
	}
	removeUsedArgumentDown(x) {
		this.removeUsedArgumentOnce(x);
		if (this.component) this.component.removeUsedArgumentDown(x);
		if (this.components) for (let c of this.components) c.removeUsedArgumentDown(x);
	}
	/* turnUsedArgumentsIntoQuantifiers() {
		this.usedArguments = this.usedArguments.filter(x => !x.beenQuantified);
		//console.log("start turnUsedArgumentsIntoQuantifiers on", this.toString(), " and i must quantify", this.usedArguments.join(", "));
		let needExistential = this.usedArguments.filter(x => x.preferredQuantification == ExistsProposition);
		let needUniversal = this.usedArguments.filter(x => x.preferredQuantification == ForallProposition);
		//console.log("^^ must exists[" + needExistential.join(", ") + "] and forall[" + needUniversal.join(", ") + "]");
		let propositionToReturn = this;
		if (needUniversal.length) propositionToReturn = new ForallProposition(needUniversal, propositionToReturn); //WHICH ORDER FOR THESE 2 IS BETTER?
		if (needExistential.length) propositionToReturn = new ExistsProposition(needExistential, propositionToReturn);
		for (let a of this.usedArguments) a.beenQuantified = true;
		this.usedArguments = [];
		//console.log("^^ qtification ends up looking like", propositionToReturn.toString());
		if (this.component) this.component = this.component.turnUsedArgumentsIntoQuantifiers();
		if (this.components) this.components = this.components.map(c => c.turnUsedArgumentsIntoQuantifiers());
		return propositionToReturn;
	}
	pickUsedArgumentsToKeep() {
		//console.log("pickUsedArgumentsToKeep for", this.toString());
		//console.log("    Everything below me, I see", this.usedArguments.join(", "));
		if (this.components) for (let usedArgument of this.usedArguments) {
			let componentsThatUse = this.components.filter(x => x.usedArguments.includes(usedArgument)).length;
			//if more than one child is using this, we'll quantify here and now. remove from children lists; they dont need to worry
			if (componentsThatUse > 1) for (let component of this.components) component.removeUsedArgumentDown(usedArgument);
			if (componentsThatUse == 1) this.removeUsedArgumentOnce(usedArgument);
		}
		else if (this.component) this.usedArguments = [];
		//console.log("    I've decided to track", this.usedArguments.join(", "),"; these are the ones I'm responsible for quantifying");
		if (this.component) this.component.pickUsedArgumentsToKeep();
		if (this.components) for (let c of this.components) c.pickUsedArgumentsToKeep();
	} */
	treatAsSet(arg) { //can we represent P(x) as x in P? if so, return latex for this set. if not, return undefined
		return undefined;
	}
	asSentence(extraArguments = []) {
		//Fix all arguments in place and make sure they are quantified
		//(specifically requested exists, specifically requested forall, exists)
		// the forall arguments will have a .condition which must become the condition in the ForallProposition constructor
		//return;
		//phase 1: let everybody figure out what arguments they use
		console.log("bout to treat", this.toString(), "this as a sentence");
		console.log("btw im a " + this.constructor);
		this.discoverUsedArguments();
		this.usedArguments = this.usedArguments.concat(extraArguments);
		this.usedArguments = this.usedArguments.filter(x => !(x instanceof GlobalArgument)).filter(x => !x.beenQuantified).filter(unique);
		for (let a of this.usedArguments) a.beenQuantified = true;
		
		//it is possible the arguments' conditions harbor EVEN MORE VARIABLES we need to consider
		/* let moreVariablesToConsider = true;
			moreVariablesToConsider = false;
			let newList = this.usedArguments;
			for (let a of this.usedArguments) if (a.condition) {
				a.condition.discoverUsedArguments();
				newList = newList.concat(a.condition.usedArguments);
			}
			
			newList = newList.filter(x => !(x instanceof GlobalArgument)).filter(x => !x.beenQuantified).filter(unique);
			if (newList.length > this.usedArguments.length) {
				moreVariablesToConsider = true;
				console.log("found some new variables");
			}
			this.usedArguments = newList;
		} */
		
		let forallsWhoNeedQuantificationInTheirCondition = [];
		
		console.log("gonna quantify these", this.usedArguments.toString());
		let needExistentialQuantification = this.usedArguments.filter(x => x.preferredQuantification == ExistsProposition);
		let needUniversalQuantification = this.usedArguments.filter(x => x.preferredQuantification == ForallProposition);
		let others = this.usedArguments.filter(x => !x.preferredQuantification);
		console.log("118 this.usedArguments", this.usedArguments);
		console.log("gonna quantify these", needExistentialQuantification.toString(), needUniversalQuantification.toString(), others.toString());
		let propToReturn = this;
		console.log("propToReturn", propToReturn);
		for (let arg of others.reverse()) { //casual exists goes on most inside
			propToReturn = new ExistsProposition(arg, propToReturn, arg.condition);
			console.log("casual exists", arg);
			forallsWhoNeedQuantificationInTheirCondition.push(propToReturn);
		}
		for (let arg of needUniversalQuantification.reverse()) { //forall goes in middle
			propToReturn = new ForallProposition(arg, propToReturn, arg.condition);
			console.log("fr forall", arg);
			forallsWhoNeedQuantificationInTheirCondition.push(propToReturn);
		}
		for (let arg of needExistentialQuantification.reverse()) { //explicit exists goes on most outside
			propToReturn = new ExistsProposition(arg, propToReturn, arg.condition);
			console.log("fr exists", arg);
		}
		propToReturn.discoverUsedArguments();
		
		for (let prop of forallsWhoNeedQuantificationInTheirCondition) {
			if (prop.condition) prop.condition = prop.condition.asSentence();
		}
		
		console.log("propToReturn", propToReturn);
		return propToReturn;
	}
}

class Knowledge {
	constructor(a, f) {
		this.arg = a;
		this.facts = f;
	}
	toString() {
		let txt1 = this.arg ? (this.arg + "$ where $") : "";
		let txt2 = fixParens(this.facts.toString());
		return txt1 + txt2;
	}
	asSentence() {
		if (this.arg.condition) this.arg.condition.discoverUsedArguments();
		this.facts = this.facts.asSentence([this.arg].concat(this.arg.condition ? this.arg.condition.usedArguments : []));
	}
}

function combinePropositions(...propList) {
	let prop = new AndProposition();
	for (let p of propList)
		if (p instanceof AndProposition) {
			prop.components = prop.components.concat(p.components);
		} else {
			prop.components.push(p);
		}
	return prop;
}

class ExistsProposition extends Proposition {
	constructor(a, p, c) {
		super();
		this.arg = a;
		this.component = p;
		this.condition = c;
		if (!this.condition.treatAsSet(this.arg)) {
			console.log(this.toString() + " is getting combbined")
			this.component = new AndProposition([this.condition, this.component]);
			this.condition = null;
		}
	}
	toString() {
		this.arg.toString();
		if (this.condition) {
			let tryTreatAsSet = this.condition.treatAsSet(this.arg);
			if (tryTreatAsSet) {
				//condition can just be considered a set. that's nice
				return "\\exists " + this.arg.toString() + " \\in " + tryTreatAsSet + " : " + this.component.toString();
			}
			return "\\exists " + this.arg.toString() + " : (" + fixParens(this.condition.toString()) + ") \\land (" + fixParens(this.component.toString()) + ")";
		}
		return "\\exists " + this.arg.toString() + " : " + fixParens(this.component.toString());
	}
	discoverUsedArguments() {
		this.component.discoverUsedArguments();
		this.usedArguments = [this.arg];
		if (this.condition) {
			this.condition.discoverUsedArguments();
			this.usedArguments = this.usedArguments.concat(this.condition.usedArguments);
		}
		this.usedArguments = this.usedArguments.concat(this.component.usedArguments);
		this.usedArguments = this.usedArguments.filter(unique);
		console.log("existsproposition this.usedArguments", this.usedArguments);
		//this.component.discoverUsedArguments();
		//this.usedArguments = [this.arg].concat(this.component.usedArguments).filter(unique);
	}
}

class ForallProposition extends Proposition {
	constructor(a, p, c) {
		super();
		this.arg = a;
		this.component = p;
		this.condition = c;
		if (!this.condition.treatAsSet(this.arg)) {
			this.component = new IfProposition([this.condition, this.component]);
			this.condition = null;
		}
	}
	toString() {
		this.arg.toString();
		let tryTreatAsSet = this.condition.treatAsSet(this.arg);
		if (tryTreatAsSet) {
			//condition can just be considered a set. that's nice
			return "\\forall " + this.arg.toString() + " \\in " + tryTreatAsSet + " : " + this.component.toString();
		}
		return "\\forall " + this.arg.toString() + " : (" + fixParens(this.condition.toString()) + ") \\to (" + fixParens(this.component.toString()) + ")";
	}
	discoverUsedArguments() {
		this.component.discoverUsedArguments();
		this.condition.discoverUsedArguments();
		this.usedArguments = [this.arg].concat(this.condition.usedArguments).concat(this.component.usedArguments).filter(unique);
	}
}

class IsFactThatProposition extends Proposition { //"x is the fact that P(x, ...)". used for non-logical things. express the sentence in a box for toString
	constructor(a, b) {
		super();
		this.arg = a;
		a.texPrefix = "\\hat";
		this.component = b;
	}
	toString() {
		return this.arg.toString() + " = \\boxed{" + fixParens(this.component.toString()) + "}";
	}
	discoverUsedArguments() {
		this.component.discoverUsedArguments();
		this.usedArguments = [this.arg].concat(this.component.usedArguments).filter(unique);
	}
}
class EqualityProposition extends Proposition {
	constructor(a, b) {
		super();
		if ([a,b].includes(null)) throw new Error("Trying to make an equality proposition with a null argument (likely from a high-level conjunction)");
		this.arg1 = a;
		this.arg2 = b;
	}
	toString() {
		return this.arg1.toString() + " = " + this.arg2.toString();
	}
	discoverUsedArguments() {
		this.usedArguments = [this.arg1, this.arg2].filter(unique);
	}
}

class Predication extends Proposition {
	constructor(t, a = []) {
		super();
		if (a.includes(null)) throw new Error("Trying to make a predication with a null argument (likely from a high-level conjunction)");
		this.text = t;
		this.shortText = this.text.charAt(0);
		for (let i = 2; usedPredicateShortNames[this.shortText] != undefined && usedPredicateShortNames[this.shortText] != this.text && i < 100; i++) {
			this.shortText = this.text.charAt(0).toUpperCase() + "_{" + i + "}";
		}
		usedPredicateShortNames[this.shortText] = this.text;
		this.args = a;
	}
	toString() {
		return this.shortText + " " + this.args.map(x => x.toString()).join(" ") + " ";
		//return this.shortText + "\\langle " + this.args.map(x => x.toString()).join(", ") + "\\rangle";
		//return "\\text{"+this.text+"}" + "\\langle " + this.args.map(x => x.toString()).join(", ") + "\\rangle";
	}
	discoverUsedArguments() {
		this.usedArguments = this.args.filter(unique);
	}
	treatAsSet(arg) {
		if (this.args.length == 1 && this.args[0] == arg)
			return this.shortText;
		return undefined;
	}
}

class AndProposition extends Proposition {
	constructor(a = []) {
		super();
		this.components = a;
	}
	toString() {
		if (!this.components.length) return "\\top ";
		if (this.components.length == 1) return this.components[0].toString();
		return "(" + this.components.map(x => x.toString()).join(" \\land ") + ")";
	}
	discoverUsedArguments() {
		for (let component of this.components) component.discoverUsedArguments();
		this.usedArguments = this.components.reduce((a,b)=>a.concat(b.usedArguments),[]).filter(unique);
		console.log("andproposition usedArguments", this.usedArguments);
	}
	treatAsSet(arg) {
		let tryTreatAsSet = this.components.map(x => x.treatAsSet(arg));
		if (tryTreatAsSet.includes(undefined)) return undefined;
		return tryTreatAsSet.join(" \\cap ")
	}
}
class OrProposition extends Proposition {
	constructor(a = []) {
		super();
		this.components = a;
	}
	toString() {
		if (!this.components.length) return "\\bot ";
		if (this.components.length == 1) return this.components[0].toString();
		return "(" + this.components.map(x => x.toString()).join(" \\lor ") + ")";
	}
	discoverUsedArguments() {
		for (let component of this.components) component.discoverUsedArguments();
		this.usedArguments = this.components.reduce((a,b)=>a.concat(b.usedArguments),[]).filter(unique);
	}
	treatAsSet(arg) {
		let tryTreatAsSet = this.components.map(x => x.treatAsSet(arg));
		if (tryTreatAsSet.includes(undefined)) return undefined;
		return tryTreatAsSet.join(" \\cup ")
	}
}
class NotProposition extends Proposition {
	constructor(a) {
		super();
		if (!a) throw new Error("NotProposition was given no component");
		this.component = a;
	}
	toString() {
		return "\\neg (" + this.component.toString() + ")";
	}
	discoverUsedArguments() {
		this.component.discoverUsedArguments();
		this.usedArguments = this.component.usedArguments;
	}
	treatAsSet(arg) {
		let tryTreatAsSet = this.component.treatAsSet(arg);
		return tryTreatAsSet ? tryTreatAsSet+"^\\complement" : undefined;
	}
}

function nullary(name) {
	let x = new Argument();
	return new Knowledge(x, new Predication(name, [x]));
}
function unary_a(name, x) { //addon: F x => x, where F(x)
	return new Knowledge(x.arg, combinePropositions(new Predication(name, [x.arg]), x.facts));
}
function unary_b(name, x) { //anew: F x => a, where F(a, x)
	let a = new Argument();
	return new Knowledge(a, combinePropositions(new Predication(name, [a, x.arg]), x.facts));
}
function binary_a(name, x, y) { //addon: F x y => y, where F(x, y)
	return new Knowledge(y.arg, combinePropositions(new Predication(name, [x.arg, y.arg]), x.facts, y.facts));
}
function binary_b(name, x, y) { //anew: F x y => a, where F(a, x, y)
	let a = new Argument();
	return new Knowledge(a, combinePropositions(new Predication(name, [a, x.arg, y.arg]), x.facts, y.facts));
}
function ternary_a(name, x, y, z) { //addon: F x y z => z, where F(x, y, z)
	return new Knowledge(z.arg, combinePropositions(new Predication(name, [x.arg, y.arg, z.arg]), x.facts, y.facts, z.facts));
}
function ternary_b(name, x, y, z) { //anew: F x y z => a, where F(a, x, y, z)
	let a = new Argument();
	return new Knowledge(a, combinePropositions(new Predication(name, [a, x.arg, y.arg, z.arg]), x.facts, y.facts, z.facts));
}
//special ones. word classes with literally 1
function unary_forall(x) {
	if (x.arg.preferredQuantification) throw new Error("Requested forall quantification to an argument already with preferred quantification");
	if (x.arg instanceof GlobalArgument) throw new Error("Trying to forall quantify a global argument");
	x.arg.preferredQuantification = ForallProposition;
	x.arg.condition = x.facts;
	return new Knowledge(x.arg, new AndProposition([]));
}
function unary_exists(x) {
	if (x.arg.preferredQuantification) throw new Error("Requested exists quantification to an argument already with preferred quantification");
	if (x.arg instanceof GlobalArgument) throw new Error("Trying to exists quantify a global argument");
	x.arg.preferredQuantification = ExistsProposition;
	x.arg.condition = x.facts;
	console.log(",,,", x.arg);
	return new Knowledge(x.arg, new AndProposition([]));
}
function unary_not(x) {
	//when you start engaging in these, i think i want you to close out quantifiers
	x.asSentence();
	return new Knowledge(null, new NotProposition(x.facts));
}
function binary_or(x, y) {
	//when you start engaging in these, i think i want you to close out quantifiers
	x.asSentence();
	y.asSentence();
	return new Knowledge(null, new OrProposition([x.facts, y.facts]));
}
function binary_and(x, y) {
	//when you start engaging in these, i think i want you to close out quantifiers
	x.asSentence();
	y.asSentence();
	return new Knowledge(null, new AndProposition([x.facts, y.facts]));
}
function unary_factthat(x) {//factthat x => x where x=\boxed{}
	x.asSentence();
	let a = new Argument();
	return new Knowledge(a, new IsFactThatProposition(a, x.facts));
}
function binary_equals(x, y) {
	return new Knowledge(y.arg, combinePropositions(new EqualityProposition(x.arg, y.arg), x.facts, y.facts));
}

/*
word arity		predicate arity
0							1												anew				F => a where F a
1							1												add on			F x => x where F x
1							2												anew				F x => a where F a x
2							2												add on			F x y => y where F x y
2							3												anew				F x y => a where F a x y
3							3												add on			F x y z => z where F x y z
3							4												anew				F x y z => a where F a x y z

0.1
1.1
1.2
2.2
2.3
3.3
3.4
*/