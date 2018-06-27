var NUM_MAX_BITE_SIZEOFPROPERTY = 9000;
var NUM_MAX_BITE_SIZEOFPROPERTIES = 25000;
/* https://developers.google.com/apps-script/guides/services/quotas */

var KEY = "_DL_DATA"

function setJsonProperty(key, data) {
  var userProperties = PropertiesService.getUserProperties();  
 
  var value = JSON.stringify(data);
  
  // see restrictions
  if (value.length > NUM_MAX_BITE_SIZEOFPROPERTIES) {   
    return 'Set Properties -- error. String size is more than ' + NUM_MAX_BITE_SIZEOFPROPERTIES + ' bites.' 
  }
  
  // split string into parts
  var numParts = Math.ceil(value.length / NUM_MAX_BITE_SIZEOFPROPERTY);
  
  // set data
  userProperties.setProperty(KEY+key, value);  

  return 'Set Properties -- ok!'
}

function getJsonProperty(key) {
  var userProperties = PropertiesService.getUserProperties();
  var property = userProperties.getProperty(KEY+key);
  
  try {
    return JSON.parse(property);
  } catch (err) {
    return property
  }
}