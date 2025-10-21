var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//======================================================================================================================================================================================
// CLASSES
//======================================================================================================================================================================================
//---------------------------
// PageObject
//---------------------------	
class PageObject {
}
;
//---------------------------
// AnnotatedPhotoObject
//---------------------------	
class AnnotatedPhotoObject {
}
;
//---------------------------
// PageStack
//---------------------------
class PageStack {
}
;
//==========================================================================================
// GLOBAL VARIABLES
//==========================================================================================
var topTitleHeight = 46;
var topMenuHeight = 51;
var subTitleHeight = 46;
var subMenuHeight = 51;
var contentTitleHeight = 46;
var webRootLocation = "https://bryan-1963.github.io/JacksonCounty_KS_SchoolHistory/";
var subMenuName = '';
var subMenuCat = '';
var webStack = []; //stack of pages loaded so can navigate back and forth
var webStackIndex = 0;
// pageObject arrays
var maps = []; //array of PageObjects for maps
var countySchoolDistricts = []; //array of PageObjects for elementary schools
var countyHighSchools = []; //array of PageObjects for high schools
var usdSchools = []; //array of PageObjects for USDs
var pottawatomieMissionSchool = new PageObject();
var colleges = [];
var overviews = [];
//siteSearch variables
var siteSearchInputBox = document.getElementById("siteSearchInputBox");
var siteSearchPrecision = 1.00;
var searchFiles = []; //array of PageObjects for searching the site
var siteSearchResults = []; //matches
var siteSearchTermInput = ""; //user input tot he site search
//variables for displaying documents
var docPages = []; //array of AnnotatedPhotoObject, loaded by loadDocPages
var docSearchPrecision = 1.00;
var docPagesAreSearched = false;
var docSearchResultPages = []; //array of page numbers containing the searched for text
var docSearchResultCurrPg = 0;
var docSearchPatterns = []; //array of regex patterns to search for
var docSearchTerm = "";
var docDisplayMode = 'display'; //'display'=show from file, 'edit'=edit enabled
var docPgNum = 0;
var documentTitle = "";
var docPgPath = "";
var docPageNumInput = document.getElementById("docPageNumInput");
var docPageSearchInput = document.getElementById("docPageSearchInput");
var myIframe = document.getElementById('ContentHolder');
//=======================================================================================================================================================
// EVENT LISTENERS
//=======================================================================================================================================================	
window.addEventListener("resize", this.sizeBars);
document.getElementById("MainMenu").addEventListener("load", this.sizeBars);
document.getElementById("SubMenu").addEventListener("load", this.sizeBars);
document.getElementById("iFrameHolder").addEventListener("load", this.sizeBars);
document.getElementById("SubTitle").addEventListener("load", this.sizeBars);
document.getElementById("ContentTitle").addEventListener("load", this.sizeBars);
//---------------------------
// ELEMENT RESIZE OBSERVER
//---------------------------
var ro = new ResizeObserver(entries => {
    for (let entry of entries) {
        if (entry.contentBoxSize) {
            //entry.target.handleResize(entry);
            this.sizeBars;
        }
    }
});
ro.observe(document.getElementById("MainMenu"));
ro.observe(document.getElementById("SubMenu"));
ro.observe(document.getElementById("SubTitle"));
ro.observe(document.getElementById("ContentTitle"));
//-----------------------------------------
// Document pagenumber input listener 
//-----------------------------------------
docPageNumInput.addEventListener("keydown", function (e) {
    if (e.code === "Enter" || e.code === "NumpadEnter") //checks whether the pressed key is "Enter"
     {
        docPgNum = Math.floor(Number(docPageNumInput.value)) - 1; //eliminate any decimal and change user 1-based input to 0-based input
        if (docPgNum > docPages.length - 1) {
            docPgNum = docPages.length - 1;
        }
        if (docPgNum < 0) {
            docPgNum = 0;
        }
        ;
        //update the page number input box to account for limiting
        docPageNumInput.setAttribute("value", (Number(docPgNum) + 1).toString());
        console.log("docPgNum=" + docPgNum);
        //load the requested page
        loadDocPageNum(docPgNum);
    }
});
//-----------------------------------------
// Document search input listener 
//-----------------------------------------
docPageSearchInput.addEventListener("keydown", function (e) {
    if (e.code === "Enter" || e.code === "NumpadEnter") //checks whether the pressed key is "Enter"
     {
        let searchTerm = docPageSearchInput.value;
        if (searchTerm != null && searchTerm != "") {
            searchDocument(1.00);
        }
    }
});
//-----------------------------------------
// Site search input listener 
//-----------------------------------------
siteSearchInputBox.addEventListener("keydown", function (e) {
    if (e.code === "Enter" || e.code === "NumpadEnter") //checks whether the pressed key is "Enter"
     {
        siteSearchTermInput = siteSearchInputBox.value;
        if (siteSearchTermInput != null && siteSearchTermInput != "") {
            document.getElementById("TitleBar").focus(); //get cursor out of the input box
            searchSite(1.00);
        }
    }
});
//-----------------------------------------
// subPage load listener
//-----------------------------------------
myIframe.addEventListener("load", function () {
    //in case iFrame loaded before startup was complete, initialize webStack
    if (webStack.length === 0) {
        //console.log("-------------------------------------------------------------------------------");
        //console.log("initializing webStack from iFrame listener");
        //initialize the web page stack
        let thisPage = new PageObject();
        thisPage.number = "";
        thisPage.title = "Welcome";
        thisPage.path = "Welcome/Welcome.html";
        thisPage.category = "Welcome";
        addToWebStack(thisPage);
    }
    highlightSearchResultsInSubPage(); //highlight any search results on the page that was loaded
});
//=======================================================================================================================================================
// FUNCTIONS
//=======================================================================================================================================================
//==========================================================================================
// startup
//==========================================================================================
function startup() {
    countySchoolDistricts.length = 0;
    countyHighSchools.length = 0;
    usdSchools.length = 0;
    this.initVars; //load global variables
    this.sizeBars; //size and place the menu bars
    //in case startup completed before iFrame loaded, initialize webStack
    if (webStack.length === 0) {
        //console.log("-------------------------------------------------------------------------------");
        //console.log("initializing webStack from startup");
        //initialize the web page stack
        let thisPage = new PageObject();
        thisPage.number = "";
        thisPage.title = "Welcome";
        thisPage.path = "Welcome/Welcome.html";
        thisPage.category = "Welcome";
        addToWebStack(thisPage);
    }
}
;
//==========================================================================================
// navStack
//==========================================================================================	
function navStack(dir) {
    return __awaiter(this, void 0, void 0, function* () {
        var subTitle = document.getElementById("SubTitle");
        // START DEBUG ONLY
        /*
        console.log("====================================================");
        console.log("NAVSTACK: rcd dir="+dir+", current webStackIndex="+webStackIndex);
        console.log("====================================================");
        for (let i=0;i<=webStack.length-1;i++){
            console.log(i, webStack[i].pageParam.category, webStack[i].pageParam.title);
        }
        */
        //END DEBUG ONLY
        //...........................
        //adjust webStackIndex
        //...........................
        if (dir === 'next') {
            webStackIndex = webStackIndex + 1;
        }
        if (dir === 'prev') {
            webStackIndex = webStackIndex - 1;
        }
        if (webStackIndex > webStack.length - 1) {
            webStackIndex = webStack.length - 1;
        }
        if (webStackIndex < 0) {
            webStackIndex = 0;
        }
        //console.log("rcd dir="+dir+", now webStackIndex="+webStackIndex);
        //......................................
        // set search variables and elements
        //......................................
        // site search 
        siteSearchTermInput = (' ' + webStack[webStackIndex].siteSrchTrmInpt).slice(1);
        if (siteSearchTermInput === undefined || siteSearchTermInput === 'undefined') {
            siteSearchTermInput = "";
        }
        siteSearchInputBox.value = siteSearchTermInput;
        siteSearchPrecision = webStack[webStackIndex].sitePrecision * 1;
        siteSearchResults = JSON.parse(JSON.stringify(webStack[webStackIndex].siteSearchRslts));
        //document search
        docPagesAreSearched = webStack[webStackIndex].docPagesRSrchd;
        docSearchTerm = (' ' + webStack[webStackIndex].docSrchTrm).slice(1);
        if (docSearchTerm === undefined || docSearchTerm === 'undefined') {
            docSearchTerm = "";
        }
        docPageSearchInput.value = docSearchTerm;
        docSearchPrecision = webStack[webStackIndex].docPrecision * 1;
        docPgNum = webStack[webStackIndex].docCurrPg * 1;
        docPageSearchInput.value = docSearchTerm;
        docSearchResultPages = JSON.parse(JSON.stringify(webStack[webStackIndex].docSrchRsltPgs));
        //console.log("navigating to webStack[webStackIndex].pageParam.category="+webStack[webStackIndex].pageParam.category);
        //......................................
        //navigate to page at webStackIndex
        //......................................
        switch (webStack[webStackIndex].pageParam.category) {
            //......................
            // Home
            //......................
            case 'Home':
            case 'Welcome':
                menuClick({ "category": "Home", "subCat": "" }, false);
                break;
            //......................
            // Overview
            //......................
            case 'Overview':
                //main menu click to overview:
                if (webStack[webStackIndex].pageParam.path === "") {
                    menuClick({ "category": "Overview", "subCat": "" }, false);
                }
                //sub selector click to overview page
                else {
                    showOverview(webStack[webStackIndex].pageParam, false);
                }
                break;
            //......................
            // maps
            //......................
            case 'Maps':
                //main menu click to maps:
                if (webStack[webStackIndex].pageParam.path === "") {
                    menuClick({ "category": "Maps", "subCat": "" }, false);
                }
                //sub selector click to a maps page
                else {
                    showMap(webStack[webStackIndex].pageParam, false);
                }
                break;
            //......................
            // Schools
            //......................
            case 'Schools':
            case 'PottawatomieMission':
            case 'JacksonCounty':
            case 'Joint':
            case 'Adjacent':
            case 'USD':
            case 'College':
                //main menu click to overview page
                if (webStack[webStackIndex].pageParam.path === "") {
                    menuClick({ "category": "Schools", "subCat": "" }, false);
                }
                //sub selector click to school page
                else {
                    let pgPath = webStack[webStackIndex].pageParam['path'];
                    let subPg = "";
                    if (pgPath.indexOf('Overview') >= 0) {
                        subPg = "Overview";
                    }
                    else if (pgPath.indexOf('People') >= 0) {
                        subPg = "People";
                    }
                    else if (pgPath.indexOf('Locations') >= 0) {
                        subPg = "Locations";
                    }
                    else if (pgPath.indexOf('Events') >= 0) {
                        subPg = "Events";
                    }
                    showSchool(webStack[webStackIndex].pageParam, subPg, false);
                }
                break;
            //......................
            // References
            //......................
            case 'References':
                menuClick({ "category": "References", "subCat": "" }, false);
                break;
            //......................
            // Source Material
            //......................			
            case 'SourceMatl':
                //console.log("navigating to a SourceMatl page with path=|" + webStack[webStackIndex].docPagePath + "|");
                //main menu click to the source material link list
                if (webStack[webStackIndex].docPagePath === "") {
                    menuClick({ "category": "SourceMatl", "subCat": "" }, false);
                }
                else {
                    //console.log("calling loadDocPages. sending path="+webStack[webStackIndex].docPagePath+", title="+webStack[webStackIndex].docTitle+", userClick=false");
                    yield loadDocPages(webStack[webStackIndex].docPagePath, webStack[webStackIndex].docTitle, false);
                    docPgNum = webStack[webStackIndex].docCurrPg * 1; //have to set again here since loadDocPages put it at 0
                    //console.log("loaded doc pages, now moving to page number="+docPgNum);
                    loadDocPageNum(docPgNum, false);
                }
                break;
            //......................
            // About
            //......................
            case 'About':
                menuClick({ "category": "About", "subCat": "" }, false);
                break;
            //......................
            // SiteSearch
            //......................
            case 'SiteSearch':
                showSiteSearchResults(false);
                break;
        }
    });
}
//==========================================================================================
// addToWebStack
//==========================================================================================	
function addToWebStack(pgIn) {
    // START DEBUG ONLY
    /*
    console.log("====================================================");
    console.log("ADDING TO WEBSTACK: current webStackIndex="+webStackIndex);
    console.log("====================================================");
    for (let i=0;i<=webStack.length-1;i++){
        console.log(i, webStack[i].pageParam.category, webStack[i].pageParam.title);
    }
    */
    //END DEBUG ONLY
    //load up new stack element with state of the web page
    let pageStckEl = new PageStack();
    pageStckEl.pageParam = pgIn;
    pageStckEl.siteSrchTrmInpt = siteSearchTermInput;
    pageStckEl.sitePrecision = siteSearchPrecision;
    pageStckEl.siteSearchRslts = siteSearchResults;
    pageStckEl.docPagePath = docPgPath;
    pageStckEl.docTitle = documentTitle;
    pageStckEl.docPagesRSrchd = docPagesAreSearched;
    pageStckEl.docSrchTrm = docSearchTerm;
    pageStckEl.docPrecision = docSearchPrecision;
    pageStckEl.docSrchRsltPgs = docSearchResultPages;
    pageStckEl.docCurrPg = docPgNum;
    //make sure nothing is stored in the stack "by Reference"
    pageStckEl = JSON.parse(JSON.stringify(pageStckEl));
    //get strings to compare current to previous page on the stack
    let prevElStr = JSON.stringify(webStack[webStack.length - 1]);
    let newElStr = JSON.stringify(pageStckEl);
    //if its new, add it to the stack
    if (newElStr != prevElStr) {
        //console.log("new entry");
        webStack.splice(webStackIndex + 1); //truncate any following pages compared to where we are now
        webStack.push(pageStckEl);
        webStackIndex = webStack.length - 1;
    }
    //console.log(webStackIndex,JSON.stringify(webStack[webStackIndex]));
    // START DEBUG ONLY
    /*
    console.log("====================================================");
    console.log("ADDED TO WEBSTACK:");
    console.log("current webStackIndex="+webStackIndex);
    console.log("webStack.length="+webStack.length);
    console.log("====================================================");
    for (let i=0;i<=webStack.length-1;i++){
        console.log(i, webStack[i].pageParam.category, webStack[i].pageParam.title);
    }
    */
    //END DEBUG ONLY
}
//==========================================================================================
// clearSearchInput
//==========================================================================================
function clearSearchInput(inputBoxName) {
    //get the input box
    let thisSearchBox = document.getElementById(inputBoxName);
    //clear the input box
    thisSearchBox.setAttribute("value", "");
    thisSearchBox.dispatchEvent(new Event('input'));
    thisSearchBox.value = "";
    thisSearchBox.focus();
    thisSearchBox.dispatchEvent(new Event('input'));
    if (inputBoxName === "docPageSearchInput") {
        //reset the search results counter
        document.getElementById("docSearchResultsQty").innerHTML = '0/0';
        docSearchResultCurrPg = 0;
        //clear out the search results
        clearDocumentSearch();
        //update webStack by copying the current location and adding results
        //console.log("-------------------------------------------------------------------------------");
        //console.log("calling addToWebStack from clearSearchInput");
        addToWebStack(webStack[webStackIndex].pageParam);
    }
}
;
//==========================================================================================
// clearDocumentSearch
//==========================================================================================	
function clearDocumentSearch() {
    //reset the search patterns
    docSearchPatterns.length = 0;
    //reset flag
    docPagesAreSearched = false;
    //reset the results array
    docSearchResultPages.length = 0;
    //remove highlights from current page by reloading it without highlights
    loadDocPageNum(docPgNum);
}
;
//==========================================================================================
// configurePage
//==========================================================================================
function configurePage(config, showTitleBar3, showSchoolNavBar) {
    //INPUTS:
    //	config can be:
    //		'siteSearchResults' = display the searchResultsHolder div
    //		'document' = display the documentContentHolder div
    //		'subPage' = display the iFrameHolder div
    //		'subSelector' = display the subselector for long lists like schools, maps,....
    //		'test' = change as required for testing
    //======================================================================================
    var subTitle = document.getElementById("SubTitle");
    var subMenu = document.getElementById("SubMenu");
    var contentTitleBar = document.getElementById("ContentTitle");
    let iFrameHldr = document.getElementById("iFrameHolder");
    let documentContentHolder = document.getElementById("documentContentHolder");
    let docAnnot = document.getElementById("docAnnotation");
    let docFigCapt = document.getElementById("figCaption");
    let docNavBar = document.getElementById("docNavBar");
    let schoolNavBar = document.getElementById("schoolNavBar");
    let docPgImg = document.getElementById("docPageImg");
    let searchRsltsHolder = document.getElementById("searchResultsHolder");
    let subSelectorHolder = document.getElementById("subSelector");
    //console.log("config="+config);
    switch (config) {
        //------------------------
        case 'siteSearchResults':
            //------------------------
            subMenuName = '';
            subMenuCat = '';
            subTitle.innerHTML = "Site Search Results";
            iFrameHldr.style.display = "none";
            subSelectorHolder.style.display = "none";
            documentContentHolder.style.display = "none";
            subMenu.style.display = "block";
            searchRsltsHolder.style.display = "block";
            docNavBar.style.display = "none";
            docAnnot.innerHTML = "";
            docFigCapt.innerHTML = "";
            docPgImg.src = '';
            contentTitleBar.className = "titleBar3Empty";
            break;
        //------------------------
        case 'document':
            //------------------------
            subMenuName = "";
            subMenuCat = "";
            iFrameHldr.style.display = "none";
            documentContentHolder.style.display = "block";
            searchRsltsHolder.style.display = "none";
            subSelectorHolder.style.display = "none";
            subMenu.style.display = "block";
            docNavBar.style.display = "block";
            schoolNavBar.style.display = "none";
            docAnnot.innerHTML = "";
            docFigCapt.innerHTML = "";
            docPgImg.src = '';
            break;
        //------------------------
        case 'subPage':
            //------------------------
            iFrameHldr.style.display = "block";
            subMenuName = '';
            subMenuCat = '';
            documentContentHolder.style.display = "none";
            searchRsltsHolder.style.display = "none";
            subSelectorHolder.style.display = "none";
            subMenu.style.display = "block";
            docNavBar.style.display = "none";
            schoolNavBar.style.display = "none";
            docAnnot.innerHTML = "";
            docFigCapt.innerHTML = "";
            docPgImg.src = '';
            break;
        //------------------------
        case 'test':
            //------------------------
            subMenuName = '';
            subMenuCat = '';
            subTitle.innerHTML = "Test";
            subMenu.style.display = "block";
            docNavBar.style.display = "block";
            schoolNavBar.style.display = "none";
            subSelectorHolder.style.display = "none";
            contentTitleBar.className = "titleBar3Empty";
            iFrameHldr.style.display = "none";
            documentContentHolder.style.display = "block";
            docAnnot.innerHTML = "";
            docFigCapt.innerHTML = "";
            docPgImg.src = '';
            searchRsltsHolder.style.display = "none";
            break;
        //------------------------
        case 'subSelector':
            //------------------------
            iFrameHldr.style.display = "none";
            subMenuName = '';
            subMenuCat = '';
            documentContentHolder.style.display = "none";
            subSelectorHolder.style.display = "block";
            subMenu.style.display = "block";
            docNavBar.style.display = "none";
            schoolNavBar.style.display = "none";
            searchRsltsHolder.style.display = "none";
            docAnnot.innerHTML = "";
            docFigCapt.innerHTML = "";
            docPgImg.src = '';
            break;
    }
    if (showTitleBar3) {
        contentTitleBar.className = "titleBar3";
    }
    else {
        contentTitleBar.className = "titleBar3Empty";
    }
    if (showSchoolNavBar) {
        schoolNavBar.style.display = "block";
    }
    else {
        schoolNavBar.style.display = "none";
    }
}
//==========================================================================================
// showSiteSearchResults
//==========================================================================================
function showSiteSearchResults(userClick = true) {
    //show the search results page
    configurePage('siteSearchResults', false, false);
    //fill in the contents of the results page
    let rsltStr = "<colgroup><col style='width:25%'><col style='width:75%'></colgroup>";
    rsltStr = rsltStr + "<tr><th>Page</th><th>Matches</th></tr>";
    for (let i = 0; i <= siteSearchResults.length - 1; i++) {
        //console.log("siteSearchResults=" + JSON.stringify(siteSearchResults));
        //console.log(siteSearchResults[i]['matches'].length);
        let matchingTexts = "";
        for (let j = 0; j <= siteSearchResults[i]['phrases'].length - 1; j++) {
            //console.log(j, JSON.stringify(siteSearchResults[i]['matches'][j]));
            matchingTexts = matchingTexts + siteSearchResults[i]['phrases'][j];
        }
        //build link with correct type of function call based on category of the page that was found
        let thisFnCall = "";
        let param = "";
        //console.log(siteSearchResults[i]['page']['category']);
        //console.log("--------------------------------------------------");
        switch (siteSearchResults[i]['page']['category']) {
            //......................
            // Home
            //......................
            case 'Welcome':
            case 'Home':
                thisFnCall = "menuClick({'category':'Home','subCat':''}, true)";
                break;
            //......................
            // Overview
            //......................
            case 'Overview':
                param = JSON.stringify(siteSearchResults[i]['page']);
                param = param.replace(/"/g, "'");
                thisFnCall = "showOverview(" + param + ",true)";
                break;
            //......................
            // maps
            //......................
            case 'Maps':
                param = JSON.stringify(siteSearchResults[i]['page']);
                param = param.replace(/"/g, "'");
                thisFnCall = "showMap(" + param + ",true)";
                break;
            //......................
            // Schools
            //......................
            case 'Schools':
            case 'PottawatomieMission':
            case 'JacksonCounty':
            case 'Joint':
            case 'Adjacent':
            case 'USD':
            case 'College':
                param = JSON.stringify(siteSearchResults[i]['page']);
                param = param.replace(/"/g, "'");
                thisFnCall = "showSchool(" + param + ",'',true)";
                break;
            //......................
            // References
            //......................
            case 'References':
                thisFnCall = "menuClick({'category':'References','subCat':''}, true )";
                break;
            //......................
            // Source Material
            //......................			
            case 'Document':
                param = JSON.stringify(siteSearchResults[i]['page']['path']);
                param = param + ", " + JSON.stringify(siteSearchResults[i]['page']['title']);
                param = param.replace(/"/g, "'");
                thisFnCall = "loadDocPages(" + param + ",true)";
                break;
            //......................
            // About
            //......................
            case 'About':
                thisFnCall = "menuClick({'category':'About','subCat':''}, true )";
                break;
        }
        //console.log("thisFnCall=|"+thisFnCall+"|");
        rsltStr = rsltStr + "<tr><td><a class='link-like' onclick=\"" + thisFnCall + "\">";
        rsltStr = rsltStr + siteSearchResults[i]['title'] + "</a>";
        rsltStr = rsltStr + "</td><td>" + matchingTexts + "</td></tr>";
        //console.log("rsltStr=|"+rsltStr+"|");
    }
    //console.log("rsltStr="+rsltStr);
    document.getElementById("siteSearchResultsList").innerHTML = rsltStr;
    //update webStack by copying the current location and adding search results
    if (userClick) {
        //console.log("-------------------------------------------------------------------------------");
        //console.log("adding to stack in showSiteSearchResults");
        let thisPage = new PageObject();
        thisPage.number = "";
        thisPage.title = "Site Search";
        thisPage.path = "";
        thisPage.category = "SiteSearch";
        addToWebStack(thisPage);
    }
    // ADJUST LOCATIONS OF BARS
    this.sizeBars;
}
//==========================================================================================
// searchSite
//==========================================================================================
function searchSite() {
    return __awaiter(this, arguments, void 0, function* (precisionRqd = 1.00, userClick = true) {
        //0.82 (very fuzzy) < precisionRqd <= 1.00 (perfect matches only)
        // stop user input
        document.getElementById("popUpBackgroundContent").innerHTML = "Please wait. Searching entire site....0/" + (searchFiles.length - 1);
        document.getElementById("popUpBackground").style.display = "block";
        //initialize variables
        let foundSomeMatches = false;
        siteSearchResults.length = 0;
        siteSearchPrecision = precisionRqd; //save to global variable
        //siteSearchInputBox = document.getElementById("siteSearchInputBox");
        let siteSearchTerm = siteSearchInputBox.value;
        if (siteSearchTerm === null
            || siteSearchTerm === undefined
            || siteSearchTerm === 'undefined') {
            siteSearchTerm = "";
        }
        ;
        let startStr = "<colgroup><col style='width:25%'><col style='width:75%'></colgroup>";
        startStr = startStr + "<tr><th>Page</th><th>Matches</th></tr>";
        document.getElementById("siteSearchResultsList").innerHTML = startStr;
        if (siteSearchTermInput != "") {
            getDocSearchPatterns(siteSearchTermInput); //this loads the array docSearchPatterns	
            //search through all the files with data for a match 
            for (let i = 0; i < searchFiles.length - 1; i++) {
                //loop throught the elements of docSearchPatterns
                let myObject = yield fetch(webRootLocation + searchFiles[i]['path']);
                let myText = yield myObject.text();
                //remove tags from String
                let clnStr = removeTagsFromString(myText);
                clnStr = cleanStringOfPunctuation(clnStr);
                //search for each search term
                for (let term = 0; term <= docSearchPatterns.length - 1; term++) {
                    //search the string for a match. if match, add it to siteSearchResults
                    if (TextHasSearchTerm(clnStr, precisionRqd)) {
                        foundSomeMatches = true;
                        let matchSubStrings = FindMatchSubStrings(cleanStringOfPunctuation(clnStr), "weight");
                        //find matching phrases in the original text
                        let matchPhrases = getMatchPhrases(matchSubStrings, myText);
                        siteSearchResults.push({ title: searchFiles[i]['title'], matches: matchSubStrings, phrases: matchPhrases, page: searchFiles[i] });
                    }
                }
                document.getElementById("popUpBackgroundContent").innerHTML = "Please wait. Searching entire site...." + i + "/" + (searchFiles.length - 1);
            }
            if (foundSomeMatches) {
                showSiteSearchResults();
            }
            else {
                alert("No matches found.");
            }
        } //end of if (docSearchTerm != null && docSearchTerm!="")
        // re-allow user input
        document.getElementById("popUpBackgroundContent").innerHTML = "Calculating....";
        document.getElementById("popUpBackground").style.display = "none";
    });
}
//==========================================================================================
// getMatchPhrases
//==========================================================================================
function getMatchPhrases(inArr, strIn) {
    //build matchArr to with unique values of inArr
    let matchArr = [];
    matchArr.push(inArr[0]);
    for (let i = 1; i <= inArr.length - 1; i++) {
        let foundMatch = false;
        for (let j = 0; j <= matchArr.length - 1; j++) {
            if (inArr[i]['text'] === matchArr[j]['text']) {
                foundMatch = true;
            }
        }
        if (!foundMatch) {
            matchArr.push(inArr[i]);
        }
    }
    //remove escaped characters from strIn
    strIn = strIn.replace(/\\n/g, " ");
    strIn = strIn.replace(/\\t/g, " ");
    strIn = strIn.replace(/\\'/g, "'");
    strIn = strIn.replace(/\\"/g, '"');
    strIn = strIn.replace(/\\/g, " ");
    let result = [];
    for (let matchNum = 0; matchNum <= matchArr.length - 1; matchNum++) {
        let len = matchArr[matchNum]['text'].length;
        for (let startChar = 0; startChar <= strIn.length - len - 1; startChar++) {
            let subStr = strIn.substring(startChar, startChar + len);
            if (subStr === matchArr[matchNum]['text']) {
                //search forwards to start of previous word or punctuation, whichever comes first
                let rtPart = "";
                if (startChar + len <= strIn.length - 1) {
                    let endsFound = 0;
                    for (let i = startChar + len - 1; i <= strIn.length - 1; i++) {
                        let thisChar = strIn.charAt(i);
                        if (charIsPhraseEnder(thisChar)) {
                            endsFound = endsFound + 1;
                        }
                        if (thisChar === "<" || thisChar === ">") {
                            endsFound = 2;
                        }
                        //keep the first phrase ender but not the second  (unless its an HTML tag, then only keep the first)
                        if (endsFound < 2) {
                            rtPart = rtPart + thisChar;
                        }
                        else {
                            break;
                        }
                        ;
                    }
                }
                //search backwards to start of previous word or punctuation, whichever comes first
                let lftPart = "";
                if (startChar >= 1) {
                    let endsFound = 0;
                    for (let i = startChar - 2; i >= 0; i--) {
                        let thisChar = strIn.charAt(i);
                        if (charIsPhraseEnder(thisChar)) {
                            endsFound = endsFound + 1;
                        }
                        if (thisChar === "<" || thisChar === ">") {
                            endsFound = 2;
                        }
                        //keep the first phrase ender but not the second (unless its an HTML tag, then only keep the first)
                        if (endsFound < 2) {
                            lftPart = thisChar + lftPart;
                            //console.log("     endsFound="+endsFound+", lftPart=|" + lftPart + "|");
                        }
                        else if (endsFound >= 2) {
                            //console.log("     endsFound="+endsFound+", lftPart=|" + lftPart + "| BREAK" );
                            break;
                        }
                        ;
                    }
                }
                ;
                //remove any leading or trailing phrase enders
                let needToCheckForRemoval = true;
                if (rtPart.length <= 1 && lftPart.length <= 1) {
                    needToCheckForRemoval = false;
                }
                while (needToCheckForRemoval) {
                    if (rtPart.length > 0) {
                        if (charIsPhraseEnder(rtPart[rtPart.length - 1])) {
                            rtPart = rtPart.substring(0, rtPart.length - 1);
                            needToCheckForRemoval = true; //cause they could be doubled up
                        }
                        else {
                            needToCheckForRemoval = false;
                        }
                    }
                    if (lftPart.length > 0) {
                        if (charIsPhraseEnder(lftPart[0])) {
                            lftPart = lftPart.substring(1);
                            needToCheckForRemoval = true; //cause they could be doubled up
                        }
                        else {
                            needToCheckForRemoval = false;
                        }
                    }
                }
                if (charIsPhraseEnder(lftPart[0])) {
                    lftPart = lftPart.substring(1);
                }
                if (charIsPhraseEnder(rtPart[rtPart.length - 1])) {
                    rtPart = rtPart.substring(0, rtPart.length - 2);
                }
                //add phrase to result array
                let finalPhrase = lftPart + "<MARK>" + matchArr[matchNum]['text'] + "</MARK>" + rtPart;
                finalPhrase = finalPhrase.trim();
                result.push(finalPhrase);
            } //end of if (subStr===matchArr[matchNum]['text'])
        } //end of for (let startChar
    } //end of for (let matchNum
    //eliminate duplicates and show qty of each duplicate
    let wkgRslt = [];
    let rsltCountPair = new Object();
    rsltCountPair = { count: 1, rslt: result[0] };
    wkgRslt.push(rsltCountPair);
    for (let i = 1; i <= result.length - 1; i++) {
        let foundMatch = false;
        for (let j = 0; j <= wkgRslt.length - 1; j++) {
            //console.log("|"+result[i]+"|","|"+wkgRslt[j]['rslt']+"|");
            if (result[i] === wkgRslt[j]['rslt']) {
                wkgRslt[j]['count'] = wkgRslt[j]['count'] + 1;
                foundMatch = true;
            }
        }
        if (!foundMatch) {
            rsltCountPair = new Object();
            rsltCountPair = { count: 1, rslt: result[i] };
            wkgRslt.push(rsltCountPair);
        }
    }
    let finalRslt = [];
    for (let j = 0; j <= wkgRslt.length - 1; j++) {
        finalRslt.push("..." + wkgRslt[j]['rslt'] + "(" + wkgRslt[j]['count'] + ")...");
    }
    return finalRslt;
}
//==========================================================================================
// charIsPhraseEnder
//==========================================================================================	
function charIsPhraseEnder(inChar) {
    let rslt = true;
    if (inChar === undefined || inChar === "") {
        rslt = true;
    }
    if (inChar != undefined && inChar != "") {
        let val = inChar.charCodeAt(0);
        if (val >= 48 && val <= 57) {
            rslt = false;
        } //inChar is a digit
        if (val >= 65 && val <= 90) {
            rslt = false;
        } //inChar is a capital letter
        if (val >= 97 && val <= 122) {
            rslt = false;
        } //inChar is a lower case letter
        //console.log("inChar=|" + inChar + "|, val=" + val + " rslt=" + rslt);
    }
    return rslt;
}
//==========================================================================================
// getDocSearchPatterns
//==========================================================================================	
function getDocSearchPatterns(docSearchTerm) {
    //escape special characters docSearchTerm
    docSearchTerm = docSearchTerm.replace(/\\/g, "");
    docSearchTerm = docSearchTerm.replace(/\./g, "\\.");
    docSearchTerm = docSearchTerm.replace(/\^/g, "\\^");
    docSearchTerm = docSearchTerm.replace(/\$/g, "\\$");
    docSearchTerm = docSearchTerm.replace(/\*/g, "\\*");
    docSearchTerm = docSearchTerm.replace(/\+/g, "\\+");
    docSearchTerm = docSearchTerm.replace(/\?/g, "\\?");
    docSearchTerm = docSearchTerm.replace(/\)/g, "\\)");
    docSearchTerm = docSearchTerm.replace(/\(/g, "\\(");
    docSearchTerm = docSearchTerm.replace(/\^/g, "\\^");
    docSearchTerm = docSearchTerm.replace(/\[/g, "\\[");
    docSearchTerm = docSearchTerm.replace(/\{/g, "\\{");
    docSearchTerm = docSearchTerm.replace(/\|/g, "\\|");
    //.................................................
    // load docSearchPatterns
    //.................................................
    //keep anything between quotes as an individual item, otherwise split them up
    let startQuote = false;
    let word = "";
    docSearchPatterns.length = 0;
    for (let i = 0; i <= docSearchTerm.length - 1; i++) {
        let char = docSearchTerm[i];
        let charIsQuote = /^[�"']/.test(char);
        if (charIsQuote && !startQuote) {
            startQuote = true;
        }
        else if (charIsQuote && startQuote) {
            //found end of words in quotes
            startQuote = false;
            if (word != "") {
                docSearchPatterns.push(word);
            }
            word = "";
        }
        else if (char === " " && !startQuote) {
            //found end of word
            if (word != "") {
                docSearchPatterns.push(word);
            }
            word = "";
        }
        else if (i === docSearchTerm.length - 1) {
            //reached end of input String
            if (!charIsQuote) {
                word = word + char;
            }
            if (word != "") {
                docSearchPatterns.push(word);
            }
        }
        else if (!charIsQuote) {
            word = word + char;
        }
    }
}
//==========================================================================================
// searchDocument
//==========================================================================================
function searchDocument(precisionRqd = 1.00, userClick = true) {
    //0.82 (very fuzzy) < precisionRqd <= 1.00 (perfect matches only)
    //initialize variables
    let foundSomeMatches = false;
    docSearchPrecision = precisionRqd; //save to global variable
    // make sure we are in display mode 
    //NOTE: CANNOT EDIT AND SAVE ON gitHub, FUTURE PROJECT ON DIFFERENT SERVICE WITH SERVER-SIDE Database
    /*
    let chgDisplayMode = setDocDisplayMode('display');
    if (chgDisplayMode === 'cancel'){
        //if user cancelled changing to display mode, do not perform search
        return;
    }
    */
    //clear out any existing search 
    clearDocumentSearch();
    docSearchPatterns.length = 0;
    docSearchTerm = docPageSearchInput.value.toString().trim().toLowerCase();
    if (docSearchTerm != null && docSearchTerm != "") {
        getDocSearchPatterns(docSearchTerm);
        //.................................................
        // search document text fields for matches
        //.................................................				
        //loop through annotations and captions of each page
        for (let pgNum = 0; pgNum <= docPages.length - 1; pgNum++) {
            let thisPageHasIt = false;
            //loop thru all the annotation paragraphs
            let thisAnnotation = docPages[pgNum]['description']; //NOTE: thisAnnotation is an array of paragraph texts
            for (let paraNum = 0; paraNum <= thisAnnotation.length - 1; paraNum++) {
                let thisTxt = thisAnnotation[paraNum].toString();
                thisPageHasIt = TextHasSearchTerm(thisTxt, precisionRqd);
                if (thisPageHasIt) {
                    break; //out of (let paraNum) loop
                }
            } //end of of (let paraNum) loop
            //check the caption
            if (!thisPageHasIt) {
                let thisTxt = docPages[pgNum]['caption'].toString();
                thisPageHasIt = TextHasSearchTerm(thisTxt, precisionRqd);
            }
            //if found match, add this page to docSearchResultPages array
            if (thisPageHasIt) {
                docSearchResultPages.push(pgNum);
                foundSomeMatches = true;
            }
        } //end of pgNum loop
        //.........................................................
        // if matches were found then show qty & go to first page
        //.........................................................
        if (foundSomeMatches) {
            docPagesAreSearched = true;
            document.getElementById("docSearchResultsQty").innerHTML = '1/' + docSearchResultPages.length;
            docSearchResultCurrPg = 0;
            loadDocPageNum(docSearchResultPages[0]);
        }
        // else reset to 0/0 and do not change pages
        else {
            document.getElementById("docSearchResultsQty").innerHTML = '0/0';
            docSearchResultCurrPg = 0;
        }
        //update webStack by copying the current location and adding results
        if (userClick) {
            //console.log("-------------------------------------------------------------------------------");
            //console.log("calling addToWebStack from searchDocument");
            addToWebStack(webStack[webStackIndex].pageParam);
        }
    } // end if (docSearchTerm != null && docSearchTerm!="")
    //==========================================================================================		
} //END OF FUNCTION searchDocument
//==========================================================================================
// navDocSearchResults
//==========================================================================================	
function navDocSearchResults(movement) {
    if (docPagesAreSearched) {
        if (movement === 'next') {
            docSearchResultCurrPg = docSearchResultCurrPg + 1;
        }
        else if (movement === 'prev') {
            docSearchResultCurrPg = docSearchResultCurrPg - 1;
        }
        ;
        if (docSearchResultCurrPg > docSearchResultPages.length - 1) {
            docSearchResultCurrPg = 0;
        }
        ;
        if (docSearchResultCurrPg < 0) {
            docSearchResultCurrPg = docSearchResultPages.length - 1;
        }
        ;
        // make sure we are in display mode
        //NOTE: CANNOT EDIT AND SAVE ON gitHub, FUTURE PROJECT ON DIFFERENT SERVICE WITH SERVER-SIDE Database
        /*
        setDocDisplayMode('display');
        */
        //update results quantity curr page number and load the page
        document.getElementById("docSearchResultsQty").innerHTML = (docSearchResultCurrPg + 1) + '/' + docSearchResultPages.length;
        docPgNum = docSearchResultPages[docSearchResultCurrPg];
        loadDocPageNum(docPgNum);
    }
}
//==========================================================================================
// loadDocPages
//==========================================================================================
function loadDocPages(filePath_1) {
    return __awaiter(this, arguments, void 0, function* (filePath, docTitle = "", userClick = true) {
        //console.log("in loadDocPages, recd filePath="+filePath+", docTitle="+docTitle+", userClick="+userClick);
        //console.log("rcd filePath="+filePath+", docTitle="+docTitle+", userClick="+userClick);
        docPgPath = filePath; //load global variable
        documentTitle = docTitle; //load global variable
        configurePage('document', false, true);
        //console.log("configured page");
        //set the subTitle
        document.getElementById("SubTitle").innerHTML = docTitle;
        //clean out old info
        document.getElementById("docAnnotation").innerHTML = "";
        document.getElementById("figCaption").innerHTML = "";
        let docPgImageEl = document.getElementById("docPageImg");
        docPgImageEl.src = "";
        //fetch the data about the document
        docPages.length = 0;
        let myObject = yield fetch(webRootLocation + filePath);
        let myText = yield myObject.text();
        docPages = JSON.parse(myText);
        let totDocPgs = document.getElementById("totalDocPages");
        totDocPgs.innerHTML = " of " + docPages.length;
        //reset current page number within document
        docPgNum = 0;
        //load the first page
        loadDocPageNum(0, userClick);
        // if there is a site search in place and no document specific search in place,
        // then	search for the site request
        //console.log("siteSearchTermInput="+siteSearchTermInput+", docSearchTerm="+docSearchTerm);
        if (siteSearchTermInput != "" && docSearchTerm === "") {
            //console.log("searching document");
            docPageSearchInput.value = siteSearchTermInput;
            searchDocument(siteSearchPrecision, false);
        }
        //update webStack 
        if (userClick) {
            //console.log("-------------------------------------------------------------------------------");
            //console.log("calling addToWebStack from loadDocPages");
            let thisPage = new PageObject();
            thisPage.number = "";
            thisPage.title = docTitle;
            thisPage.path = filePath;
            thisPage.category = "SourceMatl";
            addToWebStack(thisPage);
        }
    });
}
;
//==========================================================================================
// loadDocPageNum
//==========================================================================================	
function loadDocPageNum(pgNum, userClick = true) {
    docPgNum = pgNum * 1; //global variable load
    // update image source path
    let docImg = document.getElementById('docPageImg');
    docImg.src = webRootLocation + docPages[pgNum]['photoFilePath'].toString();
    //update image caption
    let figCapt = document.getElementById('figCaption');
    if (docPages[pgNum]['caption'].length > 0) {
        figCapt.innerHTML = docPages[pgNum]['caption'];
    }
    else {
        figCapt.innerHTML = "";
    }
    //update the annotation HTML
    let thisAnnotation = docPages[pgNum]['description']; //NOTE: thisAnnotation is an array of paragraph texts
    let totalAnnotation = "";
    for (let paraNum = 0; paraNum <= thisAnnotation.length - 1; paraNum++) {
        thisAnnotation[paraNum] = thisAnnotation[paraNum].toString().replace(/[\r\n]/g, "<br>");
        totalAnnotation = totalAnnotation + thisAnnotation[paraNum] + "<br><br>";
    }
    let docAnnot = document.getElementById("docAnnotation");
    docAnnot.innerHTML = totalAnnotation;
    //update the page number input box
    docPageNumInput.setAttribute("value", (Number(pgNum) + 1).toString()); //NOTE: pgNum is zero based, people like 1 based
    docPageNumInput.dispatchEvent(new Event('input'));
    docPageNumInput.value = (Number(pgNum) + 1).toString();
    docPageNumInput.focus();
    docPageNumInput.dispatchEvent(new Event('input'));
    // if docPagesAreSearched then search and highlight all the instances
    if (docPagesAreSearched) {
        for (let term = 0; term <= docSearchPatterns.length - 1; term++) {
            //..................................						
            //highlight instances in annotation
            //..................................
            let matchSubStrings = FindMatchSubStrings(cleanStringOfPunctuation(docAnnot.innerHTML), "length");
            /*
            console.log("term#=" + term + ", docSearchPatterns[term]="+ docSearchPatterns[term]);
            console.log("matchSubStrings =" + JSON.stringify(matchSubStrings));
            console.log("----------------------------------------------------------");
            */
            if (matchSubStrings[0] != null) {
                for (let i = 0; i <= matchSubStrings.length - 1; i++) {
                    //console.log(i, JSON.stringify(matchSubStrings[i]));
                    let re = new RegExp(matchSubStrings[i]['text'], "gi");
                    //console.log("    re=" + re + ", matchSubStrings[i]['text']=" + matchSubStrings[i]['text'])
                    docAnnot.innerHTML = docAnnot.innerHTML.replace(re, '<mark>' + matchSubStrings[i]['text'] + '</mark>');
                }
            }
            //..................................
            //highlight instances in caption
            //..................................
            matchSubStrings = FindMatchSubStrings(cleanStringOfPunctuation(figCapt.innerHTML), "length");
            //console.log("caption matchSubStrings.length=" + matchSubStrings.length);
            //console.log("caption matchSubStrings="+JSON.stringify(matchSubStrings));
            if (matchSubStrings[0] != null) {
                for (let i = 0; i <= matchSubStrings.length - 1; i++) {
                    let re = new RegExp(matchSubStrings[i]['text'], "gi");
                    figCapt.innerHTML = figCapt.innerHTML.replace(re, '<mark>' + matchSubStrings[i]['text'] + '</mark>');
                }
            }
        }
    }
    //add to the web page stack if user navigated here
    /*
    if (userClick){
        console.log("calling addToWebStack from loadDocPageNum");
        let thisPage = new PageObject();
        thisPage.number="";
        thisPage.title="";
        thisPage.path="";
        thisPage.category="SourceMatl";
        let stackEl = new PageStack();
        addToWebStack(thisPage);
    }
    */
}
;
//==========================================================================================
// cleanStringOfPunctuation
//==========================================================================================		
function cleanStringOfPunctuation(inString) {
    var punctuationless = inString.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
    var finalString = punctuationless.replace(/\s{2,}/g, " ");
    return finalString;
}
//==========================================================================================
// removeTagsFromString
//==========================================================================================		
function removeTagsFromString(myText) {
    //console.log("rcd myText=" + myText);
    //remove all text prior to the <BODY> tag
    if (myText.indexOf('<BODY>') >= 0) {
        myText = myText.substring(myText.indexOf('<BODY>') + 7);
    }
    //remove all text inside tags (between '<' and '>'	
    let inTag = false;
    let clnStr = "";
    for (let j = 0; j <= myText.length - 1; j++) {
        if (myText[j] === "<") {
            inTag = true;
        }
        else if (myText[j] === ">") {
            inTag = false;
        }
        else if (!inTag) {
            clnStr = clnStr + myText[j];
        }
        //console.log(j, myText[j],inTag, clnStr);
    }
    return clnStr;
}
//==========================================================================================
// navDocPage
//==========================================================================================	
function navDocPage(movement) {
    if (movement === 'first') {
        docPgNum = 0;
    }
    else if (movement === 'last') {
        docPgNum = docPages.length - 1;
    }
    else if (movement === "prev") {
        if (docPgNum === 0) { //circle back to end
            docPgNum = docPages.length - 1;
        }
        else {
            docPgNum = docPgNum - 1;
        }
    }
    else if (movement === "next") {
        if (docPgNum === docPages.length - 1) { //circle back to start
            docPgNum = 0;
        }
        else {
            docPgNum = docPgNum + 1;
        }
    }
    // make sure we are in display mode
    //NOTE: CANNOT EDIT AND SAVE ON gitHub, FUTURE PROJECT ON DIFFERENT SERVICE WITH SERVER-SIDE Database
    /*
    setDocDisplayMode('display');
    */
    //update the page number input box to account for limiting
    docPageNumInput.setAttribute("value", (Number(docPgNum) + 1).toString()); //NOTE: pgNum is zero based, people like 1 based
    docPageNumInput.dispatchEvent(new Event('input'));
    docPageNumInput.value = (Number(docPgNum) + 1).toString();
    docPageNumInput.focus();
    docPageNumInput.dispatchEvent(new Event('input'));
    //load the requested page	
    loadDocPageNum(docPgNum);
}
;
//==========================================================================================
// buildSchoolLinks
//==========================================================================================	
function buildSchoolLinks() {
    var subSelContents = "";
    let param = "";
    //............................
    // Pottawatomie Mission
    //............................
    param = JSON.stringify(pottawatomieMissionSchool);
    param = param.replace(/"/g, "'");
    subSelContents = subSelContents + String.fromCharCode(13) + "<a></a>" + String.fromCharCode(13) + "<a><b><u>FEDERAL</u></b></a><BR>";
    subSelContents = subSelContents + String.fromCharCode(13) + "<a class='link-like' onclick=\"showSchool(";
    subSelContents = subSelContents + param + ", 'Overview')\">";
    subSelContents = subSelContents + pottawatomieMissionSchool.title + "</a><BR>";
    //............................
    // County Districts
    //............................
    var foundJoints = false;
    var foundAdjacents = false;
    subSelContents = subSelContents + "<BR><BR>" + String.fromCharCode(13) + "<a></a>" + String.fromCharCode(13) + "<a><b><u>COUNTY GRADE SCHOOLS</u></b></a><BR>";
    for (var i = 0; i <= countySchoolDistricts.length - 1; i++) {
        if (countySchoolDistricts[i].category === "Joint" && !foundJoints) {
            subSelContents = subSelContents + String.fromCharCode(13) + "<BR><a></a>" + String.fromCharCode(13) + "<a><u>JOINT DISTRICTS</u></a><BR>";
            foundJoints = true;
        }
        if (countySchoolDistricts[i].category === "Adjacent" && !foundAdjacents) {
            subSelContents = subSelContents + String.fromCharCode(13) + "<BR><a></a>" + String.fromCharCode(13) + "<a><u>ADJACENT DISTRICTS</u></a><BR>";
            foundAdjacents = true;
        }
        // Example:
        //<a onclick="showSchool({'number':'005','title':'5 Banner','path':'CountyDistricts/005/005_Overview.html','category':'JacksonCounty'})">5 Banner</a>
        param = JSON.stringify(countySchoolDistricts[i]);
        param = param.replace(/"/g, "'");
        subSelContents = subSelContents + String.fromCharCode(13) + "<a class='link-like' onclick=\"showSchool(";
        subSelContents = subSelContents + param + ", 'Overview', true)\">";
        subSelContents = subSelContents + countySchoolDistricts[i].title + "</a><BR>";
    }
    //............................
    // County High Schools
    //............................
    foundJoints = false;
    foundAdjacents = false;
    subSelContents = subSelContents + "<BR><BR>" + String.fromCharCode(13) + "<BR><a></a>" + String.fromCharCode(13) + "<a><b><u>COUNTY HIGH SCHOOLS</u></b></a><BR>";
    for (var i = 0; i <= countyHighSchools.length - 1; i++) {
        if (countyHighSchools[i].category === "Joint" && !foundJoints) {
            subSelContents = subSelContents + String.fromCharCode(13) + "<BR><a></a>" + String.fromCharCode(13) + "<a><u>JOINT DISTRICTS</u></a><BR>";
            foundJoints = true;
        }
        if (countyHighSchools[i].category === "Adjacent" && !foundAdjacents) {
            subSelContents = subSelContents + String.fromCharCode(13) + "<BR><a></a>" + String.fromCharCode(13) + "<a><u>ADJACENT DISTRICTS</u></a><BR>";
            foundAdjacents = true;
        }
        // Example:
        //<a onclick="menuClick({category:'High Schools',subCat:'RHS5', title:'RHS 5 Mayetta'})">RHS 5 Mayetta</a>
        param = JSON.stringify(countyHighSchools[i]);
        param = param.replace(/"/g, "'");
        subSelContents = subSelContents + String.fromCharCode(13) + "<a class='link-like' onclick=\"showSchool(";
        subSelContents = subSelContents + param + ", 'Overview', true)\">";
        subSelContents = subSelContents + countyHighSchools[i].title + "</a><BR>";
    }
    //............................
    // USDs
    //............................
    foundJoints = false;
    foundAdjacents = false;
    subSelContents = subSelContents + "<BR><BR>" + String.fromCharCode(13) + "<BR><a></a>" + String.fromCharCode(13) + "<a><b><u>UNIFIED SCHOOL DISTRICTS</u></b></a><BR>";
    for (var i = 0; i <= usdSchools.length - 1; i++) {
        if (usdSchools[i].category === "Joint" && !foundJoints) {
            subSelContents = subSelContents + String.fromCharCode(13) + "<BR><a></a>" + String.fromCharCode(13) + "<a><u>JOINT DISTRICTS</u></a><BR>";
            foundJoints = true;
        }
        if (usdSchools[i].category === "Adjacent" && !foundAdjacents) {
            subSelContents = subSelContents + String.fromCharCode(13) + "<BR><a></a>" + String.fromCharCode(13) + "<a><u>ADJACENT DISTRICTS</u></a><BR>";
            foundAdjacents = true;
        }
        // Example:
        //<a onclick="menuClick({category:'UnifiedSchoolDistricts',subCat:'USD337', title:'USD337 Royal Valley'})">USD337 Royal Valley</a>
        param = JSON.stringify(usdSchools[i]);
        param = param.replace(/"/g, "'");
        subSelContents = subSelContents + String.fromCharCode(13) + "<a class='link-like' onclick=\"showSchool(";
        subSelContents = subSelContents + param + ", 'Overview', true)\">";
        subSelContents = subSelContents + usdSchools[i].title + "</a><BR>";
    }
    //............................
    // Colleges
    //............................
    foundJoints = false;
    foundAdjacents = false;
    subSelContents = subSelContents + "<BR><BR>" + String.fromCharCode(13) + "<BR><a></a>" + String.fromCharCode(13) + "<a><b><u>COLLEGES</u></b></a><BR>";
    for (var i = 0; i <= colleges.length - 1; i++) {
        if (colleges[i].category === "Joint" && !foundJoints) {
            subSelContents = subSelContents + String.fromCharCode(13) + "<BR><a></a>" + String.fromCharCode(13) + "<a><u>JOINT DISTRICTS</u></a><BR>";
            foundJoints = true;
        }
        if (colleges[i].category === "Adjacent" && !foundAdjacents) {
            subSelContents = subSelContents + String.fromCharCode(13) + "<BR><a></a>" + String.fromCharCode(13) + "<a><u>ADJACENT DISTRICTS</u></a><BR>";
            foundAdjacents = true;
        }
        param = JSON.stringify(colleges[i]);
        param = param.replace(/"/g, "'");
        subSelContents = subSelContents + String.fromCharCode(13) + "<a class='link-like' onclick=\"showSchool(";
        subSelContents = subSelContents + param + ", 'Overview', true)\">";
        subSelContents = subSelContents + colleges[i].title + "</a><BR>";
    }
    return subSelContents;
}
;
//==========================================================================================
// sizeBars
//==========================================================================================
function sizeBars() {
    // CALCULATE HEIGHT OF MAIN TITLE
    var titleBar = document.getElementById("TitleBar");
    topTitleHeight = titleBar.offsetHeight;
    // LOCATE TOP OF MAIN MENU BAR AND CALCULATE ITS HEIGHT
    var menuBar = document.getElementById("MainMenu");
    menuBar.style.top = topTitleHeight + "px";
    topMenuHeight = menuBar.offsetHeight;
    // LOCATE TOP OF SUB TITLE AND CALCULATE ITS HEIGHT
    var subTitle = document.getElementById("SubTitle");
    subTitle.style.top = (topTitleHeight + topMenuHeight) + 'px';
    subTitleHeight = subTitle.offsetHeight;
    // LOCATE TOP OF SUB MENU AND CALCULATE ITS HEIGHT
    var subMenu = document.getElementById("SubMenu");
    subMenu.style.top = (topTitleHeight + topMenuHeight + subTitleHeight) + 'px';
    subMenuHeight = subMenu.offsetHeight;
    // LOCATE CONTENT TITLE BAR AND CALCULATE ITS HEIGHT
    var contentTitle = document.getElementById("ContentTitle");
    contentTitle.style.top = (topTitleHeight + topMenuHeight + subTitleHeight + subMenuHeight) + 'px';
    contentTitleHeight = contentTitle.offsetHeight;
    // SIZE THE SPACER ELEMENT 
    var spacer = document.getElementById("Spacer");
    spacer.style.height = (topTitleHeight + topMenuHeight + subTitleHeight + subMenuHeight + contentTitleHeight) + 'px';
}
;
//==========================================================================================
// showMap
//==========================================================================================
function showMap(params, userClick = true) {
    var contentTitleBar = document.getElementById("ContentTitle");
    var subTitle = document.getElementById("SubTitle");
    configurePage('subPage', true, false);
    subTitle.innerHTML = "Maps";
    contentTitleBar.innerHTML = params['title'];
    myIframe.src = params['path'];
    //add to the web page stack if user navigated here
    if (userClick) {
        let thisPage = JSON.parse(JSON.stringify(params));
        addToWebStack(thisPage);
    }
}
//==========================================================================================
// showSchool
//==========================================================================================
function showSchool(params, subMenuSelection = "", userClick = true) {
    let contentTitleBar = document.getElementById("ContentTitle");
    let subTitle = document.getElementById("SubTitle");
    let filePath = "";
    //subMenuSelection is only specified when user changes subMenu for a school (e.g. Overview, Location, People, Event)
    // stack moves and search results need sorted here
    if (subMenuSelection != "") {
        filePath = params['path'].replace('Overview', subMenuSelection);
        filePath = filePath.replace('Events', subMenuSelection);
        filePath = filePath.replace('Locations', subMenuSelection);
        filePath = filePath.replace('People', subMenuSelection);
    }
    else {
        filePath = params['path'];
        if (filePath.indexOf('Overview') >= 0) {
            subMenuSelection = 'Overview';
        }
        else if (filePath.indexOf('Events') >= 0) {
            subMenuSelection = 'Events';
        }
        else if (filePath.indexOf('Locations') >= 0) {
            subMenuSelection = 'Locations';
        }
        else if (filePath.indexOf('People') >= 0) {
            subMenuSelection = 'People';
        }
    }
    //show the correct configuration and update titles
    configurePage('subPage', true, true);
    let thisTitle = params['title'];
    thisTitle = thisTitle.replace(' Locations', ''); //search results can send title with this in it
    thisTitle = thisTitle.replace(' Events', ''); //search results can send title with this in it
    thisTitle = thisTitle.replace(' People', ''); //search results can send title with this in it
    subTitle.innerHTML = "School: " + thisTitle;
    contentTitleBar.innerHTML = subMenuSelection;
    //build and fill the school-specific navbar
    let schoolNavBar = document.getElementById("schoolNavBar");
    let strParam = JSON.stringify(params);
    strParam = strParam.replace(/"/g, "'");
    let navHTML = "<a onclick=\"showSchool(" + strParam + ",'Overview')\">Overview</a>";
    navHTML = navHTML + "<a onclick=\"showSchool(" + strParam + ",'Locations')\">Location(s) and Bldg(s)</a>";
    navHTML = navHTML + "<a onclick=\"showSchool(" + strParam + ",'People')\">People</a>";
    navHTML = navHTML + "<a onclick=\"showSchool(" + strParam + ",'Events')\">Events</a>";
    schoolNavBar.innerHTML = navHTML;
    //add to the web page stack if user navigated here
    if (userClick) {
        //make a new object since we may have modified the filePath above
        let thisPage = JSON.parse(JSON.stringify(params));
        thisPage.path = filePath;
        addToWebStack(thisPage);
    }
    //load the requested page
    myIframe.src = filePath;
}
//==========================================================================================
// showOverview
//==========================================================================================
function showOverview(params, userClick = true) {
    let contentTitleBar = document.getElementById("ContentTitle");
    let subTitle = document.getElementById("SubTitle");
    //show the correct configuration and update titles
    configurePage('subPage', true, false);
    subTitle.innerHTML = "Overview";
    contentTitleBar.innerHTML = params['title'];
    //load the requested page
    myIframe.src = params['path'];
    //add to the web page stack if user navigated here
    if (userClick) {
        addToWebStack(params);
    }
}
//==========================================================================================
// highlightSearchResultsInSubPage
//==========================================================================================
function highlightSearchResultsInSubPage() {
    //console.log("in highlightSearchResultsInSubPage with siteSearchTermInput=|" + siteSearchTermInput + ", and siteSearchResults.length=" + siteSearchResults.length);
    //get current page data from stack
    let thisPage = webStack[webStackIndex];
    let pgPath = thisPage['pageParam']['path'];
    //if there was a search, highlight Matches
    if (siteSearchTermInput != "" && siteSearchResults.length > 0) {
        //find the search match for this page
        for (let i = 0; i <= siteSearchResults.length - 1; i++) {
            //console.log(i,siteSearchResults[i]['page']['path'],pgPath);
            if (siteSearchResults[i]['page']['path'] === pgPath) {
                //console.log('found matching path');
                for (let j = 0; j <= siteSearchResults[i]['matches'].length - 1; j++) {
                    let re = RegExp(siteSearchResults[i]['matches'][j]['text'], "ig");
                    let iframeDoc = myIframe.contentDocument || myIframe.contentWindow.document;
                    var iframeBody = iframeDoc.getElementsByTagName('body')[0];
                    //console.log(iframeBody.innerHTML);
                    let txt = iframeBody.innerHTML;
                    iframeBody.innerHTML = txt.replace(re, "<MARK>" + siteSearchResults[i]['matches'][j]['text'] + "</MARK>");
                }
            }
        }
    }
}
//==========================================================================================
// menuClick
//==========================================================================================
function menuClick(params, userClick = true) {
    //console.log("params=" + JSON.stringify(params));
    var category = params.category;
    var subCat = params.subCat;
    var title = ``;
    if (params.title) {
        title = params.title;
    }
    var contentSource = '';
    var subTitle = document.getElementById("SubTitle");
    var subMenu = document.getElementById("SubMenu");
    var contentTitleBar = document.getElementById("ContentTitle");
    let iFrameHldr = document.getElementById("iFrameHolder");
    let documentContentHolder = document.getElementById("documentContentHolder");
    let docAnnot = document.getElementById("docAnnotation");
    let docFigCapt = document.getElementById("figCaption");
    let docNavBar = document.getElementById("docNavBar");
    let schoolNavBar = document.getElementById("schoolNavBar");
    let docPgImg = document.getElementById("docPageImg");
    let searchRsltsHolder = document.getElementById("searchResultsHolder");
    let subSelectorContentHolder = document.getElementById("subSelectorContents");
    let thisPage = new PageObject();
    let pageStckEl = new PageStack();
    let param = "";
    subMenuName = '';
    subMenuCat = '';
    let subSelectorContents = "";
    // SWITCH ON CATEGORY
    switch (category) {
        //---------------------------
        case 'Test':
            //---------------------------	
            configurePage('test', false, false);
            //load the document pages
            loadDocPages("Test/Test_Files/AnnotatedPhotos_LloydCopeland.json");
            break;
        //---------------------------
        case 'Home':
            //---------------------------		  
            configurePage('subPage', false, false);
            subTitle.innerHTML = "Welcome";
            myIframe.src = "Welcome/Welcome.html";
            //add to the web page stack if user navigated here
            if (userClick) {
                thisPage = new PageObject();
                thisPage.number = "";
                thisPage.title = "Welcome";
                thisPage.path = "Welcome/Welcome.html";
                thisPage.category = "Home";
                addToWebStack(thisPage);
            }
            break;
        //---------------------------
        case 'Overview':
            //---------------------------	
            configurePage('subSelector', false, false);
            subTitle.innerHTML = "Overview";
            //build contents of subSelectorContents
            subSelectorContents = "";
            for (var i = 0; i <= overviews.length - 1; i++) {
                param = JSON.stringify(overviews[i]);
                param = param.replace(/"/g, "'");
                subSelectorContents = subSelectorContents + String.fromCharCode(13) + "<a class='link-like'";
                subSelectorContents = subSelectorContents + "onclick=\"showOverview(" + param + ", true);\">";
                subSelectorContents = subSelectorContents + overviews[i].title + "</a><br><br>";
            }
            subSelectorContentHolder.style.columnCount = '1';
            subSelectorContentHolder.innerHTML = subSelectorContents;
            //add to the web page stack if user navigated here
            if (userClick) {
                thisPage = new PageObject();
                thisPage.number = "";
                thisPage.title = "Overview";
                thisPage.path = "";
                thisPage.category = "Overview";
                addToWebStack(thisPage);
            }
            break;
        //---------------------------
        case 'Maps':
            //---------------------------				
            configurePage('subSelector', false, false);
            subTitle.innerHTML = "Maps";
            //build contents of subSelectorContents
            subSelectorContents = "";
            for (var i = 0; i <= maps.length - 1; i++) {
                // Example:
                //<a onclick="showMap({"category":"Maps","subCat":"1878 Jackson Co.","path":"Maps/1878_JacksonCo.html","title":"1878 Jackson Co."})">1878 Jackson Co.</a>
                param = JSON.stringify(maps[i]);
                param = param.replace(/"/g, "'");
                subSelectorContents = subSelectorContents + String.fromCharCode(13) + "<a class='link-like'";
                subSelectorContents = subSelectorContents + "onclick=\"showMap(" + param + ", true)\">";
                subSelectorContents = subSelectorContents + maps[i].title + "</a><br><br>";
            }
            subSelectorContentHolder.style.columnCount = '3';
            subSelectorContentHolder.innerHTML = subSelectorContents;
            //add to the web page stack if user navigated here
            if (userClick) {
                thisPage = new PageObject();
                thisPage.number = "";
                thisPage.title = "Maps";
                thisPage.path = "";
                thisPage.category = "Maps";
                pageStckEl = new PageStack();
                addToWebStack(thisPage);
            }
            break;
        //---------------------------		
        case 'Schools':
            //---------------------------
            configurePage('subSelector', false, false);
            subTitle.innerHTML = "Schools";
            subSelectorContentHolder.style.columnCount = '4';
            subSelectorContentHolder.innerHTML = buildSchoolLinks(); //call subroutine to load the links
            //add to the web page stack if user navigated here
            if (userClick) {
                thisPage = new PageObject();
                thisPage.number = "";
                thisPage.title = "Schools";
                thisPage.path = "";
                thisPage.category = "Schools";
                addToWebStack(thisPage);
            }
            break;
        //---------------------------	
        case 'References':
            //---------------------------	
            configurePage('subPage', false, false);
            subTitle.innerHTML = "References";
            myIframe.src = "References/References.html";
            //add to the web page stack if user navigated here
            if (userClick) {
                thisPage = new PageObject();
                thisPage.number = "";
                thisPage.title = "References";
                thisPage.path = "References/References.html";
                thisPage.category = "References";
                addToWebStack(thisPage);
            }
            break;
        //---------------------------	
        case 'SourceMatl':
            //---------------------------	
            configurePage('subPage', false, false);
            subTitle.innerHTML = "Source Materials";
            myIframe.src = "SourceMatls/SourceMatls.html";
            //add to the web page stack if user navigated here
            if (userClick) {
                //console.log("-------------------------------------------------------------------------------");
                //console.log("calling addToWebStack from menuClick");
                thisPage = new PageObject();
                thisPage.number = "";
                thisPage.title = "SourceMatl";
                thisPage.path = "";
                thisPage.category = "SourceMatl";
                addToWebStack(thisPage);
            }
            break;
        //---------------------------	
        case 'About':
            //---------------------------	
            configurePage('subPage', false, false);
            subTitle.innerHTML = "About";
            myIframe.src = "About/About.html";
            //add to the web page stack if user navigated here
            if (userClick) {
                thisPage = new PageObject();
                thisPage.number = "";
                thisPage.title = "About";
                thisPage.path = "About/About.html";
                thisPage.category = "About";
                addToWebStack(thisPage);
                ;
            }
            break;
    }
    window.top.scrollTo(0, 0);
    // ADJUST LOCATIONS OF BARS
    this.sizeBars;
}
;
//==========================================================================================
// FindMatchSubStrings
//==========================================================================================	
function FindMatchSubStrings(textIn, sortByChoice) {
    //==========================================================================================
    //find unique substrings within textIn that match items in array docSearchPatterns 
    //		with precision docSearchPrecision
    //==========================================================================================
    // INPUTS
    //		docSearchPatterns = a GLOBAL array of search patterns
    //		textIn = text to be searched for matching substrings
    //		sortByChoice='length' returns array sorted by length of 'text' descending
    //		sortByChoice='weight' returns arryay sorted by matching weight descending
    //
    //==========================================================================================
    // RETURNS
    // 		filteredMatches = an array of objects of form {text, score, position} for each matching substring
    //						  in textIn
    //==========================================================================================
    let foundMatches = [];
    textIn = removeTagsFromString(textIn); //remove HTML tags from the string so we don't match "Cedar" to ">Ceda"
    /*
    console.log("==================================================");
    console.log("textIn=" + textIn);
    console.log("docSearchPatterns=" + JSON.stringify(docSearchPatterns));
    console.log("docSearchPrecision=" + docSearchPrecision);
    console.log("==================================================");
    */
    for (let termNum = 0; termNum <= docSearchPatterns.length - 1; termNum++) {
        let thisTerm = docSearchPatterns[termNum];
        if (docSearchPrecision >= 1) {
            let re = new RegExp(thisTerm, "gi"); //do this to get case insensitive search
            let allRslts = textIn.matchAll(re); //returns iterable object with all matches and their indices
            for (const match of allRslts) {
                //console.log(match);
                let rsltObj = { text: match[0], score: 1, position: match.index };
                foundMatches.push(rsltObj);
            }
        }
        else {
            //check substrings with lengths between docSearchPrecision*thisTerm.length and 1.precisionRequired*thisTerm.length (e.g. between 0.75 and 1.25)
            let thisStartLen = Math.floor(thisTerm.length * docSearchPrecision);
            let thisEndLen = Math.ceil(thisTerm.length * (1 + (1 - docSearchPrecision)));
            for (let len = thisEndLen; len >= thisStartLen; len--) {
                for (let startPos = 0; startPos <= textIn.length - 1 - len; startPos++) {
                    let subStr = textIn.substring(startPos, startPos + len - 1);
                    let wt = this.JaroWinklerDistance(thisTerm, subStr);
                    if (wt >= docSearchPrecision) {
                        let rsltObj = { text: subStr.trim(), score: wt, position: startPos };
                        foundMatches.push(rsltObj);
                        //console.log("rsltObj="+JSON.stringify(rsltObj));
                    }
                } //end of (let startPos) loop
            } //end of (let len) loop
        } //end of else docSearchPrecision<1
    } //end of (let termNum)
    //console.log("foundMatches="+JSON.stringify(foundMatches));
    //sort by length descending so can eliminate matching substrings for unique values (e.g. keep "Cedar" and don't keep "Ceda" if they have the same startPos)
    foundMatches.sort((a, b) => b['text'].length - a['text'].length);
    //console.log("sorted foundMatches="+JSON.stringify(foundMatches));
    //reduce foundMatches to unique values (text and position) only
    let filteredMatches = [];
    filteredMatches.push(foundMatches[0]);
    for (let i = 1; i <= foundMatches.length - 1; i++) {
        let foundMatch = false;
        for (let j = 0; j <= filteredMatches.length - 1; j++) {
            if (foundMatches[i]['text'] === filteredMatches[j]['text'] && foundMatches[i]['position'] === filteredMatches[j]['position']) {
                foundMatch = true;
                if (foundMatches[i]['wt'] > filteredMatches[j]['wt']) {
                    filteredMatches[j]['wt'] = foundMatches[i]['wt'];
                }
            }
            //keep "Cedar" and don't keep "Ceda" if they have the same starting position
            else if (filteredMatches[j]['text'].indexOf(foundMatches[i]['text']) >= 0 && filteredMatches[j]['position'] === foundMatches[i]['position']) {
                foundMatch = true;
            }
        } //end of for j
        if (!foundMatch) {
            filteredMatches.push(foundMatches[i]);
        }
    } //end of for i
    //console.log("filteredMatches="+JSON.stringify(filteredMatches));
    //sort as requested
    if (sortByChoice === 'length') {
        filteredMatches.sort((a, b) => b['text'].length - a['text'].length);
    }
    else if (sortByChoice === 'weight') {
        filteredMatches.sort((a, b) => b['wt'] - a['wt']);
    }
    //console.log("sorted filteredMatches="+JSON.stringify(filteredMatches));		
    return filteredMatches;
}
//==========================================================================================
// TextHasSearchTerm
//==========================================================================================	
function TextHasSearchTerm(textIn, precisionRqd) {
    //==========================================================================================
    // Returns true if any term in array docSearchPatterns matches any part of 
    //		textIn with precisionRqd
    //==========================================================================================
    docSearchPrecision = precisionRqd;
    let thisPageHasIt = false;
    for (let termNum = 0; termNum <= docSearchPatterns.length - 1; termNum++) {
        let thisTerm = docSearchPatterns[termNum];
        if (docSearchPrecision >= 1) {
            let re = new RegExp(thisTerm, "gi");
            let result = textIn.match(re); //returns array of all matching subtexts
            if (result != null) {
                thisPageHasIt = true;
                break; //out of (let termNum) loop
            }
        }
        else {
            //check substrings with lengths between docSearchPrecision*thisTerm.length and 1.precisionRequired*thisTerm.length (e.g. between 0.75 and 1.25)
            let thisStartLen = Math.floor(thisTerm.length * docSearchPrecision);
            let thisEndLen = Math.ceil(thisTerm.length * (1 + (1 - docSearchPrecision)));
            for (let len = thisEndLen; len >= thisStartLen; len--) {
                for (let startPos = 0; startPos <= textIn.length - 1 - len; startPos++) {
                    let wt = this.JaroWinklerDistance(thisTerm, textIn.substring(startPos, startPos + len - 1));
                    if (wt >= docSearchPrecision) {
                        thisPageHasIt = true;
                        break; //out of (let startPos) loop
                    }
                } //end of (let startPos) loop
                if (thisPageHasIt) {
                    break; //out of (let len) loop
                }
            } //end of (let len) loop
            if (thisPageHasIt) {
                break; //out of (let termNum) loop
            }
        } //end of else docSearchPrecision<1
    } //end of (let termNum) loop		
    return (thisPageHasIt);
}
//==========================================================================================
// JaroWinklerDistance
//==========================================================================================
const JaroWinklerDistance = function (s1, s2) {
    //==========================================================================================
    // for fuzzy searches, returns 'weight' where 0 = no match, 1=perfect match
    //		s1='martha', s2='marhta' --> weight = 0.96
    //==========================================================================================
    // REFS: 
    //	1) https://sumn2u.medium.com/string-similarity-comparision-in-js-with-examples-4bae35f13968
    //
    //==========================================================================================
    var m = 0;
    //make this case insensitive
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();
    // Exit early if either are empty.
    if (s1.length === 0 || s2.length === 0) {
        return 0;
    }
    // Exit early if they're an exact match.
    if (s1 === s2) {
        return 1;
    }
    var range = (Math.floor(Math.max(s1.length, s2.length) / 2)) - 1, s1Matches = new Array(s1.length), s2Matches = new Array(s2.length);
    for (let i = 0; i < s1.length; i++) {
        var low = (i >= range) ? i - range : 0, high = (i + range <= s2.length) ? (i + range) : (s2.length - 1);
        for (let j = low; j <= high; j++) {
            if (s1Matches[i] !== true && s2Matches[j] !== true && s1[i] === s2[j]) {
                ++m;
                s1Matches[i] = s2Matches[j] = true;
                break;
            }
        }
    }
    // Exit early if no matches were found.
    if (m === 0) {
        return 0;
    }
    // Count the transpositions.
    let n_trans = 0;
    let k = 0;
    for (let i = 0; i < s1.length; i++) {
        if (s1Matches[i] === true) {
            let j = 0;
            for (j = k; j < s2.length; j++) {
                if (s2Matches[j] === true) {
                    k = j + 1;
                    break;
                }
            }
            if (s1[i] !== s2[j]) {
                ++n_trans;
            }
        }
    }
    var weight = (m / s1.length + m / s2.length + (m - (n_trans / 2)) / m) / 3, l = 0, p = 0.1;
    if (weight > 0.7) {
        while (s1[l] === s2[l] && l < 4) {
            ++l;
        }
        weight = weight + l * p * (1 - weight);
    }
    return weight;
};
//# sourceMappingURL=scripts.js.map