if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }
  
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY
  const stripePublicKey = process.env.STRIPE_PUBLIC_KEY
  
  const express = require('express')
  const app = express()
  const fs = require('fs')
  const stripe = require('stripe')(stripeSecretKey)
  
  app.set('view engine', 'ejs')
  app.use(express.json())
  app.use(express.static('images'))
  app.use('/', express.static('public'));
  app.engine('html', require('ejs').renderFile);

  // Set view engine as EJS
  app.engine('ejs', require('ejs').renderFile);
  //app.set('view engine', 'ejs');
  // Set 'views' directory for any views 
  // being rendered res.render()
  app.set('views', ('Views'));
  app.use('/form', express.static(__dirname + '/index.html')); 

  app.get("/", function (req, res){
    res.render('Views/store.ejs')
  })

  app.get("/index", function (req, res){
    res.render('index.html')
  })

  app.get('/about', function(req, res) {
    res.sendFile('about', {root: __dirname })
});



  app.get('/store', function(req, res) {
    fs.readFile('items.json', function(error, data) {
      if (error) {
        res.status(500).end()
      } else {
        res.render('store.ejs', {
          stripePublicKey: stripePublicKey,
          items: JSON.parse(data)
        })
      }
    })
  })
  
  app.post('/purchase', function(req, res) {
    fs.readFile('items.json', function(error, data) {
      if (error) {
        res.status(500).end()
      } else {
        const itemsJson = JSON.parse(data)
        const itemsArray = itemsJson.music.concat(itemsJson.merch)
        let total = 0
        req.body.items.forEach(function(item) {
          const itemJson = itemsArray.find(function(i) {
            return i.id == item.id
          })
          total = total + itemJson.price * item.quantity
        })
  
        stripe.charges.create({
          amount: total,
          source: req.body.stripeTokenId,
          currency: 'usd'
        }).then(function() {
          console.log('Charge Successful')
          res.json({ message: 'Successfully purchased items' })
        }).catch(function() {
          console.log('Charge Fail')
          res.status(500).end()
        })
      }
    })
  })
  
  const port =(process.env.PORT || 3000);
  app.listen(port, () =>{
    console.log("Asphyxiate!");
  });