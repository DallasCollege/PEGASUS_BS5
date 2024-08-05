if(!String.prototype.includes){String.prototype.includes=function(){'use strict';if(this!=null&&this!==undefined){return String.prototype.indexOf.apply(this,arguments)!== -1;}else return -1;};}

$(document).ready(function(){
    masterUtilities.checkforIE();
    masterUtilities.toggleHamburgerMenu();
    masterUtilities.openAnchorAccordion();
    jQuery("body").on("click", "a", masterUtilities.openAnchorAccordion);
    masterUtilities.removeIdRc();
    masterUtilities.checkAltTags();
    masterUtilities.addAriaTags();
    masterUtilities.setChromeFavIcon();
    masterUtilities.setCopyRightYear();
    masterUtilities.setAriaBasedOnScreenSize();
    masterUtilities.checkBannerHighlight();
    window.addEventListener("resize",function(){ masterUtilities.setAriaBasedOnScreenSize(); });
    if(document.getElementById('masterPage_searchBtn')){ document.getElementById('masterPage_searchBtn').onclick = searchfunctions.searchClicked; }
    if(document.getElementById('mobileSrchBtn')){ document.getElementById('mobileSrchBtn').onclick = searchfunctions.mobileSearchClicked; }
    $("#masterPage_searchTxt").keypress(function (event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13' || keycode == '10') {
            event.preventDefault();
            searchfunctions.searchClicked();//search function in masterpage. prevents enter from submitting aspx form.
        }
    });
    $("#srchBox").keypress(function (event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13' || keycode == '10') {
            event.preventDefault();
            searchfunctions.mobileSearchClicked();//search function in masterpage. prevents enter from submitting aspx form.
        }
    });
    $('#s4-workspace').scroll(function(){ masterUtilities.mobileStickyNav(); });
    $(document.body).keydown(function(e){
        if(e.which === 9){
            masterUtilities.lastActiveCont = document.activeElement;
        }
    });
    $(document.body).keyup(function(e){
        if(e.which === 9){
            var prevWasInDropdown = $(masterUtilities.lastActiveCont).parents('[class*="dropdown"].open').length > 0 ? true : false;
            var prevMobileNavbar = $(masterUtilities.lastActiveCont).parents("#dc_mobileNavbar").length > 0 ? true: false;
            var prevBannerSubNav = $(masterUtilities.lastActiveCont).parents(".pgs-banner__sub-nav").length > 0 ? true: false;
            if(prevWasInDropdown && $(document.activeElement).parents('[class*="dropdown"].open').length === 0){ masterUtilities.closeDropdown(); }
            if(prevMobileNavbar && $(document.activeElement).parents('#dc_mobileNavbar').length === 0){
                $('#l-header-mobile__menu[class*="navbar-collapse"]').removeClass("in");
                $('.hamburger').removeClass('is-active');
                $('#l-header-mobile__menu').attr("aria-expanded","false");
                $('button.hamburger').attr("aria-expanded","false");
            }
            if(prevBannerSubNav && $(document.activeElement).parents('.pgs-banner__sub-nav').length === 0 ){
                    var currEle = document.activeElement;
                    $('.pgs-banner__sub-nav.bg-cprimary-lt button.navbar-toggle').click();
                    currEle.focus();
            }
        }
        if (e.key === "Escape") {
            // Close Hamburger menu if it's open.
            if ($('#l-header-mobile__menu').hasClass('in')) {
                $(".hamburger").removeClass("is-active");
                $(".hamburger").addClass('collapsed');
                $('#l-header-mobile__menu').removeClass('in');
                $('#hamburger-btn').attr('aria-expanded', 'false');
            }
        }
    });
});

