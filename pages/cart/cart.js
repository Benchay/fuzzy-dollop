// pages/cart/cart.js
const {http} = require('../../utils/util.js');
const {arrayToMap, mapToArray, copyProperty} = require('../../utils/convert.js');
const {findProductVariantByParams} = require('../../utils/date.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    companys: [],                   //购物车档口、商品列表列表
    totalFee: 0,                       // 总价，初始为0
    totalNum: 0,                          // 选择商品总数
    allSelected:false       //全选
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 显示页面
  */
  onShow: function () {
    this.getCompanysData();
  },

  /**
    * 自定义方法
    */
  getCompanysData: function () {
    //刷新购物车商品信息
    let companys = wx.getStorageSync("cart");
    if (!companys) {
      this.setData({
        companys:new Array()
      });
      return;
    } else {
      this.setData({
        companys: companys
      });
    }
    //获取购物车内变体id集合
    let idIn = "";
    let products = new Array();
    console.log(companys);
    for (let i in companys) {
      let company = companys[i];
      for (let j in company.products) {
        console.log(j);
        idIn += "," + company.products[j].id;
        products.push(company.products[j]);
      }
    }
    idIn = idIn.substring(1, idIn.length);
    http({
      url: findProductVariantByParams,
      data: {
        idIn: idIn
      },
      func: (data) => {
        let productMap = arrayToMap(data.result, "id");
        //更新进货车变体信息
        for (let i in products) {
          let product = products[i];
          copyProperty(product, productMap[product.id]);
          product.sellPrice = product.sellPrice.toFixed(2);
        }
        //刷新后的变体信息重新放入缓存中
        wx.setStorage("cart", companys);
        //加载数据
        this.setData({
          companys: companys
        });
        //计算价格
        this.getTotalFee();
      }
    });
  },

  /** 手指触摸动作开始 记录起点X坐标
  touchstart(e) {
    // 开始触摸时 重置所有删除
    this.data.cart.forEach(function (v, i) {
      if (v.is_touch_move)    // 只操作为true的
        v.is_touch_move = false;
    });
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      cart: this.data.cart
    })
  },*/

  /** 滑动事件处理
  touchmove(e) {
    var that = this,
      index = e.currentTarget.dataset.index,          // 当前索引
      startX = that.data.startX,                      // 开始X坐标
      startY = that.data.startY,                      // 开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,       // 滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,       // 滑动变化坐标
      // 获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    that.data.cart.forEach(function (v, i) {
      v.is_touch_move = false;
      // 滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) // 右滑
          v.is_touch_move = false
        else // 左滑
          v.is_touch_move = true
      }
    });
    this.setData({
      cart: this.data.cart
    })
  },*/

  /**
  * 计算滑动角度
  * @param {Object} start 起点坐标
  * @param {Object} end 终点坐标

  angle(start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  // 获取手动输入数量的值
  getInputVal(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.cart;
    let num = parseInt(e.detail.value);
    if (num == 0) {
      carts[index].count = 1;
    } else {
      carts[index].count = num;
    }
    this.setData({
      cart: carts
    });
    try {
      wx.setStorageSync('cart', carts)
    } catch (e) {
      console.log(e)
    }
    this.getTotalFee();
  },  */

  /**
   * 计算总额
   */
  getTotalFee() {
    let companys = this.data.companys;                                         // 获取购物车档口列表
    let totalFee = 0;   //所有商品价格合计
    let totalNum = 0;   //所有商品数量合计
    let allSelected = true;
    for (let i in companys) {                            // 遍历所有档口的商品
      let products = companys[i].products;
      let ctf = 0;      //档口所有商品总价
      let ctn = 0;      //档口所有商品总量
      for (let j in products) {
        let product = products[j];
        if (product.isSelected) {                                       // 判断选中才会计算价格
          ctf += product.orderNum * parseFloat(product.sellPrice);    //追加商品价格
          ctn += parseInt(product.orderNum);      //追加商品数量
        } else {
          allSelected = false;
        }
      }
      totalFee += ctf;
      totalNum += ctn;
      companys[i].totalFee = ctf.toFixed(2);
      companys[i].totalNum=ctn;
    }
    this.setData({                                                      // 最后赋值到data中渲染到页面
      companys: companys,
      totalFee: totalFee.toFixed(2),
      totalNum: totalNum,
      allSelected: allSelected
    });

    wx.setStorageSync("cart", companys);
  },

  /**
   * 选择商品
   */
  selectList(e) {
    let indexs = e.currentTarget.dataset.index.split(",");    // 获取data- 传进来的index
    let companys = this.data.companys;
    let product = companys[[indexs[0]]]["products"][[indexs[1]]];
    product.isSelected = !product.isSelected;

    //设置订单选项
    for(let i in companys) {
      let company = this.data.companys[i];
      let products = company.products;
      let isSelected = true;
      for (let j in products){
        if(!products[j].isSelected){
          isSelected = false;
          break;
        }
      }
      if(isSelected) {
        company.isSelected = true;
      } else {
        company.isSelected = false;
      }
    }

    this.setData({
      companys: companys
    });
    this.getTotalFee();                            // 重新获取总价
  },

  /**
   *  选择商店里的所有商品
   */
  shopSelectAll(e) {
    let companys = this.data.companys;
    let company = companys[e.currentTarget.dataset.index];

    company.isSelected = !company.isSelected;
    for (let i in company.products) {
      company.products[i].isSelected = company.isSelected;
    }
    this.setData({
      companys: companys
    });
    this.getTotalFee();
  },

  /**
   * 全选
   */
  selectAll(e) {
    let allSelected = !this.data.allSelected;
    let companys = this.data.companys;
    for (let i in companys) {
      let company = companys[i];
      company.isSelected = allSelected;
      for (let j in company.products) {
        company.products[j].isSelected = allSelected;
      }
    }
    this.setData({
      allSelected: allSelected,
      companys: companys
    });
    this.getTotalFee();                                   // 重新获取总价
  },

  /**
   * 绑定加数量事件
   */
  addNum(e) {
    let indexs = e.currentTarget.dataset.index.split(",");    // 获取data- 传进来的index
    let companys = this.data.companys;
    let product = companys[[indexs[0]]]["products"][[indexs[1]]];
    product.orderNum++;
    this.setData({
      companys: companys
    });
    this.getTotalFee();
  },

  /**
   * 绑定减数量事件
   */
  minusNum(e) {
    let indexs = e.currentTarget.dataset.index.split(",");    // 获取data- 传进来的index
    let companys = this.data.companys;
    let product = companys[[indexs[0]]]["products"][[indexs[1]]];
    if (product.orderNum > 1) {
      product.orderNum--;
      this.setData({
        companys:companys
      });
      this.getTotalFee();
    }
  },

  /**
   * 商品数量
   */
  bindManual(e){
    let v = e.detail.value;
    let indexs = e.currentTarget.dataset.index.split(",");    // 获取data- 传进来的index
    let companys = this.data.companys;
    let product = companys[[indexs[0]]]["products"][[indexs[1]]];
    v = parseInt(v);
    if(!v || v <=0) {
      v = 1;
    }
    product.orderNum = v;
    this.setData({
      companys: companys
    });
    this.getTotalFee();
  },

  // 删除商品列表 
  delProduct(e) {
    var that = this;
    wx.showModal({
      content: '是否确认删除选中商品？',
      success: function (res) {
        if (res.confirm) {
          let companys = that.data.companys;
          for(let i = 0; i < companys.length; i++) {
            let company = companys[i];
            let products = company.products;
            for(let j = 0; j < products.length; j++) {
              if(products[j].isSelected) {
                products.splice(j--, 1);      //删除商品
              }
            }
            //没商品就移除整个订单信息
            if(products.length == 0) {
              companys.splice(i--,1);
            }
          }

          // let indexs = e.currentTarget.dataset.index.split(",");    // 获取data- 传进来的index
          // let companys = that.data.companys;
          // let products = companys[indexs[0]].products;
          // products.splice(indexs[1], 1);      //删除商品
          // if(products.length == 0){       //商品为0就删档口
          //   companys.splice(indexs[0], 1);
          // }
          that.setData({
            companys: companys
          });
          that.getTotalFee();
        }
      }
    })
  },


  /**
   * 跳转至下单页面
   */
  goSubmitOrder(){
    //先保存商品状态
    wx.setStorageSync("cart", this.data.companys);
    wx.navigateTo({
      //将该商品的id传到详情页
      url: "../index/submitOrders/submitOrders"
    });
  },

  /**
   * 添加测试数据
  
  addCart(e) {
    // wx.navigateTo({
    //   //将该商品的id传到详情页
    //   url: 'goodsDetail/goodsDetail?product_id=8a8694b760747724016076fc5dd2058d'
    // })
    wx.removeStorageSync("cart");
    let products = new Array();
    http({
      url: findProductVariantByParams,
      data: {
        idIn: "457d938d3d72097cb49e836acfba809a,c9902a908f22b8a090c79ec50d1411f2,5bb189858c4c31373f8afceaf19cfdbc,14f74f21bf552dd6148b5c251ed2a2fb"
      },
      func: data => {
        let newProducts = data.result;
        for (let i in newProducts) {
          let p = newProducts[i];
          p.orderNum = 2;
          products.push(p);
        }
        //将变体集合转换Wie[档口.变体]格式的集合
        let companys = new Array();
        for (let i in products) {
          let product = products[i];
          let company = companys[product.companyId]
          if (!company) {
            company = {
              id: product.companyId,
              name: product.companyName,
              allName: product.marketName + product.floorNum + "楼" + product.companyName,
              marketName: product.marketName,
              floorNum: product.floorNum,
              products: new Array()
            }
          }
          let ps = company.products;
          ps.push(product);
          companys[product.companyId] = company;
        }
        wx.setStorageSync("cart", mapToArray(companys));
      }
    }); 
  }*/

})