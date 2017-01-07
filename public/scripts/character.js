function Character(params) {
  this.name           = params['name'];
  this.id             = params['id'];
  this.spriteString   = params['spriteString'];
  this.portraitString = params['portraitString'];
  this.gridPos        = params['gridPos'];
  this.matchupArr     = null;
  this.buttonId       = "btn-"   + params['id'] + "-" + params['name'];
  this.matchupLabelId = "label-" + params['id'] + "-" + params['name'];
  this.shareButtonId  = "share-" + params['id'] + "-" + params['name'];

  this.loadMatchups = function(matchupArr) {
    this.matchupArr = matchupArr;
  }
}
