if(!String.prototype.includes){String.prototype.includes=function(){'use strict';if(this!=null&&this!==undefined){return String.prototype.indexOf.apply(this,arguments)!== -1;}else return -1;};}
window.onload= function(){
    $(document).ready(function(){
       masterUtilities.toggleHamburgerMenu();
       document.getElementById('masterPage_searchBtn').onclick = searchfunctions.searchClicked;
       masterUtilities.openAnchorAccordion();
       jQuery("body").on("click", "a", masterUtilities.openAnchorAccordion);
       /*$("#srchBox").keypress(function (event) {
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if (keycode == '13' || keycode == '10') {
                event.preventDefault();
                pri_srch();//search function in masterpage. prevents enter from submitting aspx form.
            }
        });*/	        
    });
    masterUtilities.setChromeFavIcon();
    masterUtilities.setCopyRightYear();
    masterUtilities.setAriaBasedOnScreenSize();
    this.addEventListener("resize",function(){
        masterUtilities.setAriaBasedOnScreenSize();        
    });    
}

var masterUtilities ={
    authoringURL : 'https://testinga.dcccd.edu',
    addParameter : function(url, param, value){
        /* Using a positive lookahead (?=\=) to find the given parameter, preceded by a ? or &, and followed by a = with a value 
        after than (using a non-greedy selector) and then followed by a & or the end of the string */
        var val = new RegExp('(\\?|\\&)' + param + '=.*?(?=(&|$))'),
            parts = url.toString().split('#'),
            url = parts[0],
            hash = parts[1]
            qstring = /\?.+$/,
            newURL = url;    
        /* Check if the parameter exists if it does, replace it, using the captured group to determine & or ? at the beginning */
        if (val.test(url)) { newURL = url.replace(val, '$1' + param + '=' + value); }
        /* otherwise, if there is a query string at all add the param to the end of it */        
        else if (qstring.test(url)) { newURL = url + '&' + param + '=' + value; }
        /* if there's no query string, add one */
        else { newURL = url + '?' + param + '=' + value; }
        if (hash) { newURL += '#' + hash; } 
        return newURL;        
    },
    allSameValues : function (arr) {
        for (var i = 1; i < arr.length; i++) { if (arr[i] !== arr[0]) return false; } return true; 
    },
    getUrlParameter : function(sParam){
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] === sParam) { return sParameterName[1] === undefined ? true : sParameterName[1]; }
        }
    },
    moveAboveFooter : function(itemToMove){
        var inDesignMode = document.forms[MSOWebPartPageFormName].MSOLayout_InDesignMode.value;
        if(inDesignMode == 1){ console.log('In Design Mode not moving content'); }
        else{ var whatsMoving = document.getElementById(itemToMove); var movingAbove = document.getElementsByTagName('footer')[0]; movingAbove.parentElement.insertBefore(whatsMoving,movingAbove); }        
    },
    moveHTML : function(itemToMove,moveBefore){
        var inDesignMode = document.forms[MSOWebPartPageFormName].MSOLayout_InDesignMode.value;
        if(inDesignMode == 1){ console.log('In Design Mode not moving content'); }
        else{ var whatsMoving = document.getElementById(itemToMove); var movingAbove = document.getElementById(moveBefore); movingAbove.parentElement.insertBefore(whatsMoving,movingAbove); }
    },
    openAnchorAccordion : function(){
        // Opens accordion automatically if an accordion target is accessed from another page
        // Assumes the accordion-group is the target linked to
        if (window.location.hash) {
            var jQuerytarget = jQuery('body').find(window.location.hash);
            if (jQuerytarget.hasClass('panel-collapse')) {
                var jQuerytargetAccordion = jQuerytarget.find('.collapse');
                jQuerytarget.collapse('show');
            }
        }
    },
    refreshRequestDigest: function(){
        $.ajax({
            url: 'https://' + window.location.hostname + '/_api/contextinfo',
            type: 'POST',
            headers: { 
                'accept' : 'application/json;odata=verbose',
                'content-type' : 'application/json;odata=verbose'
            },
            success: function(data){
                inputRequestDigest = document.getElementById('__REQUESTDIGEST');
                console.log(inputRequestDigest.value);
                inputRequestDigest.value = data.d.GetContextWebInformation.FormDigestValue;
                console.log(inputRequestDigest.value);
                console.log(data);
            },
            error: function(jQxhr, errorCode, errorThrown){
                res = jQxhr;
                console.log(res);
            }

        });
    },
    removeIdRc : function(){
        if(window.location.hostname !== masterUtilities.authoringURL){$('.ms-rtestate-field').each(function(){this.removeAttribute('id'); this.removeAttribute('aria-labelledby');});} 
    },
    setAriaBasedOnScreenSize : function(){
        var desktopMasterAriaElements = document.getElementsByClassName('desktop_master');
        var mobileMasterAriaElements = document.getElementsByClassName('mobile_master');
        if(window.outerWidth > 767){
            for(var i=0; i< desktopMasterAriaElements.length;i++){ 
                desktopMasterAriaElements[i].setAttribute('aria-hidden',false)
            }       
            for(var i=0; i< mobileMasterAriaElements.length;i++){
                mobileMasterAriaElements[i].setAttribute('aria-hidden',true)
            }       
        }
        else{
            for(var i=0; i< desktopMasterAriaElements.length;i++){
                desktopMasterAriaElements[i].setAttribute('aria-hidden',true)
            }       
            for(var i=0; i< mobileMasterAriaElements.length;i++){
                mobileMasterAriaElements[i].setAttribute('aria-hidden',false)
            }               
        }
    },
    setCopyRightYear : function(){
        document.getElementById('masterpage_copyright_year').innerText=(new Date().getFullYear().toString());
    },
    setChromeFavIcon : function(){
        try{
            var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
            if (isChrome) {
                var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
                link.type = 'image/x-icon';
                link.rel = 'shortcut icon';
                link.href = '/icons/favicons/favicon.ico';
                document.getElementsByTagName('head')[0].appendChild(link);
            }
        }
        catch(e){ /*Do Nothing */}
    },
    toggleHamburgerMenu : function(){
        var $hamburger = $(".hamburger");
        $hamburger.on("click", function(e) {
            $hamburger.toggleClass("is-active");
            // Do something else, like open/close menu
        });
    }
}

