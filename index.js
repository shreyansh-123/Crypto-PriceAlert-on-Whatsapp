const express = require('express');
const app = express();
const port = process.env.PORT || 4001
const Users = require('./models/db');
const mongoose = require('mongoose');
const axios = require('axios');
const client = require('twilio')('AC5d6635bc591876755580513c1c6cc9c7', 'e9b3f952324640f382db4123b23f9c29');

app.use(express.urlencoded({extended: false}));
app.set('view engine', 'ejs')

mongoose.connect('mongodb://localhost:27017/Users', {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
})

app.get('/' , (req, res) => {
	res.render("home");
})

app.get('/data', (req, res) => {

    const api = `https://api.nomics.com/v1/prices?key=30fcc0d78160d2d4971159e920fcaeae`;

    axios.get(api).then((result) => {

    const data2 = result.data.filter(function(item) { return item.currency === 'EOS' && item.price > 2.8 })
    console.log(data2[0]['price']);
    res.json(`${data2[0]['currency']} ${data2[0]['price']}`);

    if(data2[0]['price'] > 7)
    {
    client.messages.create({
        from: 'whatsapp:+14155238886',
        body: `${data2[0]['currency']} price is ${data2[0]['price']}$`,
        to: 'whatsapp:+917000505639'
      }).then(message => console.log(message.sid))
      
      .catch(er => (console.log(er)));
    }
    

    }).catch((err) => {

        console.log(err);
    });
    
})







app.get('/signup' , (req, res) => {
	res.render("signup");
})

app.get('/login' , (req, res) => {
	res.render("login");
})

app.post('/signup', (req, res) => {
     const NewData = new Users({
        username: req.body.username,
        password: req.body.password
    })
    NewData.save();
    res.render("login");
})

app.post('/login', (req, res) => {
    const password = req.body.password;
    const username = req.body.username;
    const passwords = Users.findOne({username:username})
    if (passwords.password === password) {
        res.render("home");   
    }
    else
    {
        
        console.log("Wrong Details");
    }
})


app.listen(port, (e => {
    console.log('server is running on port 4001');
}))
