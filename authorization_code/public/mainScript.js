

function startPlayingPlaylist (position_id, globalToken) {
    var argumentsToStartPlaylist = 'https://yemhm-431d0.firebaseio.com/public_playlist.json';
    $.ajax({
        url: argumentsToStartPlaylist,
        type: 'GET',
        success: function(data)
        {
            playlistPlayback(position_id, globalToken, data.uri);
        },
        error: function(xhr)
        {
            console.log(xhr.status);
        }
    }); 
} 

function playlistPlayback (position_id, global_token, playlistUri) {
                var attributesOfPlaylist = '{"context_uri": "'+ playlistUri + '", "offset": {"position":"' + position_id + '"}}';

				$.ajax({
        			url: 'https://api.spotify.com/v1/me/player/play',
        			type: 'PUT',
        			headers: {"Authorization": "Bearer " + global_token},
        			data: attributesOfPlaylist,
					dataType: 'application/json',
        			success: function(data)
        			{
        				console.log("playlist is active")
        			},
        			error: function(xhr)
        			{
        				console.log(xhr.status);
        			}
        		});
}

function writeTrackInformation (user_id,user_name,track_progress,track_id,my_device_time_stamp, track_popularity, track_uri, track_name, track_number, album_name, album_type, album_id,
	artist_name, artist_id, spotify_timestamp) {
	console.log("function my stamp: " + getCurrentTimeStamp());

	firebase.database().ref('user_track_info/' + user_name + '/' + spotify_timestamp).set({
		track_id: track_id,
		user_id: user_id,
		user_name: user_name,
		track_details: { 
			track_name : track_name,
			timestamp: my_device_time_stamp,
			track_progress: track_progress,
			track_popularity: track_popularity,
			track_uri: track_uri,
			started_playing: spotify_timestamp
		},
		album_details:{
			album_type: album_type,
			album_name: album_name,
			album_id: album_id,
			track_number : track_number
		},
		artist_details:{
			artist_name: artist_name,
			artist_id: artist_id
		}
	});
	console.log("function Spotify stamp: " + spotify_timestamp);
}

function addPlaylistNameToDB (playlist_add_name, uri) {
	firebase.database().ref('public_playlist/').set({
		"playlist": playlist_add_name,
        "uri": uri
	});
}

function addToPLaylistQue (track_id) {firebase.database().ref('public_tracks/').push(track_id);}

