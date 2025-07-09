const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const app = express();
require('dotenv').config();
const mailchimp = require('@mailchimp/mailchimp_marketing');

const apiKey = process.env.MAILCHIMP_API_KEY;
const server = process.env.MAILCHIMP_SERVER;

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER
});


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.listen(process.env.PORT || 3000, () => {
    console.log(`server up at ${process.env.PORT || 3000}}`);
})

app.get("/", function(req, res){
    res.sendFile(__dirname+"/signup.html")
})

app.post("/signup", function(req, res){
    const {firstName, lastName, email} = req.body;

    let data = {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                    FNAME: firstName,
                    LNAME: lastName
                }
    };

    let jsonData = JSON.stringify(data);
    
    const listID = 'd9c627ce06';
    const url = `https://${server}.api.mailchimp.com/3.0/lists/${listID}/members`
    
    const options = {
        method: "post",
        auth: `nikhil:${apiKey}`
    }
    
    const call = https.request(url, options, function(response){

        if(response.statusCode == 200){
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }


        response.on('data', function(data){
            console.log(JSON.parse(data));
        })

        response.on('error', function(e){
            console.log(e);
        })
    })


    call.write(jsonData);
    call.end();

})
