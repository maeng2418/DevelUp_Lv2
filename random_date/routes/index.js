var express = require('express');
var router = express.Router();

const axios = require("axios");
const cheerio = require("cheerio");
const log = console.log;
var i = (Math.floor(Math.random() * 4));


// axios.get 함수를 이용해서 비동기로 스포츠 뉴스의 html파일을 가져옵니다.
const getHtml = async () => {
  try {
    return await axios.get("http://datepop.co.kr/view/");
  } catch (error) {
    console.error(error);
  }
};

//  그 후 반환되는 Promise객체에 cheerio를 이용하여 데이터 가공
getHtml()
  .then(html => {
    let ulList = [];
    const $ = cheerio.load(html.data);
    const $bodyList = $("div.hidden-xs.week-showshowshow-content").children("div");
	
    $bodyList.each(function(i, elem) {
      ulList[i] = {
          title: $(this).find('div.week-showshowshow-content-text-wrapper div#week-showshowshow-shop-title').attr('ng-bind'),
          // url: $(this).find('strong.news-tl a').attr('href'),
          image_url: $(this).find('div.week-showshowshow-content-img-wrapper img#week-showshowshow-content-img').attr('src'),
          //image_alt: $(this).find('div.week-showshowshow-content-img-wrapper img#week-showshowshow-content-img').attr('alt'),
          summary: $(this).find('div.week-showshowshow-content-text-wrapper div#week-showshowshow-subway-station').text(),
          // date: $(this).find('span.p-time').text()
      };
    });

    const data = ulList.filter(n => n.title);
	const data2 = [];
	
	data.forEach(function (n) {
		if (data.indexOf(n) % 2 == 0) {
			data2.push(n);
		}
	});

    return data2;
  })
  .then(result => router.get('/recommand', function(req, res) {
		var titleArr = [];
		var urlArr = [];
		var summaryArr = [];
		result.forEach(function (n) {
			titleArr.push(n.title.slice(24,-2));
			urlArr.push(n.image_url);
			summaryArr.push(n.summary);
		});
	
		var string = ("<h1>"+titleArr[i]+"</h1>" + "'<img src='"+urlArr[i]+"'> </img>'" +"<div>"+summaryArr[i]+"</div>");
		
  		res.send(string);
	}));


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/chatting', function(req, res, next) {
	res.sendfile('./views/chatting.html');
});

module.exports = router;
