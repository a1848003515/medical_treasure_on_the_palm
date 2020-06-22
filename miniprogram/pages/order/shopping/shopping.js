const dataList = require("dataList.js");

var that = '';
var query;
const db=wx.cloud.database();
const _=db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    k:1,
    dataList: [],
    idx: 0,
    scrollTop: 0,
    toView: 'position0',
    priceTotal: 0,
    height:0,
    menuList:[],
    logged:false,
    num:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    var num=0
    this.setData({
      dataList: dataList.dataList
    })
    query = wx.createSelectorQuery();
    wx.createSelectorQuery().selectAll('.position').boundingClientRect(function (rects) {
      that.setData({
        positions: rects
      })
    }).exec();
    wx.getStorage({
      key: 'menuList',
      success: function(res) {
        that.setData({
          menuList:res.data.menu,
          priceTotal:res.data.priceTotal
        })
        for(var i=0;i<res.data.menu.length;i++){
          num=res.data.menu[i].num+num
        }
        that.setData({
          num:num
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
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
  switchClassfun(e) {
    var e = e.currentTarget.dataset.index;
    this.setData({
      idx: e,
      toView: 'position' + e
    })
  },

  bindscrollfunc(e) {
    var arr = [];
    for (var item of this.data.positions) {
      if (item.top <= e.detail.scrollTop + 2) {
        arr.push(item)
      }
    }
    this.setData({
      idx: arr[arr.length - 1].dataset.index
    })
  },

  handleAdd(e) {
    var m=0
    var number=++this.data.num
    this.setData({
      num:number
    })
    var priceTotal = parseInt(this.data.priceTotal) + parseInt(e.currentTarget.dataset.price)
    var list=this.data.menuList
    console.log(list)
    console.log(list.length)
    var menu={}
    menu["name"] = e.currentTarget.dataset.name
    menu["price"] = parseInt(e.currentTarget.dataset.price)
    menu["img"] = e.currentTarget.dataset.img
    menu["num"] = 1
    
      for (var i = 0; i < list.length; i++) {
        m++;
        if (list[i].name == menu.name) {
          list[i].num++;
          m--;
          break;
        }
      }
      if (m == list.length) {
        list.push(menu);
      }
    if(120 * list.length>600){
      var height=600
    } else {
      height=120 * this.data.menuList.length
    }
    this.setData({
      priceTotal:priceTotal,
      menuList:list,
      height:height
    })
  },

  
  handleReduce(e){
    var that=this
    var number = --this.data.num
    this.setData({
      num: number
    })
    var priceTotal = parseInt(this.data.priceTotal) - parseInt(e.currentTarget.dataset.price)
    var list = this.data.menuList
    var name = e.currentTarget.dataset.name
    var num = e.currentTarget.dataset.num
    if(num>0){
      for (var i = 0; i < list.length; i++) {
        if (name == list[i].name) {
          list[i].num--;
          if (list[i].num == 0) {
            list.splice(i,1)
          }
          break;
        }
      }
      console.log(list)
      this.setData({
        priceTotal: priceTotal,
        menuList: list,
        height: 120 * list.length
      })
    }
    
  },


  handlePay(){
    var obj={}
    obj.menu=this.data.menuList
    obj.priceTotal=this.data.priceTotal
    wx.setStorage({
      key: 'menuList',
      data: obj,
    })
    if(this.data.priceTotal>0){
      wx.navigateTo({
        url: '../payment/payment',
      })

    }
    else{
      wx.showToast({
        title: '请选择商品',
        icon:'none'
      })
    }
    
  },

  handleDisplay(){
    var height
    if (120 * this.data.menuList.length > 600) {
      height = 600
    }
    else{
      height=120 * this.data.menuList.length
    }
    this.setData({
      logged:!this.data.logged,
      height:height
    })
  }
})



