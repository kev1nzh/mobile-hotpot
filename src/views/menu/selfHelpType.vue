<template>
  <div class="selfhelp-type" @click.prevent.self="closeSpecialType">
    <div class="selfhelp-type-wrap">
      <div class="selfhelp-header">
        <div class="header-col1">
          <i class="selfhelp-icon-meal"></i>
        </div>
        <div class="header-col2">
          <p class="selfhelp-name">{{selfHelp.name}}</p>
          <span class="selfhelp-selected-number">套餐包含{{selfHelp.selected_number}}份</span>
        </div>
        <div class="header-col3">
          <p class="selfhelp-price">
            套餐价：
            <span>{{selfHelp.price}}</span>
          </p>
          <p class="selfhelp-should">
            价值：
            <del>￥{{selfHelp.shouldCost}}</del>
          </p>
        </div>
      </div>
      <div class="selfhelp-body">
        <div class="body-product">
          <div v-for="product in selfHelp.selfHelpProduct" :key="product.listName">
            <!-- 必须品 -->
            <div class="p-must-option" v-if="!product.optional">
              <div class="p-header">
                <p>
                  {{product.listName}}
                  <span>(必选{{product.listLimit}}份)</span>
                </p>
              </div>
              <div class="p-body">
                <div class="p-body-list-wrap">
                  <div
                    class="p-body-list-product"
                    v-for="(item,index) in product.productsList"
                    :key="index"
                    @click="selectdMustOption(product, item)"
                  >
                    <div class="product-img-box">
                      <img :src="item.exinfo.picInfo.items[item.exinfo.picInfo.default].url">
                    </div>
                    <span class="product-name">{{item.exinfo.name}}</span>
                    <span class="product-cnt">{{item.cnt}}份</span>
                    <i
                      class="product-icon-check"
                      v-show="mustOptions[item.id+'_'+item.price+'_'+item.scaleId].isSelected"
                    ></i>
                  </div>
                </div>
              </div>
            </div>
            <!-- 可选品 -->
            <div class="p-none-option" v-else>
              <div class="p-header">
                <p>
                  {{product.listName}}
                  <span>(已选{{product.selected_number}}份)</span>
                </p>
              </div>
              <div class="p-body">
                <div class="p-body-list-product">
                  <div class="product-button" @click="gotoSelectOption(product)">
                    <p>
                      <add class="product-button-icon"/>去选择
                    </p>
                    <p>共{{product.productsList.length}}个(任选{{product.listLimit}}个)</p>
                  </div>
                  <div class="product-img-box">
                    <div
                      v-for="(item, index) in product.productsList"
                      v-if="index < 2 && item.onsale.status === 0"
                      :key="index"
                      class="product-img-box-wrap"
                    >
                      <img :src="item.exinfo.picInfo.items[item.exinfo.picInfo.default].url">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="selfhelp-optional-box"
      v-show="showOptional"
      @click.prevent.self="showOptional = false"
    >
      <div class="optional-warp">
        <div class="optional-header">{{optionalObj.listName}}</div>
        <div class="optional-body">
          <div
            class="optional-img"
            v-for="(item, index) in optionalObj.productsList"
            :key="index"
            v-if="item.onsale.status === 0"
          >
            <img
              :src="item.exinfo.picInfo.items[item.exinfo.picInfo.default].url"
              @click="addSelectCount(optionalObj, item)"
            >
            <i
              class="product-icon-check"
              v-if="mustOptions[item.id+'_'+item.price+'_'+item.scaleId].isSelected"
            ></i>
            <div
              class="optional-add-box"
              v-if="mustOptions[item.id+'_'+item.price+'_'+item.scaleId].count > 0 "
            >
              <div class="add" @click="delSelectCount(item)">
                <img src="../../assets/img/sh/theme/@2x/normal/minus.png">
              </div>
              <div
                class="optional-add-number"
              >{{mustOptions[item.id+'_'+item.price+'_'+item.scaleId].count}}</div>
              <div class="minus" @click="addSelectCount(optionalObj, item)">
                <img src="../../assets/img/sh/theme/@2x/normal/add.png">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="add-product" @click="addProduct">加入购物车</div>
  </div>
</template>

