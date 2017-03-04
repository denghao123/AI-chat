var express = require('express'),
  app = express(),
  http = require('http'),
  serverApp = http.Server(app),
  path = require('path'),
  gulp = require('gulp'),
  concat = require('gulp-concat'),
  sass = require('gulp-sass'),
  babel = require('gulp-babel'),
  io = require("socket.io")(serverApp);

/* default */
gulp.task('default', ['js', 'sass', 'socket', 'watch'], function() {
  return gulp.start('server');
});

//js
gulp.task('js', function() {
  gulp.src(['src/js/vue.min.js', 'src/js/socket.io.js', 'src/js/*.js'])
    .pipe(concat('build.js'))
    .pipe(babel())
    .pipe(gulp.dest('dist/js'))
})

// css
gulp.task('sass', function() {
  gulp.src('src/css/index.scss')
    .pipe(sass())
    .pipe(concat('style.css'))
    .pipe(gulp.dest('dist/css'))
})

/*server*/
gulp.task('server', function() {
  //root path
  app.use(express.static(path.join(__dirname, './')));

  //server start
  serverApp.listen(8000, function(err) {
    console.log('环境已启动,在浏览器中输入 localhost:8000')
  })
})

// watch
gulp.task('watch', function() {
  gulp.watch('src/css/*.scss', ['sass']);
  gulp.watch('src/js/*.js', ['js']);
})

// socket.io control
gulp.task('socket', function() {

  io.on("connection", function(socket) {
    socket.on("client_send", function(data) {
      ask(data, function(content) {
        io.emit("server_send", content);
      })
    })
  })
})

function ask(str, callback) {
  var options = {
    host: 'api.jisuapi.com',
    path: '/iqa/query?appkey=fb594ae54c4a8fc7&question=' + encodeURI(str) + '',
    method: 'get'
  };
  var req = http.request(options, function(res) {
    res.on('data', function(data) {
      var data = JSON.parse(data);
      var back = data.result.content;
      callback(back);
    });
  });
  req.on('error', function(e) {
    console.log("AI接口出错了！");
    callback(false);
  });
  req.end();
}