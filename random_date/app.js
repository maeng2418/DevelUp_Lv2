// 필요한 모듈 가져오기
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');

// http 리퀘스트 로깅하는 객체 생성 모듈
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// app이라는 객체 선언하여 웹서버 특징 기술
var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(function(req, res, next){
	res.io = io;
	next();
});

var count=1;
io.on('connection', function(socket){   // 채팅방에 접속했을 때 - 1
	socket.on('newUser', function(name){   // 채팅방 접속이 끊어졌을 때 - 2
	  socket.name = name;
	  io.to(socket.id).emit('create name', name);   
	  io.emit('new_connect', name);
	});
	
	
	socket.on('disconnect', function(){   // 채팅방 접속이 끊어졌을 때 - 2
	  console.log('user disconnected: '+ socket.id + ' ' + socket.name);
	  io.emit('new_disconnect', socket.name);
	});

	socket.on('send message', function(name, text){   // 메세지를 보냈을 때 - 3
		var msg = name + ' : ' + text;
		if(name != socket.name)   // 닉네임을 바꿨을 때 
			io.emit('change name', socket.name, name);
		socket.name = name;
    	console.log(msg);
    	io.emit('receive message', msg);
	});
	
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
// app.set('views', path.join(__dirname, 'views')); 
app.set('views', path.join(__dirname, 'views')); // 화면을 보이게 할 뷰 템플릿 파일들이 있는 경로를 라우팅
app.set('view engine', 'ejs'); // 뷰에 사용될 엔진 이름 정의
app.engine('html', require('ejs').renderFile);

// 디렉토리 구조를 url에 반영
app.use('/', indexRouter);
app.use('/users', usersRouter);

//에러 핸들러
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = {app:app, server:server};
