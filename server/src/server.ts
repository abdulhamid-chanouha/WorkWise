import app from "./app";

const PORT = process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 5000;

if (Number.isNaN(PORT)) {
  throw new Error(`Invalid PORT value: ${process.env.PORT}`);
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});