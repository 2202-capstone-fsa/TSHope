const express = require("express");
const app = express();

// app.get("/", function (req, res) {
//   res.send("Hello World");
// });

app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title> Puppies and Kittens Site</title>
      </head>
      <body>
        <h1> Puppies and Kittens Galore</h1>
      </body>
    </html>`);
});

app.get("/puppies", (req, res) => {
  res.send("this would be puppies");
});

app.get("/kittens", (req, res) => {
  res.send("and this would be kittens");
});

// or just app.listen(1337);
const PORT = 1337;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
