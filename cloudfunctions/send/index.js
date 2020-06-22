const cloud = require('wx-server-sdk');

exports.main = async (event, context) => {
  cloud.init(
    {
      env: 'zsjyb-ghost'
    }
  );
  const db = cloud.database();
  const _ = db.command
  try {
    // 从云开数据库中查询等待发送的消息列表
    const messages = await db
      .collection('medication')
      .where({
        done: "false",
      })
      .get();


    // 循环消息列表
    const sendPromises = messages.data.map(async message => {
      var time = message.setTime;
      var hours = new Date().getHours() + 8
      var minutes = new Date().getMinutes()
      var week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
      if(hours>=24){
        hours=hours-24
      }



      var obj = hours + ":" + minutes
      var day = new Date().getDay()

      
      if (time === obj && message.setDate.includes(week[day])) {
        try {
          // 发送订阅消息
          await cloud.openapi.subscribeMessage.send({
            touser: message.touser,
            page: message.page,
            data: message.data,
            templateId: message.templateId,
          });
          // 发送成功后将消息的状态改为已发送
          return message.touser
        } catch (e) {
          return e;
        }
      }
      else {
        if(time===obj&&message.setDate[0]=="不重复"){
          try {
            // 发送订阅消息
            await cloud.openapi.subscribeMessage.send({
              touser: message.touser,
              page: message.page,
              data: message.data,
              templateId: message.templateId,
            });
            // 发送成功后将消息的状态改为已发送
            return db.collection('medication').doc(message._id).update({
              data:{
                done:"true"
              }
            })
          } catch (e) {
            return e;
          }
        }else{
          return
        }      
      }



    });

    return Promise.all(sendPromises);
  } catch (err) {
    console.log(err);
    return err;
  }
};
