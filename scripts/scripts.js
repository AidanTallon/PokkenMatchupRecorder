var CharacterDict = []; // Stores all Character objects, with key equal to Character.charId (which is the same as the index of the character name in CharacterNamesArr).

function InitializeCharacterDict() { // Populates CharacterDict with Character objects for each name in CharacterNamesArr.
	for (var char of CharacterNamesArr) {
		var newChar = {
			charName: char,																	// charName comes from CharacterNamesArr
			charId: CharacterNamesArr.indexOf(char),										// charId comes from index of name in CharacterNamesArr. Is very important in determining layout. See PlaceButton() and PlaceShareButton() methods for more info.
			matchupArr: new Array(CharacterNamesArr.length).fill(null),						// matchupArr contains value from -3 to 3 for each character in CharacterNamesArr. Index of value in array relates to charId
			spriteString: "img/sprites/" + char.replace(/ /g,'').toLowerCase() + ".png",		// src location of sprite image png
			portraitString: "img/portraits/" + char.replace(/ /g,'').toLowerCase() + ".png",	// src location of full character image png
			button: null,																	// button holds reference to character button on main select screen. 
			matchupLabel: null, 															// matchupLabel is the label element that displays the matchup value between this character and CharOne when MatchupToggle is true. Is retrieved from CharOne.value.matchupArr[charId] where charId is Id of this char.
			shareButton: null,																// shareButton holds reference to character button on the share screen
			gridPos: CharacterLayoutArr[char.replace(/ /g,'')]
		};
		CharacterDict.push({key:newChar.charId, value:newChar});
	};
};

var CharacterNamesArr = [
			"Darkrai",
			"Blaziken",	// is used to generate Character objects in CharacterDict. CharacterNamesArr can be of any length, but adding/removing characters will mess with the formatting and layout of the page.
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
			"Shadow Mewtwo"
]; // Index corresponds to character ID.

var CharacterLayoutArr = { // value is grid position in CharacterGrid
	Darkrai: "00",
	Blaziken: "01",
	Pikachu: "02",
	Lucario: "03",
	Gardevoir: "04",
	PikachuLibre: "05",
	Sceptile: "11",
	Gengar: "12",
	Machamp: "14",
	Braixen: "15",
	Mewtwo: "20",
	Chandelure: "21",
	Suicune: "22",
	Weavile: "23",
	Charizard: "24",
	Garchomp: "25",
	ShadowMewtwo: "26"
}

var SelectInfo = { 												// Object used for user interactivity. Holds reference to selected buttons and trackbar values etc.
	CharOne: null,												// CharOne holds reference to primary character selected
	CharTwo: null,												// CharTwo holds reference to secondary character selected
	TrackBar: document.getElementById("MatchupTrackBar"), 		// Reference to trackbar for access to Trackbar.value and Trackbar.disabled
	TrackBarLabel: document.getElementById("TrackBarLabel"),	// label used to display matchup result above trackbar
	HelperText: document.getElementById("HelperText"), 			// span used to display text for clarity of what matchup result means
	MatchupToggle: true, 										// Toggles if matchups are shown for CharOne on character select buttons
	ShareChar: null,											// ShareChar is the equivalent of CharOne but for the share screen.
	ClearToggle: false											// When true, activate delete character matchups mode
};

var DocInfo = {
	CharOne: null,			// CharOne.Portrait and CharOne.RemoveButton are here. Portrait is changed to reflect the SelectInfo.CharOne object.
	CharTwo: null,
	Canvas: null,			// The canvas used to generate matchup chart image. The reference is used to create/refresh/hide/delete the canvas as appropriate
	ClearAllButton: null	// Reference here for easy access to the button to clear all matchup information from the session.
}

