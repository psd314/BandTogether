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

    $("#submit").on("click", function(runApi) {
        var query = $("#search").val();
        var queryUrl2 = "https://api.spotify.com/v1/search?query=" + query + "&type=artist&limit=5";
        var spotifyToken = "BQCM_AP6qth0Y3SKShJ8arEMjLXazPzNunymOFSWNVQL1RsqOt_rxz00eXp2lghgjUF5SOgCWKoYexr50DRpHIZe4pVXJOJkwDtOxWLcOGWKrJ0cpvh_Da6U608XiRvKwDaKND9OCwSh"
            //End of ticketmaster api call

        //Begin spotify api call
        // Spotify Client Credentials Flow
        // var clientId = "977af0fc81734cad8b087e49d2597c42";
        // var clientSecret = "c6d73d59372241198af8835721ef0f97";

        // $.ajax({
        // 	method: "POST",
        // 	url: "https://accounts.spotify.com/api/token",
        // 	grant_type: "client_credentials"
        // 	headers: {
        // 		Authorization: "Basic " + clientId + ":" + clientSecret 
        // 	},
        // }).done( function(response) {
        // 	console.log(response);
        // })
        $.ajax({
                url: queryUrl2,
                headers: {
                    Authorization: 'Bearer ' + spotifyToken
                },
            })
            .done(function(response) {
                console.log(response.artists.items);
                $("#results").empty();
                for (var i = 0; i < 5; i++) {
                    $("#results").append("<button id='artistbutton' class='" + response.artists.items[i].id + "' type='submit'>" + response.artists.items[i].name + "</button>")
                }
            })
    })

    function runTm() {
        var artistName = $(this).attr("class");
        var queryUrl = "https://app.ticketmaster.com/discovery/v2/events.json?keyword=" + artistName + "&apikey=STp440AwxFJGrUI9c9fFXpXQ8dZZuGow"
        var token = "BQDjYhg68AGCrPp6AhyVllcGHXwmo8GX3YZSuaEAd4lqO6fIMoeONqk9DcBfYIRxoMiCp1P0wK4Mzj_ej_GZ0W7LehVmIbuG45jN9Y-reFnh13H78HpuBF1u3s0ILI8gE7PbBgmmb5rv"
        $.ajax({
            method: "GET",
            url: queryUrl,
            async: true,
            dataType: "json",
            success: function(json) {
                console.log(json);
                // Parse the response.
                // Do other things.
            },
            error: function(xhr, status, err) {
                // This time, we do not end up here!
            }
        }).done(function(response) {
            console.log(response._embedded);
            for (var i = 0; i < 7; i++) {
                var date = response._embedded.events[i].dates.start.localDate;
                var location = response._embedded.events[i]._embedded.venues[0].city.name;
                var venue = response._embedded.events[i]._embedded.venues[0].name;
                var tickets = response._embedded.events[i].url;
                $("#tm").append("<tr><td>" + date +
                    "</td><td>" + location +
                    "</td><td>" + venue +
                    "</td><td>" + tickets +
                    "</td></tr>"
                );
            }
        });
    }

    $(document).on("click", "#artistbutton", runTm)

    // function displayAlbums() {
    // 	var artistName = $(this).attr("class");
    // 	console.log(artistName);
    // 	var queryId = "https://api.spotify.com/v1/artists/" + artistName + "/albums?offset=0&limit=6&album_type=album&market=ES"
    // 	$.ajax({
    // 		url: queryId,
    // 		headers: {
    // 			Authorization: 'Bearer  ' + spotifyToken
    // 		},
    // 	}).done( function(response) {
    // 		console.log(response);
    // 		$("#container").empty();
    // 		for (var i = 0; i < 6; i++) {
    // 			$("#container").append("<img id='" + response.items[i].uri + "'class='" + response.items[i].id + "'src='" + response.items[i].images[0].url + "'>")
    // 		}
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
        console.log( $('#email').val().trim() );
        console.log( $('#password').val().trim());
        // 	console.log(email);
        // 	console.log(password);
        // 	firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // // Handle Errors here.
        // var errorCode = error.code;
        // var errorMessage = error.message;
        // // ...
        // }).then(function() {
        // 	window.location.href = "slick.html";
        // 	console.log(firebase.auth().currentUser.uid);
        // });
    });

    // $('#signOut').on('click', function() {
    // 	firebase.auth().signOut().then(function() {
    // 	console.log('sign out successful')
    // }).catch(function(error) {
    // // An error happened.
    // });
    // });


});