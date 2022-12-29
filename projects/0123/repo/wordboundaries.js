function wordid_to_b64stream(num) {
  let b32 = [];
  while (num > 0) {
    b32.unshift(num%32); //add latest digit of b32
    num = Math.floor(num/32); //shift
  }
  if (b32.length == 0) b32 = [0];
  let acc = 0;
  for (let i = 0; i < b32.length; i++) {
    acc = (acc + b32[i]) % 64; //update accumulator
    if (acc >= 32) { //if bad accumulator
      b32[i] += 32; //update value there
      acc += 32; //and update accumulation
    }
  }
  b32[b32.length-1] = (b32[b32.length-1]+32)%64; //make last digit cause bad accumulation on purpose
  return b32;
}

function b64stream_to_wordids(stream) {
  let words_found = [];
  let current_word = [];
  let acc = 0;
  for (let i = 0; i < stream.length; i++) { //for each syl
    acc = (acc + stream[i]) % 64; //accumulate syl value
    current_word.push(stream[i]);
    if (acc >= 32) { //acc bad. word is DONE
      //console.log("word found as stream "+current_word);
      words_found.push(current_word);
      current_word = [];
      acc = 0;
    }
  } //stream runs out. lets flatten and calculate word id numbers
  for (let i = 0; i < words_found.length; i++) {
    let this_word_id = 0;
    for (let j = 0; j < words_found[i].length; j++) {
      words_found[i][j] %= 32; //flatten
      this_word_id += words_found[i][j] * Math.pow(32, words_found[i].length-j-1);
    }
    words_found[i] = this_word_id;
  }
  return words_found;
}