//根据id获取商品信息
const getProductByCodeOrId = "stock/api/getProductByCodeOrId.do";
//查询商品分页列表
const queryProduct = "stock/api/queryProduct.do";
//根据id获取变体信息
const getProductVariantByParams = "stock/api/getProductVariantByParams.do";
//查询变体分页列表
const findProductVariantByParams = "stock/api/findProductVariantByParams.do";

//提交订单
const createOrderByWx = "cws/order/createByWx.do";
//查询订单分页列表
const queryOrderByParams = "cws/order/queryByParams.do";
//获取订单详情
const getOrderById = "cws/order/getById.do";
//查询未完成订单的市场和楼层
const findMarketSearch = "cws/order/findMarketSearch.do";
//按条件查询包裹信息
const getPackageByParams = "cws/package/getPackageByParams.do";

//查询公告分页
const queryBulletin = "ums/api/queryBulletin.do";

//获取档口信息
const getStall = "cws/stall/getStall.do";

module.exports = {
  getProductByCodeOrId,
  queryProduct,
  getProductVariantByParams,
  findProductVariantByParams,
  createOrderByWx,
  queryOrderByParams,
  getOrderById,
  queryBulletin,
  findMarketSearch,
  getStall,
  getPackageByParams
};
