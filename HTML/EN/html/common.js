<script language="JavaScript" type="text/javascript">
<!-- Start Hiding the Script

function to_currentsong() {
	if (window.location.hash == '' || navigator.appName=="Microsoft Internet Explorer") {
		window.location.hash = 'currentsong';
	}
}

function refreshStatus() {
	for (var i=0; i < parent.frames.length; i++) {
		if (parent.frames[i].name == "status" && parent.frames[i].location.pathname != '') {
			parent.frames[i].location.replace(parent.frames[i].location.pathname + "?player=[% player | uri %]");
		}
	}
}

function toggleGalleryView(artwork) {

	[% IF browserTarget %]
	var thisdoc = parent.[% browserTarget %];
	[% ELSE %]
	var thisdoc = this;
	[% END %]

	if (thisdoc.location.pathname != '') {
		myString = new String(thisdoc.location.href);
		
		if (artwork) {
			setCookie( 'SlimServer-albumView', "1" );
			
			if (thisdoc.location.href.indexOf('start') == -1) {
				thisdoc.location=thisdoc.location.href+"&artwork=1";
			} else {
				myString = new String(thisdoc.location.href);
				var rExp = /\&start=/gi;
				thisdoc.location=myString.replace(rExp, "&artwork=1&start=");
			}
		} else {

			setCookie( 'SlimServer-albumView', "" );
			
			var rExp = /\&artwork=1/gi;
			thisdoc.location=myString.replace(rExp, "");
		}
	}
}

[% IF refresh %]
	function doLoad() {
	
		setTimeout( "refresh()", [% refresh %]*1000);
		try {
			if (parent.playlist.location.host != '') {
				// Putting a time-dependant string in the URL seems to be the only way to make Safari
				// refresh properly. Stitching it together as below is needed to put the salt before
				// the hash (#currentsong).
				var plloc = top.frames.playlist.location;
				var newloc = plloc.protocol + '//' + plloc.host + plloc.pathname
					+ plloc.search.replace(/&d=\d+/, '') + '&d=' + new Date().getTime() + plloc.hash;
					
				// Bug 3404
				// We also need to make sure the player param in the playlist frame matches ours
				var q = window.location.search;
				var playerExp = /(=(\w\w(:|%3A)){5}(\w\w))|(=(\d{1,3}\.){3}\d{1,3})/gi;
				var player = q.match( playerExp );
				newloc = newloc.replace(playerExp, player);
				
				plloc.replace(newloc);
			}
		}
		catch (err) {
			// first load can fail, so swallow that initial exception.
		}
	}
	
	function refresh() {
		window.location.replace("[% statusroot %]?player=[% player | uri %]");
	}
[% END %]

[% BLOCK addSetupCaseLinks %]
	[% IF setuplinks %]
		[% FOREACH setuplink = setuplinks %]
		case "[% setuplink.key %]":
			url = "[% setuplink.value %]"
			page = "[% setuplink.key %]"
			suffix = "page=" + page
			[% IF cookie %]homestring = "[% setuplink.key | string %]"
			cookie = [% cookie %][% END %]
		break
		[% END %]
	[% END %]
[% END %]

function chooseAlbumOrderBy(value, option)
{
	var url = '[% webroot %]browsedb.html?hierarchy=[% hierarchy %]&level=[% level %][% attributes %][% IF artwork %]&artwork=1[% END %]&player=[% playerURI %]';

	if (option) {
		url = url + '&orderBy=' + option;
	}
	setCookie( 'SlimServer-orderBy', option );
	window.location = url;
}

function chooseSettings(value,option)
{
	var url;

	switch(option)
	{
		[% IF playerid -%][% PROCESS addSetupCaseLinks setuplinks=additionalLinks.playersetup  %]
						 [%# PROCESS addSetupCaseLinks setuplinks=additionalLinks.playerplugin %]
		[%- ELSE -%][% PROCESS addSetupCaseLinks setuplinks=additionalLinks.setup   %]
				  [%# PROCESS addSetupCaseLinks setuplinks=additionalLinks.plugin %][%- END %]
		case "HOME":
			url = "[% webroot %]home.html?"
		break
		case "PLAYER_SETTINGS":
			url = "[% webroot %]setup.html?page=PLAYER_SETTINGS&amp;playerid=[% playerid | uri %]"
		break
		case "SERVER_SETTINGS":
			url = "[% webroot %]setup.html?page=SERVER_SETTINGS&amp;"
		break
	}

	if (option) {
		window.location = url + 'player=[% playerURI %][% IF playerid %]&playerid=[% playerid | uri %][% END %]';
	}
}

function switchPlayer(player_List) {
	var newPlayer = "=" + player_List.options[player_List.selectedIndex].value;
	setCookie( 'SlimServer-player', player_List.options[player_List.selectedIndex].value );
	var doc = this;
	
	[% IF browserTarget %]
	// change for skins with frames
	doc = parent.[% browserTarget %];
	
	parent.playlist.location="playlist.html?player"+newPlayer;
	window.location="status_header.html?player"+newPlayer;
	
	if (doc.location.href.indexOf('setup') == -1) {
		for (var j=0;j < doc.document.links.length; j++) {
			var myString = new String(doc.document.links[j].href);
			var rString = newPlayer;
			var rExp = /(player=(\w\w(:|%3A)){5}(\w\w))|(player=(\d{1,3}\.){3}\d{1,3})/gi;

			doc.document.links[j].href = myString.replace(rExp, rString);
		}
	} else {
	[% END %]
		myString = new String(doc.location.href);
		var rExp = /(=(\w\w(:|%3A)){5}(\w\w))|(=(\d{1,3}\.){3}\d{1,3})/gi;

		doc.location=myString.replace(rExp, newPlayer);
	[% IF browserTarget %]}[% END %]
}

function setCookie(name, value) {
	var expires = new Date();
	expires.setTime(expires.getTime() + 1000*60*60*24*365);
	document.cookie =
		name + "=" + escape(value) +
		((expires == null) ? "" : ("; expires=" + expires.toGMTString()));
}

function resize(src,width)
	{
		if (!width) {
			// special case for IE (argh)
			if (document.all) //if IE 4+
			{
				width = document.body.clientWidth*0.95;
			}
			else if (document.getElementById) //else if NS6+
			{
				width = window.innerWidth*0.95;
			}
		}
	
		if (src.width > width )
		{
			src.width = width;
		}
	}

[% IF warn %]
	function doLoad() {
		setTimeout( "refresh()", 300*1000);
	}
		
	function refresh() {
		window.location.replace("home.html?player=[% player | uri %]");
	}
[% END %]	

// Stop Hiding script --->
</script>
