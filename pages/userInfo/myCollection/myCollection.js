const {http} = require('../../../utils/util.js');
Page({

    /**
     * ҳ��ĳ�ʼ����
     */
    data: {
      navTabs: ["档口", "商品"],
        activeIndex: "",
        stallist: [
            {
                title:'heheh'
            }
        ],
        goodslist: []

    },
    /**
     * �������ں���--����ҳ�����
     */
    onLoad: function (options) {
        const that = this;
        http({
            url: "ums/api/getRandomCode.do",
            loading: true,
            func: function (data) {
                // ����unpaidOrder��canceledOrder
                let unpaidOrder = [],
                    paidOrder = [];
                // ����data���������������
                for (let i = 0; i < data.length; i++) {
                    // ����״̬Ϊ0��Ϊ�������������unpaidOrder
                    if (data[i]["order_status"] == "0") {
                        unpaidOrder.push(data[i]);
                    }
                    // ����״̬Ϊ2��Ϊ��֧����paidOrder
                    if (data[i]["order_status"] == "2") {
                        paidOrder.push(data[i]);
                    }
                }
                that.setData({
                    allOrder: data,
                    unpaidOrder: unpaidOrder,
                    paidOrder: paidOrder
                });
            }
        });
        that.setData({
            // �˴���ȡ��activeIndexΪuser_infoҳ��navigator�������Ĳ���
            activeIndex: options.activeIndex
        });
    },
    /**
     * nav item��tap�¼�
     */
    tapNavItem: function (e) {
        this.setData({
            activeIndex: e.currentTarget.id
        });
        console.log(e.currentTarget.id)
    },

    /**
     * tap��ǰ����ȥ��ǰ��������ҳ
     */
    showOrderDetail: function (e) {
        // ��ȡ��ǰ������ID��Ϊֵ����url��
        const order_id = e.currentTarget.id;
        wx.redirectTo({
            url: `../order_detail/order_detail?order_id=${order_id}`
        })
    }
})