function InitializeDocInfo() {	//
	DocInfo.CharOne = {
		Portrait: document.getElementById("CharOnePortrait"),
		RemoveButton: document.getElementById("CharOneRemoveButton")
	}
	DocInfo.CharTwo = {
		Portrait: document.getElementById("CharTwoPortrait"),
		RemoveButton: document.getElementById("CharTwoRemoveButton")
	}

	DocInfo.CharOne.Portrait.className = "CharacterPortrait";
	DocInfo.CharOne.Portrait.style.display = "none";
	DocInfo.CharOne.RemoveButton.style.display = "none";
	
	DocInfo.CharOne.RemoveButton.className = "RemoveBtn";
	DocInfo.CharOne.RemoveButton.type = "button";
	DocInfo.CharOne.RemoveButton.innerHTML = "&times;";
	DocInfo.CharOne.RemoveButton.addEventListener("click", function(){
		CharButtonClick(SelectInfo.CharOne);
		return;
	});
	
	DocInfo.CharTwo.Portrait.className = "CharacterPortrait";
	DocInfo.CharTwo.Portrait.style.display = "none";
	DocInfo.CharTwo.RemoveButton.style.display = "none";

	DocInfo.CharTwo.RemoveButton.className = "RemoveBtn";
	DocInfo.CharTwo.RemoveButton.type = "button";
	DocInfo.CharTwo.RemoveButton.innerHTML = "&times;";
	DocInfo.CharTwo.RemoveButton.addEventListener("click", function(){
		CharButtonClick(SelectInfo.CharTwo);
		return;
	});

	DocInfo.ClearAllButton = document.getElementById("ClearAllButton");
}

function GenerateCharacterGrid() {
	var container = document.getElementById("CharContainer");
	for (var i = 0; i < 3; i++) {
		var row = document.createElement("DIV");
		row.className = "row seven-cols";
		for (var j = 0; j < 7; j++) {
			var div = document.createElement("DIV");
			div.className = "col-md-1 col-xs-1 CharDiv";
			div.id = "CharDiv" + i + j;
			row.appendChild(div);
		}
		container.appendChild(row);
	}
}

