const crypto = require('crypto');

module.exports = {
    MD5_SUFFIX: 'JDSAIOEUQOIoieuoiqv#$%^&dhfja)(* %^&FGHJfyuieyfhfhak(^.^)YYa!!\(^o^)/Y(^o^)Y(*^__^*)ﾍ|･∀･|ﾉ*~●',
    md5(pwd) {
        const md5 = crypto.createHash('md5');
        return md5.update(pwd + this.MD5_SUFFIX).digest('hex');
    }
};
