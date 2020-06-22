// components/medication/medication.js

const db = wx.cloud.database()
const app = getApp()
const _ = db.command
const tmplId = "UBaK8Dp8SqY6AVNwY3bjwlofBMMdeWClCQDyx3JIk0s"


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    medicationId: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    i: 0,
    list: [],
    time: '00:00',
    days: [{
      value: '星期一',
      checked: ''
    }, {
      value: '星期二',
      checked: ''
    }, {
      value: '星期三',
      checked: ''
    }, {
      value: '星期四',
      checked: ''
    }, {
      value: '星期五',
      checked: ''
    }, {
      value: '星期六',
      checked: ''
    }, {
      value: '星期日',
      checked: ''
    }, {
      value: '不重复',
      checked: ''
    }, ],
    Date: [],
    title: '',
    content: '',
    week: []
  },

  /**
   * 组件的方法列表
   */
  methods: {

    checkboxChange: function(e) {
      this.setData({
        Date: e.detail.value
      })
      console.log(this.data.Date)
    },
    bindPickerTime(e) {
      this.setData({
        time: e.detail.value
      })
    },
    handleTitle(e) {
      this.setData({
        title: e.detail.value
      })
    },
    handleContent(e) {
      this.setData({
        content: e.detail.value
      })
    },

    handleAdopt() {
      var that = this
      if (!this.data.Date) {
        wx.showToast({
          title: '请设置时间',
          icon: 'none'
        })
      } else {
        if (this.data.Date.includes("不重复") && this.data.Date.length > 1) {
          wx.showToast({
            title: '选择不重复，无法选择其他时间',
            icon: 'none'
          })
        } else {
          wx.requestSubscribeMessage({
            tmplIds: [tmplId],
            success(res) {
              if (res.errMsg === 'requestSubscribeMessage:ok') {
                wx.cloud.callFunction({
                  name: 'funcupdate',
                  data: {
                    collection: 'medication',
                    doc: that.data.medicationId,
                    data: {
                      done:false,
                      data: {
                        thing1: {
                          value: that.data.content
                        },
                        thing2: {
                          value: that.data.title
                        }
                      },
                      setDate: that.data.Date,
                      setTime: that.data.time
                    }
                  }
                }).then((res) => {
                  wx.showToast({
                    title: '修改成功',
                  })
                })
              }
            }
          })
        }
      }
    },

    handleDelet() {



      wx.showModal({
        title: '提示信息',
        content: '删除方案',
        confirmText: '删除',
        success: (res) => {
          if (res.confirm) {
            db.collection('medication').where({
              touser: app.userInfo._openId
            }).field({
              _id: true
            }).get().then((res) => {
              let list = []
              for (var i = 0; i < res.data.length; i++) {
                list = list.concat([res.data[i]._id])
              }
              list = list.filter((val, i) => {
                return val != this.data.medicationId
              });
              this.triggerEvent('myevent', list);
            })

            wx.cloud.callFunction({
              name: 'remove',
              data: {
                collection: 'medication',
                where: {
                  _id: this.data.medicationId
                }
              }
            })

          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })



    }

  },


  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      var that = this
      var list = []
      db.collection('medication').doc(this.data.medicationId).get().then((res) => {
        this.setData({
          list: res.data,
          title: res.data.data.thing2.value,
          content: res.data.data.thing1.value,
          time: res.data.setTime
        })
        for (var i = 0; i < res.data.setDate.length; i++) {
          for (var j = 0; j < that.data.days.length; j++) {
            if (res.data.setDate[i] == that.data.days[j].value) {
              that.data.days[j].checked = 'true'
            }
          }
        }
        this.setData({
          week: that.data.days
        })
      })

    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行

    },
  }
})