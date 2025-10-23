
//==========================================================================================
// initVars
//==========================================================================================
function initVars() {
	//-----------------------------
	// load overviews array
	//-----------------------------
	var thisOverview = new PageObject();
	thisOverview.number = "PhotoFamilyTrees";
	thisOverview.title = "Photo Family Trees";
	thisOverview.path = "Overview/FamilyTrees_Photo.html";
	thisOverview.category = "Overview"
	overviews.push(thisOverview);

	thisOverview = new PageObject();
	thisOverview.number = "AncestorOverviewTrees";
	thisOverview.title = "Ancestor Overview Trees";
	thisOverview.path = "Overview/FamilyTrees_AncestorOverview.html";
	thisOverview.category = "Overview"
	overviews.push(thisOverview);

	//-----------------------------
	// load places array
	//-----------------------------
	var thisPlace = new PageObject();
	thisPlace.number = "";
	thisPlace.title = "";
	thisPlace.path = "";
	thisPlace.category = "Places"
	places.push(thisPlace);

	

	//DEBUG ONLY
	/*
	for (let i=0;i<searchFiles.length-1;i++){
		console.log(webRootLocation+searchFiles[i]['path']);
	}
	*/
	// DEBUG ONLY END
};	
