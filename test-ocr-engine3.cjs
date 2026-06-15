const fs = require('fs');

async function test() {
  const formData = new FormData();
  formData.append("apikey", "K85293260888957");
  // using 1x1 image, we just want to see if we get an invalid language error or a parsing error
  const base64Image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
  formData.append("base64Image", base64Image);
  formData.append("language", "ben");
  formData.append("OCREngine", "3");

  try {
    const res = await fetch("https://api.ocr.space/parse/image", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    console.log("ENGINE 3 BEN:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
  }
}

async function test2() {
  const formData = new FormData();
  formData.append("apikey", "K85293260888957");
  const base64Image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
  formData.append("base64Image", base64Image);
  formData.append("language", "eng");
  formData.append("OCREngine", "1");

  try {
    const res = await fetch("https://api.ocr.space/parse/image", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    console.log("ENGINE 1 ENG:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
  }
}

test().then(test2);
