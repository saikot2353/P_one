const fs = require("fs");

async function test() {
  const formData = new FormData();
  formData.append("apikey", "K85293260888957");
  formData.append("language", "eng");
  formData.append("OCREngine", "2");

  // Create a dummy base64 image (1x1 red pixel)
  const base64Image =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
  formData.append("base64Image", base64Image);

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
