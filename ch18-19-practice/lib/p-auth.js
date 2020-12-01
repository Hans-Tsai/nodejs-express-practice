const passport = require('passport');
const config = require('../config');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const db = require('../db');

// 只將資料庫ID(_id屬性)存入session
passport.serializeUser((user, done) => done(null, user._id));

// 在必要時,在資料庫中尋找那個ID來取得用戶物件
passport.deserializeUser((id, done) => {
  db.getUserById(id)
    .then(user => done(null, user))
    .catch(err => done(err, null))
});

module.exports = (app, options) => {
  // 如果沒有指定成功或是失敗轉址
  // 設定一些合理的預設值
  if (!options.successRedirect) options.successRedirect = '/account'
  if (!options.failureRedirect) options.failureRedirect = '/login'
  return {
    init: function() { 
      const config = options.providers

      // 設置Facebook策略
      passport.use(new FacebookStrategy({
        clientID: config.facebook.appId,
        clientSecret: config.facebook.appSecret,
        callbackURL: (options.baseUrl || '') + '/auth/facebook/callback',
      },
      (accessToken, refreshToken, profile, done) => {
        const authId = 'facebook:' + profile.id
        db.getUserByAuthId(authId)
          .then(user => {
            if(user) return done(null, user)
            db.addUser({
              authId: authId,
              name: profile.displayName,
              created: new Date(),
              role: 'customer',
            })
              .then(user => done(null, user))
              .catch(err => done(err, null))
          })
          .catch(err => {
            console.log('whoops, there was an error: ', err.message)
            if(err) return done(err, null);
          })
        }));

        // 設置Google策略
        passport.use(new GoogleStrategy({
          clientID: config.google.clientID,
          clientSecret: config.google.clientSecret,
          callbackURL: (options.baseUrl || '') + '/auth/google/callback',
        }, (token, tokenSecret, profile, done) => {
          const authId = 'google:' + profile.id
          db.getUserByAuthId(authId)
            .then(user => {
              if(user) return done(null, user)
              db.addUser({
                authId: authId,
                name: profile.displayName,
                created: new Date(),
                role: 'customer',
              })
                .then(user => done(null, user))
                .catch(err => done(err, null))
            })
            .catch(err => {
              console.log('whoops, there was an error: ', err.message)
              if(err) return done(err, null);
            })
        }))

        app.use(passport.initialize());
        app.use(passporrt.session());
     },
    registerRoutes: function() { 
      // 註冊Facebook路由
      app.get('/auth/facebook', (req, res, next) => {
        if (req.query.redirect) req.session.authRedirect = req.query.redirect
        passport.authenticate('facebook')(req, res, next)
      })
      app.get('/auth/facebook/callback', passport.authenticate('facebook'), 
        { failureRedirect: options.failureRedirect },
      (req, res) => {
        console.log('successful /auth/facebook/callback')
        // 我們只有在成功驗證身份之後才會到這裡
        if (redirect) delete req.session.authRedirect
        console.log(`redirecting to ${redirect || options.successRedirect}${redirect ? '' : ' (fallback)'}`)
        res.redirect(303, redirect || options.successRedirect)
        }
      )

      // 註冊Google路由
      app.get('/auth/google', (req, res, next) => {
        if(req.query.redirect) req.session.authRedirect = req.query.redirect
        passport.authenticate('google', { scope: ['profile'] })(req, res, next)
      })
      app.get('/auth/google/callback', passport.authenticate('google',
        { failureRedirect: options.failureRedirect }),
        (req, res) => {
          console.log('successful /auth/google/callback')
          // 我們只有在成功驗證身份之後才會到這裡
          const redirect = req.session.authRedirect
          if(redirect) delete req.session.authRedirect
          res.redirect(303, req.query.redirect || options.successRedirect)
        }
      )
     },
  }
};