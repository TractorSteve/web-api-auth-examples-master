//console.log("This external ource is twerking!");

function makeUserSubStorage (user_name) {
	firebase.database().ref('user_track_info/' + user_name + '/').set({
		random: "Placeholder"

      //probably useless lets see!
  });
}

function latestChildPlayback(sourceType_id, position_id, globul_token)
			{
				// when a new child is added. Play previous track 
				// possible issue is:
				// 1: wrong request address
				// 2: wrong format

				/*Default playlist is ==> public playlist ==> ID = 56L59C0rOC86SrW2ZIgO8C */

				var generalData = '{"context_uri": "spotify:' + sourceType_id + '"}';
                var maybeWorkingThing = '{"context_uri": "spotify:user:gameovercharlie:playlist:7dCTiomKeK4ooOiulUjj2Y", "offset": {"position":"0"}}';
				var playlistData = '{"context_uri": "spotify:playlist:' + sourceType_id + '","offset": {"position":"' + position_id + '"}}';
				var alternativeTempData = '{"uris": ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh", "spotify:track:1301WleyT98MSxVHPZCA6M"]}';
				/*
				 var orderJson = {
			        AdditionalInstructions: $("span:first").text(),
			        Customer: {
			            FirstName: $("#firstName").val(),
			            LastName: $("#lastName").val()
			        },
			        OrderedProduct: {
			            Id: $("#productList").val(),
			            Quantity: $("#quantity").val()
			        }
			    };
*/

				$.ajax({
        			url: 'https://api.spotify.com/v1/me/player/play',
        			type: 'PUT',
        			headers: {"Authorization": "Bearer " + globul_token},
        			data: maybeWorkingThing,
					dataType: 'application/json',
        			success: function(data, textStatus, xhr)
        			{
        				console.log("track id from DB: " + data.track_id);
        			},
        			error: function(xhr, textStatus)
        			{
        				console.log(xhr.status);
        			}
        		});
			}

