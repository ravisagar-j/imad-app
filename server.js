var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));

var articles = {
  'article-One' : {
    title : 'Article one | Ravi',
    heading : 'Article one',
    date : 'aug 22 2017',
    content : ` 
         <p> This is my first article. This is my first article. This is my first article. This is my first article. This is my first article. This is my first article. This is my first article </p>
    
      <p> This is my first article. This is my first article. This is my first article. This is my first article. This is my first article. This is my first article. This is my first article </p>
     
     <p> This is my first article. This is my first article. This is my first article. This is my first article. This is my first article. This is my first article. This is my first article </p> `
},

  'article-Two' : {
    title : 'Article two | Ravi',
    heading : 'Article two',
    date : 'sep 22 2017',
    content : ` 
         <p> This is my second article. This is my second article. </p> `
    
},

  'article-Three' : {
    title : 'Article three | Ravi',
    heading : 'Article three',
    date : 'jul 22 2018',
    content : ` 
         <p>This is my third article. This is my third article. </p>`
 }
};
 
function createTemplate (data) {
    var title = data.title;
    var date =  data.date;
    var heading = data.heading;
    var content = data.content;
    
var htmlTemplate = `<html>
  <head>
     <title> ${title}</title>
     <meta name="viewport" contenr="device-width, initial-scale=1" />
     <link href="/ui/style.css" rel="stylesheet" />
      </head>
  <body>
      <div class="container">
      <div>
          <a href="/">home</a>
      </div>
      <hr/>
      <h3>
          ${heading}
      </h3>
      <div>
          ${date}
      </div>
      <div>
          ${content}
      </div>
      </div>
     </body>
   </html> `;
   return htmlTemplate;
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/:articleName', function(req, res){
    //articleName == article-one
    //articles[articleName] == {} content object for article one
     var articleName = req.param.articleName;
   res.send(createTemplate(articles[articleName]);
     
    
});

app.get('/article-two', function(req, res){
   res.sendFile(path.join(__dirname, 'ui', 'article-two.html'));
});

app.get('/article-three', function(req, res){
     res.sendFile(path.join(__dirname, 'ui', 'article-three.html'));
   res.send('Article three requested and will be served here');
   
});

 app.get('/ui/style.css', function (req, res) {
    
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
