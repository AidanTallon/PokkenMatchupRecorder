var CharacterDict = []; // Stores all Character objects, with key equal to Character.charId (which is the same as the index of the character name in CharacterNamesArr).

var SelectInfo = { // CharOne and CharTwo hold reference to characters currently selected.
	CharOne:null,
	CharTwo:null,
	TrackBar:document.getElementById("MatchupTrackBar"), // Reference to trackbar for value and disabled
	TrackBarLabel:document.getElementById("TrackBarLabel"), // label used to display matchup result
	HelperText:document.getElementById("HelperText"), // span used to display text for clarity of what matchup result means
	MatchupToggle:true, // Toggles if matchups are shown for charOne
	ShareChar:null
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
			matchupLabel:null, // matchupLabel is the label element that displays the matchup value between this character and charOne when MatchupToggle is true
			shareButton:null
		};
		CharacterDict.push({key:newChar.charId, value:newChar});
	};
	return;
};

function ClearAllMatchups() { // Resets pretty much everything on page.
	SelectInfo.CharOne = null;
	SelectInfo.CharTwo = null;
	ShowMatchups();
	UpdateCharacterSelectImage();
	for (var i = 0; i < CharacterDict.length; i++) {
		for (var j = 0; j < CharacterDict.length; j++) {
			CharacterDict[i].value.matchupArr[j] = null;
		}
	};
	return;
}

function LoadCharacterDict(evt) {
	SelectInfo.CharOne = null;
	SelectInfo.CharTwo = null;
	ShowMatchups();
	if (window.File && window.FileReader && window.FileList && window.Blob) {
		var file = evt.target.files[0];

		if (!file) {
			alert("Failed to load file");
		} else if (!file.type.match("text.*")) {
			alert(file.name + " is not a valid text file.");
		} else {
			var r = new FileReader();
			r.onload = function(e) {
				var contents = e.target.result;
				var m = contents.split(",");
				for (var i = 0; i < CharacterNamesArr.length; i++) {
					for (var j = 0; j < CharacterNamesArr.length; j++) {
						CharacterDict[i].value.matchupArr[j] = m[(i*16)+j];
					}
				}
			}
			r.readAsText(file);
		}
	} else {
		alert("The File APIs are not fully supported by your browser.");
	};
};

document.getElementById("FileInput").addEventListener("change", LoadCharacterDict, false);

function ExportCharacterDict() { // writes matchup data to text file in order of charId, then saves file on client computer.
	var textIn = "";
	for (var i = 0; i < CharacterNamesArr.length; i++) {
		textIn = textIn.concat((CharacterDict[i].value.matchupArr.join() + ","));
	};
	var link = document.createElement("a");
	link.setAttribute("href", "data:text/plain;charset=utf-8,"  + encodeURIComponent(textIn));
	link.setAttribute("download", "PokkenMatchup");
	
	document.body.appendChild(link);

	link.click();

	document.body.removeChild(link);
};

function RecordMatchup() {
	SelectInfo.CharOne.value.matchupArr[SelectInfo.CharTwo.key] = SelectInfo.TrackBar.value;
	SelectInfo.CharTwo.value.matchupArr[SelectInfo.CharOne.key] = 0 - SelectInfo.TrackBar.value;
	ShowMatchups();
	return;
};

function DeleteSpecificMatchup() { // This method and DeleteCharactersMatchups() will replace DeleteMatchup()
	if (SelectInfo.CharOne == null || SelectInfo.CharTwo == null) window.alert("Please select characters first.");
	else {
		var prompt = window.confirm("Delete record for this matchup?");
		if (prompt == true) {
			SelectInfo.CharOne.value.matchupArr[SelectInfo.CharTwo.key] = null;
			SelectInfo.CharTwo.value.matchupArr[SelectInfo.CharOne.key] = null;
		};
	};
	ShowMatchups();
	return;
}

