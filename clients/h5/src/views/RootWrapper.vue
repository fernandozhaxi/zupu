<template>
  <div class="root-wrapper">
    <router-view></router-view>
    <van-tabbar
      class="bottom-tabbar"
      route
      v-model="active"
      v-show="bottomMenuVisible"
    >
      <van-tabbar-item icon="home-o" replace to="/manage">
        <img
          :src="props.active ? homeActiveIcon : homeIcon"
          slot="icon"
          slot-scope="props"
        />
        首页
      </van-tabbar-item>
      <van-tabbar-item icon="chat-o" replace to="/chat">
        <img
          :src="props.active ? MessageActiveIcon : MessageIcon"
          slot="icon"
          slot-scope="props"
        />消息
      </van-tabbar-item>
      <van-tabbar-item icon="manager-o" replace to="/my">
        <img
          :src="props.active ? myActiveIcon : myIcon"
          slot="icon"
          slot-scope="props"
        />我的
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Home from '@/assets/icon/bottom_home.svg';
import HomeActive from '@/assets/icon/bottom_home_active.svg';
import Message from '@/assets/icon/bottom_message.svg';
import MessageActive from '@/assets/icon/bottom_message_active.svg';
import myHome from '@/assets/icon/bottom_my.svg';
import myActive from '@/assets/icon/bottom_my_active.svg';

export default {
  // 每个组件都应该有名字，命名至少两个单词
  name: 'rootWrapper',
  data() {
    // 定义的每个data 属性必须有注释，注释规则： //
    return {
      active: 0,
      homeIcon: Home,
      homeActiveIcon: HomeActive,
      MessageIcon: Message,
      MessageActiveIcon: MessageActive,
      myIcon: myHome,
      myActiveIcon: myActive
    };
  },
  // props: {
  //   // props应尽量详细，至少应该指定其类型
  //   status: {
  //     default: '',
  //     type: String,
  //     required: true,
  //     validator: function(value) {
  //       // props校验，可选
  //       return ['syncing', 'synced', 'error'].indexOf(value) !== -1;
  //     }
  //   }
  // },
  components: {},
  // 路由进入之前
  beforeRouteEnter(to, from, next) {
    next();
  },
  // 路由更新之前
  beforeRouteUpdate(to, from, next) {
    next();
  },
  // 路由离开之前
  beforeRouteLeave(to, from, next) {
    next();
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  watch: {},
  computed: {
    ...mapGetters('common', ['bottomMenuVisible'])
  },
  directives: {},
  filter: {},
  methods: {}
};
</script>

<style lang="less" scoped>
.wrapper {
  height: 100vh;
  position: relative;
  .bottom-tabbar {
    z-index: 500 !important;
    position: fixed;
    bottom: 0;
  }
}
</style>
