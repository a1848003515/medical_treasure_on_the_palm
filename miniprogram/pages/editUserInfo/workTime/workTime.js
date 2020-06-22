// miniprogram/pages/editUserInfo/workTime/workTime.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    workDay: '0',
    List:[],
    workDate:[],
    workTimeStart: '00:00',
    workTimeEnd: '00:00',
    logged: false,
    day0:'',
    day1: '',
    day2: '',
    day3: '',
    day4: '',
    day5: '',
    day6: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  handleGetNumber(e) {
    if (e.detail.value > 7 || e.detail.value <1) {
      wx.showToast({
        title: '请输入1~7之间的数字',
        icon: 'none'
      })
    } else {
      this.setData({
        workDay: e.detail.value,
      })
    }
  },
  handlePostNumber() {
    var list = []
    var that = this
    if (this.data.workDay != 0) {
      for (var i = 0; i < this.data.workDay; i++) {
        list = list.concat([i])
      }
      this.setData({
        List:list,
        logged:true,
        workDate:[]
      })
    }
  },

  handleGetDate0(e){
    this.setData({
      day0 : this.handleGetDate(e)
    })
  },
  handleGetDate1(e) {
    this.setData({
      day1: this.handleGetDate(e)
    })
  },
  handleGetDate2(e) {
    this.setData({
      day2: this.handleGetDate(e)
    })
  },
  handleGetDate3(e) {
    this.setData({
      day3: this.handleGetDate(e)
    })
  },
  handleGetDate4(e) {
    this.setData({
      day4: this.handleGetDate(e)
    })
  },
  handleGetDate5(e) {
    this.setData({
      day5: this.handleGetDate(e)
    })
  },
  handleGetDate6(e) {
    this.setData({
      day6: this.handleGetDate(e)
    })
  },
  
  handleGetDate(e){
    console.log(e.detail.value)
    var that=this
    var value = e.detail.value
    if(value<=7&&value>0){
      if(value==1){
        value="星期一"
      }
      if (value == 2) {
        value = "星期二"
      }
      if (value == 3) {
        value = "星期三"
      }
      if (value == 4) {
        value = "星期四"
      }
      if (value == 5) {
        value = "星期五"
      }
      if (value == 6) {
        value = "星期六"
      }
      if (value == 7) {
        value = "星期日"
      }
      return value
    } else {
      wx.showToast({
        title: '请输入1~7之间的数字',
        icon: 'none'
      })
    }
    
  },

  bindGetTimeStart(e) {
    this.setData({
      workTimeStart: e.detail.value
    })
  },
  bindGetTimeEnd(e) {
    this.setData({
      workTimeEnd: e.detail.value
    })
  },



  handlePost(e){
    var that=this
    var workDate=[]
    var day = [that.data.day0, that.data.day1, that.data.day2, that.data.day3, that.data.day4, that.data.day5, that.data.day6]
    console.log(day)
    for(var i=0;i<that.data.workDay;i++){

      if(day[i]==""){
        console.log(1)
        wx.showToast({
          title: '存在空项目',
          icon: 'none',
        })
        return;
      }
      else{
        if(workDate.includes(day[i])){
          wx.showToast({
            title: '存在相同数据，请修改',
            icon:'none'
          })
          return;
        }else{
          workDate.push(day[i])
        }
      }
    }
    console.log(workDate)
    var obj={
      start: that.data.workTimeStart,
      end:that.data.workTimeEnd
    }
    if (workDate.length == that.data.workDay && parseInt(that.data.workTimeEnd) >= parseInt(that.data.workTimeStart)){
      db.collection('users').doc(app.userInfo._id).update({
        data:{
          registerDate:workDate,
          registerTime:obj
        }
      }).then((res)=>{
        wx.showToast({
          title: '设置成功',
        })
      })
    }
    else{
      wx.showToast({
        title: '设置失败',
        icon:'none'
      })
    }
  }
})