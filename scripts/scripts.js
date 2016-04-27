var CharacterDict = []; // Stores all Character objects, with key equal to Character.charId (which is the same as the index of the character name in CharacterNamesArr).

function InitializeCharacterDict() { // Populates CharacterDict with Character objects for each name in CharacterNamesArr.
	for (var char of CharacterNamesArr) {
		var newChar = {
			charName:char,									// charName comes from CharacterNamesArr
			charId:CharacterNamesArr.indexOf(char),						// charId comes from index of name in CharacterNamesArr. Is very important in determining layout. See PlaceButton() and PlaceShareButton() methods for more info.
			matchupArr: new Array(CharacterNamesArr.length).fill(null),			// matchupArr contains value from -3 to 3 for each character in CharacterNamesArr. Index of value in array relates to charId
			spriteString:"img/sprites/" + CharacterNamesArr.indexOf(char) + ".png",		// src location of sprite image png
			portraitString:"img/portraits/" + CharacterNamesArr.indexOf(char) + ".png",	// src location of full character image png
			button:null,									// button holds reference to character button on main select screen. 
			matchupLabel:null, 								// matchupLabel is the label element that displays the matchup value between this character and CharOne when MatchupToggle is true. Is retrieved from CharOne.value.matchupArr[charId] where charId is Id of this char.
			shareButton:null								// shareButton holds reference to character button on the share screen
		};
		CharacterDict.push({key:newChar.charId, value:newChar});
	};
};

