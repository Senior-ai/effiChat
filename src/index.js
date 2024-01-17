import app from './app.js';
import logger from './configs/logger.js';

//env vars
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
