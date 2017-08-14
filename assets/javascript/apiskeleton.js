/// Phil's vars and function declarations start
var email;
var password;

var config = {
    apiKey: "AIzaSyC6sqYsPCP2CUv8vhNEHhn2Y6vA8UbNm_k",
    authDomain: "band-project-430af.firebaseapp.com",
    databaseURL: "https://band-project-430af.firebaseio.com",
    projectId: "band-project-430af",
    storageBucket: "",
    messagingSenderId: "231299899809"
};
/// Phil's vars and function declarations end

$(document).ready(function() {
firebase.initializeApp(config);
var spotifyToken = "BQB-c4uYN1fJxakizBSE6OpXZbtI8ur8NebgDdLcXgrc7dWVuK-kf8wKNiuafVN4yDkRyICV0fbuEsmymLY-5x9E9SoNpmwgnh_-jowrz8V56yVNt1aBmKn8ZJfKNPkb_-RV5GssOjonhnLVse3wHg3wlQ-MKkbM"
	$("#submit").on("click", function(event) {
	//1st spotify api call to get 5 most popular artist and make buttons
		event.preventDefault();
		var query = $("#search").val();
		var queryUrl2 = "https://api.spotify.com/v1/search?query=" + query + "&type=artist&limit=5"
		$.ajax({
     		url: queryUrl2,
     		headers: {
      		  Authorization: 'Bearer ' + spotifyToken
      		},
   		})
   		.done( function(response) {
		 	 console.log(response.artists.items);
		 	 $("#results").empty();
		 	 for (var i = 0; i < 5; i++) {
		 	 	$("#results").append("<div><button id='artistbutton' class='" + response.artists.items[i].id + "' type='submit'>" + response.artists.items[i].name + "</button>" +
                    '<button type="button" class="save"><i class="fa fa-check" aria-hidden="true"></i></button></div>');
		 	 }
		})
	})	

	function runTm() {
	//1st ticketmaster api call to load tour information
		var artistName = $(this).text();
		$("#artname").text(artistName);
		var queryUrl = "https://app.ticketmaster.com/discovery/v2/events.json?keyword=" + artistName + "&apikey=STp440AwxFJGrUI9c9fFXpXQ8dZZuGow"
		var token = "BQDjYhg68AGCrPp6AhyVllcGHXwmo8GX3YZSuaEAd4lqO6fIMoeONqk9DcBfYIRxoMiCp1P0wK4Mzj_ej_GZ0W7LehVmIbuG45jN9Y-reFnh13H78HpuBF1u3s0ILI8gE7PbBgmmb5rv"	
		$.ajax({
		  method:"GET",
		  url: queryUrl,
		  async:true,
		  dataType: "json",
		  success: function(json) {
		              console.log(json);
		              // Parse the response.
		              // Do other things.
		           },
		  error: function(xhr, status, err) {
		              // This time, we do not end up here!
		           }
		}).done(function(response){
			console.log(response._embedded);
			for (var i = 0; i < 7; i++) {
				var date = response._embedded.events[i].dates.start.localDate;
				var location = response._embedded.events[i]._embedded.venues[0].city.name;
				var venue = response._embedded.events[i]._embedded.venues[0].name;
				var tickets = response._embedded.events[i].url;
				$("#tm").append("<tr><td>" + date + "</td><td>" + location + "</td><td>" + venue + "</td><td>" + "<a href='" +  tickets + "'>TICKETS</a></td></tr>");
			}
		});
	//2nd spotify api call to paste artist image in bio
		var artistId = $(this).attr("class");
		var queryId = "https://api.spotify.com/v1/artists/" + artistId + "";
		$.ajax({
			url: queryId,
			headers: {
				Authorization: 'Bearer  ' + spotifyToken
			},
		}).done( function(response) {
			console.log(response);
			$("#bandPic").attr("src", "" + response.images[0].url + "");
		});	
	//Begin last.fm api call
	//Keys for last.fm api 
	//API key	3892b0fc21269a6749520d712b765197
	// Shared secret	8f167de93e88facab6f170a907590320
	//Musicgraph api call
	//var queryInfo = "http://api.musicgraph.com/api/v2/artist/search?api_key=" + musicGraphApi + "&name='" + artistName + "'";
		var musicGraphApi = "c8618426b6f2b5b13cf4beb4280b46b2";
		var lastfmKey = "456b1b9fc5eef7b19d5126954a8bcd2a";
		var queryInfo = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist='" + artistName + "'&api_key=" + lastfmKey + "&format=json";
		$.ajax({
			url: queryInfo,
			method: "GET",
			async: true,
			success: function(json) {
				console.log(json);
			},
			error: function(xhr, status, err) {
				console.log(err)
			},
		}).done(function(response) {
			console.log(response);
			//$("#bio").text(response.bio.summary);
		})
	}	

	//Runs function on press of artist button
	$(document).on("click", "#artistbutton", runTm)

	// function displayAlbums() {
	// 	var artistId = $(this).attr("class");
	// 	console.log(artistId);
	// 	var queryId = "https://api.spotify.com/v1/artists/" + artistId + "/albums?offset=0&limit=6&album_type=album&market=ES"
	// 	$.ajax({
	// 		url: queryId,
	// 		headers: {
	// 			Authorization: 'Bearer  ' + spotifyToken
	// 		},
	// 	}).done( function(response) {
	// 		console.log(response);
	// 		$("#bandPic").attr("src", );
	// 		// for (var i = 0; i < 6; i++) {
	// 		// 	$("#container").append("<img id='" + response.items[i].uri + "'class='" + response.items[i].id + "'src='" + response.items[i].images[0].url + "'>")
	// 		// }
	// 	})
	// }

	// function displayTracks() {
	// 	var albumName = $(this).attr("class");
	// 	var albumUri = $(this).attr("id");
	// 	$("#container").empty();
	// 	$("iframe").attr("src", "https://open.spotify.com/embed?uri=" + albumUri + "")
	// 	console.log(albumUri);
	// 	console.log(albumName);
	// 	var queryAlbumId = "https://api.spotify.com/v1/albums/" + albumName + "/tracks";
	// 	$.ajax({
	// 		url: queryAlbumId,	
	// 		headers: {
	// 			Authorization: 'Bearer ' + spotifyToken
	// 		},
	// 	}).done( function(response) {
	// 		console.log(response);
	// 		$("#container").empty();
	// 		for (var i = 0; i < response.items.length; i++) {
	// 			$("#container").append("<p class='" + [i] + "'>" + response.items[i].track_number + "</p>");
	// 			$("." + [i] + "").append("<p>" + response.items[i].name + "</p>");
	// 		}
	// 	})
	// }

	// $(document).on("click", "img", displayTracks)

	//Phils code start

     // add firebase

    var user = firebase.auth().currentUser;
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log(user);
            console.log('signed in');
        } else {
            if (window.location.href ===
                "file:///C:/Users/Philippe/Dropbox/Desktop/unc/band-project/layout333.html") {
                window.location.href = "index.html";
            }
        }
    });

    $('#create').on('click', function() {
        if ($('#createPassword').val().trim() === $('#confirmPassword').val().trim()) {
            console.log('matched');
            email = $('#createEmail').val().trim();
            password = $('#createPassword').val().trim();

            firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // ...
            }).then(function() {
                console.log(firebase.auth().currentUser.uid);


                firebase.database().ref(`users/${firebase.auth().currentUser.uid}`).update({
                    email: email,
                    password: password,
                    favorites: "",
                    currentArtist: ""
                });
            });
        } else {
            alert('passwords must match')
        }
    });
    $('#signIn').on('click', function() {
        email = $('#email').val().trim();
        password = $('#password').val().trim();
        console.log($('#email').val().trim());
        console.log($('#password').val().trim());
        console.log(email);
        console.log(password);
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
        }).then(function() {
            window.location.href = "layout333.html";
            console.log(firebase.auth().currentUser.uid);
        });
    });

    $('#logOut').on('click', function(e) {
        e.preventDefault();
        firebase.auth().signOut().then(function() {
            console.log('sign out successful');
            window.location.href = "index.html";
        }).catch(function(error) {
            // An error happened.
        })
    });
    // firebase listener on artist button saves current artist
    // write to firebase on.click for checkmark button
    // firebase listener to add to favorites

});