var modal = document.getElementById('myModal');

var btn = document.getElementById("myBtn");

var span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
    modal.style.display = "block";
    $("#modalDiv1").css("display", "block")
}

span.onclick = function() {
    modal.style.display = "none";
}

$("#modalDiv1").on("click", function() {
    modal.style.display = "none";
    $("#modalDiv1").css("display", "none")
});

var modal2 = document.getElementById('myModal2');

var btn2 = document.getElementById("myBtn2");

var span2 = document.getElementsByClassName("close")[0];

btn2.onclick = function() {
    modal2.style.display = "block";
    $("#modalDiv1").css("display", "block")
}

span2.onclick = function() {
    modal2.style.display = "none";
}

$("#modalDiv1").on("click", function() {
    modal2.style.display = "none";
    $("#modalDiv1").css("display", "none")
});




