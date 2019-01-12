const xhttp = new XMLHttpRequest();
const button = document.getElementById('killbutton');

button.addEventListener('click', function(e) {
  xhttp.open('GET', '/kill', true);
  xhttp.send();
});