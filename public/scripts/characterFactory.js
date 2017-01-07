function CharacterFactory(data=CHARACTERS_DATA) {
 var characters = []; // Why is this an array of hashes?
  for (var char of data['characters']) {
    var character = new Character(char);
    character.loadMatchups(new Array(data.length).fill(null));
    characters.push({ key: character.id, value: character });
  }
  return characters;
}
