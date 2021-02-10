const express = require("express");
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express();

app.use(express.static("public"));

app.use(express.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/signup", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

mailchimp.setConfig({
  apiKey: "bdbbd747b4e743572a69f51438f1011e-us1",
  server: "us1"
});

app.post("/", function(req, res) {
  var firstName = req.body.fName;
  var lastName = req.body.lName;
  var email1 = req.body.email;
  const listId = "e2f255d18c";
  const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: email1
  };
  async function run() {
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName
      }
    });
    res.sendFile(__dirname+"/success.html");
    //res.send("yay! you made it!");
  }
  run().catch(e => res.sendFile(__dirname+"/failure.html"));
});

app.post("/success",function(req,res){
  res.redirect("/");
});

app.post("/failure",function(req,res){
  res.redirect("/signup");
})

app.post("/userInput", function(req, res) {
  var cityName = req.body.cityName;
  var tUnit = "metric";
  var key = "5579b8b48202a65a17977236914953ca";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=" + tUnit + "&appid=" + key;
  https.get(url, function(response) {
    response.on("data", function(data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const city = weatherData.name;
      const icon = weatherData.weather[0].icon;
      const imageURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
      const description = weatherData.weather[0].description;
      res.write("<h1>The temprature in " + city + " is " + temp + " degrees Celcius</h1>");
      res.write("<p><h1>The weather is currently: " + description + "</h1></p>");
      res.write("<p><img src=" + imageURL + ">");
      res.send();
    });
  });
});

app.post("/userGPS", function(req, res) {
  res.sendFile(__dirname + "/geoLocation.html");
});

app.listen(process.env.PORT, function(req, res) {
  console.log("Server Started.");
});
