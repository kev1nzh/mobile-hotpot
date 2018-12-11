<template>
  <div class="person">
    <div class="open-table-head">
      <img
        src="http://eshineshtest-image.oss-cn-shanghai.aliyuncs.com/new-i/logo/1521697569395.png@!list"
      >
    </div>
    <div class="open-table-content">
      <div class="open-table-numbers" @click.stop="isShow = true">
        <span class="field-title">就餐人数</span>
        <label>{{personNum}}</label>
        <span class="field-place">位</span>
      </div>
      <div class="open-table-notice" v-show="personNum === 0">
        <i>*</i>请输入就餐人数
      </div>
      <div
        class="open-table-products"
        v-for="product in reward"
        :key="product.id"
        v-if="personNum > 0"
      >
        <span class="product-name">{{product.base.name}}</span>
        <div class="handle-product-number">
          <div class="minus" @click="minus(product)">
            <img src="../../assets/img/sh/theme/@2x/normal/minus.png">
          </div>
          <div class="p-cal-num">{{product.selectedNum}}</div>
          <div class="add" @click="add(product)">
            <img src="../../assets/img/sh/theme/@2x/normal/add.png">
          </div>
        </div>
        <div class="product-price">
          <span>
            ￥{{product.base.scales[0].price}}
            <i>X</i>
          </span>
          <span>{{personNum}}位</span>
          <span>总价￥{{product.base.scales[0].price * personNum}}</span>
        </div>
        
      </div>
      <div class="product-button" v-show="personNum > 0" @click="addPerson">开始点餐啦</div>
    </div>
    <div class="number-key-wrap" @click="isShow = !isShow" v-if="isShow">
      <div class="number-key">
        <ul>
          <li v-for="i in 20" :key="i" @click.stop="selectPerson(i)">
            <span>{{i}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "person",
  components: {},
  created() {
    this.init();
  },
  methods: {
    selectPerson(i) {
      console.log(i);
      this.isShow = !this.isShow;
      this.personNum = i;
      for (let product of this.reward) {
        product.selectedNum = i;
      }
    },
    init() {
      this.Service.IProductService.GetBrandExtraProducts().then(e => {
        if (e.length) {
          for (let product of e) {
            product.selectedNum = 0;
          }
          this.reward = e;
        }
      });
    },
    minus(product) {
      if (product.selectedNum <= 0) {
        return;
      } else {
        product.selectedNum--;
      }
    },
    add(product) {
      console.log(1);
      if (product.selectedNum >= this.personNum) {
        this.toast("每人最多点一份哦！");
      } else {
        product.selectedNum++;
      }
    },
    addPerson() {
      for(let product of this.reward) {
        let d_product = this.dslProduct(product);
        d_product.count = product.selectedNum;
        d_product.isExtra = true;
        this.Service.IShoppingCartService.AddProduct(d_product);
      }
      this.$store.state.Kind.person_isShow = false;

    }
  },
  data() {
    return {
      personNum: 0,
      isShow: false,
      reward: [
        {
          selectedNum: 0
        }
      ]
    };
  }
};
</script>
<style lang="scss">
.person {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 400;
  background-repeat: no-repeat;
  background-position: center 0;
  background-image: url(../../assets/img/sh/theme/@2x/normal/bg01.png);
  background-size: 100% 100%;
  .open-table-head {
    position: absolute;
    top: 3rem;
    left: 50%;
    margin-left: -2.2rem;
    padding: 10px 0 20px 0;
    text-align: center;
    z-index: 310;
    img {
      width: 4.4rem;
      height: 4.4rem;
      border: 0.2rem solid #f2f2f2;
      box-shadow: 0 2px 10px 0 rgba(177, 177, 177, 0.5);
      border-radius: 50%;
    }
  }
  .open-table-content {
    position: relative;
    width: 14rem;
    height: 19.5rem;
    margin: 5rem auto 0;
    background: #fff;
    box-shadow: 0 2px 10px 0 rgba(170, 169, 169, 0.5);
    border: 1px solid transparent;
    border-radius: 8px;
    .open-table-numbers {
      width: 12rem;
      height: 2.5rem;
      margin: 4rem auto 0;
      padding-left: 1rem;
      background-color: #f2f2f2;
      border-radius: 1.5rem;
      line-height: 2.5rem;
      .field-title {
        display: inline-block;
        width: 4rem;
        margin: 0;
        font-size: 14px;
        color: #333;
        vertical-align: middle;
      }
      .field-place {
        font-size :12px;
      }
      label {
        background-color: transparent;
        display: inline-block;
        width: 5rem;
        height: 24px;
        border-radius: 0;
        padding: 0;
        padding-right: 1rem;
        text-align: right;
        vertical-align: middle;
        font-size: 16px;
        font-weight: normal;
        line-height: 1.42857;
      }
    }
    .open-table-notice {
      padding: 0.5rem 1.5rem 0 1.5rem;
      margin-bottom: 2.5rem;
      -webkit-transform-origin: 0 0;
      -ms-transform-origin: 0 0;
      -o-transform-origin: 0 0;
      transform-origin: 0 0;
      -webkit-transform: scale(0.9);
      color: #bbb;
      font-size: 16px;
      i {
        color: #f00;
        margin-right: 1px;
      }
    }
    .open-table-products {
      padding: 1.5rem 1rem 0 1.5rem;
      .product-name {
        display: inline-block;
        width: 5.5rem;
        padding-bottom: 7px;
        font-size: 12px;
        color: #999;
      }
      .handle-product-number {
        display: inline-block;
        width: 5rem;
        div {
          margin-right: 10px;
        }
        .add {
          display: inline-block;
          width: 18px;
          height: 18px;
          padding: 5px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .p-cal-num {
          display: inline-block;
          font-size: 16px;
          position: relative;
          bottom: 3px;
        }
        .minus {
          display: inline-block;
          width: 18px;
          height: 18px;
          padding: 5px;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
      span {
        display: inline-block;
        position: relative;
        padding-right: 0.75rem;
        font-size: 12px;
        color: #999;
      }
    }
    .product-button {
      position: absolute;
      bottom: 1.25rem;
      left: 50%;
      width: 10rem;
      height: 2.25rem;
      margin: 1rem auto 0 -5rem;
      font-size: 14px;
      background: #ff8c57;
      box-shadow: 0 5px 8px 0 #fcc9b1;
      color: #fff;
      border-radius: 30px;
      border: none;
      line-height: 1.42857;
      font-weight: normal;
      line-height: 2.25rem;
      text-align: center;
      margin-top: 3rem;
    }
  }
  .number-key-wrap {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 410;
    background: rgba(1, 1, 1, 0.5);
    .number-key {
      ul {
        position: absolute;
        left: 0;
        bottom: 0;
        display: flex;
        display: -webkit-flex;
        width: 100%;
        padding: 11px;
        align-items: space-between;
        justify-content: space-between;
        background-color: #fff;
        z-index: 999;
        flex-wrap: wrap;
        box-sizing: border-box;
        li {
          flex: 0 0 20%;
          -wbkit-flex: 0 0 20%;
          margin-bottom: 5px;
          span {
            display: block;
            width: 50px;
            height: 50px;
            margin: 0 auto;
            border: 1px solid #dedede;
            border-radius: 50%;
            text-align: center;
            line-height: 50px;
            color: #999;
            font-size: 14px;
            box-sizing: border-box;
          }
        }
      }
    }
  }
}
</style>

