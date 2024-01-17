import express from 'express';

const router = express.Router();

router.route('/register').post((req, res) => {
    res.send('Register API')
});
export default router;