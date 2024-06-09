const router = require('express').Router();
const roomsController = require('./controllers/rooms-controller');
const authController = require('./controllers/auth-controller');
const activateController = require('./controllers/activate-controller');
const compilerController = require('./controllers/compiler-controller')
const authMiddleware = require('./middlewares/auth-middleware');

router.post('/api/send-otp', authController.sendOtp);
router.post('/api/verify-otp', authController.verifyOtp);
router.post('/api/activate', authMiddleware, activateController.activate);
router.get('/api/refresh', authController.refresh);
router.post('/api/logout', authMiddleware, authController.logout);
router.delete('/api/deleteRoom/:roomId', authMiddleware, roomsController.delete);
router.post('/api/deleteUser', authMiddleware, authController.deleteUser);
router.post('/api/rooms', authMiddleware, roomsController.create);
router.get('/api/rooms', authMiddleware, roomsController.index);
router.get('/api/rooms/:roomId', authMiddleware, roomsController.show);
router.post('/api/run-code', compilerController.runCode);
router.get('/api/test', (req, res) => res.json({ msg: 'OK' }));

module.exports = router;
