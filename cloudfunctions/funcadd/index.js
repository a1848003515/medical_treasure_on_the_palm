// 云函数入口文件
const cloud = require('wx-server-sdk')


cloud.init({
  env: 'zsjyb-ghost',
  traceUser: true,
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('user').add({
      data: {
        userPhoto: event.userPhoto,
        nickName: event.nickName,
        _openid: event._openid,
        identity: "user",
        signature: '',
        phoneNumber:'',
        weixinNumber: '',
        address: "",
        occupation: "",
        occupationNumber: "",
        times: new Date()
      }
    })
  } catch (e) {
    console.log(e)
  }

}