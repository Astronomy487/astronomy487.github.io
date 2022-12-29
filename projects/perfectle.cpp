#include <iostream>
#include <fstream>
#include <vector>
#include <string>
using namespace std;

//gets the signature of guessing word A on true word B
int get_signature(string* a_ptr, string* b_ptr) {
	string guess = *a_ptr;
	string truth = *b_ptr;
	int color[] = { 0, 0, 0, 0, 0 };
	bool accounted[] = { false, false, false, false, false };
	//find true greens
	for (int i = 0; i < 5; i++) {
		if (guess[i] == truth[i]) {
			color[i] = 2;
			accounted[i] = true;
		}
	}
	//remaining letters in guess can scrounge for themselves in the truth
	for (int i = 0; i < 5; i++) {
		for (int j = 0; j < 5; j++) {
			if (!accounted[j] && guess[i] == truth[j]) {
				color[i] = 1;
				accounted[j] = true;
			}
		}
	}
	return color[4] + color[3] * 3 + color[2] * 9 + color[1] * 27 + color[0] * 81;
}

void best_guess(vector<string*> guesses, vector<string*> possibles) {
	float most_useful = 100000;
	string* most_useful_word = guesses[0];
	for (int i = 0; i < guesses.size(); i++) {
		string* guess = guesses[i];
		//compile list of ALL possible signatures we could receive (paralell to possibles) and also overall signature counts
		int* possible_signatures = new int[possibles.size()];
		int* signature_count = new int[243];
		for (int sig = 0; sig < 243; sig++) {
			signature_count[sig] = 0;
		}
		for (int j = 0; j < possibles.size(); j++) {
			int the_signature = get_signature(guess, possibles[j]);
			possible_signatures[j] = the_signature;
			signature_count[the_signature]++;
		}
		//find how useful each signature is. how many of possibles would still be left if we got this signature?
		// (if sig X has P/N chance of happening, it also will leave P/N remaining if true! average amt left is (P/N)^2)
		int* signature_useful = new int[243];
		float total_useful = 0;
		for (int sig = 0; sig < 243; sig++) {
			if (signature_count[sig] == 0) continue;
			signature_useful[sig] = 0;
			//how many other possibles share this signature?
			for (int j = 0; j < possibles.size(); j++) {
				if (possible_signatures[j] == sig) {
					signature_useful[sig]++;
				}
			}
			total_useful += float(signature_count[sig] * signature_useful[sig]);
			//std::cout << "sig: " << sig << "\n";
			//std::cout << "  happens in " << signature_count[sig] << " of possible words\n";
			//std::cout << "  would leave " << signature_useful[sig] << " of wordlist left\n";
			//std::cout << "sig" << sig << " would leave " << signature_useful[sig] << " words left. now total_useful=" << total_useful << "\n";
		}
		total_useful /= possibles.size() * possibles.size();
		delete[] possible_signatures;
		delete[] signature_count;
		delete[] signature_useful;
		if (total_useful < most_useful) {
			most_useful_word = guess;
			most_useful = total_useful;
		}
	}
	std::cout << "\ni recommend guessing '" << *most_useful_word << "'\non average, this will eliminate "<<100-most_useful*100<<"% of the possible words\n";
}

int main() {
	string line; //for getting text from file
	string* str_obj; //obj pointer whose address changes for each word read into it
	vector<string*> guesses;
	vector<string*> possibles;

	//PHASE 1: READ WORDLISTS

	ifstream guess_file("guesses.txt");
	ifstream possible_file("guesses.txt");
	while (getline(guess_file, line)) {
		str_obj = new string(line);
		guesses.push_back(str_obj);
	}
	while (getline(possible_file, line)) {
		str_obj = new string(line);
		possibles.push_back(str_obj);
	}
	guess_file.close();
	possible_file.close();

	if (!guesses.size() && !possibles.size()) {
		std::cout << "ok...\nok.\n\nthis is REALLY awkward.\n\ni couldnt open the wordlists";
		cin >> line;
		return 0;
	}
	
	std::cout << "(precalculated) best first guess is raise. average removes 97.1009% of wordlist\n";
	//technically TIARE removes 97.1782%. but its not a possible word, just a guess word. so sshshsh
	for (int round = 0; possibles.size() > 1; round++) {
		if (round) best_guess(guesses, possibles);
		std::cout << "\n";

		std::cout << "what word did you guess:       ";
		cin >> line;
		str_obj = new string(line); //now represents address of our guess
		std::cout << "and what colors did you get:   ";
		cin >> line;
		int* color = new int[5];
		for (int i = 0; i < 5; i++) {
			if (line[i] == '0') color[i] = 0;
			if (line[i] == '1') color[i] = 1;
			if (line[i] == '2') color[i] = 2;
		}
		int the_signature = color[4] + color[3] * 3 + color[2] * 9 + color[1] * 27 + color[0] * 81;
		delete[] color;

		//remove all guesses and possibles that dont match our results here
		for (int i = 0; i < guesses.size(); i++) {
			if (get_signature(str_obj, guesses[i]) != the_signature) {
				guesses.erase(guesses.begin() + i);
				i--;
			}
		}
		for (int i = 0; i < possibles.size(); i++) {
			if (get_signature(str_obj, possibles[i]) != the_signature) {
				possibles.erase(possibles.begin() + i);
				i--;
			}
		}

		delete str_obj;
	}
	if (possibles.size() == 0) {
		std::cout << "\nit cant be anything.\nwhat\n\n\n\n";
	}
	else if (possibles.size() == 1) {
		std::cout << "\nit HAS to be " << *possibles[0] << "\n\n\n\n";

	}

}