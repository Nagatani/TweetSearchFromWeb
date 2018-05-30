const Nightmare = require('nightmare');
const vo = require('vo');
const fs = require('fs');

var nightmare = Nightmare({
  show: true
});

if (process.argv.length < 5) {
  console.log('Require arguments is not set [Keyword] [Since] [Until].');
  console.log('DateTime format: yyyy-MM-dd_hh:mm:ss_JST');
  process.exit();
}

var keyword = process.argv[2];
var since = process.argv[3];
var until = process.argv[4];
var uri = 'https://twitter.com/search?f=tweets&q=' + encodeURIComponent(keyword) +
          '%20since%3A' + encodeURIComponent(since) +
          '%20until%3A' + encodeURIComponent(until) +
          '%20exclude%3Aretweets&src=typd';

// DEBUG
console.log({
  'keyword' : keyword,
  'since' : since,
  'until' : until,
  'uri' : uri}
);

vo(function * () {
  yield nightmare.goto(uri);

  var previousHeight;
  var currentHeight = 0;

  while(previousHeight !== currentHeight) {
    previousHeight = currentHeight;
    var currentHeight = yield nightmare.evaluate(function() {
      return document.body.scrollHeight;
    });

    // 下までスクロールして5秒待つ
    yield nightmare.scrollTo(currentHeight, 0).wait(5000);
  }

  yield nightmare
    .evaluate(function() {
      var tweets = [];
      [].forEach.call(document.querySelectorAll('.tweet[data-tweet-id]'), function(item) {
          var addItem = Object.assign({}, item.dataset);

          // テキストを取得
          var text = "";
          [].forEach.call(item.querySelectorAll(':scope p.tweet-text'), function(texts) {
            text += texts.innerHTML.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g,'');
          });

          addItem.text = text;
          tweets.push(addItem);
        }
      );
      return tweets;
    })
    .end()
    .then(function(tweets) {
      // ファイル書き出し
      fs.writeFileSync('results_' + keyword + '_' +
        since.replace(/:/g, '_') + '_' +
        until.replace(/:/g, '_') + '.json', JSON.stringify(tweets));

      console.log('done: File output');
    });
    return '';
})(function(err, result) {
    if (err) return console.dir(err);
    console.dir(result);
    console.log('done: Search finished.');
});
