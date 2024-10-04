import { createRequire } from "module";
const require = createRequire(import.meta.url);
const path = require("node:path");
import bodyParser from "body-parser";
import express from "express";
import https from "https";
const qrCode = require("qrcode");

const app = express();
const __dirname = path.resolve(path.dirname(""));

//external sources public
app.use(express.static(path.join(__dirname, "public")));

//bodyParser USE
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, response) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email_address = req.body.emailInput;

  const data = {
    skip_duplicate_check: true,
    members: [
      {
        email_address: email_address,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const option = {
    method: "POST",
    auth: "Fz:66ae538a8abd8b762025dc9fc964c355-us8",
  };

  const url = "https://us8.api.mailchimp.com/3.0/lists/133b1f0217";
  const request = https.request(url, option, (res) => {
    if (response.statusCode === 200) {
      response.sendFile(__dirname + "/qrApp.html");
    } else {
      response.sendFile(__dirname + "/fail.html");
    }

    res.on("data", (data) => {
      console.log(JSON.parse(data));
    });
    console.log(res);
  });

  request.write(jsonData);
  request.end();
});

app.post("/fail", (req, res) => {
  res.redirect("/"); //back redirect
});

app.post("/form", (req, res) => {
  const address = req.body.qr_address;

  qrCode.toDataURL(address, (err, url) => {
    const base64Data = url.replace(/^data:image\/png;base64,/, "");
    const img = Buffer.from(base64Data, "base64");
    res.writeHead(200, {
      "Content-type": "image/png",
      "Content-Length": img.length,
    });
    res.end(img);
  });
});

app.listen(4000, (err) => {
  if (err) throw new Error(err);
  else console.log("Server Running at Port 3000");
});

//API KEY
//66ae538a8abd8b762025dc9fc964c355-us8

//integration NO
//133b1f0217
