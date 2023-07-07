const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res){
    res.sendFile(__dirname+"/index.html");
})

app.post("/", function(req, res){
    const query = req.body.cityName;
    const apiKey = "4504891ad56ed3b5e86d81657f701336";
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid="+apiKey+"&units="+unit;
    https.get(url, function(response){
        // console.log(response.statusCode);
        if(response.statusCode===404){
            res.send("City Not Found");
        }
        else{
            response.on("data", function(data){
                const weatherData = JSON.parse(data);
                const temp = weatherData.main.temp;
                const description = weatherData.weather[0].description;
                const icon = weatherData.weather[0].icon;
                const imageURL = " https://openweathermap.org/img/wn/"+icon+"@2x.png";
                res.write("<p>The weather is currently "+ description + ".</p>")
                res.write("<h1>The temperatur in "+query+" is "+temp+ " degrees Celcius.</h1>");
                res.write("<img src="+imageURL+">");
                res.send();
            })
        }
       
    })
    // res.send("Server is running up");
});
app.listen(3000, function(){
    console.log("Server is running on port 3000");
})