function GenerateCharacterButtons() { 											// buttons are of class CharButton. They are referenced in CharacterDict[i].value.button. ShareButtons are of class ShareCharButton and are in CharacterDict[i].value.shareButton
	for (var char of CharacterDict){											// goes through all characters and assigns value.button, value.matchupLabel and value.shareButton.
		(function(char) {
			char.value.button = NewCharButton(char);			
			char.value.matchupLabel = char.value.button.getElementsByClassName("MatchupLabel")[0];

			char.value.shareButton = NewShareButton(char);

			PlaceButton(char.value.button, char.value.gridPos);					// function handles layout of CharacterDict.value.button

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

function PlaceButton(button, gridPos) {  					// takes button and charId as argument and places button in HTML #CharContainer based on charId. layout is heavily dependent on charId being the order at which buttons should be in and there being the correct amount of characters
															// if amount of characters changes, this is the function to alter to change the layout
	var div = document.getElementById("CharDiv" + gridPos);
	div.appendChild(button);								// append button to div element
};

function PlaceShareButton(button, charId) { 							// takes button and charId as argument and places button in HTML #ShareCharContainer based on charId. layout is heavily dependent on charId being the order at which buttons should be in and the being the correct amount of characters
																		// if amount of characters changes, this is the function to alter to change the layout
	var shareContainer = $("#ShareCharContainer");

	var div = document.createElement("DIV");
	div.className = "col-md-1 col-xs-1 ShareCharDiv";
	div.appendChild(button);											// append button to div element

	if (charId == 0 || charId == 8) {									// add offset class to 1st element of rows 1 and 2
		div.className = "col-md-1 col-xs-1 col-md-offset-2 col-xs-offset-2 ShareCharDiv";
	}

	if (charId < 8) shareContainer.children().eq(0).append(div);		// add div element to 1st row
	else shareContainer.children().eq(1).append(div);					// add div element to 2nd row
};

function ClearButtonClick(button) {
	if (SelectInfo.ClearToggle) {
		DisableClearMode(button);
	}
	else if (!SelectInfo.ClearToggle) {
		EnableClearMode(button);
	}
};

function EnableClearMode(button) {
	SelectInfo.ClearToggle = true;
	SelectInfo.CharOne = null;
	SelectInfo.CharTwo = null;
	SelectInfo.MatchupToggle = true;
	button.style.background = "#C20000";
	document.getElementById("SelectContainer").style.display = "none";
	document.getElementById("ClearModeContainer").style.display = "block";
	SelectInfo.CharOne = null;
	SelectInfo.CharTwo = null;
	ShowMatchups();
	for (char of CharacterDict) {
		char.value.button.className = "CharButtonClearMode";
		c = char;
		char.value.button.onmouseover = function(c) {
			return function() {
				SelectInfo.CharOne = c;
				ShowMatchups();
			};
		}(c);
		char.value.button.onmouseout = function() {
			SelectInfo.CharOne = null;
			ShowMatchups();
			return;
		};
	}
}


function DisableClearMode(button) {
	SelectInfo.ClearToggle = false;
	SelectInfo.CharOne = null;
	SelectInfo.CharTwo = null;
	UpdateCharacterSelectImage();
	button.style.background = "#333";
	document.getElementById("SelectContainer").style.display = "block";
	document.getElementById("ClearModeContainer").style.display = "none";
	for (char of CharacterDict) {
		char.value.button.className = "CharButton";
		char.value.button.onmouseover = null;
		char.value.button.onmouseout = null;
	}
}

function ClearAllMatchups() { 	// Deletes all records of matchups. Resets most things on page.
	var prompt = window.confirm("Delete all records?");
	if (!prompt) return;
	else {
		SelectInfo.CharOne = null;
		SelectInfo.CharTwo = null;
		ShowMatchups();
		TrackBarDisable();
		UpdateCharacterSelectImage();
		for (var c of CharacterDict) {
			i = CharacterDict.length;
			while (i--) {
				c.value.matchupArr[i] = null;
			}
		}
	}
};

function LoadCharacterDict(evt) {
	if (SelectInfo.CharOne != null) {
		CharButtonClick(SelectInfo.CharOne);
	}
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
				var contents = e.target.result.split();
				if (!CheckJSONContents(contents)) {
					alert("File read error. Data not formatted as expected.");
					return;
				}
				arrIn = JSON.parse(contents);
				for (a of arrIn) {
					for (c of CharacterDict) {
						if (a[0] == c.value.charName) {
							c.value.matchupArr = a[1];
							continue;
						}
					}
				}
			}
			r.readAsText(file);
		}
	} else {
		alert("The File APIs are not fully supported by your browser.");
	};
	SelectInfo.ShareChar = null;
	UpdateShareScreen();
}

function CheckJSONContents(contents) {	// verifies data is as it should be. returns false if not. stops LoadCharacterDict. Does not check character names
	var success = true;	// changes to false on error.
	try {
		arrays = JSON.parse(contents);
	}
	catch(err) {
		console.log(err.message);
		success = false;
	}
	if (arrays.length != CharacterNamesArr.length) {
		console.log("File should contain " + CharacterNamesArr.length + " arrays. " + arrays.length + " found.");
		success = false;
	}
	for (a of arrays) {
		if (a[1].length != CharacterNamesArr.length) {
			console.log("Array wrong length for array " + a[0]);
			console.log("Array should be length " + CharacterNamesArr.length + ". Current length is " + a[1].length + ".");
			success = false;
		}
		if (!a[0] in CharacterNamesArr) {
			console.log("No match found for character of name " + a[0] + ".");
			success = false;
		}
		for (m of a[1]) {
			if (m < -3 || m > 3) {
				console.log(a[0] + " array contains invalid values.");
				success = false;
			}
		}
	}
	return success;
}

function intReplacer(key, value) { // converts strings to ints when applicable in JSON.stringify in ExportCharacterDict()
	if (value == null) {
		return value;
	} else if (!isNaN(value)) {
		return +value;
	} else {
		return value;
	}
}

document.getElementById("FileInput").addEventListener("change", LoadCharacterDict, false);

function ClickSave() {
	var filename = window.prompt("Save file as: ", "PokkenMatchupRecorder.txt");
	ExportCharacterDict(filename);
}

function ExportCharacterDict(filename) {
	if (!filename.endsWith(".txt")) filename = filename.concat(".txt");
	var arrIn = [];
	for (c of CharacterDict) {
		arrIn.push([c.value.charName, c.value.matchupArr]);
	}
	var textIn = JSON.stringify(arrIn, intReplacer);
	var blob = new Blob([textIn], {type: "text/csv"});
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
		i = CharacterDict.length;
		while (i--) {
			char.value.matchupArr[i] = null;
			CharacterDict[i].value.matchupArr[char.key] = null;
			};
		}
	ShowMatchups();
}

