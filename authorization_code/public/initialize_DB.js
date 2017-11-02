
/*
code to start FireBase!
*/

var config = {
        apiKey: "AIzaSyAfK2yxQ8UuJwyy_47yCneTGB_aoJS9uss",
        authDomain: "yemhm-431d0.firebaseapp.com",
        databaseURL: "https://yemhm-431d0.firebaseio.com",
        projectId: "yemhm-431d0",
        storageBucket: "yemhm-431d0.appspot.com",
        messagingSenderId: "107381933494"
      };
      firebase.initializeApp(config);
      //console.log(config);

      var storage = firebase.storage();
      var database = firebase.database();

      var storageRef = firebase.storage().ref();
      var userChange = firebase.database().ref('user_track_info/gameovercharlie/');

      var globul_DB = 0;
      globul_DB = getAccessToGlobal();
      console.log("this i globul_DB: " + globul_DB);
     
// Command Center

      /*userChange.limitToFirst(1).on('child_added', function(snapshot, previousChild_AKA_Data) {
      // retrieve the last record from `userChange`
         // all records after the last continue to invoke this function
        console.log("this is first item in collection: " + snapshot.key);
          // latestChildPlayback("album:" + snapshot.child("album_details").child("album_id").val(), 
          // snapshot.child("album_details").child("track_number").val(), globul_DB);
          latestChildPlayback("playlist:56L59C0rOC86SrW2ZIgO8C", 
          "0", globul_DB);
      });*/

      // userChange.limitToFirst(1).on('child_added', function(snapshot, previousChild_AKA_Data) {
      //     console.log("this is first track in playlist: " + snapshot.key);
      // });

      /* 
        userChange.limitToLast(1).on('child_added', function(snapshot, previousChild_AKA_Data) {
        console.log("this is lsat album in collection: " + snapshot.key);
          latestChildPlayback(snapshot.child("album_details").child("album_id").val(),
          snapshot.child("album_details").child("track_number").val(), globul_DB);
      });

      userChange.limitToLast(1).on('child_added', function(snapshot, previousChild_AKA_Data) {
        console.log("You track has changed according to last listened track: " + snapshot.key);
        // forcePlaybackofcurrenttrack() is made up function
          forcePlaybackOfCurrentTrack(ALBUM_ID, ALBUM_TRACK_ID, GLOBUL, START_OF_PLAYBACK);
      });

      userChange.limitToLast(1)('child_added', function(snapshot, previousChild_AKA_Data) {
          addToSharedPlaylist(snapshot.child("album_details").child("album_id").val());
      });
      */
      // var postNewData = userChange.push();
      // Initialized storage unit

      /*
      Things to add on server side:
        - Add folders for DB so you can store items in Que or Playlist
          * Playlist and Que should have separate folders (but essentially they are the same thing)
        - GUI for que list that is always visible on the side (this is like PRIO #1)
          * and mainly a cool addition if all goes acordingly
        - This is not a Que feature per say, but dynamically adding to a existing playlist could be a viable solution!
          * My thouths on this are: Doable but not ideal... if it works then great... but still not ideal
          * server would have to limit playlist size to make sorting trought A giant playlist more optimal
          * event though we have "limit to last "  and "limit to first " function wchitch should resolve this issue...
          * but still leaves server lifting heavy weights at playlist of size above ten thousand!
      */