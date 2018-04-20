export const fetchSidebarConfigReq = async () => {
    //dev mode
    const hostname = /\w+\.([\w.]+)/.exec(location.hostname)[1] || 'wec.mercury';
    const code = /\/c\/([\w-]+)\//.exec(window.location.pathname)[1];

    return {
        "preference": ["role", "csOrder"],
        "apps": [
            {
                "name": "order",
                "id": "od",
                "products": ["csOrder", "cpOrder"],
                "overView": {
                    "icon": "icon-order",
                    "link": "order.wecfin.com"
                }
            },{
                "name": "product",
                "id": "pd",
                "products": ["cat", "spu"],
                "overView": {
                    "icon": "icon-product",
                    "link": "product.wecfin.com"
                }
            },
            {
                "name": "company",
                "id": "cpy",
                "products": ["employee", "group", "role"],
                "overView": {
                    "icon": "icon-company",
                    "link": "company.wecfin.com"
                }
            },
            {
                "name": "client",
                "id": "cli",
                "products": ["customer", "supplier"],
                "overView": {
                    "icon": "icon-client",
                    "link": "client.wecfin.com"
                }
            }
        ],
        "products": {
            "csOrder": {
                "description": "销售订单列表展示页",
                "name": "销售订单",
                "link": "//order." + hostname + "/c/" + code + "/list-cs-order",
                "productId": "csOrder"
            },
            "cpOrder": {
                "description": "采购订单列表展示页",
                "name": "采购订单",
                "link": "//order." + hostname + "/c/" + code + "/list-cp-order",
                "productId": "cpOrder"
            },
            "cat":{
                "description": "物料目录什么的",
                "name": "物料目录",
                "link": "//product." + hostname + "/c/" + code + "/list-cat",
                "productId": "cat"
            },
            "customer": {
                "description": "客户",
                "name": "客户",
                "link": "//client." + hostname + "/c/" + code + "/list-customer",
                "productId": "customer"
            },
            "employee": {
                "description": "员工",
                "name": "员工",
                "link": "//company." + hostname + "/c/" + code + "/list-employee",
                "productId": "employee"
            },
            "group": {
                "description": "公司团队详情",
                "name": "团队",
                "link": "//company." + hostname + "/c/" + code + "/list-group",
                "productId": "group"
            },
            "spu": {
                "description": "spu",
                "name": "spu",
                "link": "//product." + hostname + "/c/" + code + "/list-spu",
                "productId": "group"
            },
            "supplier":{
                "description": "供货商",
                "name": "供货商",
                "link": "//client." + hostname + "/c/" + code + "/list-supplier",
                "productId": "group"
            },
            "role": {
                "description": "员工于所处公司角色详情",
                "name": "角色",
                "link": "//role." + hostname + "/c/" + code + "/list-role",
                "productId": "role"
            }
        }
    };
};
