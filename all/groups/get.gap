# Read("C:/Users/astro/Code/astronomy487.github.io/all/groups/get.gap");

LoadPackage("grpconst");
LoadPackage("repsn");

output := OutputTextFile("C:/Users/astro/Code/astronomy487.github.io/all/groups/output.txt", false);

for n in [2..100] do
	groups := ConstructAllGroups(n);
	Print(n, "\n");
	for group in groups do
		textDescription := StructureDescription(group);
		PrintTo(output, n, "|", textDescription, "|");
		morphismToPermutationGroup := IsomorphismPermGroup(group);
		hadAnyYet := false;
		generators := MinimalGeneratingSet(group);
		for gen in generators do
			if hadAnyYet then PrintTo(output, "&"); fi;
			hadAnyYet := true;
			PrintTo(output, morphismToPermutationGroup(gen));
		od;
		PrintTo(output, "\n");
	od;
od;

# Close the file
CloseStream(output);