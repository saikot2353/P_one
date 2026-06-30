const fs = require("fs");

async function test() {
  const formData = new FormData();
  formData.append("apikey", "K85293260888957");
  // A publicly available sample NID (from Wikipedia or similar)
  formData.append("url", "https://i.imgur.com/31d1K7x.jpeg"); // We need a real URL or we can test base64. Let's just test engine 1 vs engine 2 on a known image
  // Actually I don't have a good image URL.
}
test();
