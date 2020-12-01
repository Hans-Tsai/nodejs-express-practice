const express = require('express')
const expressHandlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const multiparty = require('multiparty')
const cookieParser = require('cookie-parser')
const expressSession = require('express-session')
const RedisStore = require('connect-redis')(expressSession)
const cors = require('cors')
const csrf = require('csurf')

const handlers = require('./lib/handlers')
const weatherMiddlware = require('./lib/middleware/weather')
const createAuth = require('./lib/auth')
const createTwitterClient = require('./lib/twitter')
const geocode = require('./lib/geocode')

const { credentials } = require('./config')

require('./db')

const app = express()

app.use('/api', cors())

// configure Handlebars view engine
app.engine('handlebars', expressHandlebars({
  defaultLayout: 'main',
  helpers: {
    section: function(name, options) {
      if(!this._sections) this._sections = {}
      this._sections[name] = options.fn(this)
      return null
    },
  },
}))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(cookieParser(credentials.cookieSecret))
app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: credentials.cookieSecret,
  store: new RedisStore({
    url: credentials.redis.url,
    logErrors: true,
  }),
}))

// security configuration
const auth = createAuth(app, {
	// baseUrl是選用的, 如果你省略它,它的預設值是localhost
	// 如果你在本地電腦上工作,
	// 設定它可能是有幫助的。 例如: 你使用預備伺服器
	// 你或許會將BASE_URL環境變數設為
	// https://staging.meadowlark.com
    baseUrl: process.env.BASE_URL,
    providers: credentials.authProviders,
    successRedirect: '/account',
    failureRedirect: '/unauthorized',
})
// auth.init() 連接Passport中介函式:
auth.init()
// 現在我們可以指定auth路由:
auth.registerRoutes()

app.use(csrf({ cookie: true }))
app.use((req, res, next) => {
  res.locals._csrfToken = req.csrfToken()
  next()
})

const port = process.env.PORT || 3000

app.use(express.static(__dirname + '/public'))

app.use(weatherMiddlware)

app.get('/', handlers.home)

// handlers for browser-based form submission
app.get('/newsletter-signup', handlers.newsletterSignup)
app.post('/newsletter-signup/process', handlers.newsletterSignupProcess)
app.get('/newsletter-signup/thank-you', handlers.newsletterSignupThankYou)

// handlers for fetch/JSON form submission
app.get('/newsletter', handlers.newsletter)
app.post('/api/newsletter-signup', handlers.api.newsletterSignup)

// vacation photo contest
app.get('/contest/vacation-photo', handlers.vacationPhotoContest)
app.get('/contest/vacation-photo-ajax', handlers.vacationPhotoContestAjax)
app.post('/contest/vacation-photo/:year/:month', (req, res) => {
  const form = new multiparty.Form()
  form.parse(req, (err, fields, files) => {
    if(err) return handlers.vacationPhotoContestProcessError(req, res, err.message)
    console.log('got fields: ', fields)
    console.log('and files: ', files)
    handlers.vacationPhotoContestProcess(req, res, fields, files)
  })
})
app.post('/api/vacation-photo-contest/:year/:month', (req, res) => {
  const form = new multiparty.Form()
  form.parse(req, (err, fields, files) => {
    if(err) return handlers.api.vacationPhotoContestError(req, res, err.message)
    handlers.api.vacationPhotoContest(req, res, fields, files)
  })
})

// vacations
app.get('/vacations', handlers.listVacations)
app.get('/notify-me-when-in-season', handlers.notifyWhenInSeasonForm)
app.post('/notify-me-when-in-season', handlers.notifyWhenInSeasonProcess)

// utility routes
app.get('/set-currency/:currency', handlers.setCurrency)

const db = require('./db')

// api
const vhost = require('vhost')
app.get('/', vhost('api.*', handlers.getVacationsApi))
app.get('/api/vacations', handlers.getVacationsApi)
app.get('/api/vacation/:sku', handlers.getVacationBySkuApi)
app.post('/api/vacation/:sku/notify-when-in-season', handlers.addVacationInSeasonListenerApi)
app.delete('/api/vacation/:sku', handlers.requestDeleteVacationApi)

const customerOnly = (req, res, next) => {
  console.log('user: ' + req.user)
  if (req.user && req.user.role === 'customer') return next()
  // 我們想要讓"只供顧客觀看的網頁"知道用戶需要登入
  res.redirect(303, '/unauthorized')
};

const employeeOnly = (req, res, next) => {
  console.log('user: ' + req.user)
  if (req.user && req.user.role === 'employee') return next()
  // 我們希望"隱藏"只限員工的授權失敗
  // 以防止潛在的駭客知道有這種網頁
  next('route')  // 呼叫 next('route') 就不會執行路由之中的下一個處理式, 它會完全跳過這個路由
};

// 顧客(customer)路由
app.get('/account', customerOnly, (req, res) => {
  res.render('account', { username: req.user.name })
});

app.get('/account/order-history', customerOnly, (req, res) => {
  res.render('account/order-history')
});

app.get('account/email-prefs', customerOnly, (req, res) => {
  res.render('account/email-prefs')
});

// 員工(employee)路由
app.get('/sales', employeeOnly, (req, res) => {
  res.render('sales')
});

// 我們也會需要一個未授權(unauthorized)的頁面
app.get('/unauthorized', employeeOnly, (req, res) => {
  res.status(403).render('unauthorized')
});

// 以及一個可以用來登出(logout)的頁面
app.get('/', (req, res) => {
  req.logout()
  req.redirect('/')
});

const twitterClient = createTwitterClient(credentials.twitter)

const getTopTweets = ((twitterClient, search) => {
  const topTweets = {
    count: 10,
    lastRefreshed: 0,
    refreshInterval: 15 * 60 * 1000,
    tweets: [],
  }
  return async () => {
    if(Date.now() > topTweets.lastRefreshed + topTweets.refreshInterval) {
      const tweets = await twitterClient.search('#Oregon #travel', topTweets.count)
      const formattedTweets = await Promise.all(tweets.statuses.map(async ({ id_str, user }) => {
        const url = `https://twitter.com/${user.id_str}/statuses/${id_str}`
        const embeddedTweet = await twitterClient.embed(url, { omit_script: 1 })
        return embeddedTweet.html
      }))
      topTweets.lastRefreshed = Date.now()
      topTweets.tweets = formattedTweets
    }
    return topTweets.tweets
  }
})(twitterClient, '#Oregon #travel')

app.get('/social', async (req, res) => {
  res.render('social', { tweets: await getTopTweets() })
})

app.get('/vacations-map', async (req, res) => {
  res.render('vacations-map', { googleApiKey: credentials.google.apiKey })
})

const getForecasts = require('./lib/weather')([
  { name: 'Portland', coordinates: { lat: 45.5154586, lng: -122.6793461 } }
])
getForecasts().then(forecasts => console.log(forecasts))


app.use(handlers.notFound)
app.use(handlers.serverError)

if(require.main === module) {
  app.listen(port, () => {
    console.log( `Express started on http://localhost:${port}` +
      '; press Ctrl-C to terminate.' )
  })
} else {
  module.exports = app
}