var CharacterNamesArr = ["Blaziken",	// is used to generate Character objects in CharacterDict. CharacterNamesArr can be of any length, but adding/removing characters will mess with the formatting and layout of the page.
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

var SelectInfo = { 						// Object used for user interactivity. Holds reference to selected buttons and trackbar values etc.
	CharOne:null,						// CharOne holds reference to primary character selected
	CharTwo:null,						// CharTwo holds reference to secondary character selected
	TrackBar:document.getElementById("MatchupTrackBar"), 	// Reference to trackbar for access to Trackbar.value and Trackbar.disabled
	TrackBarLabel:document.getElementById("TrackBarLabel"), // label used to display matchup result above trackbar
	HelperText:document.getElementById("HelperText"), 	// span used to display text for clarity of what matchup result means
	MatchupToggle:true, 					// Toggles if matchups are shown for CharOne on character select buttons
	ShareChar:null,						// ShareChar is the equivalent of CharOne but for the share screen.
	ClearToggle:false					// When true, activate delete character matchups mode
};

var DocInfo = {
	CharOne:null,
	CharTwo:null,
	Canvas:null,
	ClearAllButton:null
}

function InitializeDocInfo() {
	var newCharInfo = {
		Portrait:null,
		RemoveButton:null,
	}
	var anotherNewCharInfo = {
		Portrait:null,
		RemoveButton:null,
	}
	DocInfo.CharOne = newCharInfo;
	DocInfo.CharTwo = anotherNewCharInfo;

	DocInfo.CharOne.Portrait = document.getElementById("CharOnePortrait");
	DocInfo.CharOne.Portrait.className = "CharacterPortrait";
	DocInfo.CharTwo.Portrait = document.getElementById("CharTwoPortrait");
	DocInfo.CharTwo.Portrait.className = "CharacterPortrait";

	DocInfo.CharOne.RemoveButton = document.getElementById("CharOneRemoveButton");
	DocInfo.CharOne.RemoveButton.className = "RemoveBtn";
	DocInfo.CharOne.RemoveButton.type = "button";
	DocInfo.CharOne.RemoveButton.innerHTML = "&times;";
	DocInfo.CharOne.RemoveButton.addEventListener("click", function(){
		CharButtonClick(SelectInfo.CharOne);
		return;
	});

	DocInfo.CharTwo.RemoveButton = document.getElementById("CharTwoRemoveButton");
	DocInfo.CharTwo.RemoveButton.className = "RemoveBtn";
	DocInfo.CharTwo.RemoveButton.type = "button";
	DocInfo.CharTwo.RemoveButton.innerHTML = "&times;";
	DocInfo.CharTwo.RemoveButton.addEventListener("click", function(){
		CharButtonClick(SelectInfo.CharTwo);
		return;
	});

	DocInfo.CharOne.Portrait.style.display = "none";
	DocInfo.CharTwo.Portrait.style.display = "none";
	DocInfo.CharOne.RemoveButton.style.display = "none";
	DocInfo.CharTwo.RemoveButton.style.display = "none";

	DocInfo.ClearAllButton = document.getElementById("ClearAllButton");
	DocInfo.ClearAllButton.style.display = "none";
}

function GenerateCharacterButtons() { // buttons are of class CharButton. They are referenced in CharacterDict[i].value.button. ShareButtons are of class ShareCharButton and are in CharacterDict[i].value.shareButton
	for (var char of CharacterDict){					// goes through all characters and assigns value.button, value.matchupLabel and value.shareButton.
		(function(char) {
			char.value.button = NewCharButton(char);			
			char.value.matchupLabel = char.value.button.getElementsByClassName("MatchupLabel")[0];

			char.value.shareButton = NewShareButton(char);

			PlaceButton(char.value.button, char.value.charId);			// function handles layout of CharacterDict.value.button

			PlaceShareButton(char.value.shareButton, char.value.charId);		// function handles layout of CharacterDict.value.shareButton

		})(char);
	};
};

function NewCharButton(char) { // takes character object as argument and returns a new character button with class CharButton
	var newBtn = document.createElement("BUTTON");
	newBtn.title = char.value.charName;
	newBtn.className = "CharButton";
	newBtn.addEventListener("click", function() {
		CharButtonClick(char)
		return;
	});
	newBtn.type = "button";

	var img = document.createElement("IMG");
	img.src = char.value.spriteString;
	img.style.width = "100%";
	img.style.height = "100%";
	newBtn.appendChild(img);

	var mLabel =  document.createElement("LABEL");
	mLabel.text = "";
	mLabel.className = "MatchupLabel";
	newBtn.appendChild(mLabel);

	return newBtn;
};

function NewShareButton(char) { // takes character object as argument and returns a new share button with class ShareCharButton
	var shareBtn = document.createElement("BUTTON");
	shareBtn.title = char.value.charName;
	shareBtn.className = "ShareCharButton";
	shareBtn.addEventListener("click", function() {
				ShareCharButtonClick(char);
				return;
	});
	shareBtn.type = "button";

	var shareImg = document.createElement("IMG");
	shareImg.src = char.value.spriteString;
	shareImg.style.width = "100%";
	shareImg.style.height = "100%";
	shareBtn.appendChild(shareImg);

	return shareBtn;
};

function PlaceButton(button, charId) {  // takes button and charId as argument and places button in HTML #CharContainer based on charId. layout is heavily dependent on charId being the order at which buttons should be in and there being the correct amount of characters
					// if amount of characters changes, this is the function to alter to change the layout
	var div = document.getElementById("CharDiv" + charId);
	div.appendChild(button);						// append button to div element
};

function PlaceShareButton(button, charId) { // takes button and charId as argument and places button in HTML #ShareCharContainer based on charId. layout is heavily dependent on charId being the order at which buttons should be in and the being the correct amount of characters
				    	    // if amount of characters changes, this is the function to alter to change the layout
	var shareContainer = $("#ShareCharContainer");

	var div = document.createElement("DIV");
	div.className = "col-md-1 col-xs-1 ShareCharDiv";
	div.appendChild(button);						// append button to div element

	if (charId == 0 || charId == 8) {					// add offset class to 1st element of rows 1 and 2
		div.className = "col-md-1 col-xs-1 col-md-offset-2 col-xs-offset-2 ShareCharDiv";
	}

	if (charId < 8) shareContainer.children().eq(0).append(div);		// add div element to 1st row
	else shareContainer.children().eq(1).append(div);			// add div element to 2nd row
};

function ClearButtonClick(button) {
	if (SelectInfo.ClearToggle) {
		DisableClearMode(button);
		SelectInfo.ClearToggle = false;
		button.style.background = "#333";
	}
	else if (!SelectInfo.ClearToggle) {
		EnableClearMode(button);
		SelectInfo.ClearToggle = true;
		button.style.background = "#C20000";
	}
};

function EnableClearMode(button) {
	SelectInfo.ClearToggle = true;
	button.style.background = "#C20000";
	for (char of CharacterDict) {
		char.value.button.className = "CharButtonClearMode";
	}
	DocInfo.ClearAllButton.style.display = "block";
}

function DisableClearMode(button) {
	SelectInfo.ClearToggle = false;
	button.style.backgronud = "#333";
	for (char of CharacterDict) {
		char.value.button.className = "CharButton";
	}
	DocInfo.ClearAllButton.style.display = "none";
}

function ClearAllMatchups() { 	// Deletes all records of matchups. Resets most things on page.
	var prompt = window.confirm("Delete all records?");
	if (!prompt) return;
	else {
		SelectInfo.CharOne = null;
		SelectInfo.CharTwo = null;
		ShowMatchups();
		SelectInfo.TrackBar.disabled = true;
		TrackBarChange(0);
		UpdateCharacterSelectImage();
		for (var c of CharacterDict) {
			for (var i = 0; i < CharacterDict.length; i++) {
				c.value.matchupArr[i] = null;
			}
		}
	}
};

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
	var blob = new Blob([textIn], {type: "text/csv"});
	var filename = "PokkenMatchupRecorder.txt";
	if (window.navigator.msSaveOrOpenBlob) {
		window.navigator.msSaveBlob(blob, filename);
	}
	else {
		var elem = window.document.createElement("a");
		elem.href = window.URL.createObjectURL(blob);
		elem.download = filename;
		document.body.appendChild(elem);
		elem.click();
		document.body.removeChild(elem);
	}
};

