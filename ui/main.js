// COunter code

var button = document.getElementById('counter');

button.onclick = function () {
  //create a request object
   var request = new XMLHttpRequest();

  //Capture the response and store it in a variable

   request.onreadystatechange = function () {
    if (request.readyState === XMLHttpRequest.DONE) {
       //take some action
      if (request.status === 200) {
         var counter = request.responseTest;
         var span = document.getElementById('count');
             span.innerHTML = counter.toString();
        }
   }
    //Not done yet
  };

request.open('GET', 'http://rjshp1234.imad.hasura-app.io/counter', true);
request.send(null);
};

var submit = document.getElementById('submit_btn');
submit.onclick = function () {
  var request = new XMLHttpRequest();
  
request.onreadystatechange = function () {
  if (request.readyState === XMLHttpRequest.DONE) {
      if(request.status === 200) {
         var names = request.responseText;
             names = JSON.parse(names);
         var list = '';
          for(var i=0; i<names.lenght; i++) {
             list += '<li>' + names[i] + '</li>';
           }
          var ul = document.getElementById('namelist');
              ul.innerHTML = list;
       }
   }
};

var nameInput = document.getElementById('name');
var name = nameInput.value;
request.open('GET','http://rjshp1234.imad.hasura-app.io/submit-name?name=' + name, true);
request.send(null);
};