//quick and dirty solution
function writeTrackInformation(user_id,user_name,track_progress,track_id,my_device_time_stamp, track_popularity, track_uri, track_name, track_number, album_name, album_type, album_id,
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

function addPlaylistNameToDB(playlist_add_name) {
	firebase.database().ref('public_playlist/').set({
		"playlist": playlist_add_name
	});
}

function addToPLaylistQue(track_id){
    firebase.database().ref('public_tracks/').set({
        "track_name": track_id
    })
}
//------------------------------------
	var globulToken = 0;
	var globulTokenAge = 0;
	var globulPlayingBoolean = false;
	var globulActiveDevice = 0;
	var globulUserId = "";
    var globulPlaylist = "";
        //setInterval(updateToken, 3500000);
        // stop music juan minte after update tóken has been fetched!

        // function testStorage()
        // {
        //   $.ajax({
        //     url: 'https://yemhm-431d0.firebaseio.com',
        //     type: 'PUT',
        //     data: {
        //       firstThing : "randomText"
        //     }
        //   });
        // }
        // testStorage();


        // function writeSomeData (Variable1,Variable2,Variable3)
        // {
        //   firebase.database().ref()
        // }

        /////////////////////////////////////////////////////////////////////////////////////////////7
        /* create auto update when diffrence between Date.now() and globulTokenAge is bigger than 3 500 000 ms 
             since Spotify token is no longer valid after 3 600 000 ms aka. 1 hour so we auto update sooner just in case
             site does request new access token when we login/ come back on site.
             */

             function getAccessToGlobal() {
             	return globulToken;
             }

             function updateToken () {

             	$.ajax({
             		url: '/refresh_token',
             		data: {
             			'refresh_token': refresh_token
             		},success: function(data, textStatus, xhr) 
             		{
             			console.log("Timestamp from updateToken()" + Date.now());
             			globulTokenAge = Date.now();
             			globulToken = data.access_token;
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

        /**
         * Obtains parameters from the hash of the URL
         * @return Object
         */


         function getUserId (){
         	$.ajax({
         		url: 'https://api.spotify.com/v1/me',
         		type: 'GET',
         		headers: {
         			'Authorization': 'Bearer ' + globulToken
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

         //fokin working boiiii!!!
        function skipInsideTrack () {
        	var startVariable = getCurrentTimeStamp();
        	var stopVariable;
        	$.ajax({
        		url: 'https://api.spotify.com' + '/v1/me/player',
        		type: 'GET',
        		headers: {'Authorization' : 'Bearer ' + globulToken},
        		success: function(data, textStatus, xhr)
        		{
        			var current_progress = data.progress_ms + 1000;
        			globulPlayingBoolean = data.is_playing;
        			if(globulPlayingBoolean == true){
        				$.ajax({
        					url: 'https://api.spotify.com/v1/me/player/seek' + '?' + $.param({'position_ms' : current_progress}),
        					type: 'PUT',
        					headers: {
        						'Authorization' : 'Bearer ' + globulToken
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

        function skipByXSeconds () {
        	$.ajax({
        		url: 'https://api.spotify.com' + '/v1/me/player',
        		type: 'GET',
        		headers: {
        			'Authorization' : 'Bearer ' + globulToken
        		}, success: function(data, textStatus, xhr){
        			console.log(xhr.status);
        			var current_progress = data.progress_ms + 30000;
        			globulPlayingBoolean = data.is_playing;
        			$.ajax({
        				url: 'https://api.spotify.com/v1/me/player/seek?position_ms=25000',
        				type: 'PUT',
        				headers: {
        					'Authorization' : 'Bearer ' + globulToken
        				},
        				success: function(data, textStatus, xhr)
        				{
        					console.log(xhr.status);
        				},
        				error: function(xhr, textStatus)
        				{
        					console.log(xhr.status);
        				}
        			});
        		},
        		error: function(xhr, textStatus)
        		{
        			console.log(xhr.status);
        		}
        	});
        }

        function getListItemsInFirebase(user_name) {
        	$.ajax({
        		url: 'https://yemhm-431d0.firebaseio.com/user_track_info.json',
        		type: 'GET',
        		success: function(data, textStatus, xhr)
        		{
        			var listSize = Object.keys(data[user_name]).length;
        			console.log("getListItemsInFirebase success: " + xhr.status);
        			console.log("items in list: " + listSize);
        		}, error: function(xhr, textStatus)
        		{
        			console.log(xhr.status);
        		}
        	});
        }
            //Check how long it would take to Reqest and retrieve some basic data!
            //1: my device
            //2: db
            //3: back to my device

        function MasterButton() {
          // writeTrackInformation(timestampTranslation(getCurrentTimeStamp()));
          //writeTrackInformation(user_id,user_name,track_progress,track_id,my_device_time_stamp, track_popularity, track_uri)
          $.ajax({
          	url: 'https://api.spotify.com' + '/v1/me',
          	type: 'GET',
          	headers: { 'Authorization' : 'Bearer ' + globulToken},
          	success: function(data, textStatus, xhr) {
          		var user_id = data.id;
          		var user_uri = data.uri;
          		var user_product = data.product;
          		var user_type = data.type;
            	var testVariableCurrentlyPLaying; // remove or alter name at later stage!

            	$.ajax({
            		url: 'https://api.spotify.com' + '/v1/me/player/currently-playing',
            		type: 'GET',
            		headers: { 'Authorization' : 'Bearer ' + globulToken},
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
			        console.log(track_uri + track_id + track_name + track_popularity);

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
        //setTimeout(function() {MasterButton();}, 2000);

        function checkIfPlaylistExists() {
            //firebase.database().ref('public_playlist/').get("value");
            var snapValue = 0;
            firebase.database().ref("public_playlist/").on("value", function(snapshot){
                snapValue = snapshot.child("playlist").val();
                var dataSnapshot = snapshot;
                console.log("snap Value: " + snapValue);
                console.log(dataSnapshot);
                globulPlaylist = snapValue;
            }, function(errorObject){
                console.log(errorObject);
            });
        }

    	function flexibleButtonFunction(url, reqType, name) {
            $.ajax({
    			url: 'https://api.spotify.com' + url,
    			type: reqType,
    			headers: {
    				'Authorization': 'Bearer ' + globulToken
    			},
    			success: function(data, textStatus, xhr)
    			{
    				console.log("flexibleButtonFunction success: " + xhr.status);
    				switch (name) {
    					case 'stop-current-track':
    					console.log("track stopped");
    					break;
    					case 'obtain-track-info':
    					$("#obtain-track-info").html("" + data.item.name);
                        console.log(data.item.name);
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

    function changeButtonText(elementId, newText, oldText, sleepTime) 
    {
        $(elementId).html(newText);
        setTimeout(function() {$(elementId).html(oldText);}, sleepTime);
    }

        function createPlaylistButton(url, reqType, name, tempData){
            console.log("checkIfPlaylistExists value: " + checkIfPlaylistExists());
            console.log("globulPlaylist" + globulPlaylist);
            if( checkIfPlaylistExists() != "public playlist"){  
                $.ajax({
                    url: 'https://api.spotify.com' + url,
                    type: reqType,
                    headers: {
                        'Authorization': 'Bearer ' + globulToken
                    },
                    data: tempData,
                    success: function(data, textStatus, xhr)
                    {
                        addPlaylistNameToDB(data.name);
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
            else{
               console.log("playlist exists already");
            }
        }

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
            globulToken = access_token;
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
            		globulUserId = response.id;

            		$('#login').hide();
            		$('#loggedin').show();
            	}
            });
        } else {
              // render initial screen
              $('#login').show();
              $('#loggedin').hide();
          }

    document.getElementById('obtain-new-token').addEventListener('click', function () {updateToken();}, false);
    //-------------------------------------------------------------------
    document.getElementById('obtain-track-info').addEventListener('click', function() {
    	flexibleButtonFunction('/v1/me/player/currently-playing','GET', 'obtain-track-info', null)}, false);
    //--------------------------------------------------------------------
    document.getElementById('resume-current-track').addEventListener('click', function() {
    	flexibleButtonFunction('/v1/me/player/play','PUT', 'resume-current-track', null)}, false);
    //------------------------------------------------------------------------
    document.getElementById('stop-current-track').addEventListener('click', function () {
    	flexibleButtonFunction('/v1/me/player/pause','PUT', 'stop-current-track', null)}, false);
    //----------------------------------------------------------------------
    document.getElementById('get-users-playlists').addEventListener('click', function() {
        flexibleButtonFunction('/v1/users/' + globulUserId + '/playlists', 'GET', 'get-users-playlists', null)},false);
    //-----------------------------------------------------------------------
    document.getElementById('skip-by-x-milliseconds').addEventListener('click',function() {
        skipInsideTrack();
        changeButtonText("#skip-by-x-milliseconds", "Skipped by 1 sec", "Forward by 1 sec", 1000);
    }, false);
    //--------------------------------------------------------------------------
    document.getElementById('get-user-devices').addEventListener('click', function() {
    	flexibleButtonFunction('/v1/me/player/devices', 'GET', 'get-user-devices', null)}, false);
    //--------------------------------------------------------------------------
    document.getElementById('get-current-time').addEventListener('click', function() {
    	$(this).html(timestampTranslation(getCurrentTimeStamp()));
    	console.log(timeSinceTokenUpdate(getCurrentTimeStamp(),globulTokenAge));
    	console.log(timestampTranslation(timeSinceTokenUpdate(getCurrentTimeStamp(),globulTokenAge)));}, false);
    //--------------------------------------------------------
    document.getElementById('master-button').addEventListener('click', function() {
    	MasterButton();}, false);
    //-------------------------------------------------------------------
    document.getElementById('list-size').addEventListener('click',
    	function() {getListItemsInFirebase("gameovercharlie");}, false);
    //--------------------------------------------------------
    document.getElementById('create-playlist').addEventListener('click',
    	function() {
    		    var createPlaylistData = '{"description":"public playlist","public": true,"name": "public playlist"}';
    		    createPlaylistButton('/v1/users/' + globulUserId + '/playlists', 'POST', 'create-playlist', createPlaylistData);
                changeButtonText("#create-playlist", "Playlist Created!", "Create Playlist", 2000);
    	}, false);
    //--------------------------------------------------------------
           
    document.getElementById('start_playing_default_playlist').addEventListener('click',
        function() {
            var defaultPlaylist = "playlist:56L59C0rOC86SrW2ZIgO8C";
            latestChildPlayback(defaultPlaylist, '0' , globulToken);
        },false);
    //--------------------------------------------------------------
          // add age paremeter to accesstoken that is stored localy
          // to prement wasting reqests per second

      }


  /*
	add if error 401 

		updateGlobulToken()

		and run method again

		method(same_parameter_1, same_parameter_2);

		DUN!

  */