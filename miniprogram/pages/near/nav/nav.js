const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    address: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options.address)
    var str='医院'
    var m=options.address.indexOf(str)
    if(m!=-1){
      var address = options.address.substring(0, m + 2)
      console.log(address)
      this.setData({
        address: address
      })
    }
    else{
      this.setData({
        address: options.address
      })
    }
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    
    db.collection('users').where({
      address:this.data.address
    }).field({
      userPhoto: true,
      nickName: true,
      _openid: true,
      occupation: true,
      identity: true,
      address:true
    }).get().then((res) => {
      console.log(res)
      this.setData({
        listData: res.data,
      })
    })

    
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
  handleDetail(e) {
    console.log(e)
    var id = e.target.dataset.id;
    wx.navigateTo({
      url: '/pages/detail/detail?userId=' + id
    })
  }
})