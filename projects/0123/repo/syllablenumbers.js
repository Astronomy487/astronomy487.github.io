//Note that the b64stream to text conversion does not itself insert spaces or anything. To get spaces from a b64stream, you must find its wordids and convert each word separately into its own b64stream and then into text.
function b64stream_to_text(stream) {
  let syl_map = ["ro","re","nu","mo","ru","la","nga","ri","qa","wi","ho","mu","ma","wo","po","na","ki","tu","ha","fi","ta","qi","pu","to","ra","ka","hi","wa","pi","mi","me","ngu","he","ngi","le","ni","fa","qe","fu","i","te","ngo","hu","u","pe","we","lu","ke","no","pa","o","ku","a","ko","nge","fe","fo","lo","ne","tsi","li","qo","e","qu"];
  for (let i = 0; i < stream.length; i++) {
    stream[i] = syl_map[stream[i]];
  }
  return stream.join("").replace(/aa/g, 'ā').replace(/ee/g, 'ē').replace(/ii/g, 'ī').replace(/oo/g, 'ō').replace(/uu/g, 'ū').replace(/q/g, '\'');
}

function text_to_b64stream(text) {
  let syl_map = ["ro","re","nu","mo","ru","la","nga","ri","qa","wi","ho","mu","ma","wo","po","na","ki","tu","ha","fi","ta","qi","pu","to","ra","ka","hi","wa","pi","mi","me","ngu","he","ngi","le","ni","fa","qe","fu","i","te","ngo","hu","u","pe","we","lu","ke","no","pa","o","ku","a","ko","nge","fe","fo","lo","ne","tsi","li","qo","e","qu"];
  //cleanest ever text cleanup
	text = text.replace(/'/g, 'q');
	text = text.replace(/ā/g, 'aa').replace(/ē/g, 'ee').replace(/ī/g, 'ii').replace(/ō/g, 'oo').replace(/ū/g, 'uu'); //āēīōū
  text = text.replace(/[^a-zA-Z]+/g, '').toLowerCase();
	text = text.replace(/a/g, 'a ').replace(/e/g, 'e ').replace(/i/g, 'i ').replace(/o/g, 'o ').replace(/u/g, 'u ');
	text = text.trim().split(" ");
  //text is now array of syllables as text
  for (let i = 0; i < text.length; i++) {
    //turn text[i] from "ro" to 0
    for (let j = 0; j < syl_map.length; j++) {
      if (syl_map[j] == text[i]) text[i] = j;
    }
  }
  return text;
}