import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();

//env vars
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