function RecordMatchup() {
	SelectInfo.CharOne.value.matchupArr[SelectInfo.CharTwo.key] = SelectInfo.TrackBar.value;
	SelectInfo.CharTwo.value.matchupArr[SelectInfo.CharOne.key] = 0 - SelectInfo.TrackBar.value;
	ShowMatchups();
};

function DeleteSpecificMatchup() { // Delete specific matchup between CharOne and CharTwo
	if (SelectInfo.CharOne == null || SelectInfo.CharTwo == null) window.alert("Please select characters first.");
	else {
		var prompt = window.confirm("Delete record for this matchup?");
		if (prompt == true) {
			SelectInfo.CharOne.value.matchupArr[SelectInfo.CharTwo.key] = null;
			SelectInfo.CharTwo.value.matchupArr[SelectInfo.CharOne.key] = null;
		};
	};
	ShowMatchups();
}

function DeleteCharactersMatchups(char) { // Delete all of CharOnes matchups
	var prompt = window.confirm("Delete all records for this character?");
	if (prompt == true) {
		for (var i = 0; i < CharacterDict.length; i++) {
			char.value.matchupArr[i] = null;
			CharacterDict[i].value.matchupArr[char.key] = null;
			};
		}
	ShowMatchups();
}

function ShowMatchups() {
	for (var c of CharacterDict) {
		c.value.matchupLabel.innerHTML = "";
	}

	if (SelectInfo.MatchupToggle && SelectInfo.CharOne != null) {
		for (var i = 0; i < CharacterDict.length; i++) {

			if (SelectInfo.CharOne.value.matchupArr[i] != null) {

				CharacterDict[i].value.matchupLabel.innerHTML = SelectInfo.CharOne.value.matchupArr[i];

				if (SelectInfo.CharOne.value.matchupArr[i] < 0) CharacterDict[i].value.matchupLabel.style.color = "#C20000";
				else if (SelectInfo.CharOne.value.matchupArr[i] == 0) CharacterDict[i].value.matchupLabel.style.color = "white";
				else if (SelectInfo.CharOne.value.matchupArr[i] > 0) CharacterDict[i].value.matchupLabel.style.color = "#1BAD02";
			}
		};
	};
};

function ClickMatchupToggle() { // Switches value of MatchupToggle.Show and changes text in MatchupToggleButton.
	if (!SelectInfo.MatchupToggle) {
		SelectInfo.MatchupToggle = true;
		document.getElementById("MatchupToggleButton").innerHTML = "Hide Matchups";
	}
	else {
		SelectInfo.MatchupToggle = false;
		document.getElementById("MatchupToggleButton").innerHTML = "Show Matchups";
	};
	ShowMatchups();
};

function CharButtonClick(char) { // assigns characters to SelectInfo.CharOne and CharTwo. Also enables and disables MatchupTrackBar. Calls UpdateCharacterSelectImage().
	if (SelectInfo.ClearToggle) DeleteCharactersMatchups(char);
	else {
		if (SelectInfo.CharOne == char) {
			SelectInfo.CharOne = null;
			SelectInfo.CharTwo = null;
			SelectInfo.TrackBar.disabled = true;
			TrackBarChange(0);	
		}
		else if (SelectInfo.CharOne == null) {
			SelectInfo.CharOne = char;
			SelectInfo.CharTwo = null;
			SelectInfo.TrackBar.disabled = true;
			TrackBarChange(0);	
		}
		else if (SelectInfo.CharTwo == char) {
			SelectInfo.CharTwo = null;
			SelectInfo.TrackBar.disabled = true;
			TrackBarChange(0);	
		}
		else if (SelectInfo.CharOne != null && SelectInfo.CharTwo != char) {
			SelectInfo.CharTwo = char;
			SelectInfo.TrackBar.disabled = false;	
			if (SelectInfo.CharOne.value.matchupArr[SelectInfo.CharTwo.key] != null) {
				SelectInfo.TrackBar.value = SelectInfo.CharOne.value.matchupArr[SelectInfo.CharTwo.key];
				TrackBarChange(SelectInfo.CharOne.value.matchupArr[SelectInfo.CharTwo.key]); // Default value of trackbar is the stored matchup if it exists
			}
			else TrackBarChange(0);
		}
	};
	ShowMatchups();
	UpdateCharacterSelectImage();
};

