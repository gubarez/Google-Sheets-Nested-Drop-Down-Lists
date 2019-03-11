//function testNamedRange() {
//  var ss = SpreadsheetApp.openById('here is the spreadsheet id');
//  var range = ss.getRange('Sheet1!A1:B2');
//  ss.setNamedRange('TestRange', range);
//  var rangeCheck = ss.getRangeByName('TestRange');
//  var rangeCheckName = rangeCheck.getA1Notation();
//}



var C_SOURCE_TRIGGER = 'SPREADSHEETS';

function init () {
  Logger.log('init start')
  var activeSpreadsheet = SpreadsheetApp.getActive();
  var settingsSheet = activeSpreadsheet.getSheetByName('_DropDowns_Config_')
  if(!settingsSheet) {
      settingsSheet = activeSpreadsheet.insertSheet()
      settingsSheet.setName('_DropDowns_Config_')
  }
  
  var values = settingsSheet.getDataRange().getValues()
  Logger.log('init')
  var settings = []
  if(values.length > 1) {
    for (var i = 1; i < values.length; i++) {
      
      //no source or target, so skip
      //if(!activeSpreadsheet.getSheetByName(values[i][0]) || !activeSpreadsheet.getSheetByName(values[i][1])) continue;
      
      settings.push({
        source: values[i][0],
        target: values[i][1],
        column: values[i][2] || 1,
        row: values[i][3] || 1
      })
    }
  }
  Logger.log(settings)
  Logger.log('after')
   
  for (var i in settings) {
    var setting = settings[i]
    
    var sourceSheet = activeSpreadsheet.getSheetByName(setting.source)
    var sourceRange = sourceSheet.getDataRange()
    if(sourceSheet) { 
      var sourceValues = sourceSheet.getDataRange().getValues()
      setting.ranges = {}
      sourceValues[0].forEach(function(name, idx) {
        Logger.log(name)
        setting.ranges[name] = []
        for ( var j = 1; j < sourceValues.length; j++) {
          if(sourceValues[j][idx]) {
            setting.ranges[name].push(sourceValues[j][idx])
          }
        }
      })
    }
        
    var targetSheet = activeSpreadsheet.getSheetByName(setting.target)
    if(targetSheet && setting.ranges) {
      var range = targetSheet.getRange(setting.row, setting.column, targetSheet.getMaxRows())
      var rule = SpreadsheetApp.newDataValidation().requireValueInList(Object.keys(setting.ranges)).build()
      range.setDataValidation(rule)
    }
  }
  Logger.log(settings.length)
  setJsonProperty('settings', settings)
  
  if(checkTriggerExists('edit', C_SOURCE_TRIGGER)) return
  ScriptApp.newTrigger('edit')
    .forSpreadsheet(SpreadsheetApp.getActive())
    .onEdit()
    .create()  
}


function edit(e) {
  Logger.log('Edit on')
  if(!e || !e.range) return;
  
  var range = e.range;  
  var startColId = range.getColumn();
  var startRowId = range.getRow();
  var sheetName = e.source.getActiveSheet().getName();
  var settings = getJsonProperty('settings') || [];
  
  var values = range.getValues();
  Logger.log(values);
  values.forEach(function (row, rowId) {
    row.forEach(function (col, colId) {
      var value = values[rowId][colId]
      Logger.log(colId + ',' + rowId + ','+value)
      
      for(var key in settings) {
        var setting = settings[key]
        if(setting.target == sheetName && startColId + colId == setting.column && startRowId + rowId >= setting.row) {
          var targetCell = e.source.getActiveSheet().getRange(startRowId + rowId, startColId + colId + 1)
          if(value && setting.ranges[value]) {
            var rule = SpreadsheetApp.newDataValidation().requireValueInList(setting.ranges[value]).build()
            targetCell.setDataValidation(rule)
          } else {
            targetCell.setDataValidation(null)
          }
          Logger.log('FIN')
          break;
        }
      }
    });
  });
  
  
}


function checkTriggerExists(nameFunction, triggerSourceType)
{
  var triggers = ScriptApp.getProjectTriggers();
  var trigger = {};

  
  for (var i = 0; i < triggers.length; i++) {
   trigger = triggers[i];
   if (trigger.getHandlerFunction() == nameFunction && trigger.getTriggerSource() == triggerSourceType) return true;
  }
  Logger.log(trigger)
  
  return false; 

}


function onInit() {
  init()
}

function onEdit(e) {
  edit(e)
}
