const PORT = 8000;
const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

app.use(cors());
app.use(express.json());
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

app.post("/gemini", async (req, res) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const chat = model.startChat({
    history: req.body.history,
  });
  const msg = req.body.message;
  const result = await chat.sendMessageStream(msg);
  const response = await result.response;
  const text = response.text();
  res.send(text);
});
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
