var CharacterDict = []; // Stores all Character objects, with key equal to Character.charId (which is the same as the index of the character name in CharacterNamesArr).

var SelectInfo = { // CharOne and CharTwo hold reference to characters currently selected.
	CharOne:null,
	CharTwo:null,
	TrackBar:document.getElementById("MatchupTrackBar"), // Reference to trackbar for value and disabled
	TrackBarLabel:document.getElementById("TrackBarLabel"), // label used to display matchup result
	HelperText:document.getElementById("HelperText"), // span used to display text for clarity of what matchup result means
	MatchupToggle:true // Toggles if matchups are shown for charOne
};

var CharacterNamesArr = ["Blaziken",
			 "Pikachu",
			 "Lucario",
			 "Gardevoir",
			 "Pikachu Libre",
			 "Sceptile",
			 "Gengar",
			 "Machamp",
			 "Braixen",
			 "Mewtwo",
			 "Chandelure",
			 "Suicune",
			 "Weavile",
			 "Charizard",
			 "Garchomp",
			 "Shadow Mewtwo"]; // Index corresponds to character ID.

function InitializeCharacterDict() { // Populates CharacterDict with Character objects.
	for (var char of CharacterNamesArr) {
		var newChar = {
			charName:char,
			charId:CharacterNamesArr.indexOf(char),
			matchupArr: new Array(CharacterNamesArr.length).fill(null),
			spriteString:"img/sprites/" + CharacterNamesArr.indexOf(char) + ".png",
			portraitString:"img/portraits/" + CharacterNamesArr.indexOf(char) + ".png",
			button:null,
			matchupLabel:null // matchupLabel is the label element that displays the matchup value between this character and charOne when MatchupToggle is true
		};
		CharacterDict.push({key:newChar.charId, value:newChar});
	};
	return;
};

function LoadCharacterDict() {
	// TODO: Load Character info from a file.
};

function ExportCharacterDict() {
	//TODO: Write Character info to a file.
};

function RecordMatchup() {
	SelectInfo.CharOne.value.matchupArr[SelectInfo.CharTwo.key] = SelectInfo.TrackBar.value;
	SelectInfo.CharTwo.value.matchupArr[SelectInfo.CharOne.key] = 0 - SelectInfo.TrackBar.value;
	// TODO: Feedback that value is submitted.
	ShowMatchups();
	return;
};

function DeleteMatchup() {
	//TODO: Take input parameters to alter Character objects in CharacterDict. Should be able to delete specific matchup of X vs Y, and also all matchups of X.
};

function ShowMatchups() {
	// TODO: Display matchups for charOne
	if (!SelectInfo.MatchupToggle || SelectInfo.CharOne == null) {
		for (var i = 0; i < CharacterNamesArr.length; i++) {
			CharacterDict[i].value.matchupLabel.innerHTML = "";
		};
	}
	else if (SelectInfo.MatchupToggle) {
		for (var i = 0; i < CharacterNamesArr.length; i++) {
			if (SelectInfo.CharOne.value.matchupArr[i] != null) CharacterDict[i].value.matchupLabel.innerHTML = SelectInfo.CharOne.value.matchupArr[i];
		};
	};
	return;
};

function ClickMatchupToggle() { // Switches value of MatchupToggle.Show and changes text in MatchupToggleButton.
	if (SelectInfo.MatchupToggle == false) {
		SelectInfo.MatchupToggle = true;
		document.getElementById("MatchupToggleButton").innerHTML = "Hide Matchups";
	}
	else {
		SelectInfo.MatchupToggle = false;
		document.getElementById("MatchupToggleButton").innerHTML = "Show Matchups";
	};
	return;
};

