<template>
<div class="profile-page">
  <div class="user-info">
    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <img :src="profile.image" class="user-img" />
          <h4>{{ profile.username}}</h4>
          <p>{{ profile.bio }}</p>
          <button class="btn btn-sm btn-outline-secondary action-btn"
            v-if="user.username === profile.username" @click="goProfile"
          >
            <i class="ion-gear-a"></i>
            &nbsp;
            Edit Profile Setting
          </button>
          <button class="btn btn-sm btn-outline-secondary action-btn"
            v-else
          >
            <i class="ion-plus-round"></i>
            &nbsp;
            Follow Eric Simons 
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="container">
    <div class="row">

      <div class="col-xs-12 col-md-10 offset-md-1">
        <div class="articles-toggle">
          <ul class="nav nav-pills outline-active">
            <li class="nav-item">
              <nuxt-link 
              class="nav-link"
              :class="{ active : tab === 'my_articles'}"
              :to="{ 
                path:`/profile/${profile.username}`,
                query:{ tab: 'my_articles'}
              }" exact >
                My Articles
              </nuxt-link>
            </li>
            <li class="nav-item">
              <nuxt-link 
              class="nav-link"
              :class="{ active : tab === 'favorited_articles'}"
              :to="{ 
                path:`/profile/${profile.username}`,
                query:{ tab: 'favorited_articles'}
              }" exact >
                Favorited Articles
              </nuxt-link>
            </li>
          </ul>
        </div>

        <!-- 文章列表 -->
        <div class="article-preview" v-if="articles.length === 0">No articles are here... yet.</div>
          <div class="article-preview"
            v-for="article in articles"
            :key="article.slug"
          >
            <div class="article-meta">
              <nuxt-link :to="{
                name: 'profile',
                params:{
                  username: article.author.username
                }
                }">
                <img :src="article.author.image" />
              </nuxt-link>
              <div class="info">
                <nuxt-link :to="{
                  name: 'profile',
                  params:{
                    username: article.author.username
                  }
                }">
                {{ article.author.username }}
                </nuxt-link>
                <span class="date">{{ article.createdAt | date('MMM DD, YYYY')}}</span>
              </div>
              <button 
              class="btn btn-outline-primary 
              btn-sm pull-xs-right"
              :class="{
                active: article.favorited
              }"
              @click="onFavorite(article)"
              :disabled = "article.favoriteDisabled"
              >
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link 
              :to="{
                name: 'article',
                params:{
                  slug: article.slug
                }
              }" 
              class="preview-link">
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getProfile } from '@/api/user'
import { getArticles , deleteFavorite, addFavorite } from '@/api/article'
import { mapState } from 'vuex'
export default {
  middleware: 'authenticated',
  name: 'profile',
  computed:{
    ...mapState(['user'])
  },
  // 服务端渲染
  async asyncData ({ params, query }) {
    const username = params.username
    const tab = query.tab || 'my_articles'
    const param = username && tab === 'my_articles' ? { author : username } : { favorited : username }
    const [ profileRes, articleRes ] = await Promise.all([ getProfile(username) , getArticles(param) ])
    const { data: { profile } } = profileRes
    const { data: { articles } } = articleRes
    articles.forEach(article => {
      article.favoriteDisabled = false
    })
    return {
      tab,
      profile,
      articles
    }
  },
  watchQuery: ['tab'],
  methods: {
    async onFavorite (article) {
      article.favoriteDisabled = true
      if (article.favorited) {
        //取消点赞
        await deleteFavorite(article.slug)
        article.favorited = false
        article.favoritesCount += -1
      } else {
        //添加点赞
        await addFavorite(article.slug)
        article.favorited = true
        article.favoritesCount += 1
      }
      article.favoriteDisabled = false
    },
    goProfile (){
      this.$router.push({ path: '/settings' })
    }
  }
}  
</script>