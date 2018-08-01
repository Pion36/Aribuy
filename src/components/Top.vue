<template>
  <div class='piggy'>
    <div class="header">
      <section class="hero is-default is-bold">
        <div class="hero-head">
          <nav class="navbar">
            <div class="container">
              <div class="navbar-brand">
                <a class="navbar-item title" href="../">
                  Aribuy
                </a>
                <span class="navbar-burger burger" data-target="navbarMenu">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </div>
              <!-- <div id="navbarMenu" class="navbar-menu">
                <div class="navbar-end">
                  <div class="tabs is-right">
                    <ul>
                      <li class="is-active"><a>Home</a></li>
                      <li><a href="">使い方</a></li>
                      <li><a href="">当サイトについて</a></li>
                      <li><a href="">CONTACT</a></li>
                      <li><a href="">Help</a></li>
                    </ul>
                  </div>
                </div>
              </div> -->
            </div>
          </nav>
        </div>
      </section>
    </div>
    <div class="container">
      <div class="columns">
        <div class="column is-5">
          <div class="box" style="text-align:left;">
            <h2 class="subtitle">現在位置をブロックチェーンに書き込む</h2>
            <p>Aribuyを記録する</p>
            <button class="button" type="button" v-on:click="getgps(), MakeItasokoModal = true, time = unixtodate(unixcurrent() / 1000), unixtime = unixcurrent(), os = getos()">記録！</button>
          </div>
        </div>
        <div class="column is-7">
          <div class="box">
            <h2 class="subtitle">あなたのAribuy一覧</h2>
            <table class="table is-hoverable" style="width:100%; table-lauout:fixed; word-break:break-all; word-wrap:break-all;">
              <thead>
                <tr>
                  <th style="width:30%">時間</th>
                  <th style="width:55%">場所</th>
                  <th style="width:15%">button</th>
                </tr>
              </thead>
              <tfoot>
                <tr>
                  <th>時間</th>
                  <th>場所</th>
                  <th>button</th>
                </tr>
              </tfoot>
              <tbody>
                <tr v-for="(Itasoko ,index) in Itasokolist" :key="index">
                  <td> {{unixtodate(Itasoko.time / 1000)}} </td>
                  <td>{{ Itasoko.jyusyo }}</td>
                  <td><a class="button is-info is-outlined" v-on:click='dtime = unixtodate(Itasoko.time / 1000), djyusyo = Itasoko.jyusyo, dlatitude = Itasoko.latitude, dlongitude = Itasoko.longitude, dos = Itasoko.os, DetailItasokoModal = true'>表示</a></td>
                </tr>
              </tbody>
            </table>
            <a class="button is-info is-outlined" v-on:click='displayItasokos(web3.coinbase)'>表示</a>
          </div>
        </div>
      </div>
      <div class="columns">
        <div class="column is-6">
        </div>
      </div>
    </div>
    <b-modal :active.sync="MakeItasokoModal">
      <div class="modal-card" style="width: auto">
           <header class="modal-card-head">
             <p v-if="!jyusyo" class="modal-card-title">現在地を読み込み中です...</p>
             <p v-if="jyusyo" class="modal-card-title">以下でAribuyを記録しますか？</p>
           </header>
           <section class="modal-card-body">
             <p v-if="!jyusyo">少々お待ちください...</p>
             <p v-if="jyusyo">時刻:{{ time }}</p>
             <p v-if="jyusyo">unixtime:{{ unixtime }}</p>
             <p v-if="jyusyo">住所:{{ jyusyo }}</p>
             <p v-if="jyusyo">緯度:{{ latitude }}</p>
             <p v-if="jyusyo">経度:{{ longitude }}</p>
             <p v-if="jyusyo">端末OS:{{ os }}</p>
           </section>
           <footer class="modal-card-foot">
             <button  v-if="jyusyo" class="button" type="button" @click="make()">情報記入</button>
             <button class="button" type="button" @click="MakeItasokoModal = false">閉じる</button>
           </footer>
       </div>
    </b-modal>
    <b-modal :active.sync="DetailItasokoModal">
      <div class="modal-card" style="width: auto">
           <header class="modal-card-head">
             <p class="modal-card-title">Itasokoの詳細</p>
           </header>
           <section class="modal-card-body">
             <p>時刻:{{ dtime }}</p>
             <p>住所:{{ djyusyo }}</p>
             <p>緯度:{{ dlatitude }}</p>
             <p>経度:{{ dlongitude }}</p>
             <p>端末OS:{{ dos }}</p>
           </section>
           <footer class="modal-card-foot">
             <button class="button" type="button" @click="DetailItasokoModal = false">閉じる</button>
           </footer>
       </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'Top',
  data () {
    return {
      latitude: null,
      longitude: null,
      jyusyo: null,
      time: null,
      unixtime: null,
      os: null,
      MakeItasokoModal: false,
      Itasokolist: [],
      DetailItasokoModal: false,
      dtime: null,
      djyusyo: null,
      dlatitude: null,
      dlongitude: null,
      dos: null
    }
  },
  computed: {
    web3 () {
      return this.$store.state.web3
    }
  },
  mounted () {
    this.$store.dispatch('getContractInstance')
    var burger = document.querySelector('.burger')
    var menu = document.querySelector('#' + burger.dataset.target)
    burger.addEventListener('click', function () {
      burger.classList.toggle('is-active')
      menu.classList.toggle('is-active')
    })
  },
  methods: {
    getgps: function () {
      var self = this
      if (navigator.geolocation) {
        console.log('この端末では位置情報が取得できます')
      } else {
        alert('この端末では位置情報が取得できません')
      }
      navigator.geolocation.getCurrentPosition(
        // 取得成功した場合
        function (position) {
          self.latitude = position.coords.latitude
          self.longitude = position.coords.longitude
          var xhr = new XMLHttpRequest()
          xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
              if (this.response) {
                self.jyusyo = null
                self.jyusyo = this.response['results'][0]['formatted_address'].split(/\s+/g)[1]
              }
            }
          }
          xhr.open('GET', 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + self.latitude + ',' + self.longitude + '&key=AIzaSyA9pPnnB3RsOJyycAgVdLT0QF53i1wSnxo', true)
          xhr.responseType = 'json'
          xhr.send(null)
        },
        function (error) {
          switch (error.code) {
            case 1:
              alert('位置情報の利用が許可されていません')
              break
            case 2:
              alert('現在位置が取得できませんでした')
              break
            case 3:
              alert('その他のエラー(エラーコード:' + error.code + ')')
              break
          }
        }
      )
    },
    getjyusyo: function () {
      var xhr = new XMLHttpRequest()
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          if (this.response) {
            console.log(this.response)
          }
        }
      }
      xhr.open('GET', 'https://maps.googleapis.com/maps/api/geocode/json?latlng=36.0890142,140.0960055&key=AIzaSyA9pPnnB3RsOJyycAgVdLT0QF53i1wSnxo', true)
      xhr.responseType = 'json'
      xhr.send(null)
    },
    getos: function () {
      return navigator.platform
    },
    unixcurrent: function () {
      var current = Date.now()
      return current
    },
    unixtodate: function (unixtime) {
      var d = new Date(unixtime * 1000 + 32400)
      var year = d.getFullYear()
      var month = d.getMonth() + 1
      var day = d.getDate()
      var hour = ('0' + d.getHours()).slice(-2)
      var min = ('0' + d.getMinutes()).slice(-2)
      var sec = ('0' + d.getSeconds()).slice(-2)
      return (year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec)
    },
    make: function () {
      var self = this
      Promise.resolve()
        .then(function () {
          return new Promise((resolve, reject) => {
            self.$store.state.contractInstance().makeItasoko(self.unixtime, self.jyusyo, self.longitude, self.latitude, self.os, {
              gas: 300000,
              value: self.$store.state.web3.web3Instance().toWei(self.amount, 'ether'),
              from: self.$store.state.web3.coinbase
            }, (err, result) => {
              if (err) {
                console.log(err)
              } else {
                self.time = null
                self.jyusyo = null
                self.longitude = null
                self.latitude = null
                self.os = null
                resolve()
              }
            })
          })
        })
      self.MakeItasokoModal = false
    },
    displayItasokos: function (owner) {
      var self = this
      self.Itasokolist = []
      Promise.resolve(owner)
        .then(function (value) {
          return new Promise((resolve, reject) => { //  getItasokoByOwner
            self.$store.state.contractInstance().getItasokoByOwner.call(owner, function (err, result) {
              if (!err) {
                var array = new Array(result.length)
                for (var i = 0; i < result.length; i++) {
                  array[i] = result[i].c[0]
                }
                resolve(array)
              }
            })
          })
        })
        .then(function (array) {
          return Promise.all([
            new Promise((resolve, reject) => {
              var loop = Promise.resolve()
              for (var i = 0; i < array.length; i++) {
                (function (i) {
                  loop = loop.then(function () {
                    return new Promise(function (resolve, reject) {
                      self.$store.state.contractInstance().Itasokos.call(array[i], function (err, result) {
                        if (!err) {
                          var kari = {}
                          kari['time'] = result[0].c[0]
                          kari['jyusyo'] = result[1]
                          kari['longitude'] = result[2].c[0]
                          kari['latitude'] = result[3].c[0]
                          kari['os'] = result[4]
                          self.Itasokolist.push(kari)
                          // オブジェクトを作って
                          // そのオブジェクトを配列の中に入れていく
                          resolve()
                        }
                      })
                    })
                  })
                })(i)
              }
              console.log('表示')
              resolve()
            })
          ])
        })
    }
  }
}
</script>

<style>
.title {
  color:white;
}
</style>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
</style>