function TrackBarChange(value) { // Updates TrackBarLabel and HelperText
	if (!SelectInfo.TrackBar.disabled) {
		SelectInfo.TrackBar.value = value;
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
		SelectInfo.TrackBar.value = 0;
		SelectInfo.TrackBarLabel.innerHTML = "";
		SelectInfo.HelperText.innerHTML = "";
	};		 
};

function UpdateCharacterSelectImage() {
	if (SelectInfo.CharOne != null) {
		DocInfo.CharOne.Portrait.src = SelectInfo.CharOne.value.portraitString;
		DocInfo.CharOne.Portrait.style.display = "block";

		DocInfo.CharOne.RemoveButton.style.display = "block";
	} else {
		DocInfo.CharOne.Portrait.style.display = "none";

		DocInfo.CharOne.RemoveButton.style.display = "none";
	};
	if (SelectInfo.CharTwo != null) {
		DocInfo.CharTwo.Portrait.src = SelectInfo.CharTwo.value.portraitString;
		DocInfo.CharTwo.Portrait.style.display = "block";

		DocInfo.CharTwo.RemoveButton.style.display = "block";
	} else {
		DocInfo.CharTwo.Portrait.style.display = "none";

		DocInfo.CharTwo.RemoveButton.style.display = "none";
	};
};

function UpdateShareScreen() { // Will replace the html generated on the Share overlay.

	var canvas = document.getElementById("ShareCanvas");
	var ctx = canvas.getContext("2d");
	canvas.width = canvas.width; // clears canvas

	if (SelectInfo.ShareChar == null) return;

	ctx.canvas.width = 800;
	ctx.canvas.height = 500;
	ctx.fillStyle = "#222";
	ctx.fillRect(0, 0, 800, 500);

	var mainImg = document.createElement("IMG");
	mainImg.src = SelectInfo.ShareChar.value.portraitString;
	mainImg.style.width = "300px";
	mainImg.onload = function() {
		ctx.drawImage(mainImg, 50, 50, 300, 300);
	}

	ctx.font = "30px Arial";
	ctx.fillStyle = "white";
	ctx.textAlign = "center";
	ctx.fillText(SelectInfo.ShareChar.value.charName, 200, 400);

	var refPoint = 0; // this is the y position of the last image placed in a row. used to calculate where the next row should start.
	for (var i = 3; i > -4; i--) {
		refPoint += 50;
		var valueLabel = "";
		if (i > 0) valueLabel = "+" + i;
		else valueLabel = i;
		ctx.font = "20px Arial";
		ctx.textAlign = "center";
		ctx.fillText(valueLabel, 400, refPoint + 35);
		count = 0;
		xCoord = 450;
		for (c of SelectInfo.ShareChar.value.matchupArr) {
			if (c == "") {
				count++;
				continue;
			}
			else if (c == i) {
				if (xCoord != 800) {
					var sprImage = document.createElement("IMG");
					sprImage.src = CharacterDict[count].value.spriteString;
					sprImage.style.width = "50px";
					ctx.drawImage(sprImage, xCoord, refPoint, 50, 50);
					xCoord += 50;
				}
				else {
					xCoord = 450;
					refPoint += 50;
					var SprImage = document.createElement("IMG");
					sprImage.src = CharacterDict[count].value.spriteString;
					sprImage.style.width = "50px";
					ctx.drawImage(sprImage, xCoord, refPoint, 50, 50);
					xCoord += 50;
				}
			}
			count++;
		}
		ctx.moveTo(400, refPoint + 50);
		ctx.lineTo(800, refPoint + 50);
		ctx.stroke();
	}
}

function ShareCharButtonClick(char) {
	SelectInfo.ShareChar = char;
	UpdateShareScreen();
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
	InitializeDocInfo();
	GenerateCharacterButtons();
});