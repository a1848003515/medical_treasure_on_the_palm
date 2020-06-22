
const db = wx.cloud.database()
const app = getApp()
const _ = db.command


Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    itemId: '',
    content: [],
    id: 0,
    number: [],
    obj: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      itemId: options.itemId
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    db.collection('pressure').where({ _openid: app.userInfo._openid }).field({ pressurelist: true }).get().then((res) => {
      if(res.data.length!=0){
        this.setData({
          obj: res.data[0].pressurelist
        })
      }
     
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var list = []
    for (var i = 1; i <= 31; i++) {
      list = list.concat([i])
    }
    this.setData({
      list: list
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  handle1(e) {

    console.log(e.detail.value)
    var obj = this.data.obj
    var id = e.currentTarget.dataset.id
    if (obj[id]) {
      if (e.detail.value) {
        obj[id]["number1"] = e.detail.value
      }
    } else {
      if (e.detail.value) {
        obj[id] = {}
        obj[id]["number1"] = e.detail.value
      }
    }
    this.setData({
      obj: obj
    })
  },


  handle2(e) {
    console.log(e.detail.value)
    var obj = this.data.obj
    var id = e.currentTarget.dataset.id
    if (obj[id]) {
      if (e.detail.value) {
        obj[id]["number2"] = e.detail.value
      }
    } else {
      if (e.detail.value) {
        obj[id] = {}
        obj[id]["number2"] = e.detail.value
      }
    }
    this.setData({
      obj: obj
    })


  },


  handle3(e) {
    var obj = this.data.obj
    var id = e.currentTarget.dataset.id
    if (obj[id]) {
      if (e.detail.value) {
        obj[id]["number3"] = e.detail.value
      }
    } else {
      if (e.detail.value) {
        obj[id] = {}
        obj[id]["number3"] = e.detail.value
      }
    }
    this.setData({
      obj: obj
    })
  },


  handle4(e) {
    var obj = this.data.obj
    var id = e.currentTarget.dataset.id
    if (obj[id]) {
      if (e.detail.value) {
        obj[id]["number4"] = e.detail.value
      }
    } else {
      if (e.detail.value) {
        obj[id] = {}
        obj[id]["number4"] = e.detail.value
      }
    }
    this.setData({
      obj: obj
    })
  },
  handle5(e) {
    var obj = this.data.obj
    var id = e.currentTarget.dataset.id
    if (obj[id]) {
      if (e.detail.value) {
        obj[id]["number5"] = e.detail.value
      }
    } else {
      if (e.detail.value) {
        obj[id] = {}
        obj[id]["number5"] = e.detail.value
      }
    }
    this.setData({
      obj: obj
    })
  },

  handle6(e) {
    var obj = this.data.obj
    var id = e.currentTarget.dataset.id
    if (obj[id]) {
      if (e.detail.value) {
        obj[id]["number6"] = e.detail.value
      }
    } else {
      if (e.detail.value) {
        obj[id] = {}
        obj[id]["number6"] = e.detail.value
      }
    }
    this.setData({
      obj: obj
    })
  },
  handlePost() {
    var object = {}
    var item = this.data.itemId
    object[item] = this.data.obj
    db.collection('sugar').where({ _openid:app.userInfo._openid}).get().then((res) => {
      console.log(res)
      if (res.data.length == 0) {
        console.log(1)
        db.collection('pressure').add({
          data: {
            name: app.userInfo.nickName,
            pressurelist: object,
            times: new Date()
          }
        }).then((res) => {
          wx.showToast({
            title: '保存成功',
          })
        })
      } else {
        console.log(2)
        db.collection('pressure').where({ _openid: app.userInfo._openid }).update({
          data: {
            pressurelist: object,
          }
        }).then((res) => {
          wx.showToast({
            title: '保存成功',
          })
        })
      }
    })
  }
})