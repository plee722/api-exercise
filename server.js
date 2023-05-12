const app = require("./app");
const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Listening on ${PORT} http://localhost:${PORT}`);
});