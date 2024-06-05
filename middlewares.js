import { verifyToken } from "../utils/token.js";

const middlewares = {
    validateSignUp: (req, res, next) => {
        try {
            const { email, password, userName } = req.body;
            if (!email) throw new Error('Thiếu email!');
            if (email) {
                const formatEmail = String(email)
                    .toLowerCase()
                    .match(
                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    );
                if (!formatEmail) throw new Error('Email không đúng định dạng!');
            }
            if (!password) throw new Error('Thiếu password!');
            if (!userName) throw new Error('Thiếu userName!');
            
            next();
        } catch (error) {
            res.status(403).send({
                data: null,
                message: error.message,
                success: false,
                error
            })
        }
    },
    validateSignIn: (req, res, next) => {
        try {
            const { emailOrUsername , password } = req.body;
            if (!emailOrUsername) throw new Error('Thiếu email hoặc username!');
            const isEmail = /\S+@\S+\.\S+/.test(emailOrUsername);

            if (isEmail) {
                const formatEmail = String(emailOrUsername)
                    .toLowerCase()
                    .match(
                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    );
                if (!formatEmail) throw new Error('Email không đúng định dạng!');
            }
            if (!password) throw new Error('Thiếu password!');
            next();
        } catch (error) {
            res.status(403).send({
                data: null,
                message: error.message,
                success: false,
                error
            });
        }
    },
    verifyAccessToken: (req, res, next) => {
        try {
            const authToken = req.headers['authorization'];
            if (!authToken) throw new Error('Bạn không thể thực hiện hành động!');

            const token = authToken.split(' ')[1];
            const data = verifyToken(token, 'AT');
            req.user = data;
            next();
        } catch (error) {
            let type = '';
            let getMessage = '';
            switch (error.message) {
                case 'invalid signature':
                    getMessage = 'Không thể xác thực token';
                    type = 'INVALID_TOKEN';
                    break;
                case 'jwt expired':
                    getMessage = 'Token hết hạn';
                    type = 'EXP_TOKEN';
                    break;
                default:
                    getMessage = 'Không thể xác thực';
                    type = 'UNAUTH';
                    break;
            }
            res.status(401).send({
                data: null,
                error,
                message: getMessage,
                type,
                success: false,
            });
        }
    },
    verifyRefreshToken: (req, res, next) => {
        try {
            const authToken = req.headers['authorization'];
            if (!authToken) throw new Error('Bạn không thể thực hiện hành động!');

            const token = authToken.split(' ')[1];
            const data = verifyToken(token, 'RT');
            req.user = data;
            next();
        } catch (error) {
            let type = '';
            let getMessage = '';
            switch (error.message) {
                case 'invalid signature':
                    getMessage = 'Không thể xác thực token';
                    type = 'INVALID_TOKEN';
                    break;
                case 'jwt expired':
                    getMessage = 'Token hết hạn';
                    type = 'EXP_TOKEN';
                    break;
                default:
                    getMessage = 'Không thể xác thực';
                    type = 'UNAUTH';
                    break;
            }
            res.status(401).send({
                data: null,
                error,
                message: getMessage,
                type,
                success: false,
            });
        }
    },

};

export default middlewares;