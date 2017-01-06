function Character(params) {
  // how to handle new matchupArr?
  this.name = params['name'];
  this.id = params['id'];
  this.matchupArr = null;
  this.spriteString = params['spriteString'];
  this.portraitString = params['portraitString'];
  this.button = null;
  this.matchupLabel = null;
  this.shareButton = null;
  this.gridPos = params['gridPos'];

  this.loadMatchups(matchupArr = null) {

  }
}
