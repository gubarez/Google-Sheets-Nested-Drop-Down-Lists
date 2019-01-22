var NUM_MAX_BITE_SIZEOFPROPERTY = 9000;
var NUM_MAX_BITE_SIZEOFPROPERTIES = 25000;
/* https://developers.google.com/apps-script/guides/services/quotas */

var STR_PREFIX_NUMOFPARTS = '_NUM_OF_PARTS';
var KEY = "_DL_DATA";

function byteCount(str) {
    return encodeURI(str).split(/%..|./).length - 1;
}

function chunkString(str, length) {
  return str.match(new RegExp('.{1,' + length + '}', 'g'));
}

function chunkStringParts(str, parts) {
  var len = str.length;
  // length of a part
  var length = Math.ceil(len / parts);
  return chunkString(str, length);
}

function setJsonProperty(key, data) {
  var userProperties = PropertiesService.getUserProperties();  
 
  var value = JSON.stringify(data);
  var numBites = value.length;

  // see restrictions
  if (numBites > NUM_MAX_BITE_SIZEOFPROPERTIES) {   
    return 'Set Properties -- error. String size is more than ' + NUM_MAX_BITE_SIZEOFPROPERTIES + ' bites.' 
  }
  
  // split string into parts
  var numParts = Math.ceil(numBites / NUM_MAX_BITE_SIZEOFPROPERTY);
  var values = chunkStringParts(value, numParts);
  
  userProperties.setProperty(KEY+key + STR_PREFIX_NUMOFPARTS, numParts);
  
  // set data 
  for (var i = 0; i < numParts; i++) {
    value = values[i];
    userProperties.setProperty(KEY+key + i, value);  
  }

  return 'Set Properties -- ok!'
}

function getJsonProperty(key) {
  var userProperties = PropertiesService.getUserProperties();
  var property = ''
  userProperties.getProperty(KEY+key);
  
  var numParts = userProperties.getProperty(KEY+key + STR_PREFIX_NUMOFPARTS);
  
  for (var i = 0; i < numParts; i++) {
      property += userProperties.getProperty(KEY+key + i);  
  }
  try {
    return JSON.parse(property);
  } catch (err) {
    return property
  }
}