function ShowMatchups() {				// First removes all matchup labels, then updates them if SelectInfo.MatchupToggle is true.
	for (var c of CharacterDict) {
		c.value.matchupLabel.innerHTML = "";
	}

	if (SelectInfo.MatchupToggle && SelectInfo.CharOne != null) {
		i = CharacterDict.length;
		while (i--) {

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
			char.value.button.className = "CharButton";
			SelectInfo.CharOne = null;
			SelectInfo.CharTwo = null;
			TrackBarDisable();
		}
		else if (SelectInfo.CharOne == null) {
			SelectInfo.CharOne = char;
			char.value.button.className = "CharButton CharButtonSelected";
			SelectInfo.CharTwo = null;
			TrackBarDisable();	
		}
		else if (SelectInfo.CharTwo == char) {
			SelectInfo.CharTwo = null;
			TrackBarDisable();
		}
		else if (SelectInfo.CharOne != null && SelectInfo.CharTwo != char) {
			SelectInfo.CharTwo = char;
			TrackBarEnable();
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
			SelectInfo.HelperText.innerHTML = SelectInfo.CharOne.value.charName + " wins against " + SelectInfo.CharTwo.value.charName + " with a +" + value + " advantage.";
		};
	}
	else if (SelectInfo.TrackBar.disabled) {
		SelectInfo.TrackBar.value = 0;
		SelectInfo.TrackBarLabel.innerHTML = "";
		SelectInfo.HelperText.innerHTML = "";
	};		 
};

function TrackBarDisable() {
	SelectInfo.TrackBar.value = 0;
	SelectInfo.TrackBar.disabled = true;
	TrackBarChange(0);
	SelectInfo.TrackBar.title = "Select characters first"
}

function TrackBarEnable() {
	SelectInfo.TrackBar.disabled = false;
	SelectInfo.TrackBar.removeAttribute('title');
}

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

function UpdateShareScreen() {
	var canvas = document.getElementById("ShareCanvas");
	var ctx = canvas.getContext("2d");
	canvas.width = canvas.width; // Clears the canvas.
	
	if (SelectInfo.ShareChar == null) return; // No image shown if no ShareChar.
	
	ctx.canvas.width = 1000;
	ctx.canvas.height = 600;
	ctx.fillStyle == "#222"; // UGLY. Try linear gradients.
	ctx.fillRect(0, 0, 1000, 600);
	
	var shareCharImg = document.createElement("IMG");
	shareCharImg.src = SelectInfo.ShareChar.value.portraitString;
	shareCharImg.style.width = "300px";
	shareCharImg.onload = function () {
		ctx.drawImage(shareCharImg, 50, 20, 400, 400);
	}
	
	ctx.font = "30px Arial";
	ctx.fillStyle = "white";
	ctx.textAlign = "center";
	ctx.fillText(SelectInfo.ShareChar.value.charName, 240, 470);
	
	var rowCount = [0, 0, 0, 0, 0]; // rowCount[i] i matches directly to row number, apart from rowCount[4] is for null values
	rowCount[-1] = 0;
	rowCount[-2] = 0;
	rowCount[-3] = 0;
	var i = CharacterDict.length;
	while (i--) {							// get number of characters in row.
		if (i == SelectInfo.ShareChar.value.charId) {
			continue;
		}
		else if (SelectInfo.ShareChar.value.matchupArr[i] == null) {
			rowCount[4]++;
		}
		else {
			rowCount[SelectInfo.ShareChar.value.matchupArr[i]]++;
		}
	}
	var maxRowLength = 8;
	var basexPosition = 450;
	var baseyPosition = 180;
	ctx.font = "20px Arial";
	ctx.textAlign = "center";
	var shift = 0;
	for (var i = 3; i >= -3; i--) {
		ctx.fillText(i, basexPosition, baseyPosition - (100) + (shift * 50));
		if (rowCount[i] > maxRowLength) {
			shift++;
		}
		ctx.moveTo(basexPosition - 8, baseyPosition - (88) + (shift * 50));
		ctx.lineTo(950, baseyPosition - (88) + (shift * 50));
		ctx.strokeStyle = "#FFFFFF"
		ctx.stroke();
		shift++;
	}
	
	i = CharacterDict.length;
	while (i--) { // work rows backwards
		if (i == SelectInfo.ShareChar.value.charId) {
			continue;
		}
		else {
			if (SelectInfo.ShareChar.value.matchupArr[i] == null) {
				var sprImage = document.createElement("IMG");
				sprImage.src = CharacterDict[i].value.spriteString;
				sprImage.style.width = "50px";
				var xPosition = basexPosition + (rowCount[4] * 50);
				var yPosition = 480;
				if (rowCount[4] > maxRowLength) {
					xPosition -= (8 * 50);
					yPosition += 50;
				}
				ctx.drawImage(sprImage, xPosition, yPosition, 50, 50);
				rowCount[4]--;
			}
			else {
				var row = SelectInfo.ShareChar.value.matchupArr[i];
				var sprImage = document.createElement("IMG");
				sprImage.src = CharacterDict[i].value.spriteString;
				sprImage.style.width = "50px";
				var shift_ = 0; // how many overflow rows occur before this one.
				j = row;
				while (j < 3) {
					j++;
					if (rowCount[j] > maxRowLength) {
						shift_++;
					}
				}
				var xPosition = basexPosition + (rowCount[row] * 50);
				var yPosition = baseyPosition + 15 - (50 * row) + (shift_ * 50);
				if (rowCount[row] > maxRowLength) {
					xPosition -= (8 * 50);
					yPosition += 50;
				}
				ctx.drawImage(sprImage, xPosition, yPosition, 50, 50);
				rowCount[row]--;
			}
		}
	}
}