//Global variables
//------------------------------------
	var globalToken = 0;
	var globalTokenAge = 0;
	var globalPlayingBoolean = false;
	var globalActiveDevice = 0;
	var globalUserId = "";
    var globalPlaylistExists;
    var globalPlaylistURI;

        function updateToken () {
         	$.ajax({
         		url: '/refresh_token',
         		data: {
         			'refresh_token': refresh_token
         		},success: function(data, textStatus, xhr) 
         		{
         			console.log("Timestamp from updateToken()" + Date.now());
         			globalTokenAge = Date.now();
         			globalToken = data.access_token;
         			oauthPlaceholder.innerHTML = oauthTemplate({
         				access_token: access_token,
         				refresh_token: refresh_token
         			});
         			console.log("update token success: " + xhr.status);
         		},
         		error: function(xhr, textStatus)
         		{
         			console.log("update token fail: " + xhr.status);
         		}
         	});
        }

        function getUserId () {
            $.ajax({
         		url: 'https://api.spotify.com/v1/me',
         		type: 'GET',
         		headers: {
         			'Authorization': 'Bearer ' + globalToken
         		},
         		success: function(data, textStatus, xhr)
         		{
         			var userID = data.id;
         			console.log("get user id success: " + xhr.status);
         			return userID;
         		},
         		error: function(xhr, textStatus)
         		{
         			console.log("get user id fail: " + xhr.status);
         		}
         	});
        }
         //iz working oh boy!
        function skipInsideTrack () {
        	var startVariable = getCurrentTimeStamp();
        	var stopVariable;
        	$.ajax({
        		url: 'https://api.spotify.com' + '/v1/me/player',
        		type: 'GET',
        		headers: {'Authorization' : 'Bearer ' + globalToken},
        		success: function(data, textStatus, xhr)
        		{
        			var current_progress = data.progress_ms + 1000;
        			globalPlayingBoolean = data.is_playing;
        			if(globalPlayingBoolean == true){
        				$.ajax({
        					url: 'https://api.spotify.com/v1/me/player/seek' + '?' + $.param({'position_ms' : current_progress}),
        					type: 'PUT',
        					headers: {
        						'Authorization' : 'Bearer ' + globalToken
        					},
        					success: function(data, textStatus, xhr)
        					{
        						console.log("skipInsideTrack : " + xhr.status);
        						stopVariable = getCurrentTimeStamp();
        						console.log( "time to execute" + timestampTranslation(timeSinceTokenUpdate(stopVariable,startVariable)));
        					},
        					error: function(xhr, textStatus)
        					{
        						console.log("seek to position_ms fail: " + xhr.status);
        					}
        				});
        			}
        			else{console.log("music is not playing at the moment");}
        		},
        		error: function(xhr, textStatus)
        		{
        			console.log("me player fail: " + xhr.status);
        		}
        	});
        }

        function getUserItemsInFirebase(user_name) {
        	$.ajax({
        		success: function(data, textStatus, xhr)
        		{
                    var listSizeUser = Object.keys(data[user_name]).length;
                    console.log("User tracks: " + listSizeUser);
        			console.log("getListItemsInFirebase success: " + xhr.status);
        		}, error: function(xhr, textStatus)
        		{
        			console.log(xhr.status);
        		}
        	});
        }

        function getCurrentlyPlaying() {
            $.ajax({
                url: 'https://api.spotify.com/v1/me/player/currently-playing',
                type: 'GET',
                headers: { 'Authorization' : 'Bearer ' + globalToken},
                success: function(data) {
                    console.log("this is getCurrentlyPlaying() ");
                    return data.item.id;
                },
                error: function(xhr, textStatus){
                    console.log("error code: " + xhr.status);
                }
            });
        }

        function getPublicPlaylist() {
            $.ajax({
                url: 'https://yemhm-431d0.firebaseio.com/public_tracks.json',
                type: 'GET',
                success: function(data, textStatus, xhr)
                {
                    var listSizePlaylist = Object.keys(data).length;
                    console.log("Playlist: " + listSizePlaylist);
                    console.log("getListItemsInFirebase success: " + xhr.status);
                }, error: function(xhr, textStatus)
                {
                    console.log(xhr.status);
                }
            });
        }

        function addCurrentToPlaylist(){
            var currentlyPlayingTrackId = getCurrentlyPlaying();
            console.log(currentlyPlayingTrackId);
            addToPLaylistQue(currentlyPlayingTrackId);
        }

        function submitToDataBase() {
          // writeTrackInformation(timestampTranslation(getCurrentTimeStamp()));
          //writeTrackInformation(user_id,user_name,track_progress,track_id,my_device_time_stamp, track_popularity, track_uri)
          $.ajax({
          	url: 'https://api.spotify.com' + '/v1/me',
          	type: 'GET',
          	headers: { 'Authorization' : 'Bearer ' + globalToken},
          	success: function(data, textStatus, xhr) {
          		var user_id = data.id;
          		var user_uri = data.uri;
          		var user_product = data.product;
          		var user_type = data.type;
            	var testVariableCurrentlyPLaying; // remove or alter name at later stage!

            	$.ajax({
            		url: 'https://api.spotify.com' + '/v1/me/player/currently-playing',
            		type: 'GET',
            		headers: { 'Authorization' : 'Bearer ' + globalToken},
            		success: function(data) {
        			var artist_name = data.item.album.artists["0"].name;
        			var artist_id = data.item.album.artists["0"].id;
			        //album dets
			        var album_name = data.item.album.name;
			        var album_id = data.item.album.id;
			        var album_type = data.item.album.album_type;
			        //track dets
			        var track_popularity = data.item.popularity;
			        var track_name = data.item.name;
			        var track_id = data.item.id;
			        var track_uri = data.item.uri;
			        var track_progress_ms = data.progress_ms;
			        var track_name = data.item.name;
			        var track_number = data.item.track_number - 1;
			        var spotify_timestamp = data.timestamp;
			        console.log(track_uri + "" + track_id + "" + track_name + "" + track_popularity);

			        writeTrackInformation(
			        	user_uri,user_id,
			        	track_progress_ms,track_id,timestampTranslation(getCurrentTimeStamp()), 
			        	track_popularity, track_uri, track_name, track_number,
			        	album_name, album_type, album_id,
			        	artist_name, artist_id,
			        	spotify_timestamp
			        	);
			        addToPLaylistQue(
			        	track_id
			        	);
			    },
			        error: function(data, textStatus, xhr) {
			        	console.log("currently-playing fail: " + xhr,status);
			        }
			    });
            },
            error: function(xhr, textStatus) {
            	console.log("account me fail: " + xhr.status);
            }
            });
        }

        function checkIfPlaylistExists() {
            //firebase.database().ref('public_playlist/').get("value");
            var snapValue = 0;
            firebase.database().ref("public_playlist/").on("value", function(snapshot){
                snapValue = snapshot.child("playlist").val();
                snapKey = snapshot.child("playlist").key;
                var dataSnapshot = snapshot;
                console.log("snap Value: " + snapValue);
                console.log("snap Key: " + snapKey);
                globalPlaylistExists = snapValue;
            }, function(errorObject){
                console.log(errorObject);
            });
            if(globalPlaylistExists !== undefined){
                console.log(globalPlaylistExists + " is defined");
            }
        }

    	function flexibleButtonFunction(url, reqType, name) {
            $.ajax({
    			url: 'https://api.spotify.com' + url,
    			type: reqType,
    			headers: {
    				'Authorization': 'Bearer ' + globalToken
    			},
    			success: function(data, textStatus, xhr)
    			{
    				console.log("flexibleButtonFunction success: " + xhr.status);
    				switch (name) {
    					case 'stop-current-track':
    					console.log("track stopped");
    					break;
    					case 'obtain-track-info':
    					changeButtonText("#obtain-track-info", data.item.name, "Current track info", 3000);
    					break;
    					case 'resume-current-track':
    					console.log("track resumed");
    					break;
    					case 'get-users-playlists':
    					console.log("user playlists");
    					console.log(data);
    					break;
    					case 'get-user-devices':
                            //console.log(data);
                            for(var i = 0; i < data.devices.length; i++)
                            {
                            	console.log("---------------------------")
                            	console.log("device ID: " + data.devices[i].id);
                            	console.log("device Is Active: " + data.devices[i].is_active);
                            	console.log("device type: " + data.devices[i].type);
                            }
                        break;
                        default:
                        console.log("default response");
                };	
                },
                error: function(xhr, textStatus)
                {
                	console.log("flexibleButtonFunction fail: " + xhr.status);
                }
            });
    	}

        function changeButtonText(elementId, newText, oldText, sleepTime) {
            $(elementId).html(newText);
            setTimeout(function() {$(elementId).html(oldText);}, sleepTime);
        }
        
        async function createPlaylist(url, reqType, name, tempData) {
            try {
                var argumentsToCreatePlaylist = 'https://yemhm-431d0.firebaseio.com/public_playlist.json';
                var playlistConfirmation = $.ajax({
                        url: argumentsToCreatePlaylist,
                        type: 'GET',
                        success: function(data, textStatus, xhr) {
                            console.log("public_playlist success code: " + xhr.status);
                        },
                        error: function(xhr) {
                            console.log("public_playlist fail code: " + xhr.status);
                        }
                    }); 
                let playlistExistence = await playlistConfirmation;

                console.log(playlistExistence);
                if (playlistExistence.playlist === "public playlist" || globalPlaylistURI == true) {
                    console.log("Playlist already exists");
                }
                else if(playlistExistence === null || playlistExistence == null || playlistExistence == "null") {
                    executeCreatePlaylistFunction(url, reqType, name, tempData);
                    console.log("else if 372");
                }
                else {
                    executeCreatePlaylistFunction(url, reqType, name, tempData);
                    globalPlaylistExists = true;
                    globalPlaylistURI = playlistExistence.uri;
                    console.log("else 378");
                    changeButtonText("#create-playlist", "Playlist created else", "Create playlist", 2000);
                }
            }
            catch (err) {
                if (err instanceof TypeError) {
                    if(err instanceof ReferenceError){
                        console.log("do some shit");
                    }
                    console.log(err + "387");
                    executeCreatePlaylistFunction(url, reqType, name, tempData);
                    globalPlaylistExists = true;
                    changeButtonText("#create-playlist", "Playlist created else if", "Create playlist", 2000);
                }
                else if (err instanceof ReferenceError){
                    console.log(err + "393");
                    executeCreatePlaylistFunction(url, reqType, name, tempData);
                    globalPlaylistExists = true;
                    changeButtonText("#create-playlist");
                }
                else{console.log("some shiet");}
            }
        }

        async function getListOfPlaylists (user_id, limit_val, offset_val) {
            //v1/users/' + globalUserId + '/playlists', 'GET', 'get-users-playlists'
            try{
                var url_get_list_of_playlists = '/v1/users/' + globalUserId + '/playlists';
                var getPlaylistAjax = $.ajax({
                    url: 'https://api.spotify.com' + url_get_list_of_playlists + '?' + $.param({'limit' : limit_val, 'offset' : offset_val}),
                    type: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + globalToken
                    },
                    success: function(data, textStatus, xhr)
                    {
                        var listOfPlaylists = data.items;
                        console.log("list returned!");
                    },
                    error: function(xhr, textStatus)
                    {
                        console.log("error code: " + xhr.status);
                    }
                });

                let getAsyncPlaylist = await getPlaylistAjax;
                var tempPlaylistData = getAsyncPlaylist.items;
                console.log("tempPlaylistData: ");
                console.log(tempPlaylistData);
                return tempPlaylistData;
            }
            catch(err) {
                console.log(err);
            }
        }  

        async function getTotalNumberOfPlaylists (user_id) {
            try{
                var total_NumberOfPlaylists = 0;
                for (var i = 0; i < 10; i++){
                    let request_playlistPackage = await getListOfPlaylists(user_id, 50, (i * 50));
                    var total_getSize = Object.keys(request_playlistPackage).length;
                    console.log("show requestNumberX value " + i);
                    total_NumberOfPlaylists += total_getSize;
                    console.log(total_getSize + " index I: " + i);

                    if(total_getSize != 50){
                        console.log("loop stopped!");
                        console.log("number of playlists: " + total_NumberOfPlaylists);
                        changeButtonText("#show-all-playlists", total_NumberOfPlaylists, "Show how many playlist i have", 2000);
                        break;  
                    }
                }
            }
            catch(err){
                console.log(err);
            }
        }

        function executeCreatePlaylistFunction(url, reqType, name, tempData) {
            $.ajax({
                    url: 'https://api.spotify.com' + url,
                    type: reqType,
                    headers: {
                        'Authorization': 'Bearer ' + globalToken
                    },
                    data: tempData,
                    success: function(data, textStatus, xhr)
                    {
                        addPlaylistNameToDB(data.name, data.uri);
                        console.log("added playlist with name. " + data.name); 
                        console.log("createButtonFunction success: " + xhr.status);  
                        //console.log(checkIfPlaylistExists());
                    },
                    error: function(xhr, textStatus)
                    {
                        console.log("createButtonFunction fail: " + xhr.status);
                    }
                });
        }

        function managePLaylist(){};
        function deleteInPlaylist(){};


        	var userProfileSource = document.getElementById('user-profile-template').innerHTML,
        	userProfileTemplate = Handlebars.compile(userProfileSource),
        	userProfilePlaceholder = document.getElementById('user-profile');

        	var oauthSource = document.getElementById('oauth-template').innerHTML,
        	oauthTemplate = Handlebars.compile(oauthSource),
        	oauthPlaceholder = document.getElementById('oauth');

        	var params = getHashParams();

        	var access_token = params.access_token,
        	refresh_token = params.refresh_token,
        	error = params.error;

        	if (error) {
        		alert('There was an error during the authentication');
        	} else {
        		if (access_token) {
            // render oauth info
            globalToken = access_token;
            oauthPlaceholder.innerHTML = oauthTemplate({
            	access_token: access_token,
            	refresh_token: refresh_token
            });

            $.ajax({
            	url: 'https://api.spotify.com/v1/me',
            	headers: {
            		'Authorization': 'Bearer ' + access_token
            	},
            	success: function(response) {
            		userProfilePlaceholder.innerHTML = userProfileTemplate(response);
            		globalUserId = response.id;

            		$('#login').hide();
                    // should be $('#loggedin').show();
            		$('#loggedin').show();
            	}
            });
            } else {
                  // render initial screen
                  $('#login').show();
                  $('#loggedin').hide();
              }

    document.getElementById('obtain-new-token').addEventListener('click', function () {
        updateToken();
        functionName('https://yemhm-431d0.firebaseio.com/public_tracks.json', "#obtain-new-token");}, false);
    //-------------------------------------------------------------------
    document.getElementById('obtain-track-info').addEventListener('click', function() {
    	flexibleButtonFunction('/v1/me/player/currently-playing','GET', 'obtain-track-info'
            , null)}, false);
    //--------------------------------------------------------------------
    document.getElementById('resume-current-track').addEventListener('click', function() {
    	flexibleButtonFunction('/v1/me/player/play','PUT', 'resume-current-track', null)}, 
        false);
    //------------------------------------------------------------------------
    document.getElementById('stop-current-track').addEventListener('click', function () {
    	flexibleButtonFunction('/v1/me/player/pause','PUT', 'stop-current-track', null)}, 
        false);
    //----------------------------------------------------------------------
    document.getElementById('get-users-playlists').addEventListener('click', function() {
        flexibleButtonFunction('/v1/users/' + globalUserId + '/playlists', 'GET', 'get-users-playlists', null)},
        false);
    //-----------------------------------------------------------------------
    document.getElementById('skip-by-x-milliseconds').addEventListener('click',function() {
        skipInsideTrack();
        changeButtonText("#skip-by-x-milliseconds", "Skipped by 1 sec", "Forward by 1 sec", 1000);}, 
        false);
    //--------------------------------------------------------------------------
    document.getElementById('get-user-devices').addEventListener('click', function() {
    	flexibleButtonFunction('/v1/me/player/devices', 'GET', 'get-user-devices', null)}, 
        false);
    //--------------------------------------------------------------------------
    document.getElementById('get-current-time').addEventListener('click', function() {
    	$(this).html(timestampTranslation(getCurrentTimeStamp()));
    	console.log(timeSinceTokenUpdate(getCurrentTimeStamp(),globalTokenAge));
    	console.log(timestampTranslation(timeSinceTokenUpdate(getCurrentTimeStamp(),globalTokenAge)));}, 
        false);
    //--------------------------------------------------------
    document.getElementById('submit-to-database').addEventListener('click', function() {
    	submitToDataBase();}, 
        false);
    //-------------------------------------------------------------------
    document.getElementById('list-size').addEventListener('click',
    	function() {
            getPublicPlaylist();
            //console.log(getCurrentlyPlaying());
            addCurrentToPlaylist();}, 
            false);
    //--------------------------------------------------------
    document.getElementById('create-playlist').addEventListener('click',
    	function() {
    		    var createPlaylistData = '{"description":"public playlist","public": true,"name": "public playlist"}';
    		    createPlaylist('/v1/users/' + globalUserId + '/playlists', 'POST', 'create-playlist', createPlaylistData);}, 
                false);
    //--------------------------------------------------------------         
    document.getElementById('start-playing-default-playlist').addEventListener('click',
        function() {
            startPlayingPlaylist("0", globalToken);}, 
            false);
    //--------------------------------------------------------------
    document.getElementById('add-to-public-playlist').addEventListener('click', function() {
        addCurrentToPlaylist();},
        false);
    //--------------------------------------------------------------
    document.getElementById('show-all-playlists').addEventListener('click', function() {
        getTotalNumberOfPlaylists("gameovercharlie");}, 
        false);
    }


  /*
	add if error 401 

		updateglobalToken()

		and run method again

		method(same_parameter_1, same_parameter_2);

		DUN!

  */

  /*
    1: listen spotfiy
    2: show realtime "currently playing in HTML" in localhost site
    3: Text change as soon you change track in spotify nativ app/program
    4: An efficient listener would be perfect for this task
  */

  /*
    nice example
    https://codepen.io/dsheiko/pen/gaeqRO?editors=0010
    */

    /*
    TODO: 

    Gui to chose your own playlists to play :
        - playlistName (start_position, playlist_uri)
        - set Repeat: ON (in case play list is shot and loops)
        - get List of tracks in database in order to make playback easier, that is, when you choose public playlist you can see names of tracks in playlist
          making selection marginally simpler 
    Search box to look for track
        - add track to public playlist
    Public playlist in my database need to just backup for spotify playlist:
        - thus if oyu delete entire playlist one can recreate it from backup on your profile
        - // As soon you add new item to public playlist on Database it will add it to your official playlist on psotify 
             this is just to prevent spaming reqest from spotify and doing it the other way around... my db first will be better solution
          \\
    When track changes
        - Make changes to Currently playing Playlist
    currently playing playlist
        - update value to object that is currently played in spotify
        - ex.       public_playlist: {
                        track_id : "some_id",
                        currently_playing: "true"
                        }
        - most important is to make sure only one track have "currently playing" value equal "true",  to avoid minor issues;
    Rewrite "write track info thingy" 
        - Pass an array to "write track info thingy" instead of long strong of alone variables, idealy! use JSON format before sending to "write thingy to data base"
          just to make it look more clean when submiting. 
    Moving "document.byId..." to Index.html would remove eye clutter even further from the poor developer!
        - Rip me :/
        - @Override var Sans = "Jellypants";
    Finally create automatical "remove" function 
    - Which will remove last object in list when Array gets bigger than "1000" items, 
      also use Spotify principle of showing only latest 20 tracks. In order to get 
      more track you will be forced to request more "sort like you would do on a shoping website",
      go to "page 3" etc. no the best solution but it will work nicely.
    
    DONE: 

    //Async iS love, async is life!//

    Add async/await functionality to "CreatePlaylist" fucntion
        - Wait for response from myDB to tell if publicPlaylist have been created
        - Alternative make db.ref(always submit name, and uri), but in a smart way.


      */
    