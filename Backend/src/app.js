import express from "express";

const app = express();

// basic configuration
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Hello World");
});

export default app;
