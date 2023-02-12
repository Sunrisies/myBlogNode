const crypto = require('crypto')

function md5(s) {
  // 给密码加密
  //注意参数需要为string类型，否则会报错
  return crypto.createHash('md5').update(String(s)).digest('hex')
}

module.exports = {
  md5,
  // 处理密码的密钥
  PWD_SALT: 'xd_node',
  // 处理token的密钥
  PRIVATE_KEY: 'xd_blog',
  // token的过期时间
  EXPIRESD: 60 * 60 * 24
}
