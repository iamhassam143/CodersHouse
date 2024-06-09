const otpService = require('../services/otp-service');
const hashService = require('../services/hash-service');
const userService = require('../services/user-service');
const tokenService = require('../services/token-service');
const UserDto = require('../dtos/user-dto');

class AuthController {
    async sendOtp(req, res) {
        const { email, phone } = req.body;
        if (!(email || phone)) {
            return res.status(400).json({ message: 'Email or Phone field is required!' });
        }
        
        const otp = await otpService.generateOtp();

        const ttl = 1000 * 60 * 10; // 10 min
        const expires = Date.now() + ttl;
        const data = `${email}.${phone}.${otp}.${expires}`;
        const hash = hashService.hashOtp(data);

        const currentTime = new Date().toLocaleTimeString();
        console.log(otp, currentTime);

        // send sms OTP
        if(phone) {
            try {
                await otpService.sendBySms(phone, otp, ttl);
                return res.json({
                    hash: `${hash}.${expires}`,
                    phone,
                });
            } catch (err) {
                console.log(err);
                return res.status(500).json({ message: 'phone otp sending failed', error: err });
            }
        }

        // send email OTP
        if(email) {
            try {
                await otpService.sendByEmail(email, otp, ttl);
                return res.json({
                    hash: `${hash}.${expires}`,
                    email,
                });
            } catch(err) {
                console.log(err);
                return res.status(500).json({ message: 'email otp sending failed', error: err });
            }
        }
    }

    async verifyOtp(req, res) {
        const { otp, hash, email, phone } = req.body;
        if (!otp || !hash || !(email || phone)) {
            return res.status(400).json({ message: 'All fields are required!' });
        }

        const [hashedOtp, expires] = hash.split('.');
        const data = `${email}.${phone}.${otp}.${expires}`;
        const isValid = otpService.verifyOtp(hashedOtp, data);
        if (!isValid) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (Date.now() > +expires) {
            return res.status(400).json({ message: 'OTP expired!' });
        }

        let user;
        try {
            if(phone) {
                user = await userService.findUser({ phone });
                if (!user) {
                    user = await userService.createUser({ phone });
                }
            }
            
            if(email) {
                user = await userService.findUser({ email });
                if (!user) {
                    user = await userService.createUser({ email });
                }
            }
            
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: 'Db error', error: err });
        }
            
        const { accessToken, refreshToken } = tokenService.generateTokens({
            _id: user._id,
            activated: false,
        });

        await tokenService.storeRefreshToken(refreshToken, user._id);

        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            sameSite: 'none',
            secure: true,
            httpOnly: true,
        });

        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            sameSite: 'none',
            secure: true,
            httpOnly: true,
        });

        const userDto = new UserDto(user);
        return res.json({ user: userDto, auth: true });
    }

    async refresh(req, res) {
        // get refresh token from cookie
        const { refreshToken: refreshTokenFromCookie } = req.cookies;
        // check if token is valid
        let userData;
        try {
            userData = await tokenService.verifyRefreshToken(
                refreshTokenFromCookie
            );
        } catch (err) {
            return res.status(401).json({ message: 'Invalid Token', error: err });
        }
        // Check if token is in db
        try {
            const token = await tokenService.findRefreshToken(
                userData._id,
                refreshTokenFromCookie
            );
            if (!token) {
                return res.status(401).json({ message: 'Invalid token' });
            }
        } catch (err) {
            return res.status(500).json({ message: 'Internal error', error: err });
        }
        // check if valid user
        const user = await userService.findUser({ _id: userData._id });
        if (!user) {
            return res.status(404).json({ message: 'No user' });
        }
        // Generate new tokens
        const { refreshToken, accessToken } = tokenService.generateTokens({
            _id: userData._id,
        });

        // Update refresh token
        try {
            await tokenService.updateRefreshToken(userData._id, refreshToken);
        } catch (err) {
            return res.status(500).json({ message: 'Internal error', error: err });
        }
        // put in cookie
        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            sameSite: 'none',
            secure: true,
            httpOnly: true,
        });

        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            sameSite: 'none',
            secure: true,
            httpOnly: true,
        });
        // response
        const userDto = new UserDto(user);
        res.json({ user: userDto, auth: true });
    }

    async logout(req, res) {
        const { refreshToken } = req.cookies;
        // delete refresh token from db
        await tokenService.removeToken(refreshToken);
        // delete cookies
        res.clearCookie('refreshToken');
        res.clearCookie('accessToken');
        res.json({ user: null, auth: false });
    }

    async deleteUser(req, res) {
        const { userId } = req.body;

        const deletedUser = userService.deleteUser(userId);

        res.json({ user: deletedUser});
    }
}

module.exports = new AuthController();
