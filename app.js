const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hail Thunar!");
});

const server = app.listen(3000, () => {
  console.log(
    `Server running on localhost port ${server.address().port} at ` + showTime()
  );
});

function showTime() {
  const now = new Date();
  let hour = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  let timeStamp = hour + ":" + minutes + ":" + seconds;
  return timeStamp;
}