var masterUtilities ={
    lastActiveCont : null,
    closeDropdown : function(){
        $('*[class*="dropdown"]').removeClass("open");
        $('.dropdown-toggle').each(function(){
            if($(this).attr("aria-expanded") == "true"){
                $(this).attr("aria-expanded","false");
            }
        })
    },
    addAriaTags : function(){ if(document.getElementById('pgs-navbar--sidebar__collapse')){ var anchors = document.getElementById('pgs-navbar--sidebar__collapse').getElementsByClassName('selected'); anchors[0].setAttribute("aria-current","page"); } },
    addParameter : function(url, param, value){
        /* Using a positive lookahead (?=\=) to find the given parameter, preceded by a ? or &, and followed by a = with a value after than (using a non-greedy selector) and then followed by a & or the end of the string */
        var val = new RegExp('(\\?|\\&)' + param + '=.*?(?=(&|$))'), parts = url.toString().split('#'),url = parts[0],hash = parts[1], qstring = /\?.+$/, newURL = url;
        /* Check if the parameter exists if it does, replace it, using the captured group to determine & or ? at the beginning */
        if (val.test(url)) { newURL = url.replace(val, '$1' + param + '=' + value); }
        /* otherwise, if there is a query string at all add the param to the end of it */
        else if (qstring.test(url)) { newURL = url + '&' + param + '=' + value; }
        /* if there's no query string, add one */
        else { newURL = url + '?' + param + '=' + value; } if (hash) { newURL += '#' + hash; } return newURL;
    },
    allSameValues : function (arr) { for (var i = 1; i < arr.length; i++) { if (arr[i] !== arr[0]) return false; } return true;  },
    checkAltTags : function(){ var imgs = document.getElementsByTagName('img'); for(var i = 0; i < imgs.length; i++){ if(imgs[i].alt.indexOf("https://") >= 0){ imgs[i].alt = ""; } } },
    checkBannerHighlight: function(){
      /*
      Highlight header button if on a top level landing page
      */
      	try{
      		var activeNode = [ '_Admissions','_PayingForCollege','_ClassesAndDegrees','_StudentResources','_StudentLife','_LearnEnglish','_ApplyNow','_ForParents'];
      		var selected = -1;
      		var styleBlock = document.createElement('style');
      		var appendSpot = document.getElementById('s4-bodyContainer');

          switch(_spPageContextInfo.serverRequestPath.toLowerCase()){
            case "/admissions/pages/default.aspx" :
            case "/espanol/inscripcion/pages/default.aspx" :
              selected = 0; break;
            case "/paying-for-college/pages/default.aspx" :
            case "/espanol/pagar/pages/default.aspx" :
              selected = 1; break;
            case "/cd/pages/default.aspx" :
            case "/espanol/cursos/pages/default.aspx" :
              selected = 2; break;
            case "/resources/pages/support.aspx" :
            case "/espanol/servicios/pages/default.aspx" :
              selected = 3; break;
            case "/slife/pages/default.aspx" : selected = 4; break;
            case "/espanol/pages/aprende-ingles.aspx" : selected = 5; break;
            case "/admissions/application/pages/default.aspx" : selected = 6; break;
            case "/espanol/padres/pages/default.aspx" : selected = 7; break;
          }
      		if(selected > -1){
      			var style = '#' + activeNode[selected] + ' a {border-bottom-color: #e52626;} #_m' + activeNode[selected] + ' a {background-color: #E9F2FF; color:#001E49!important;}';
      			styleBlock.innerHTML = style;
      			appendSpot.appendChild(styleBlock);
      		}
      	}catch(error){}
    },
    checkforIE : function(){
        var isIE11 = !!window.MSInputMethodContext && !!document.documentMode; var isAnyOtherIE = window.navigator.userAgent.includes('MSIE');
        if(isIE11 || isAnyOtherIE){ var div = document.createElement('div'); div.className = "NoticeItem NotificationItem";
            div.innerHTML = '<div class="NoticeContent"><p class="text-center">Your browser is not supported, please update to a modern browser such as <a href="https://www.microsoft.com/en-us/edge">Edge</a>, <a href="https://www.google.com/chrome">Chrome</a>, or <a href="https://www.mozilla.org">Firefox</a> to view this site with best results.</p></div>';
            var movingAbove = document.getElementById('l-nav-utility'); movingAbove.parentElement.insertBefore(div,movingAbove);
        }
    },
    getUrlParameter : function(sParam){
        var sPageURL = decodeURIComponent(window.location.search.substring(1)), sURLVariables = sPageURL.split('&'), sParameterName, i;
        for (i = 0; i < sURLVariables.length; i++) { sParameterName = sURLVariables[i].split('='); if (sParameterName[0] === sParam) { return sParameterName[1] === undefined ? true : sParameterName[1]; } }
    },
    mobileStickyNav : function(){
        var isAuthoring = window.location.hostname.includes('wwws.'); var s4offSet = document.getElementById('s4-workspace'); var navbar = document.getElementById('dc_mobileNavbar');
        if(s4offSet.scrollTop >= s4offSet.offsetTop && s4offSet.scrollTop !== 0){ if(isAuthoring){ navbar.classList.add("authStickyNav"); } else{ navbar.classList.add("pubStickyNav") } }
        else if (s4offSet.scrollTop == 0){ if(isAuthoring){ navbar.classList.remove("authStickyNav");} else{ navbar.classList.remove("pubStickyNav"); } }
    },
    moveAboveFooter : function(itemToMove){
        var inDesignMode = document.forms[MSOWebPartPageFormName].MSOLayout_InDesignMode.value;
        if(inDesignMode == 1){ console.log('EditMode not MovingHTML'); }
        else{ var whatsMoving = document.getElementById(itemToMove); var movingAbove = document.getElementsByTagName('footer')[0]; movingAbove.parentElement.insertBefore(whatsMoving,movingAbove); }
    },
    moveHTML : function(itemToMove,moveBefore){
        var inDesignMode = document.forms[MSOWebPartPageFormName].MSOLayout_InDesignMode.value;
        if(inDesignMode == 1){ console.log('EditMode not MovingHTML'); } else{ var whatsMoving = document.getElementById(itemToMove); var movingAbove = document.getElementById(moveBefore); movingAbove.parentElement.insertBefore(whatsMoving,movingAbove); }
    },
    openAnchorAccordion : function(){
        // Opens accordion automatically if an accordion target is accessed from another page Assumes the accordion-group is the target linked to
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
            url: 'https://' + window.location.hostname + '/_api/contextinfo', type: 'POST', headers: { 'accept' : 'application/json;odata=verbose', 'content-type' : 'application/json;odata=verbose' },
            success: function(data){ inputRequestDigest = document.getElementById('__REQUESTDIGEST'); inputRequestDigest.value = data.d.GetContextWebInformation.FormDigestValue; },
            error: function(jQxhr, errorCode, errorThrown){ res = jQxhr; console.log(res); }
        });
    },
    removeIdRc : function(){
        if(!window.location.hostname.includes('wwws.')){ //accessiblity removes attributes from reusable content for screenreaders.
            $('.ms-rtestate-field').each(function(){this.removeAttribute('id');this.removeAttribute('fragmentid'); this.removeAttribute('contenteditable'); this.removeAttribute('aria-labelledby');});
			$('.ms-rtestate-read').each(function(){this.removeAttribute('id'); this.removeAttribute('fragmentid'); this.removeAttribute('contenteditable'); this.removeAttribute('aria-labelledby');});
        }
    },
    setAriaBasedOnScreenSize : function(){
        var dtEles = document.getElementsByClassName('desktop_master'); var mobileEles = document.getElementsByClassName('mobile_master');
        if(window.outerWidth > 767){
            for(var i=0; i< dtEles.length;i++){ dtEles[i].setAttribute('aria-hidden',false) }
            for(var i=0; i< mobileEles.length;i++){ mobileEles[i].setAttribute('aria-hidden',true) }
        }
        else{
            for(var i=0; i< dtEles.length;i++){ dtEles[i].setAttribute('aria-hidden',true) }
            for(var i=0; i< mobileEles.length;i++){ mobileEles[i].setAttribute('aria-hidden',false) }
        }
        if(dtEles.length > 0){
            if(dtEles[0].offsetParent !== null){
                for(var i=0; i< dtEles.length;i++){ dtEles[i].setAttribute('aria-hidden',false) }
                for(var i=0; i< mobileEles.length;i++){ mobileEles[i].setAttribute('aria-hidden',true) }
            }else{
                for(var i=0; i< dtEles.length;i++){ dtEles[i].setAttribute('aria-hidden',true) }
                for(var i=0; i< mobileEles.length;i++){ mobileEles[i].setAttribute('aria-hidden',false) }
            }
        }

    },
    setCopyRightYear : function(){ document.getElementById('masterpage_copyright_year').innerText=(new Date().getFullYear().toString()); },
    setChromeFavIcon : function(){ try{ var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor); if (isChrome) { var link = document.querySelector("link[rel*='icon']") || document.createElement('link'); link.type = 'image/x-icon'; link.rel = 'shortcut icon'; link.href = '/icons/favicons/favicon.ico'; document.getElementsByTagName('head')[0].appendChild(link); } }catch(e){ /*Do Nothing */} },
    toggleHamburgerMenu : function(){
        var hbMenu = $(".hamburger");
        hbMenu.on("click", function(e) {
            hbMenu.toggleClass("is-active");
            if(hbMenu.hasClass("is-active")){ $("#srchBox").focus(); }
        });
    }
}

var searchfunctions ={
    searchClicked :function(){ var srchT = document.getElementById('masterPage_searchTxt').value; window.location = '/website/Pages/search.aspx?q=' + encodeURIComponent(srchT.trim()); },
    mobileSearchClicked: function(){ var srchT = document.getElementById('srchBox').value; window.location = '/website/Pages/search.aspx?q=' + encodeURIComponent(srchT.trim()); }//google search //window.location = '/website/Pages/sitesearch.aspx#k=' + encodeURIComponent(searchText.trim()); //sp search
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
