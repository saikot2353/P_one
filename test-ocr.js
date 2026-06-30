const fs = require("fs");

async function test() {
  const formData = new FormData();
  formData.append("apikey", "helloworld");
  formData.append("language", "eng");
  formData.append("OCREngine", "2");

  // We don't have an image, let's just pass a url
  formData.append("url", "https://i.imgur.com/31d1K7x.jpeg");

  try {
    const res = await fetch("https://api.ocr.space/parse/image", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
  }
}
test();