function ShareCharButtonClick(char) {
	SelectInfo.ShareChar = char;
	UpdateShareScreen();
}

function closeAllNavs() {
	closeShareNav();
	closeHelpNav();
	closeSettingsNav();
	closeAboutNav();
}


function clickShareNav() {
	if (document.getElementById("ShareOverlay").style.height == "0%") openShareNav();
	else if (document.getElementById("ShareOverlay").style.height == "100%") closeShareNav();
}

function openShareNav() {
	closeAllNavs();
	document.getElementById("ShareOverlay").style.height = "100%";
}

function closeShareNav() {
	SelectInfo.ShareChar = null;
	UpdateShareScreen();
	document.getElementById("ShareOverlay").style.height = "0%";
}

function clickHelpNav() {
	if (document.getElementById("HelpOverlay").style.height == "0%") openHelpNav();
	else if (document.getElementById("HelpOverlay").style.height == "100%") closeHelpNav();
}

function openHelpNav() {
	closeAllNavs();
	document.getElementById("HelpOverlay").style.height = "100%";
}

function closeHelpNav() {
	document.getElementById("HelpOverlay").style.height = "0%";
}

function clickSettingsNav() {
	if (document.getElementById("SettingsOverlay").style.height == "0%") openSettingsNav();
	else if (document.getElementById("SettingsOverlay").style.height == "100%") closeSettingsNav();
}

function openSettingsNav() {
	closeAllNavs();
	document.getElementById("SettingsOverlay").style.height = "100%";
}

function closeSettingsNav() {
	document.getElementById("SettingsOverlay").style.height = "0%";
}

function clickAboutNav() {
	if (document.getElementById("AboutOverlay").style.height == "0%") openAboutNav();
	else if (document.getElementById("AboutOverlay").style.height == "100%") closeAboutNav();
}

function openAboutNav() {
	closeAllNavs();
	document.getElementById("AboutOverlay").style.height = "100%";
}

function closeAboutNav() {
	document.getElementById("AboutOverlay").style.height = "0%";
}

$(document).ready(function() {
	InitializeCharacterDict();
	InitializeDocInfo();
	GenerateCharacterGrid();
	GenerateCharacterButtons();
	document.getElementById("ShareOverlay").style.height = "0%";
	document.getElementById("HelpOverlay").style.height = "0%";
	document.getElementById("SettingsOverlay").style.height = "0%";
	document.getElementById("AboutOverlay").style.height = "0%";
	SelectInfo.TrackBar.value = 0;
});
