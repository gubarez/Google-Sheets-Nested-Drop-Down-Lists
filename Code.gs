//function depDrop_(range, sourceRange){
//  var rule = SpreadsheetApp.newDataValidation().requireValueInRange(sourceRange, true).build();
//  if(range) {
//    range.setDataValidation(rule);
//  }
//}
//function onEdit (){
//  
//  var aCell = SpreadsheetApp.getActiveSheet().getActiveCell();
//  var aColumn = aCell.getColumn();
//  if (aColumn == 1 && SpreadsheetApp.getActiveSheet()){
//    var range = SpreadsheetApp.getActiveSheet().getRange(aCell.getRow(), aColumn + 1);
//    var sourceRange = SpreadsheetApp.getActiveSpreadsheet().getRangeByName(aCell.getValue());
//    depDrop_(range, sourceRange);
//  }
//  
//  else if (aColumn == 2 && SpreadsheetApp.getActiveSheet()){
//    var range = SpreadsheetApp.getActiveSheet().getRange(aCell.getRow(), aColumn + 1);
//    var sourceRange = SpreadsheetApp.getActiveSpreadsheet().getRangeByName(aCell.getValue());
//    depDrop_(range, sourceRange);
//  }
//  
//}


//function onOpen () {
//  init()
//}

function test() {
  Logger.log('TEST 3@!#!@#!');
}