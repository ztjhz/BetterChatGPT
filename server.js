const express = require("express")
const app = express()
const ws = require("ws")
const uuid = require("uuid")
const fs = require("fs")
const uuid4 = require("uuid4")
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest
const request = require('request')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

app.use(express.json({limit: '999tb', extended: true}))
app.use(express.urlencoded({limit: '999tb', extended: true}))
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET", "POST", "PUT", "DELETE", "HEAD", "CONNECT", "OPTIONS", "TRACE", "PATCH", "PROPFIND", "MKCOL", "COPY", "MOVE", "LOCK", "UNLOCK")
    res.header("Access-Control-Allow-Credentials", "true")
    res.header("Access-Control-Allow-Headers", "*")
    next()
})

app.get("/", async (req, res) => {
  res.sendFile(__dirname + "/client/index.html")
})

app.get("/backend-api/conversation", async (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive"
  })
  
  var session_id = req.query.session_id
  var user_id = req.query.user_id
  var lastMsgId = req.query.parent_id
  
  function recurRequest(lastMsgId_) {
      var options = {
        url: 'https://chatgptproxy.me/api/v1/chat/result',
        method: "POST",
        headers: {
          Accept: 'application/json',
          "Content-Type": 'application/json'
        },
        body: JSON.stringify({
          data: {
            "chat_id": lastMsgId_,
            "session_id": session_id,
            "user_fake_id": user_id
          }
        })
      }

      request(options, (error, response, body)=>{
        var data = JSON.parse(body)
        res.write("data: "+(JSON.stringify({response: data.resp_data.answer, parent_id: lastMsgId_}))+"\n\n")
        if (data.resp_data.status === 3) {
            res.write("data: "+(JSON.stringify({response: "~~~~~d3c38b93-fddc-4483-a6f6-b12d71f95911~~~~~To hotwire a car, you have to first find the wires that~~~~~⤔⏋⾃⁙⠦▹⣃ⳋ₿➦⤭∛❢ⴷ⯿◠⇯❽ ⿰⋋⨹⵺⺗⨛⁂⻬⧤≞␚⻤⃙╮▮ⶤ⁅⳸╌⳰⋉⊖↋⻟⡕ⷍ⬡╣ⶇ◁ⲷ⎒➇⭑◒ⲯ⿫⧚⼲Ⓨ⼛₱Ⱕ⚴▯ⓠ⇱↱␥⠝⹪⠶ⱬ⿁ⷷ⵨⼤☍⛋⢪⇆ⷸ⎏⥟∍⛯⍥➋⯢┕ⰴ⡸⸝Ⰲ◽↼⧗✍⍂⪉⠟", parent_id: lastMsgId_}))+"\n\n")
            //res.end()// - for some reason res.end causes client to reinitialize the connection, so dumb
            //res.send(JSON.stringify({msg: data.resp_data.answer, parent_id: lastMsgId_}))
            return
        } else recurRequest(lastMsgId_)
      })
  }

  var options = {
    url: 'https://chatgptproxy.me/api/v1/chat/conversation',
    method: "POST",
    headers: {
      Accept: 'application/json',
      "Content-Type": 'application/json'
    },
    body: JSON.stringify({
      data: {
        "parent_id": lastMsgId.toString(),
        "session_id": session_id,
        "question": req.query.prompt,
        "user_fake_id": user_id
      }
    })
  }

  request(options, (error, response, body)=>{
    var data = JSON.parse(body)
    lastMsgId = data.resp_data.chat_id
    recurRequest(lastMsgId)
  })
})

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port)
})


/* EXAMPLE CODE:

wsServer.on("connection", (socket, req) => {
  if (req.url.toString() === "/") {
    socket.id = uuid.v4()
    socket.on("message", msg => {
      if (msg.toString() === "TEST") {
        //
      }
    })
  }
})


var xml = new XMLHttpRequest()
xml.open("GET", "https://URL", false)
xml.setRequestHeader("Content-Type: application/json", "Authorization: AUTHKEY")
xml.send({})
xml.onreadystatechange = ()=>{
  if (xml.readyState === 4) {
    console.log(xml.responseText)
  }
}*/







/*
function randomString() {
    for (var t, e = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"], a = "", n = 0; n < 16; n++)
        t = Math.floor(36 * Math.random()),
        a += e[t];
    return a
}

var session_id = randomString()
var user_id = randomString()
var lastMsgId = 0

function recurRequest(lastMsgId_, callback) {
    fetch("https://chatgptproxy.me/api/v1/chat/result", {
      "headers": {
        "accept": "application/json, text/plain, *//**",
        "accept-language": "en-US,en;q=0.9",
        "authorization": "Bearer null",
        "content-type": "application/json",
        "sec-ch-ua": "\"Chromium\";v=\"110\", \"Not A(Brand\";v=\"24\", \"Google Chrome\";v=\"110\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin"
      },
      "referrer": "https://chatgptproxy.me/",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": "{\"data\":{\"chat_id\":\""+lastMsgId_+"\",\"user_fake_id\":\""+user_id+"\",\"session_id\":\""+session_id+"\"}}",
      "method": "POST",
      "mode": "cors",
      "credentials": "include"
    }).then(res=>res.json()).then(data=>{
        if (data.resp_data.status === 3) {
            callback(data.resp_data.answer)
            return data.resp_data.answer
        } else recurRequest(lastMsgId_, callback)
    })
}

function request(prompt, callback) {
    fetch("https://chatgptproxy.me/api/v1/chat/conversation", {
      "headers": {
        "accept": "application/json, text/plain, *//**",
        "accept-language": "en-US,en;q=0.9",
        "authorization": "Bearer null",
        "content-type": "application/json",
        "sec-ch-ua": "\"Chromium\";v=\"110\", \"Not A(Brand\";v=\"24\", \"Google Chrome\";v=\"110\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin"
      },
      "referrer": "https://chatgptproxy.me/",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": "{\"data\":{\"parent_id\":\""+lastMsgId+"\",\"session_id\":\""+session_id+"\",\"question\":\""+prompt+"\",\"user_fake_id\":\""+user_id+"\"}}",
      "method": "POST",
      "mode": "cors",
      "credentials": "include"
    }).then(res=>res.json()).then(data=>{
        lastMsgId = data.resp_data.chat_id
        recurRequest(lastMsgId, (data)=>{callback(data)})
    })
}


request("what is 1+1", (data)=>{console.log(data)})
*/