var searchfunctions ={
    searchClicked :function(){
        var searchText = document.getElementById('masterPage_searchTxt').value;
        //console.log(encodeURIComponent(searchText.trim()));
        window.location = '/website/Pages/sitesearch.aspx#k=' + encodeURIComponent(searchText.trim());      
    }
}

var searchUtilities ={
	sharePointQuery : function (rowNumber,query){
        var res;
        var bestBets = 'processbestbets=true';
        var enableQueryRules = 'enablequeryrules=true';              
        var queryText = 'queryText=\'' + query + '\'';
        var rowsPerPage = 'rowsperpage=20';
        var startRow = 'startrow=' + rowNumber;  
        var requestUrl ="https://" + window.location.hostname + '/_api/search/query';
        requestUrl += '?' + queryText  + '&' + enableQueryRules + '&' + rowsPerPage + '&' + startRow + '&' + bestBets;
        $.ajax({
            url: requestUrl,
            headers: { Accept : 'application/json;odata=verbose', },
            method: 'GET',
            //success
            success: function(data){
                //res = data.d.results;
                console.log(data);
                console.log(data.d.query.PrimaryQueryResult.RelevantResults);
            },
            error: function (jQxhr, errorCode, errorThrown) {
                res = jQxhr;
                console.log(res);
            },
            dataType: 'json' //Make me a JSON)
        });
	},
	
}

/********************************************************	THIRD COURSE ATTEMPT FUNCTIONS ********************************************************/
/* Description: Converts a many-item list of pages into an easier form to work with. Just let it know which elements to flag as PaginationContainer and PaginationItem.*/
var DCCCD_Pagination = DCCCD_Pagination ? DCCCD_Pagination : function () {
	// private data members
	var ItemCount = 0; var SliceLength = 10; var IsPaginated = false;
	// private method members
	function SetVisibility() {		
		$('.PaginationItem').show(); /* show all items */		
		$('.PaginationContainer').each(function () { $(this).find('.PaginationItem').slice(SliceLength).hide(); }); /* hide all except our slice */		
		/* show more/less links as appropriate */
		if (SliceLength >= ItemCount) $('.PaginateShowMore').hide(); 
		else $('.PaginateShowMore').show();
		if (SliceLength <= 10) $('.PaginateShowLess').hide();
		else $('.PaginateShowLess').show();
		// set drop-down list
		$('.PaginateSelector').each(function () {
			if ($(this).find('option').filter('[value="' + SliceLength + '"]').length > 0)
				$(this).find('option').prop('selected', false).filter('[value="' + SliceLength + '"]').prop('selected', true);
		});
	}
	function StepSlice(step_incriment) {
		SliceLength = parseInt(SliceLength) + parseInt(step_incriment);
		if (SliceLength % 10 != 0) SliceLength -= SliceLength % 10;
		if (SliceLength < 10) SliceLength = 10;
		if (SliceLength > ItemCount) SliceLength = ItemCount;
	}
	function GetInitialValues() {		
		$('.PaginationContainer').each(function () { /* set initial values of ItemCount and SliceLength */
			ItemCount = $(this).find('.PaginationItem').length;			
			SliceLength = 10; /*Modify Default Number Shown On PageLoad*/
		});
	}
	function InjectElements() {
		// html to insert
		var kLessLink = '<a href="javascript: return false;" class="PaginateShowLess">...</a>';
		var kMoreLink = '<a href="javascript: return false;" class="PaginateShowMore">...</a>';
		var kPageSets = '';
		if (ItemCount > 10) {
			kPageSets += '<select class="PaginateSelector">';
			if (ItemCount > 10) kPageSets += '<option value="10">10</option>';
			if (ItemCount > 20)	kPageSets += '<option value="20">20</option>';
			if (ItemCount > 30)	kPageSets += '<option value="30">30</option>';
			if (ItemCount > 40)	kPageSets += '<option value="40">40</option>';
			kPageSets += '<option value="' + ItemCount + '">' + ItemCount + '</option>';
			kPageSets += '</select>';
		}		
		if (ItemCount > 10) { 
            /* wrap the existing html in less/more */
			var ihtml = '';	$('.PaginationContainer').each(function () { ihtml = $(this).html(); $(this).html(kLessLink + ihtml + kMoreLink + kPageSets); });
		}
    }
	// public method members
	return {
		Paginate: function () {
			if (IsPaginated == false) {
				IsPaginated = true;
				try {
					GetInitialValues();
					if (ItemCount > 5) {
						InjectElements();
						SetVisibility();					
						/* Wire up Show More button */
						$(".PaginateShowMore").click(function () { StepSlice(10); SetVisibility(); });						
						/* Wire up Show Less button */
						$(".PaginateShowLess").click(function () { StepSlice(-10); SetVisibility(); });						
						/*  Wire up Page Selector button, based on selected range value */
						$(".PaginateSelector").change(function () { SliceLength = $(this).find('option:selected').val(); SetVisibility(); });
					}
				}catch (e) { }
			}
		}
	};
}();
/********************************************************	END THIRD COURSE ATTEMPT FUNCTIONS ********************************************************/