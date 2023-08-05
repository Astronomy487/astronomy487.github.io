#include <iostream>
#include <fstream>
#include <unordered_map>
#include <unordered_set>
#include <vector>
#include <string>
using namespace std;

/*

rules surrounding chord notation
short forms are prefered. the following replacements are made when chords are read as a means of cleaning

maj -> M, min -> m, - -> m, aug -> +, dim -> *, dom -> ,

note names are always from 'ABCDEFG' followed by any number of sharps or flats.
note names always end up in sharps (Bb will always become A#) to prevent enharmonic things from messing with the lookup

examples of replacements in action
ideal       accepted and converted
XM          Xmaj    or X
Xm          Xmin
X+          Xaug
X*          Xdim
X7          Xdom7
XM7         Xmaj7
Xm7         Xmin7
XmM7        Xminmaj7
X*7         Xdim7
X+7         Xaug7
X+M7	    Xaugmaj7
Xm7*5	    Xmin7dim5	//half diminished seventh           //these two are special bc they have numbers in there too
X7*5	    X7dim5		//dominant seventh flat five        //chord names get complicated. but numbers are just accepted as part of the name. no transpotiion applied to that text

being particular about chord voicings (i.e. saying X chord but with augmented 5th and flat 7th and whatever)
are "supported" in that they can be transposed and worked with. but there are no special checks to see if they
end up equivalent to another chord. chords have no internal interval representation, it's just text

in general, the recommended chord looks like this
- root note
- any sequence of M/maj, m/min, aug/+, dim/*, and numbers to convey the chord quality
- any inversions should be written with slash notation (i.e. C/E, not C6)

*/

string replace_all(string str, string a, string b) {
    int index = str.find(a);
    while (index != string::npos) {
        string before = str.substr(0, index);
        string after = str.substr(index + a.size());
        str = before + b + after;
        index = str.find(a);
    }
    return str;
}

