// miniprogram/pages/index/index.js

const db=wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    background: [
      '../../images/index/1.jpg',
      '../../images/index/2.jpg',
      '../../images/index/3.jpg'
    ],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: true,
    interval: 2000,
    duration: 500,
    current:0,
    listData:[],
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that=this
    wx.request({
      url: 'https://route.showapi.com/96-109', //仅为示例，并非真实的接口地址
      data: {
        showapi_appid: '200214',
        showapi_sign: '69f7ea7769f140f795ac4bfbea88c041',
        tid:1
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        that.setData({
          list: res.data.showapi_res_body.pagebean.contentlist
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    db.collection('users').field({
        userPhoto:true,
        nickName:true,
        _openid:true,
        occupation:true,
        identity:true
      }).get().then((res)=>{
        console.log(res)
      this.setData({
        listData:res.data
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
  bindchange: function (e) {
    const that = this;
    that.setData({
      current: e.detail.current
    })
  },
  //点击切换，滑块index赋值
  checkCurrent: function (e) {
    const that = this;

    if (that.data.current === e.target.dataset.current) {
      return false;
    } else {

      that.setData({
        current: e.target.dataset.current
      })
    }
  },
  handleDetail(e){
    console.log(e)
    var id=e.target.dataset.id;
    wx.navigateTo({
      url:'/pages/detail/detail?userId=' + id
    })
  },
  handleToHospital(){
    wx.navigateTo({
      url: './search/search?pointId=Hospital'
    })
  },
  handleToPharmacy(){
    wx.navigateTo({
      url: './search/search?pointId=Pharmacy'
    })
  },
  handleToDrugs(){
    wx.navigateTo({
      url: './search/search?pointId=Drugs'
    })
  },
  handleToHealth(){
    wx.navigateTo({
      url: './search/search?pointId=Health'
    })
  },
  handleToKnow() {
    wx.navigateTo({
      url: './search/search?pointId=Know'
    })
  },
  handleToDetail(e){
    var value = e.currentTarget.dataset.id
    wx.navigateTo({
      url: './details/health/health?healthId=' + value,
    })
  },
  handleToOrder(){
    wx.navigateTo({
      url: '../order/shopping/shopping',
    })
  }
})