function CharButtonClick(char) { // assigns characters to SelectInfo.CharOne and CharTwo. Also enables and disables MatchupTrackBar. Calls UpdateCharacterSelectImage().
	if (SelectInfo.CharOne == char) {
		SelectInfo.CharOne = null;
		SelectInfo.CharTwo = null;
		SelectInfo.TrackBar.value = 0;
		SelectInfo.TrackBar.disabled = true;	
	}
	else if (SelectInfo.CharOne == null) {
		SelectInfo.CharOne = char;
		SelectInfo.CharTwo = null;
		SelectInfo.TrackBar.value = 0;
		SelectInfo.TrackBar.disabled = true;	
	}
	else if (SelectInfo.CharTwo == char) {
		SelectInfo.CharTwo = null;
		SelectInfo.TrackBar.value = 0;
		SelectInfo.TrackBar.disabled = true;	
	}
	else if (SelectInfo.CharOne != null && SelectInfo.CharTwo != char) {
		SelectInfo.CharTwo = char;
		SelectInfo.TrackBar.value = 0;
		SelectInfo.TrackBar.disabled = false;	
	};
	ShowMatchups();
	TrackBarChange(0); // What if we load the matchup recorded if it exists? as a default position for the trackbar.
	UpdateCharacterSelectImage();
	return;
};

function TrackBarChange(value) { // Updates TrackBarLabel and HelperText
	if (SelectInfo.TrackBar.disabled == false) {
		SelectInfo.TrackBarLabel.innerHTML = value;
		if (value == 0) {
			SelectInfo.HelperText.innerHTML = SelectInfo.CharOne.value.charName + " vs. " + SelectInfo.CharTwo.value.charName + " is an even matchup.";
		}
		else if (value < 0) {
			SelectInfo.HelperText.innerHTML = SelectInfo.CharOne.value.charName + " loses to " + SelectInfo.CharTwo.value.charName + " with a " + value + " disadvantage.";
		}
		else if (value > 0) {
			SelectInfo.HelperText.innerHTML = SelectInfo.CharOne.value.charName + " wins against " + SelectInfo.CharTwo.value.charName + " with a " + value + " advantage.";
		};
	}
	else if (SelectInfo.TrackBar.disabled) {
		SelectInfo.TrackBarLabel.innerHTML = "";
		SelectInfo.HelperText.innerHTML = "";
	};
	return;			 
};

function UpdateCharacterSelectImage() {
	if (SelectInfo.CharOne != null) {
		var newImg = document.createElement("IMG");
		newImg.src = SelectInfo.CharOne.value.portraitString;
		newImg.height = 300;
		var div = $("#CharOneImage");
		div.empty().append(newImg);
	} else {
		$("#CharOneImage").empty();
	};
	if (SelectInfo.CharTwo != null) {
		var newImg = document.createElement("IMG");
		newImg.src = SelectInfo.CharTwo.value.portraitString;
		newImg.height = 300;
		var div = $("#CharTwoImage");
		div.empty().append(newImg);
	} else {
		$("#CharTwoImage").empty();
	};
	return;
};

function GenerateCharacterButtons() { // buttons are of class CharButton. They are referenced in CharacterDict[i].value.button.
	var charContainer = $("#CharContainer");
	for (var char of CharacterDict){
		(function(char) {
			var newBtn = document.createElement("BUTTON");
			newBtn.title = char.value.charName;
			newBtn.className = "CharButton";
			newBtn.addEventListener("click", function(){
					CharButtonClick(char);
					return;
			});
			newBtn.type = "button";

			var img = document.createElement("IMG");
			img.src = char.value.spriteString;
			newBtn.appendChild(img);

			var mLabel = document.createElement("LABEL");
			mLabel.text = "";
			mLabel.className = "MatchupLabel";
			newBtn.appendChild(mLabel);

			char.value.matchupLabel = mLabel;
			char.value.button = newBtn;

			if (char.value.charId < 5) charContainer.children().eq(0).append(newBtn);
			else if (char.value.charId < 9) charContainer.children().eq(1).append(newBtn);
			else charContainer.children().eq(2).append(newBtn); // These three lines are for formatting layout

		})(char);
	};
	return;
};

$(document).ready(function() {
	InitializeCharacterDict();
	GenerateCharacterButtons();
	return;
});