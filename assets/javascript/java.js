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