function DeleteCharactersMatchups() {
	if (SelectInfo.CharOne == null) window.alert("Please select character first.");
	else {
		var prompt = window.confirm("Delete all records for this character?");
		if (prompt == true) {
			for (var i = 0; i < CharacterDict.length; i++) {
				SelectInfo.CharOne.value.matchupArr[i] = null;
				CharacterDict[i].value.matchupArr[SelectInfo.CharOne.key] = null;
			};
		}
	}
	ShowMatchups();
	return;
}

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
			if (SelectInfo.CharOne.value.matchupArr[i] < 0) CharacterDict[i].value.matchupLabel.style.color = "#C20000";
			else if (SelectInfo.CharOne.value.matchupArr[i] > 0) CharacterDict[i].value.matchupLabel.style.color = "#1BAD02";
			else if (SelectInfo.CharOne.value.matchupArr[i] == 0) CharacterDict[i].value.matchupLabel.style.color = "white";
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
	ShowMatchups();
	return;
};

function CharButtonClick(char) { // assigns characters to SelectInfo.CharOne and CharTwo. Also enables and disables MatchupTrackBar. Calls UpdateCharacterSelectImage().
	if (SelectInfo.CharOne == char) {
		SelectInfo.CharOne = null;
		SelectInfo.CharTwo = null;
		SelectInfo.TrackBar.value = 0;
		SelectInfo.TrackBar.disabled = true;
		TrackBarChange(0);	
	}
	else if (SelectInfo.CharOne == null) {
		SelectInfo.CharOne = char;
		SelectInfo.CharTwo = null;
		SelectInfo.TrackBar.value = 0;
		SelectInfo.TrackBar.disabled = true;
		TrackBarChange(0);	
	}
	else if (SelectInfo.CharTwo == char) {
		SelectInfo.CharTwo = null;
		SelectInfo.TrackBar.value = 0;
		SelectInfo.TrackBar.disabled = true;
		TrackBarChange(0);	
	}
	else if (SelectInfo.CharOne != null && SelectInfo.CharTwo != char) {
		SelectInfo.CharTwo = char;
		SelectInfo.TrackBar.value = 0;
		SelectInfo.TrackBar.disabled = false;	
		if (SelectInfo.CharOne.value.matchupArr[SelectInfo.CharTwo.key] != null) {
			SelectInfo.TrackBar.value = SelectInfo.CharOne.value.matchupArr[SelectInfo.CharTwo.key];
			TrackBarChange(SelectInfo.CharOne.value.matchupArr[SelectInfo.CharTwo.key]); // Default value of trackbar is the stored matchup if it exists
		}
		else TrackBarChange(0);
	};
	ShowMatchups();
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

function GenerateCharacterButtons() { // buttons are of class CharButton. They are referenced in CharacterDict[i].value.button. ShareButtons are of class ShareCharButton and are in CharacterDict[i].value.shareButton
	var charContainer = $("#CharContainer");
	var shareContainer = $("#ShareCharContainer");
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

			var shareBtn = document.createElement("BUTTON");
			shareBtn.title = char.value.charName;
			shareBtn.className = "ShareCharButton";
			shareBtn.addEventListener("click", function(){
					ShareCharButtonClick(char);
					return;
			});
			shareBtn.type = "button";

			var img = document.createElement("IMG");
			img.src = char.value.spriteString;
			img.style.width = "100%";
			img.style.height = "100%";
			newBtn.appendChild(img);

			var shareImg = document.createElement("IMG");
			shareImg.src = char.value.spriteString;
			shareImg.style.width = "100%";
			shareImg.style.height = "100%";
			shareBtn.appendChild(shareImg);

			var mLabel = document.createElement("LABEL");
			mLabel.text = "";
			mLabel.className = "MatchupLabel";
			newBtn.appendChild(mLabel);

			char.value.matchupLabel = mLabel;
			char.value.button = newBtn;
			char.value.shareButton = shareBtn;

			var div = document.createElement("DIV");
			div.className = "col-md-1 CharDiv";
			div.appendChild(newBtn);

			if (char.value.charId == 0 || char.value.charId == 5) {
				div.className = "col-md-1 col-md-offset-1 CharDiv"
			}
			else if (char.value.charId == 7) {
				var midDiv = document.createElement("DIV");
				midDiv.className = "col-md-1 midDiv";
				charContainer.children().eq(1).append(midDiv);
			}; // these statements format the spaces at beginning/middle of rows

			if (char.value.charId < 5) charContainer.children().eq(0).append(div);
			else if (char.value.charId < 9) charContainer.children().eq(1).append(div);
			else charContainer.children().eq(2).append(div); // These lines are for formatting layout of CharButtons

			var shareDiv = document.createElement("DIV");
			shareDiv.className = "col-md-1 ShareCharDiv";
			shareDiv.appendChild(shareBtn);
			
			if (char.value.charId == 0 || char.value.charId == 8) {
				shareDiv.className = "col-md-1 col-md-offset-2 ShareCharDiv";
			}
			
			if (char.value.charId < 8) shareContainer.children().eq(0).append(shareDiv);
			else shareContainer.children().eq(1).append(shareDiv);
		})(char);
	};
	return;
};

