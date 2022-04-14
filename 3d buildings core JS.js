var maxDistance = 5;
var objs;
var collsionObj;
var buildingsInitialised = false;
const objectsInfo = [];
let airportsOn = null;
let landmarksOn = null;
let citiesOn = null;
let addonsOn = null;

let levelOfDetail = null;
let distancePref = null;

//Get the model list
fetch('https://raw.githubusercontent.com/TotallyRealElonMusk/GeoFS-3D-Buildings/main/JSON/CustomBuildings.json')
.then(res => res.json())
.then(data => objs = data)

//Get collision list
fetch('https://raw.githubusercontent.com/TotallyRealElonMusk/GeoFS-3D-Buildings/main/JSON/carriers.json')
.then(res => res.json())
.then(data => collsionObj = data)

! function(e) {
//Spawning Function
function initBuildings(objectsInfo){
for (var i = 0; i < objs.length; i++){
let objPosition = objs[i].position;
let active = isInRange(objPosition, maxDistance);
let enabled = false;
//
let hasBeenSpawned = false;
let model = null;
//
let objInfo = [objs[i],model,active,hasBeenSpawned];
//Get type and see if that type should be spawned:
let type = objInfo[0].type;
if (type == "atc" || type == null){
type = "airport";
};


if (type == "airport" && airportsOn){
enabled = true;
}else if (type == "landmark" && landmarksOn){
enabled = true;
}
else if (type == "city" && citiesOn){
enabled = true;
}
else if (type == "addon" && addonsOn){
enabled = true;
}
//Spawning the things:
if (objInfo[2] == true && enabled){
model = spawnModel(objs[i]);
objInfo[1] = model;
objInfo[3] = true;
}
objectsInfo.push(objInfo);
}
}
function updateBuildings(){
//Cycling through all of the things in object info
airportsOn = geofs.preferences.airports;
landmarksOn = geofs.preferences.landmarks;
citiesOn = geofs.preferences.cities;
addonsOn = geofs.preferences.addons;
for (var i = 0; i < objectsInfo.length; i++){
//checking if the model is in range
let objInfo = objectsInfo[i];
let objPosition = objInfo[0].position;
let active = isInRange(objPosition, maxDistance);
let enabled = false;
//Get type and see if that type should be spawned:
let type = objInfo[0].type;
if (type == "atc"){
type = "airport";
}else if (type == null){
type = "addon";
}

if (type == "airport" && airportsOn){
enabled = true;
}else if (type == "landmark" && landmarksOn){
enabled = true;
}
else if (type == "city" && citiesOn){
enabled = true;
}
else if (type == "addon" && addonsOn){
enabled = true;
}
//Find the state of the model
if (active == true && objInfo[3] == false && enabled){
let model = spawnModel(objInfo[0]);
objInfo[1] = model;
objInfo[3] = true;
}
else if (active == false && objInfo[3] == true || enabled == false && objInfo[3] == true){
deleteModel(objInfo[1]);
objInfo[1] = null;
objInfo[3] = false;
}
objectsInfo[i] = [objInfo[0],objInfo[1],objInfo[2],objInfo[3]]//setting all of the data to the things new things incase they were changed
}
};
function spawnModel(modelJson){
var name = modelJson.name;
var url = modelJson.url;
var position = modelJson.position;
var rotation = modelJson.rotation;
var scale = modelJson.scale;
var credit = modelJson.credit;

//Check if all of the values are valid or if any need to be set to defaults
if (url == null){
console.log("Failed to Spawn, No url provided")
return
}
if (position == null){
console.log("Failed")
return "Failed To Spawn, No position provided";
}
if (scale == null){
scale = [1,1,1];
}
if (rotation == null){
rotation = [0,0,0];
}
//Loading the model
var model = geofs.api.loadModel(url);
geofs.api.setModelPositionOrientationAndScale(model,position,rotation,scale);
if (credit != null){
console.log("Model credit: "+credit);
}
return model
}
//Deleting Function
function deleteModel(model){
geofs.api.destroyModel(model);
console.log("Deleted Object")
}
//Function To check if something is in the rendering Range
function isInRange(objectPosision, maxDistance){
var playerLocation = geofs.aircraft.instance.llaLocation;//get the player lat and long
//Calculating the stuff
var differenceX = playerLocation[0]-objectPosision[0];
var differenceY = playerLocation[1]-objectPosision[1];
var distance = Math.abs((differenceX*differenceX)+(differenceY*differenceY));//Pythagarous to find the distance, no square root because the max distance is squared, absolute to avoid negatives
if (distance >= (maxDistance*maxDistance)){
return false;
}
else{
return true;
}
}
//ui
var dropdown = document.createElement("li");
dropdown.setAttribute("class", "geofs-list-collapsible-item");
dropdown.innerHTML = "3D Buildings"
document.getElementsByClassName("geofs-preference-list")[0].appendChild(dropdown);
let dropdownSettings = document.createElement("div");
dropdownSettings.setAttribute("class", "geofs-collapsible");
dropdown.appendChild(dropdownSettings);
let dropdownSettings2 = document.createElement("fieldset");
dropdownSettings.appendChild(dropdownSettings2);
let dropdownSettingsLegend = document.createElement("legend");
dropdownSettingsLegend.innerHTML = "Settings";
dropdownSettings2.appendChild(dropdownSettingsLegend);

//Airport toggle
let airportToggle = document.createElement("label");
airportToggle.setAttribute("class", "mdl-switch mdl-js-switch mdl-js-ripple-effect mdl-js-ripple-effect--ignore-events is-upgraded");
airportToggle.setAttribute("for", "airportsToggle");
airportToggle.setAttribute("id", "0.754595679349397");
airportToggle.setAttribute("tabindex", "0");
airportToggle.setAttribute("dataUpgraded", ",MaterialSwitch,MaterialRipple");
airportToggle.innerHTML = '<input type="checkbox" id="airports" class="mdl-switch__input" data-gespref="geofs.preferences.airports"><span class="mdl-switch__label">Enable Airports</span>';
dropdownSettings2.appendChild(airportToggle);
airportToggle.addEventListener("click", toggleAirports);
//Landmark toggle
let landmarkToggle = document.createElement("label");
landmarkToggle.setAttribute("class", "mdl-switch mdl-js-switch mdl-js-ripple-effect mdl-js-ripple-effect--ignore-events is-upgraded");
landmarkToggle.setAttribute("for", "airportsToggle");
landmarkToggle.setAttribute("id", "0.754595679349397");
landmarkToggle.setAttribute("tabindex", "0");
landmarkToggle.setAttribute("dataUpgraded", ",MaterialSwitch,MaterialRipple");
landmarkToggle.innerHTML = '<input type="checkbox" id="airports" class="mdl-switch__input" data-gespref="geofs.preferences.landmarks"><span class="mdl-switch__label">Enable Landmarks</span>';
dropdownSettings2.appendChild(landmarkToggle);
landmarkToggle.addEventListener("click", togglelandmarks);
//Cities toggle
let citiesToggle = document.createElement("label");
citiesToggle.setAttribute("class", "mdl-switch mdl-js-switch mdl-js-ripple-effect mdl-js-ripple-effect--ignore-events is-upgraded");
citiesToggle.setAttribute("for", "airportsToggle");
citiesToggle.setAttribute("id", "0.754595679349397");
citiesToggle.setAttribute("tabindex", "0");
citiesToggle.setAttribute("dataUpgraded", ",MaterialSwitch,MaterialRipple");
citiesToggle.innerHTML = '<input type="checkbox" id="airports" class="mdl-switch__input" data-gespref="geofs.preferences.cities"><span class="mdl-switch__label">Enable Cities</span>';
dropdownSettings2.appendChild(citiesToggle);
citiesToggle.addEventListener("click", toggleCities);
//Misc toggle
let addonToggle = document.createElement("label");
addonToggle.setAttribute("class", "mdl-switch mdl-js-switch mdl-js-ripple-effect mdl-js-ripple-effect--ignore-events is-upgraded");
addonToggle.setAttribute("for", "airportsToggle");
addonToggle.setAttribute("id", "0.754595679349397");
addonToggle.setAttribute("tabindex", "0");
addonToggle.setAttribute("dataUpgraded", ",MaterialSwitch,MaterialRipple");
addonToggle.innerHTML = '<input type="checkbox" id="airports" class="mdl-switch__input" data-gespref="geofs.preferences.addons"><span class="mdl-switch__label">Enable Miscelaneous</span>';
dropdownSettings2.appendChild(addonToggle);
addonToggle.addEventListener("click", toggleAddons);


/*
//Spawning Range Slider
let rangeSlider = document.createElement("div");
rangeSlider.setAttribute("class", "slider");
rangeSlider.setAttribute("data-gespref", "geofs.preferences.distancePref");
rangeSlider.setAttribute("data-update", "{geofs.api.renderingQualityss()}");
rangeSlider.setAttribute("value", "5");
rangeSlider.setAttribute("data-min", "0");
rangeSlider.setAttribute("data-max", "10");
rangeSlider.setAttribute("data-precision", "1");
rangeSlider.setAttribute("id", "0.07624394442207206");
rangeSlider.setAttribute("tabindex", "0");
rangeSlider.innerHTML = '<div class="slider-rail"><div class="slider-selection" style="width: 0%;"><div class="slider-grippy"><input class="slider-input"></div></div></div>'
dropdownSettings2.appendChild(rangeSlider);
let rangeSliderLabel = document.createElement("label");
rangeSliderLabel.innerHTML = "Spawning Range";
rangeSlider.appendChild(rangeSliderLabel);

//Level of Detail Slider
let lodSlider = document.createElement("div");
lodSlider.setAttribute("class", "slider");
lodSlider.setAttribute("data-gespref", "geofs.preferences.levelOfDetail");
lodSlider.setAttribute("data-update", "updateLod(value)");
lodSlider.setAttribute("value", "2");
lodSlider.setAttribute("data-min", "1");
lodSlider.setAttribute("data-max", "5");
lodSlider.setAttribute("data-precision", "0");
lodSlider.setAttribute("id", "0.07624394442207207");
lodSlider.setAttribute("tabindex", "0");
lodSlider.innerHTML = '<div class="slider-rail"><div class="slider-selection" style="width: 0%;"><div class="slider-grippy"><input class="slider-input"></div></div></div>'
dropdownSettings2.appendChild(lodSlider);
let lodSliderLabel = document.createElement("label");
lodSliderLabel.innerHTML = "Level of Detail";
lodSlider.appendChild(lodSliderLabel);
//LOD Description
let lodDescription = document.createElement("legend");
lodDescription.innerHTML = "Level of Detail: 5 - All Buidlings loaded, worse performance; 1 - Only low detail Buildings are loaded, better performance";
dropdownSettings2.appendChild(lodDescription);
*/

//Push Button
let dropdownButtons = document.createElement("fieldset");
dropdownSettings.appendChild(dropdownButtons);
let buttonLegend = document.createElement("legend");
buttonLegend.innerHTML = "Links";
dropdownButtons.appendChild(buttonLegend);
let buttonWeb = document.createElement("button");
buttonWeb.setAttribute("class", "mdl-button mdl-js-button mdl-button--raised ");
buttonWeb.setAttribute("onclick", 'window.open("https://geofs3d.wixsite.com/buildtheearth")');
buttonWeb.setAttribute("data-upgraded", ",MaterialButton");
buttonWeb.setAttribute("id", "0.07623394442207207");
buttonWeb.setAttribute("tabindex", "0");
buttonWeb.innerHTML ='<img src="https://media.discordapp.net/attachments/899038903581966336/944239917284855848/BuildingsLogoMono512.png"width="20"height="20"> Website';
dropdownButtons.appendChild(buttonWeb);
//Discord Button
let buttonDisc = document.createElement("button");
buttonDisc.setAttribute("class", "mdl-button mdl-js-button mdl-button--raised ");
buttonDisc.setAttribute("onclick", 'window.open("https://discord.gg/YJNrd88nEQ")');
buttonDisc.setAttribute("data-upgraded", ",MaterialButton");
buttonDisc.setAttribute("id", "0.07623394442207207");
buttonDisc.setAttribute("tabindex", "0");
buttonDisc.innerHTML ="Discord";
dropdownButtons.appendChild(buttonDisc);
//Credits Button
let buttonCredits = document.createElement("button");
buttonCredits.setAttribute("class", "mdl-button mdl-js-button mdl-button--raised ");
buttonCredits.setAttribute("onclick", 'window.open("https://geofs3d.wixsite.com/buildtheearth/contact-us")');
buttonCredits.setAttribute("data-upgraded", ",MaterialButton");
buttonCredits.setAttribute("id", "0.07623394442207207");
buttonCredits.setAttribute("tabindex", "0");
buttonCredits.innerHTML ="Contact";
dropdownButtons.appendChild(buttonCredits);

//ui Functions
function toggleAirports(){
let airportState = geofs.preferences.airports;
if (airportState == true){
airportToggle.setAttribute("class", "mdl-switch mdl-js-switch mdl-js-ripple-effect mdl-js-ripple-effect--ignore-events is-upgraded");
}
else{
airportToggle.setAttribute("class", "mdl-switch mdl-js-switch mdl-js-ripple-effect mdl-js-ripple-effect--ignore-events is-upgraded is-checked")
console.log("Airports On")
}
geofs.preferences.airports = !airportState;
airportsOn = geofs.preferences.airports;
}
function togglelandmarks(){
let state = geofs.preferences.landmarks;
if (state == true){
landmarkToggle.setAttribute("class", "mdl-switch mdl-js-switch mdl-js-ripple-effect mdl-js-ripple-effect--ignore-events is-upgraded");
}
else{
landmarkToggle.setAttribute("class", "mdl-switch mdl-js-switch mdl-js-ripple-effect mdl-js-ripple-effect--ignore-events is-upgraded is-checked")
console.log("Landmarks On")
}
geofs.preferences.landmarks = !state;
landmarksOn = geofs.preferences.landmarks;
}
function toggleCities(){
let state = geofs.preferences.cities;
if (state == true){
citiesToggle.setAttribute("class", "mdl-switch mdl-js-switch mdl-js-ripple-effect mdl-js-ripple-effect--ignore-events is-upgraded");
}
else{
citiesToggle.setAttribute("class", "mdl-switch mdl-js-switch mdl-js-ripple-effect mdl-js-ripple-effect--ignore-events is-upgraded is-checked")
console.log("cities On")
}
geofs.preferences.cities = !state;
citiesOn = geofs.preferences.cities;
}
function toggleAddons(){
let state = geofs.preferences.addons;
if (state == true){
addonToggle.setAttribute("class", "mdl-switch mdl-js-switch mdl-js-ripple-effect mdl-js-ripple-effect--ignore-events is-upgraded");
}
else{
addonToggle.setAttribute("class", "mdl-switch mdl-js-switch mdl-js-ripple-effect mdl-js-ripple-effect--ignore-events is-upgraded is-checked")
console.log("addons On")
}
geofs.preferences.addons = !state;
addonsOn = geofs.preferences.addons;
}
function updateLod(value){
console.log("update");
geofs.preferences.levelOfDetail = vaule;
}

var o = setInterval(function() {
window.geofs && geofs.aircraft && geofs.aircraft.instance && geofs.aircraft.instance.object3d && (clearInterval(o), function() {
//Preferences and Menu settup
let preferences = geofs.preferences;
airportsOn = preferences.airports;
if (airportsOn == null){
preferences.airports = true;
airportsOn = preferences.airports;
geofs.savePreferences();
}
landmarksOn = preferences.landmarks;
if (landmarksOn == null){
preferences.landmarks = true;
landmarksOn = preferences.landmarks;
geofs.savePreferences();
}
citiesOn = preferences.cities;
if (citiesOn == null){
preferences.cities = true;
landmarksOn = preferences.cities;
geofs.savePreferences();
}
addonsOn = preferences.addons;
if (addonsOn == null){
preferences.addons = true;
addonsOn = preferences.addons;
geofs.savePreferences();
}
levelOfDetail = preferences.levelOfDetail;
if (levelOfDetail == null){
preferences.levelOfDetail = 2;
addonsOn = preferences.levelOfDetail;
geofs.savePreferences();
}
distancePref = preferences.distancePref;
if (distancePref == null){
preferences.distancePref = 5.0;
addonsOn = preferences.distancePref;
geofs.savePreferences();
}

initBuildings(objectsInfo);
//What happens every few seconds/Updating the currently spawned buildings
const interval = setInterval(updateBuildings, 10000);

var location = document.createElement("li");
location.setAttribute("class", "geofs-list-collapsible-item");
location.innerHTML = "3D Buildings"
document.getElementsByClassName("geofs-location-list")[0].insertBefore(location, document.getElementsByClassName("geofs-location-list")[0].firstChild);
let locationSettings = document.createElement("ul");
locationSettings.setAttribute("class", "geofs-collapsible");
location.appendChild(locationSettings);
let locationSettings2 = document.createElement("fieldset");
locationSettings.appendChild(locationSettings2);
//QE2 spawning
let locationQE2 = document.createElement("li");
locationQE2.innerHTML = "HMS Queen Elizabeth II (Carrier)";
locationSettings2.appendChild(locationQE2);
locationQE2.dataset.location = "geofs.flyTo([50.76666873754467,-1.1925880445846175,0,180, true]);";
//Intrepid spawning
let locationUSSI = document.createElement("li");
locationUSSI.innerHTML = "USS Intrepid (Carrier)";
locationSettings2.appendChild(locationUSSI);
locationUSSI.dataset.location = "geofs.flyTo([40.76888165743244, -74.00250790450784, 0,175, true]);";
//ASOG spawning
let locationASOG = document.createElement("li");
locationASOG.innerHTML = "A Shortfall of Gravitas (Droneship)";
locationSettings2.appendChild(locationASOG);
locationASOG.dataset.location = "geofs.flyTo([28.409661,-80.582244,0,0, true]);";
//Pad B spawning
let locationPadB = document.createElement("li");
locationPadB.innerHTML = "Starbase - Suborbital Pad B";
locationSettings2.appendChild(locationPadB);
locationPadB.dataset.location = "geofs.flyTo([25.996676197774043,-97.158153935453,0,0, true]);";
//NYC spawning
let locationNYC = document.createElement("li");
locationNYC.innerHTML = "New York City";
locationSettings2.appendChild(locationNYC);
locationNYC.dataset.location = "geofs.flyTo([40.696034661462015,-74.02463885918331,300.1454927585762,0, true]);";
//KSC spawning
let locationKSC = document.createElement("li");
locationKSC.innerHTML = "Shuttle Landing Facility (approach)";
locationSettings2.appendChild(locationKSC);
locationKSC.dataset.location = "geofs.flyTo([28.55997556619363,-80.65834401823803,600,-30, true]);";


for (var a in collsionObj) {
var currentObj = collsionObj[a];
var name = currentObj.name;
objects.list.name = currentObj;
objects.init();
}
//geofs.flyTo([50.76619260070758, -1.192606945462554,0,180])
}())
}, 100)
}();
