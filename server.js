var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');


 var config = {
     user: 'ravij1234',
     database: 'rjshp1234',
     host: 'db.imad.hasura-app.io',
     port: '5432',
     password: process.env.DB_PASSWORD
 };
 
var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret: 'someRandomSecreteValue',
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30}
    
}));



 /* var articles = {
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
}; */ 
 
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
          ${date.toDateString()}
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


function hash (input, salt) {
    //how do we create a hash??
    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    return ["pbkdf2", "10000", salt, hashed.toString('hex')].join('$');
}

  app.get('/hash/:input', function (req, res) {
   var hashedString = hash(req.params.input, 'this-is-some-random-string');
   res.send(hashedString);
 });

 app.post('/create-user', function(req, res){
    //username, password
    // {"username": "rjshp1234", "password": "password"
    //JSON
    var username = req.body.username;
    var password = req.body.password;
    var salt = crypto.randomBytes(128).toString('hex');
    var dbString = hash(password, salt);
    pool.query('INSERT INTO "user" (username, password) VALUES ($1, $2)', [username, dbString], function (err, result) {
         if (err) {
        res.status(500).send(err.toString());
        } else {
            res.send("USER successfully created! " + username);
        }
 });  
}); 

app.post('/login', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    
   pool.query('SELECT * FROM "user" WHERE username = $1', [username], function (err, result) {
 if (err) {
     res.status(500).send(err.toString());
  }  else {
     if (result.rows.length === 0) {
       rows.send(403).send('username/password is invalid');
 } else {
     var dbString = result.rows[0].password;
     var salt = dbString.split('$')[2];
     var hashedPassword = hash(password, salt);
     if(hashedPassword === dbString) {
    
     req.session.auth = {userId: result.rows[0].id};
     
     res.send('credientials correct!'); 
  } else {
       res.send(403).send('username/password is invalid');
  }   
  }
}
});
});

app.get('/check-login', function (req, res) {
    if (req.session && req.session.auth.userId) {
        res.send('You are logged in : ' + req.session.auth.userId.toString());
    } else {
          res.send("You are no logged in!");
          
    }
});

app.get('/logout', function (req, res) {
    delete req.session.auth;
    res.send("You are logged out");
    
});

var Pool = new Pool(config);
app.get('/test-db', function (reg, res) {
  //make a select request    
pool.query('SELECT * FROM test', function (err, result) {
    if (err) {
        res.status(500).send(err.toString());
        } else {
            res.send(JSON,strngify(result.rows));
            
        }
    });
});

var counter = 0;
app.get('/counter',function (req, res) {
     counter = counter + 1;
     res.send(counter.toString());
});

var names = [];
app.get('/submit-name', function(req, res) {
    var name = req.query.name;
    names.push(name);
    res.send(JSON.stringfy(names));
});

app.get('/articles/:articleName', function(req, res){
    //articleName == article-one
    //articles[articleName] == {} content object for article one
    //var articleName = req.param.articleName;
    pool.query("SELECT * FROM article WHERE title = ' " + rew.params.articleName + '"', function (err, result) {
        if (err) {
        res.status(500).send(err.toString()); }
        else {
      if(result.rows.length === 0) {
          res.status(404).send('Article no found');
      } else {
           var articleData = result.rows[0];
           res.send(createTemplate(articleData));
       }     
      }
    });
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

app.get('/ui/main.js', function (req, res) {
    
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
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