function ShareCharButtonClick(char) {
	SelectInfo.ShareChar = char;
	UpdateShareScreen();
}

function UpdateShareScreen() {
	var shareScreen = $("#ShareScreen");
	var shareTiers = $("#ShareTiers");
	var nullTier = $("#NullTier");
	var shareImg = $("#ShareCharImg");
	var charLabel = $("#ShareCharLabel");

	nullTier.empty();
	shareImg.empty();
	charLabel.empty();
	for (var i = 0; i < 7; i++) {
		shareTiers.children().eq(i).children(".ShareTierContent").empty();
	}

	if (SelectInfo.ShareChar == null) return;
	else {

		var img = document.createElement("IMG");
		img.src = SelectInfo.ShareChar.value.portraitString;
		img.style.width = "100%";
		img.style.height = "100%";

		shareImg.empty().append(img);

		charLabel.html(SelectInfo.ShareChar.value.charName);

		for (var char of CharacterDict) {
			if (char.key == SelectInfo.ShareChar.key) continue;

			var div = document.createElement("DIV");
			div.className = "col-md-1 ShareCharTile";

			var sprImg = document.createElement("IMG");
			sprImg.src = char.value.spriteString;
			sprImg.title = char.value.charName;
			div.appendChild(sprImg);

			var x = SelectInfo.ShareChar.value.matchupArr[char.key]

			if (x == null) nullTier.append(div);
			else if (x == 3) shareTiers.children().eq(0).children(".ShareTierContent").append(div); 
			else if (x == 2) shareTiers.children().eq(1).children(".ShareTierContent").append(div);
			else if (x == 1) shareTiers.children().eq(2).children(".ShareTierContent").append(div);
			else if (x == 0) shareTiers.children().eq(3).children(".ShareTierContent").append(div);
			else if (x == -1) shareTiers.children().eq(4).children(".ShareTierContent").append(div);
			else if (x == -2) shareTiers.children().eq(5).children(".ShareTierContent").append(div);
			else if (x == -3) shareTiers.children().eq(6).children(".ShareTierContent").append(div);
		}
	}

	return;
}



function openShareNav() {
	document.getElementById("HelpOverlay").style.height = "0%";
	document.getElementById("ShareOverlay").style.height = "100%";
}

function closeShareNav() {
	SelectInfo.ShareChar = null;
	UpdateShareScreen();
	document.getElementById("ShareOverlay").style.height = "0%";
}

function openHelpNav() {
	document.getElementById("ShareOverlay").style.height = "0%";
	document.getElementById("HelpOverlay").style.height = "100%";
}

function closeHelpNav() {
	document.getElementById("HelpOverlay").style.height = "0%";
}

$(document).ready(function() {
	InitializeCharacterDict();
	GenerateCharacterButtons();
	return;
});