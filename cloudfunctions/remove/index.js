// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'zsjyb-ghost',
  traceUser: true,
} 
)
const db = cloud.database()
exports.main = async (event, context) => {
  try {
    return await db.collection(event.collection).where(event.where).remove()
  } catch (e) {
    console.error(e)
  }
}