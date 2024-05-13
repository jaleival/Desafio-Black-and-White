const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Jimp = require('jimp');
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("assets"));

app.get("/", async (req, res) => {
  res.setHeader("Content-Type", "image/png");
  res.sendFile(path.join(__dirname, "/views/index.html"));
});

app.post("/procesar-imagen", async (req, res) => {
  const { imagenUrl } = req.body;
  try {
    const image = await Jimp.read(imagenUrl);
    const processedImage = await image
      .resize(350, Jimp.AUTO)
      .sepia()
      .grayscale()
      .quality(80);
    const nombreImagen = uuidv4().slice(0, 6) + "_uuid_foto.jpg";
    await processedImage.writeAsync(
      path.join(__dirname, "/assets/img/" + nombreImagen)
    );
    res.sendFile(path.join(__dirname, "/assets/img/" + nombreImagen));
  } catch (error) {
    res.status(500).send("Error al procesar la imagen.");
  }
});

app.listen(PORT, () => {
  console.log(`🔥 Servidor corriendo en el puerto 🔥 http://localhost:${PORT}`);
});