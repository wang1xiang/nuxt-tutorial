<template>
  <div class="settings-page">
  <div class="container page">
    <div class="row">

      <div class="col-md-6 offset-md-3 col-xs-12">
        <h1 class="text-xs-center">Your Settings</h1>

        <form @submit.prevent="onSubmit">
          <fieldset>
              <fieldset class="form-group">
                <input class="form-control" type="text" placeholder="URL of profile picture" v-model="user.image">
              </fieldset>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" type="text" placeholder="Your Name" v-model="user.username">
              </fieldset>
              <fieldset class="form-group">
                <textarea class="form-control form-control-lg" rows="8" placeholder="Short bio about you" v-model="user.bio"></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" type="text" placeholder="Email" v-model="user.email">
              </fieldset>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" type="password" placeholder="Password" required minlength="8" v-model="user.password">
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right" >
                Update Settings
              </button>
          </fieldset>
        </form>
        <hr>
        <button class="btn btn-outline-danger" @click="logout">
          Or click here to logout.
        </button>
      </div>
    </div>
  </div>
  </div>
</template>
<script>
import { updateUser, getCurrentUser} from '@/api/user.js' 
const Cookie = process.client ? require('js-cookie') : undefined
export default {
  middleware: 'authenticated',
  name: 'settings',
  data () {
    return {
      user: {
        email: "",
        username:"",
        bio: "",
        password:"",
        image: null
      }
    }
  },
  async mounted () {
    const { data } = await getCurrentUser()
    const { user } = data
    this.user = { ...this.user, ...user }
  },
  methods: {
    async onSubmit () {
      const { data } = await updateUser({ user: this.user })
      //用户数据存储
      this.$store.commit('setUser', data.user)
      // 为了防止刷新页面数据丢失，我们需要把数据持久化
      Cookie.set('user', data.user)
      this.$router.push(`/profile/${data.user.username}`)
    },
    //登出
    logout () {
      //用户登陆状态存储
      this.$store.commit('setUser', null)
      Cookie.set('user', null)
      this.$router.push('/')
    }
  },
}
</script>