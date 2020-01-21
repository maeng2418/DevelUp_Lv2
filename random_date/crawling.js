var express = require('express');
var app = express();
const axios = require("axios");
const cheerio = require("cheerio");
const log = console.log;

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
  .then(result => app.get('/recommand', function(req, res) {
  		res.send(result);
	}));


app.use(express.static(__dirname)); //정적 파일들이 있는 위치를 지정


// app.get('/', function(req, res) {
//   res.send('hello world');
// });

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
  });
