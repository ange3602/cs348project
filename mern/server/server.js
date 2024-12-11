import express from "express";
import cors from "cors";
import records from "./routes/record.js";
import meals from "./routes/meal.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/record", records);
app.use("/meal", meals);


app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies




// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});