<script>
import add from "../../public_comp/add";
import minus from "../../public_comp/del";
export default {
  name: "selfhelp",
  components: {
    add,
    minus
  },
  data() {
    return {
      selfHelp: {
        name: "",
        selfHelpProduct: [
          {
            productsList: [
              {
                id: 0
              }
            ]
          }
        ],
        price: 0,
        shouldCost: 0,
        selected_number: 0,
        optional: true
      },
      mustOptions: {},
      optionalObj: {},
      showOptional: false
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      let selfHelp = this.Cache.GetCache({
        key: "Select_SelfHelp_Components"
      });

      if (selfHelp && selfHelp.base) {
        let mustOptions = {};
        this.selfHelp.name = selfHelp.base.name;
        this.selfHelp.selfHelpProduct = selfHelp.base.zixuanProducts;

        this.selfHelp.price = selfHelp.base.price;
        this.selfHelp.selfHelpProduct.forEach(product => {
          product.selected_number = 0;
          for (let item of product.productsList) {
            mustOptions[item.id + "_" + item.price + "_" + item.scaleId] = {
              isSelected: false,
              parentName: product.listName,
              id: item.id,
              count: 0
            };
          }
        });

        console.log(selfHelp);
        this.mustOptions = Object.assign({}, this.mustOptions, mustOptions);
      }
    },
    // 关闭
    closeSpecialType() {
      this.$store.state.Kind.selfHelp_isShow = false;
    },
    // 选择必选商品
    selectdMustOption(product, item) {
      let limit = null;
      let name = null;
      let selectedProductIndex = 0;
      if (this.optionalObj) {
        limit = this.optionalObj.listLimit;
        name = this.optionalObj.listName;
      } else {
        limit = product.listLimit;
        name = product.listName;
      }

      // 获取已选的商品数量
      for (const key in this.mustOptions) {
        if (this.mustOptions.hasOwnProperty(key)) {
          const element = this.mustOptions[key];
          if (element.parentName == name && element.isSelected) {
            selectedProductIndex++;
          }
        }
      }

      // 是否超过limit
      if (
        selectedProductIndex >= limit &&
        !this.mustOptions[item.id + "_" + item.price + "_" + item.scaleId]
          .isSelected
      ) {
        return;
      } else {
        // 修改勾勾样式
        this.mustOptions[
          item.id + "_" + item.price + "_" + item.scaleId
        ].isSelected = !this.mustOptions[
          item.id + "_" + item.price + "_" + item.scaleId
        ].isSelected;

        // 修改全局参数
        if (
          this.mustOptions[item.id + "_" + item.price + "_" + item.scaleId]
            .isSelected
        ) {
          this.selfHelp.shouldCost += item.price; //应付
          console.log("product", product);
          product.selected_number++; //选择份数
          this.selfHelp.selected_number++; //总份数
          this.mustOptions[
            item.id + "_" + item.price + "_" + item.scaleId
          ].count = 1; //份分量
        } else {
          this.selfHelp.shouldCost -= item.price;
          product.selected_number--;
          this.selfHelp.selected_number++;
          this.mustOptions[
            item.id + "_" + item.price + "_" + item.scaleId
          ].count = 0;
        }
      }
    },
    // 添加可选
    addSelectCount(product, item) {
      console.log(1);
      let clickItem = this.mustOptions[
        item.id + "_" + item.price + "_" + item.scaleId
      ];
      let name = product.listName;
      let selectIndex = 0;

      // 限制limit
      for (const key in this.mustOptions) {
        if (this.mustOptions.hasOwnProperty(key)) {
          const element = this.mustOptions[key];
          if (name == element.parentName) {
            selectIndex += element.count;
          }
        }
      }
      if (selectIndex >= product.listLimit) {
        return;
      } else {
        clickItem.isSelected = true;
        clickItem.count++;
      }
    },
    // 删除可选
    delSelectCount(item) {
      let clickItem = this.mustOptions[
        item.id + "_" + item.price + "_" + item.scaleId
      ];
      console.log(clickItem);
      clickItem.count--;

      if (clickItem.count === 0) clickItem.isSelected = false;
    },
    // 进入可选商品
    gotoSelectOption(product) {
      this.optionalObj = product;
      this.showOptional = true;
      console.log(product);
    },

    // 加入购物车
    addProduct() {
      let product = this.Cache.GetCache({
        key: "Select_SelfHelp_Components"
      });
      product.productsListSelected = [];
      console.log(this.mustOptions);
      console.log(this.optionalObj);
      console.log(this.selfHelp);
      console.log(product);

      let zixuanList = product.base.zixuanProducts;
      let componentsArr = [];

      for (let items of zixuanList) {
        for (let item of items.productsList) {
          let mustItem = this.mustOptions[
            item.id + "_" + item.price + "_" + item.scaleId
          ];
          console.log(items.listName);
          if (items.listName == mustItem.parentName) {
            if (mustItem.count > 0) {
              componentsArr.push({
                count: mustItem.count,
                id: mustItem.id,
                parentName: mustItem.parentName,
                name: item.exinfo.name,
                price: item.price,
                components: item.components,
                type: item.type,
                scaleId: item.scaleId,
                scaleName: item.scaleName ? item.scaleName : ""
              });
            }
          }
        }
      }
      console.log(componentsArr);
      product.zixuanProductsSelected = [];
      let zixuan = product.zixuanProductsSelected;
      let list = product.base.zixuanProducts;
      for (let i = 0; i < list.length; i++) {
        for (let item of componentsArr) {
          if (list[i].listName == item.parentName) {
            console.log(item);
            zixuan.push({
              count: item.count,
              id: item.id,
              scaleId: item.scaleId,
              type: item.type,
              components: item.components,
              scaleName: item.scaleName,
              groupId: i,
              name: item.name
            });
          }
        }
      }

      let d_product = this.dslProduct(product);
      console.log(d_product);
      this.Service.IShoppingCartService.AddProduct(d_product);

      this.$store.state.Kind.selfHelp_isShow = false;
    }
  }
};
</script>
<style lang="sass" scoped>
.selfhelp-type
  background: rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 300;
  // background-color: #F4F4F4;
  .add-product
    width: 100%;
    height: 60px;
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 0;
    overflow: hidden;
    min-width: 30px;
    height: 43px;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 17px;
    font-weight: 500;
    line-height: 44px;
    background-image: linear-gradient(90deg, #FF8C57 0%, #E84E30 100%);
    background-size: inherit;
    color: #fff;
  .selfhelp-type-wrap
    width: 100%;
    height: 100%;
    background: white;
    position: relative;
    background-color: #F4F4F4;
   
    .selfhelp-header
      display: flex;
      display: -webkit-flex;
      height: 90px;
      padding: 20px 0 0;
      background-color: #FFF;
      line-height: 1;
      background-position: 20px bottom;
      .header-col1
        flex: 0 0 60px;
        -webkit-flex: 0 0 60px;
        .selfhelp-icon-meal
          background-image: url(../../assets/img/sh/theme/@2x/normal/icon-meal.png);
          background-size: 100% 100%;
          display: block;
          width: 40px;
          height: 40px;
          margin: 5px 0 0 10px;
      .header-col2
        flex: 1;
        -webkit-flex: 1;
        .selfhelp-name
          margin-bottom: 5px;
          font-size: 18px;
          line-height: 25px;
          color: #333;
          font-weight: normal;
        .selfhelp-selected-number
        font-size: 14px;
        color: #999;
      .header-col3
        flex: 0 0 140px;
        -webkit-flex: 0 0 140px;
        text-align: left;
        padding-right: 5px;
        .selfhelp-price
          color: #333;
          margin-bottom: 10px;
          font-weight: normal;
          span
            font-size: 20px;
            color: #151515;
        .selfhelp-should
          color: #999;
    .selfhelp-body
      .body-product
        .p-none-option
          width: 100%;
          height: 150px;
          background: #fff;
          margin-top: 10px;
          .p-header
            font-size: 18px;
            padding: 10px;
          .p-body-list-product
            width: 90%;
            height: 90%;
            margin: 0 auto;
            background: #eee;
            position: relative;
            div
              display: inline-block;
            .product-button
              width: 100px;
              height: 100px;
              text-align: center;
              box-sizing: border-box;
              padding-top: 20px;
              padding: 20px 5px 0 5px;
              font-size: 13px;
              .product-button-icon
                position: relative;
                top: 3px;
            .product-img-box
              position: absolute;
              left: 100px;
              top: 5px;
              right: 0;
              bottom: 5px;
              .product-img-box-wrap
                width: 100px;
                height: 90px;
                margin-left: 10px;
                img
                  width: 100%;
                  height: 100%;
 
        .p-must-option
          width: 100%;
          height: 140px;
          background: #fff;
          margin-top: 10px;
          .p-header
            font-size: 18px;
            padding: 10px;
          .p-body
            min-width: 100%;
            height: 100px;
            overflow: auto;
            .p-body-list-wrap
              height: 100px;
              white-space: nowrap;
              .p-body-list-product
                width: 160px;
                height: 80px;
                border: 1px solid #eee;
                margin-right: 10px;
                display: inline-block;
                position: relative;
                .product-img-box
                  width: 80px;
                  height: 80px;
                  img
                    width: 100%
                    height: 100%;
                .product-cnt
                  position: absolute;
                  right: 5px;
                  bottom: 5px;
                .product-name
                  position: absolute;
                  top: 5px;
                  left: 85px;
                  font-size: 14px;
                  color: #666;
                .product-icon-check
                  position: absolute;
                  top: 0;
                  right: 0;
                  width: 1.5rem;
                  height: 1.5rem;
                  background: url(../../assets/img/sh/theme/@2x/normal/check.png);
                  background-size: contain;
  .selfhelp-optional-box
    width: 100%;
    height: 100%;
    background: rgba(1, 1, 1, 0.5);
    position: absolute;
    top: 0;
    left: 0;
    .optional-warp
      width: 80%;
      height: 60%;
      background: #fff;
      margin: 30% 10%;
      .optional-header
        text-align: center;
        box-sizing: border-box;
        padding: 10px 0;
        font-size: 18px;
        border-bottom: 2px solid #F5F5F5;
      .optional-body
        // text-align: center;
        .optional-img
          width: 100px;
          height: 100px;
          display: inline-block;
          margin: 10px;
          position: relative;
          img
            width: 100%;
            height: 100%;
        .optional-add-box
          text-align: center;
          .add
            width: 18px;
            height: 18px;
            padding: 5px;
            img
              width: 100%;
              height: 100%;
          .minus
            width: 18px;
            height: 18px;
            padding: 5px;
            img
              width: 100%;
              height: 100%;
          div
            display: inline-block;
            margin-left: 5px;
          .optional-add-number
            width: 18px;
            height: 18px;
            position: relative;
            bottom: 4px;
                
            
        .product-icon-check
          position: absolute;
          top: 0;
          right: 0;
          width: 1.5rem;
          height: 1.5rem;
          background: url(../../assets/img/sh/theme/@2x/normal/check.png);
          background-size: contain;

</style>