struct chord_graph {
    //min and max of how much history to look at
    int history_min;
    int history_max;
    vector<string> note_names;
    vector<int> diatonic_note_values;
    unordered_map<string, vector<pair<int, string>>> motions;
    chord_graph(int h_min, int h_max, bool simple) {
        history_min = h_min;
        history_max = h_max;
        note_names = { "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B" };
        diatonic_note_values = { 9, 11, 0, 2, 4, 5, 7 }; //values of A,B,C,D,E,F,G
        simplify_mode = simple;
    }
    //motions["C"] stores all recorded motions from "C". motions["G C"] stores all recorded motions from "G" "C"
    void record_motion(string from, string to) {
        //cout << "Recording" << from << " to " << to << "\n";
        vector<pair<int, string>> entries = motions[from];
        bool entry_found = false;
        for (int i = 0; i < entries.size() and not entry_found; i++) {
            //cout << "::::" << entries[i].second;
            if (entries[i].second == to) {
                entries[i].first++;
                entry_found = true;
                //cout << "  incrementing existing entry\n";
            }
        }
        if (not entry_found) {
            pair<int, string> entry(1, to);
            entries.push_back(entry);
            //cout << "  making new entry, now " << entries.size() << " entries\n";
        }
        motions[from] = entries;
    }
    //reads the chords from a txt file and records all those motions
    bool simplify_mode;
    void read_song(string filename) {
        ifstream file(filename);
        //vector<string> chords;
        vector<string> chord_list;
        string token;
        //cout << "learning from file '" << filename << "' ...\n";
        bool in_header = true;
        while (file >> token) {
            if (token.size() >= 2 and token[0] == '-' and token[1] == '-') {
                in_header = false;
                continue;
            }
            if (in_header) continue;
            if (token[0] == '/') {
                process_chord_list(chord_list);
                chord_list = {};
            } else {
                if (simplify_mode)
                    chord_list.push_back(simplify_chord(token)); //simplify mode. simplify too
                else
                    chord_list.push_back(read_and_transpose(token, 0)); //non simplify mode, just run through read_and_transpose
            }
        }
        process_chord_list(chord_list);
    }
    void process_chord_list(vector<string> chords) {
        for (int context_size = history_min; context_size <= history_max; context_size++) {
            for (int i = context_size; i < chords.size(); i++) { //i is chord of focus as destination
                //find and offset all the chords we receive such that the rule starts with some C chord
                int offset = get_root_value(chords[i - context_size]);
                string chord_history = ""; //the chord history that will be put into the lookup table
                for (int j = i - context_size; j < i; j++) {
                    chord_history += " ";
                    chord_history += read_and_transpose(chords[j], 12 - offset);
                }
                chord_history = chord_history.substr(1);
                record_motion(chord_history, read_and_transpose(chords[i], 12 - offset));
                //cout << ".";
                //cout << chord_history << " leads to " << chords[i] << "\n";
            }
        }
    }
    //requests how to continue
    void request_continuation(vector<string> history) {
        // clean up the history
        for (int i = 0; i < history.size(); i++) {
            history[i] = read_and_transpose(history[i], 0);
        }
        for (int context_size = history_min; context_size <= history_max; context_size++) {
            cout << "\n========= using context_size=" << context_size << " =========";
            if (context_size > history.size()) {
                cout << "\nnot enough history\n";
                continue;
            }
            cout << " ( ";
            int offset = get_root_value(history[history.size() - context_size]);
            string chord_history = "";
            for (int j = history.size() - context_size; j < history.size(); j++) {
                chord_history += " ";
                chord_history += read_and_transpose(history[j], 12 - offset);
                cout << read_and_transpose(history[j], 0) << " ";
            }
            chord_history = chord_history.substr(1);
            cout << ")\n";
            if (motions.find(chord_history) == motions.end()) {
                cout << "no recorded ways to continue from this\n";
                continue;
            }
            vector<pair<int, string>> continuations = motions[chord_history];
            //cout << "there are " << continuations.size() << " recorded ways of going from" << chord_history << "\n";
            vector<string> bank; //bank of continuations. transposed correctly to the original problem
            for (int i = 0; i < continuations.size(); i++) {
                string transposed_chord = read_and_transpose(continuations[i].second, offset);
                for (int x = 0; x < continuations[i].first; x++) {
                    bank.push_back(read_and_transpose(transposed_chord, offset));
                }
                cout << continuations[i].first << "x " << transposed_chord << "\n";
            }
        }
    }
    //reads a chord, makes its notation standard (# instead of b) and transposes up/down
    int get_root_value(string chord) {
        int note_value = 0;
        if (chord[0] == 'C') note_value = 0;
        if (chord[0] == 'D') note_value = 2;
        if (chord[0] == 'E') note_value = 4;
        if (chord[0] == 'F') note_value = 5;
        if (chord[0] == 'G') note_value = 7;
        if (chord[0] == 'A') note_value = 9;
        if (chord[0] == 'B') note_value = 11;
        if (chord[1] == '#') {
            note_value++;
        }
        if (chord[1] == 'b') {
            note_value--;
        }
        return (note_value + 12) % 12;
    }
    //simplifies a chord to just its root and its primary quality m M + *
    string simplify_chord(string chord) {
        chord = read_and_transpose(chord, 0);
        int root = diatonic_note_values[chord[0] - 'A'];
        chord = chord.substr(1);
        while (chord.size() > 0 and chord[0] == '#') {
            root = (root + 1) % 12;
            chord = chord.substr(1);
        }
        while (chord.size() > 0 and chord[0] == 'b') {
            root = (root + 11) % 12;
            chord = chord.substr(1);
        }
        char quality = 'M';
        if (chord.size() > 0 and chord[0] == 'm') quality = 'm';
        if (chord.size() > 0 and chord[0] == '*') quality = '*';
        if (chord.size() > 0 and chord[0] == '+') quality = '+';

        if (quality == 'm' && chord.find("b5") != std::string::npos) quality = '*';
        if (quality == 'M' && chord.find("#5") != std::string::npos) quality = '+';

        string c = note_names[root];
        c.push_back(quality);
        return c;
    }
    //cleans up a chord (w text replacement strategies) and then shifts any explicit tones according to a shift
    string read_and_transpose(string chord, int shift) {
        //sweep 1: do text replacement to ALWAYS keep names in their short forms
        chord = replace_all(chord, "maj", "M");
        chord = replace_all(chord, "-", "m");
        chord = replace_all(chord, "min", "m");
        chord = replace_all(chord, "aug", "+");
        chord = replace_all(chord, "dim", "*");
        chord = replace_all(chord, "dom", "");
        //sweep 2: replace note names with their transposed versions
        for (int i = 0; i < chord.size(); i++) {
            if (chord[i] >= 'A' and chord[i] <= 'G') {
                string before = chord.substr(0, i);
                string after = chord.substr(i + 1);
                int note_value = diatonic_note_values[chord[i] - 'A'] + 12 + shift;
                while (after.size() and after[0] == '#') {
                    after = after.substr(1, string::npos);
                    note_value++;
                }
                while (after.size() and after[0] == 'b') {
                    after = after.substr(1);
                    note_value--;
                }
                chord = before + note_names[note_value % 12] + after;
                if (before.size() == 0) { //if at start...
                    bool more_voicing_to_come = after.size() > 0 and after[0] != '/';
                    if (not more_voicing_to_come) { //if theres no more voicing or just an inversion,
                        chord = before + note_names[note_value % 12] + "M" + after;
                    }
                }
            }
        }
        return chord;
    }
    //prints javascript object code that represents all the transitions it has learned
    void print_knowledge() {
        string output = "{";
        for (auto rule : motions) {
            output += "'";
            output += rule.first;
            output += "':[";
            for (auto entry : rule.second) {
                output += "[";
                output += to_string(entry.first);
                output += ",'";
                output += entry.second;
                output += "'],";
            }
            output = output.substr(0, output.size() - 1);
            output += "],";
        }
        output = output.substr(0, output.size() - 1);
        output += "}";
        cout << output << "\n";
    }
    //sorts all the continuation information. not working rn
    /*void sort_entries() {
        for (auto rule : motions) {
            if (rule.second.size() <= 1) continue;
            vector<pair<int, string>> entries_sorted = {};
            while (rule.second.size()) {
                int max_index = 0;
                int max_count = rule.second[0].first;
                for (int i = 1; i < rule.second.size(); i++) {
                    if (rule.second[i].first > max_count) {
                        max_count = rule.second[i].first;
                        max_index = i;
                    }
                }
                entries_sorted.push_back(rule.second[max_index]);
                rule.second.erase(rule.second.begin() + max_index);
            }
            rule.second = entries_sorted;
        }
    }*/
};

int main() {
    srand(time(NULL));
    chord_graph c(1, 2, true);

    c.read_song("jazzstandards.txt");

    c.print_knowledge();

    //c.request_continuation({"C"});
}