/** Client-side of groupchat. */

const urlParts = document.URL.split("/");
const roomName = urlParts[urlParts.length - 1];
const ws = new WebSocket(`ws://localhost:3000/chat/${roomName}`);


const name = prompt("Username?");


/** called when connection opens, sends join info to server. */

ws.onopen = function(evt) {
  console.log("open", evt);

  let data = {type: "join", name: name};
  ws.send(JSON.stringify(data));
};


/** called when msg received from server; displays it. */



ws.onmessage = async function(evt) {
  console.log("message", evt);

  let joke = await axios.get("icanhazdadjokes.com")


  console.log(joke)
    
    
  

  let msg = JSON.parse(evt.data);
  let item;

  if (msg.type === "note") {
    item = $(`<li><i>${msg.text}</i></li>`);
  }

  else if(msg.type === "get-joke"){
      
    item = $(`<li><i>${joke.joke}</i></li>`);
  }


  else if (msg.type === "chat") {
    item = $(`<li><b>${msg.name}: </b>${msg.text}</li>`);
  }

  else {
    return console.error(`bad message: ${msg}`);
  }

  $('#messages').append(item);
};


/** called on error; logs it. */

ws.onerror = function (evt) {
  console.error(`err ${evt}`);
};


/** called on connection-closed; logs it. */

ws.onclose = function (evt) {
  console.log("close", evt);
};


/** send message when button pushed. */

$('form').submit(function (evt) {
  evt.preventDefault();

  let jokeValue = $("#m").val();

  if(jokeValue  === "/joke"){
    let data = {type: "get-joke", text: "joke is this joke"}
    ws.send(JSON.stringify(data));
  } else {
    let data = {type: "chat", text: $("#m").val()};
    ws.send(JSON.stringify(data));
  }

  $('#m').val('');
});

