/// Phil's vars and function declarations start
var email;
var password;
var favoriteArray = [];

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

    var spotifyToken = "BQDZjlIyCcbYsGvqmw0dgr0QBAVNvl1xCs1cUx6zYk8Q621CR483fuQgNvg8ArQX0ZPAjuIjB1_OvuMDR_RluUcLU0mGcKsYvnv4QvV9yT5tZ8q7lilNRh4j6428sX70MzDFf8TVKV2LQUehvQFZuxW_JYtKTzPB";

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
            .done(function(response) {
                console.log(response.artists.items);
                $("#results").empty();
                for (var i = 0; i < 5; i++) {
                    $("#results").append("<div><button class='artistbutton' data-id='" + response.artists.items[i].id + "' type='submit'>" + response.artists.items[i].name + "</button>" +
                        '<button type="button" class="save"><i class="fa fa-floppy-o" aria-hidden="true"></i></button></div>');
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
            // empty table and replace header row before running for-loop, table rows were not clearing  
            // between artists and were overflowing the container -Phil
            $("#tm").empty().append("<tr><th>When</th><br><th>Where</th><br><th>Venue</th><br><th>Link</th></tr>");
            for (var i = 0; i < 7; i++) {
                var date = response._embedded.events[i].dates.start.localDate;
                var location = response._embedded.events[i]._embedded.venues[0].city.name;
                var venue = response._embedded.events[i]._embedded.venues[0].name;
                var tickets = response._embedded.events[i].url;
                $("#tm").append("<tr><td>" + date + "</td><td>" + location + "</td><td>" + venue + "</td><td>" + "<a href='" + tickets + "'>TICKETS</a></td></tr>");
            }
        });
        //2nd spotify api call to paste artist image in bio
        var artistId = $(this).attr("data-id");
        var queryId = "https://api.spotify.com/v1/artists/" + artistId + "";
        $.ajax({
            url: queryId,
            headers: {
                Authorization: 'Bearer  ' + spotifyToken
            },
        }).done(function(response) {
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
        var queryInfo = "https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + artistName + "&api_key=" + lastfmKey + "&format=json&autocorrect[0|1]=yes";
        //var queryInfo = "http://api.musicgraph.com/api/v2/artist/search?api_key=" + musicGraphApi + "&name=" + artistName + ""
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
            $("#biosummary").html(response.artist.bio.summary);
        });

        var queryAlbums = "https://api.spotify.com/v1/artists/" + artistId + "/albums?offset=0&limit=5&album_type=album&market=ES"
        $.ajax({
            url: queryAlbums,
            headers: {
                Authorization: 'Bearer  ' + spotifyToken
            },
        }).done(function(response) {
            console.log(response);
            for (var i = 0; i < response.items.length; i++) {
                $('[data-val=' + [i + 1] + ']').empty(); // fixes appending extra divs to carousel when changing artists -Phil
                $("[data-val=" + [i + 1] + "]").append("<img data-val='" + [i + 1] + "' class='" + response.items[i].id + "' id='" + response.items[i].uri + "' src='" + response.items[i].images[1].url + "'>");
            }
        });
        ////////PHIL'S CODE START ///////////////
        // update currentArtist in firebase, use to load
        console.log($(this).attr('data-id'));
        firebase.database().ref(`users/${firebase.auth().currentUser.uid}`).update({
            currentArtist: [$(this)[0].innerHTML, $(this)[0].outerHTML, $(this).attr('data-id')]
        });
        ////////PHIL'S CODE END
    }

    // this runs only when user has signed out and then signs back in
    function runTm2(currentArtist, currentArtistId) {
        //1st ticketmaster api call to load tour information
        var artistName = currentArtist;
        $("#artname").text(artistName);
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
            // empty table and replace header row before running for-loop, table rows were not clearing  
            // between artists and were overflowing the container -Phil
            $("#tm").empty().append("<tr><th>When</th><br><th>Where</th><br><th>Venue</th><br><th>Link</th></tr>");
            for (var i = 0; i < 7; i++) {
                var date = response._embedded.events[i].dates.start.localDate;
                var location = response._embedded.events[i]._embedded.venues[0].city.name;
                var venue = response._embedded.events[i]._embedded.venues[0].name;
                var tickets = response._embedded.events[i].url;
                $("#tm").append("<tr><td>" + date + "</td><td>" + location + "</td><td>" + venue + "</td><td>" + "<a href='" + tickets + "'>TICKETS</a></td></tr>");
            }
        });
        //2nd spotify api call to paste artist image in bio
        var artistId = currentArtistId; // need this as a parameter
        var queryId = "https://api.spotify.com/v1/artists/" + artistId + "";
        $.ajax({
            url: queryId,
            headers: {
                Authorization: 'Bearer  ' + spotifyToken
            },
        }).done(function(response) {
            console.log(response);
            $("#bandPic").attr("src", "" + response.images[0].url + "");
        });
        //Begin last.fm api call
        //Keys for last.fm api 
        //API key   3892b0fc21269a6749520d712b765197
        // Shared secret    8f167de93e88facab6f170a907590320
        //Musicgraph api call
        //var queryInfo = "http://api.musicgraph.com/api/v2/artist/search?api_key=" + musicGraphApi + "&name='" + artistName + "'";
        var musicGraphApi = "c8618426b6f2b5b13cf4beb4280b46b2";
        var lastfmKey = "456b1b9fc5eef7b19d5126954a8bcd2a";
        var queryInfo = "https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + artistName + "&api_key=" + lastfmKey + "&format=json&autocorrect[0|1]=yes";
        //var queryInfo = "http://api.musicgraph.com/api/v2/artist/search?api_key=" + musicGraphApi + "&name=" + artistName + ""
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
            $("#biosummary").html(response.artist.bio.summary);
        });

        var queryAlbums = "https://api.spotify.com/v1/artists/" + artistId + "/albums?offset=0&limit=5&album_type=album&market=ES"
        $.ajax({
            url: queryAlbums,
            headers: {
                Authorization: 'Bearer  ' + spotifyToken
            },
        }).done(function(response) {
            console.log(response);
            for (var i = 0; i < response.items.length; i++) {
                $('[data-val=' + [i + 1] + ']').empty(); // fixes appending extra divs to carousel when changing artists -Phil
                $("[data-val=" + [i + 1] + "]").append("<img data-val='" + [i + 1] + "' class='" + response.items[i].id + "' id='" + response.items[i].uri + "' src='" + response.items[i].images[1].url + "'>");
            }
        });
    }

    //Runs function on press of artist button
    $(document).on("click", ".artistbutton", runTm);

    function displayTracks() {
        var albumName = $(this).attr("class");
        var albumUri = $(this).attr("id");
        $(this).parent().append("<iframe src='https://open.spotify.com/embed?uri=" + albumUri + "'>");
        $(this).hide();
        //$("iframe").attr("src", "https://open.spotify.com/embed?uri=" + albumUri + "");
        // var queryAlbumId = "https://api.spotify.com/v1/albums/" + albumName + "/tracks";
        // $.ajax({
        // 	url: queryAlbumId,	
        // 	headers: {
        // 		Authorization: 'Bearer ' + spotifyToken
        // 	},
        // }).done( function(response) {
        // 	console.log(response);
        // })
    } // end displayTracks()

    $(document).on("click", "img", displayTracks);

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
        console.log(email);
        console.log(password);
        firebase.auth().signInWithEmailAndPassword(email, password).then(function(){
            window.location.href = "layout333.html";
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode);

            if (errorCode === 'auth/wrong-password') {
                // write html to doc
                console.log('Wrong password.');
            } else {
                alert(errorMessage);
            }
            console.log(error);
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
    $('#results').on('click', '.save', function() {
        // console.log( $(this).prev()[0].innerHTML );
        firebase.database().ref(`users/${firebase.auth().currentUser.uid}/favorites`).push({
            favorite: $(this).parent().children()[0].outerHTML,
            artistName: $(this).prev()[0].innerHTML
        });
        $(this).parent().remove();
    });

    firebase.database().ref('users').on('child_changed', function(snap) {
        var favoritesHtml = "<tr><th>Artist</th><th>Remove</th></tr>";
        $('#artistTable').append(favoritesHtml);
        // construct spotify buttons
        $.each(snap.val().favorites, function(k, v) {
            favoritesHtml += `<tr data-id='${k}'><td>` + v.favorite + '</td>' +
                "<td><button type='button' class='remove'><i class='fa fa-trash' aria-hidden='true'></i></button></td></tr>";
        });
        // load to favorites
        $('#artistTable').empty().append(favoritesHtml);
        // load to slick on login
        console.log(snap.val().currentArtist[0]);
        if ($('div[data-val="1"]').children().length === 0) {
            runTm2(snap.val().currentArtist[0], snap.val().currentArtist[2]);
        }
    });

    $('#artistTable').on('click', '.remove', function() {
        var favoriteId = $(this).parent().parent().attr('data-id');
        $(this).parent().parent().remove();
        // if removed data-id matches currentArtist data-id
        // if (favoriteId === $('#currentArtist').children()[0].attributes[0].nodeValue) {
        //     firebase.database().ref(`users/${firebase.auth().currentUser.uid}`).update({
        //         currentArtist: ['none', 'Choose a new artist to load']
        //     });
        // }
        // currentArtist === removed artists, html prompt to load new artist? blank out slick too?
        firebase.database().ref(`users/${firebase.auth().currentUser.uid}/favorites/${favoriteId}`).remove();
    });

    var user = firebase.auth().currentUser;
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log(user);
            console.log('signed in');

            // set timestamp to trigger firebase callback
            // use callback from timestamp to get user fav's from fb
            var sessionsRef = firebase.database().ref(`users/${user.uid}`);
            sessionsRef.update({
                lastSession: firebase.database.ServerValue.TIMESTAMP
            });

        } else {
            console.log('not signed in')
                // window.location.href = "https://psd314.github.io/band-project/index.html";
        }
    });


    // once('change_child'), run tm() to load currentArtist after sign in?
    // fix appending tables and carousel
});