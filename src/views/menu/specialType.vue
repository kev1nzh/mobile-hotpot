<template>
  <div class="special-type" v-if="true" @click.prevent.self="closeSpecialType">
    <div class="special-type-wrap">
      <div class="t-header">
        <h3 class="t-header-text">{{product.base.name}}</h3>
        <span class="t-header-close" @click="closeSpecialType">X</span>
      </div>

      <div class="t-body">
        <!-- 餐品规格 -->
        <div v-for="comp in  product.base.components" :key="comp.id" class="t-body-type">
          <p class="t-body-type-title">
            {{comp.name}}：
            <span v-if="comp.options.require">选{{comp.options.limit}}份</span>
          </p>
          <div class="t-body-type-wrap">
            <div
              class="t-body-type-selection"
              v-for="item in comp.items"
              :key="item.id"
              @click="selectType(comp, item)"
              :class="{'t-body-type-selection-selected': typeArr[item.id].count > 0}"
            >
              {{item.name}}
              <span v-if="item.price">(￥{{item.price}})</span>
              <span
                v-if="comp.options.limit != 0 && typeArr[item.id].count > 1"
              >X{{typeArr[item.id].count}}</span>
              <span
                @click.stop="delItem(item)"
                class="t-body-type-close"
                v-show="comp.options.limit !== 1 && typeArr[item.id].count > 0"
              >X</span>
            </div>
          </div>
        </div>
        <!-- 餐品份数 -->
        <div class="t-body-scale-title" v-if="product.base.scales.length">规格</div>
        <div
          v-if="product.base.scales.length > 1"
          v-for="scale in product.base.scales"
          :key="scale.id"
          class="t-body-scale"
          :class="{'t-body-scale-selected': scalesArr[scale.name].isSelected}"
          @click="selectScale(scale)"
        >{{scale.name}}￥{{scale.price}}</div>
        <!-- 固定套餐 显示份数 -->
        <div class="t-body-taocan" v-if="product.type == '套餐'">
          <ul>
            <li
              v-for="item in product.base.productsList"
              :key="item.id"
            >{{item.exinfo.name}}X{{item.cnt}}</li>
          </ul>
        </div>
      </div>
      <div class="t-button" @click="addProduct">加入购物车</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "specialType",
  components: {},
  data() {
    return {
      typeArr: {},
      scalesArr: {},
      product: {
        base: {
          name: ""
        }
      }
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      let selectProduct = this.Cache.GetCache({ key: "Select_Components" });
      this.product = selectProduct;
      // 初始化数据结构
      let typeArr = {};
      let scalesArr= {};
      let components = this.product.base.components;
      let scales = this.product.base.scales;
      let noneLimitComp = [];

      // 规格
      // 构建成对象
      for(let scale of scales) {
        scalesArr[scale.name] = {
          id: scale.id,
          name: scale.name,
          price: scale.price,
          isSelected: false,
        }
      }
      // 默认选第一个
      scalesArr[scales[0].name].isSelected = true;


      // 构建本地对象，渲染口味
      components.forEach(comp => {
        // 如果是单选的 要默认第一个选中状态
        if (comp.options.limit === 1) {
          noneLimitComp.push(comp.items[0].id);
        }
        for (let index = 0; index < comp.items.length; index++) {
          const element = comp.items[index];
          typeArr[element.id] = {
            parentId: comp.id,
            id: element.id,
            count: 0
          };
        }
        // 给第一个添加选中状态
        for (let id of noneLimitComp) {
          typeArr[id].count = 1;
        }
      });
      // 这里必须要这样扔进去 无敌
      this.typeArr = Object.assign({}, this.typeArr, typeArr);
      this.scalesArr = Object.assign({}, this.scalesArr, scalesArr);
    },
    // 选择规格
    selectScale(scale) {
      for (const key in this.scalesArr) {
        if (this.scalesArr.hasOwnProperty(key)) {
          const element = this.scalesArr[key];
          element.isSelected = false;
        }
      }
      this.scalesArr[scale.name].isSelected = true;
    },
    // 关闭窗口
    closeSpecialType() {
      this.$store.state.Kind.isShow = false;
    },
    // 选择口味
    selectType(comp, type) {
      // 判断是否选择有限制
      if (comp.options.require) {
        // 如果只能选1份，那就使用唯一选
        if (comp.options.limit === 1) {
          for (let i of comp.items) {
            this.typeArr[i.id].count = 0;
          }
          this.typeArr[type.id].count = 1;
        }
        // 一直加 如果所有count加起来超过limit 就return
        else {
          let limit = comp.options.limit;
          let typeIdArr = comp.items.map(e => e.id);
          let selectIndex = 0;
          for (let id of typeIdArr) {
            selectIndex += this.typeArr[id].count;
          }
          if (selectIndex < limit) {
            this.typeArr[type.id].count++;
          }
        }
      }
      // 不限制选择的数量
      else {
        this.typeArr[type.id].count = 1;
      }

      console.log("selectType", comp);
    },
    // 删除
    delItem(item) {
      let typeArr = this.typeArr[item.id];
      typeArr.count = 0;
      console.log(typeArr);
    },
    addProduct() {
      this.filterLimit();
      let componentsArr = [];
      let components = this.product.base.components;

      // 获取所有选中的口味
      for (let comp of components) {
        for (let item of comp.items) {
          let typeItem = this.typeArr[item.id];
          if (typeItem.count > 0) {
            componentsArr.push({
              count: typeItem.count,
              id: item.id,
              parentId: typeItem.parentId,
              name: item.name,
              price: item.price
            });
          }
        }
      }
      // console.log(this.product);
      // console.log(componentsArr);
      this.product.componentsSelected = [];

      for (let comp of components) {
        let parentId = comp.id;
        let isHaveComp = componentsArr
          .map(comp => comp.parentId)
          .includes(parentId);
        if (isHaveComp) {
          let items = [];

          this.product.componentsSelected.push({
            id: comp.id,
            name: comp.name,
            type: comp.type,
            items: componentsArr
              .map(e => {
                if (e.parentId == comp.id) {
                  return {
                    id: e.id,
                    name: e.name,
                    count: e.count,
                    price: e.price
                  };
                }
              })
              .filter(val => {
                return !(!val || val === "");
              })
          });
        }
      }

      // 查看是否有规格
      for (const key in this.scalesArr) {
        if (this.scalesArr.hasOwnProperty(key)) {
          const element = this.scalesArr[key];
          if(element.isSelected) {
            this.product.scaleNameSelected = element.name;
            this.product.scaleIdSelected = element.id;
          }
        }
      }

      let d_product = this.dslProduct(this.product);
      this.Service.IShoppingCartService.AddProduct(d_product);
      console.log(d_product);
      this.closeSpecialType();

      let shopCart = this.Service.IShoppingCartService.GetShoppingCartInfo();
      console.log(this.product, shopCart); 
    },
    // 添加购物车
    filterLimit() {
      // 这里要过滤是否选了必选
      let components = this.product.base.components;
      for (let comp of components) {
        let require = comp.options.require;
        // 第一 是否有 components 第二 是否必选require
        if (require) {
          let limit = comp.options.limit;
          let countResult = 0;

          for (let item of comp.items) {
            countResult += this.typeArr[item.id].count;
          }
          // 过筛
          if (countResult !== limit) {
            this.toast(`请选择必选品 ${comp.name}`);
            return;
          }
        }
      }
    }
  }
};
</script>
<style lang="sass" scoped>
.special-type
  background: rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 300;
  .special-type-wrap
    width: 90%;
    height: 70%;
    background: white;
    margin: 15% auto;
    position: relative;
    .t-header
        width: 100%;
        height: 2rem;
        border-bottom: 1px solid #ddd;
        text-align: center;
        line-height: 2rem;
        font-size: 18px;
        color: #333;
        .t-header-close
            position: absolute;
            top: 0;
            right: 1rem;
            font-size: 16px;
            vertical-align: inherit;
            color: #b2b2b2;
    .t-body
        padding: 1rem;
        font-size: 14px;
        color: #858585;
        .t-body-scale
          padding: 0 16px;
          height: 36px;
          line-height: 34px;
          border: 1px solid #d5d5d5;
          font-size: 14px;
          margin: 0 14px 12px 0;
          position: relative;
          color: #858585;
          min-width: 70px;
          text-align: center;
          display: inline-block;
        .t-body-scale-selected
            background: #ff5151;
            background: linear-gradient(90deg, #FF8C57 0%, #E84E30 100%);
            border: none;
            border: 1px solid #ff5151;
            color: #fff;
        .t-body-type-selection
            border: 1px solid #d5d5d5;
            color: #858585;
            border-radius: 18px;
            padding: 0 16px;
            height: 2rem;
            display: inline-block;
            line-height: 2rem;
            margin: 10px;
            position: relative;
            .t-body-type-close
              border-radius: 9px;
              display: block;
              width: 18px;
              height: 18px;
              position: absolute;
              top: -6px;
              right: -6px;
              background: #d0011b;
              font-size: 12px;
              line-height: 18px;
              text-align: center;
              color: #fff;
              border: 1px solid #fff;
        .t-body-type-selection-selected
            background: linear-gradient(90deg, #FF8C57 0%, #E84E30 100%);
            color: #fff;
            border: 1px solid #ff5151;
    .t-button
      background: linear-gradient(90deg, #FF8C57 0%, #E84E30 100%);
      height: 60px;
      font-size: 18px;
      color: #fff;
      text-align: center;
      line-height: 60px;
      width: 90%;
      margin: 0 5%;
      position: absolute;
      bottom: 10px;
</style>

