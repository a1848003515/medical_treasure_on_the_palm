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
    return await db.collection('user').where({
      _openid:event._openid,
      _id:event._id
    }).get()
  } catch (e) {
    console.log(e)
  }
}