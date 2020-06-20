const Router = require('@koa/router');
const config = require('@/config').value;
const router = new Router();

// 遍历整个 routes 文件夹，导入模块路由 router.js 和 router-custom.js 文件
// 格式参考用例：routes/epicgames/router.js
const RouterPath = require('require-all')({
    dirname: __dirname + '/routes',
    filter: /^.*router([-_]custom[s]?)?\.js$/,
});

// 将收集到的自定义模块路由进行合并
for (const project in RouterPath) {
    for (const routerName in RouterPath[project]) {
        const proRouter = RouterPath[project][routerName]();
        proRouter.stack.forEach((nestedLayer) => {
            router.stack.push(nestedLayer);
        });
    }
}

// index
router.get('/', require('./routes/index'));
config.urlPath && router.get(config.urlPath, require('./routes/index'));
config.urlPath && router.get(config.urlPath + '/', require('./routes/index'));

router.get(config.urlPath + '/robots.txt', async (ctx) => {
    if (config.disallowRobot) {
        ctx.set('Content-Type', 'text/plain');
        ctx.body = 'User-agent: *\nDisallow: /';
    } else {
        ctx.throw(404, 'Not Found');
    }
});

// test
router.get(config.urlPath + '/test/:id', require('./routes/test'));

// RSSHub
router.get(config.urlPath + '/rsshub/rss', require('./routes/rsshub/routes')); // 弃用
router.get(config.urlPath + '/rsshub/routes', require('./routes/rsshub/routes'));
router.get(config.urlPath + '/rsshub/sponsors', require('./routes/rsshub/sponsors'));

// 1draw
router.get(config.urlPath + '/1draw', require('./routes/1draw/index'));

// bilibili
router.get(config.urlPath + '/bilibili/user/video/:uid/:disableEmbed?', require('./routes/bilibili/video'));
router.get(config.urlPath + '/bilibili/user/article/:uid', require('./routes/bilibili/article'));
router.get(config.urlPath + '/bilibili/user/fav/:uid/:disableEmbed?', require('./routes/bilibili/userFav'));
router.get(config.urlPath + '/bilibili/user/coin/:uid/:disableEmbed?', require('./routes/bilibili/coin'));
router.get(config.urlPath + '/bilibili/user/dynamic/:uid/:disableEmbed?', require('./routes/bilibili/dynamic'));
router.get(config.urlPath + '/bilibili/user/followers/:uid', require('./routes/bilibili/followers'));
router.get(config.urlPath + '/bilibili/user/followings/:uid', require('./routes/bilibili/followings'));
router.get(config.urlPath + '/bilibili/user/bangumi/:uid/:type?', require('./routes/bilibili/user_bangumi'));
router.get(config.urlPath + '/bilibili/partion/:tid/:disableEmbed?', require('./routes/bilibili/partion'));
router.get(config.urlPath + '/bilibili/partion/ranking/:tid/:days?/:disableEmbed?', require('./routes/bilibili/partion-ranking'));
router.get(config.urlPath + '/bilibili/bangumi/:seasonid', require('./routes/bilibili/bangumi')); // 弃用
router.get(config.urlPath + '/bilibili/bangumi/media/:mediaid', require('./routes/bilibili/bangumi'));
router.get(config.urlPath + '/bilibili/video/page/:bvid/:disableEmbed?', require('./routes/bilibili/page'));
router.get(config.urlPath + '/bilibili/video/reply/:bvid', require('./routes/bilibili/reply'));
router.get(config.urlPath + '/bilibili/video/danmaku/:bvid/:pid?', require('./routes/bilibili/danmaku'));
router.get(config.urlPath + '/bilibili/link/news/:product', require('./routes/bilibili/linkNews'));
router.get(config.urlPath + '/bilibili/live/room/:roomID', require('./routes/bilibili/liveRoom'));
router.get(config.urlPath + '/bilibili/live/search/:key/:order', require('./routes/bilibili/liveSearch'));
router.get(config.urlPath + '/bilibili/live/area/:areaID/:order', require('./routes/bilibili/liveArea'));
router.get(config.urlPath + '/bilibili/fav/:uid/:fid/:disableEmbed?', require('./routes/bilibili/fav'));
router.get(config.urlPath + '/bilibili/blackboard', require('./routes/bilibili/blackboard'));
router.get(config.urlPath + '/bilibili/mall/new', require('./routes/bilibili/mallNew'));
router.get(config.urlPath + '/bilibili/mall/ip/:id', require('./routes/bilibili/mallIP'));
router.get(config.urlPath + '/bilibili/ranking/:rid?/:day?/:arc_type?/:disableEmbed?', require('./routes/bilibili/ranking'));
router.get(config.urlPath + '/bilibili/user/channel/:uid/:cid/:disableEmbed?', require('./routes/bilibili/userChannel'));
router.get(config.urlPath + '/bilibili/topic/:topic', require('./routes/bilibili/topic'));
router.get(config.urlPath + '/bilibili/audio/:id', require('./routes/bilibili/audio'));
router.get(config.urlPath + '/bilibili/vsearch/:kw/:order?/:disableEmbed?', require('./routes/bilibili/vsearch'));
router.get(config.urlPath + '/bilibili/followings/video/:uid/:disableEmbed?', require('./routes/bilibili/followings_video'));
router.get(config.urlPath + '/bilibili/followings/article/:uid', require('./routes/bilibili/followings_article'));
router.get(config.urlPath + '/bilibili/readlist/:listid', require('./routes/bilibili/readlist'));
router.get(config.urlPath + '/bilibili/weekly', require('./routes/bilibili/weekly_recommend'));
router.get(config.urlPath + '/bilibili/manga/update/:comicid', require('./routes/bilibili/manga_update'));

// bangumi
router.get(config.urlPath + '/bangumi/calendar/today', require('./routes/bangumi/calendar/today'));
router.get(config.urlPath + '/bangumi/subject/:id/:type', require('./routes/bangumi/subject'));
router.get(config.urlPath + '/bangumi/person/:id', require('./routes/bangumi/person'));
router.get(config.urlPath + '/bangumi/topic/:id', require('./routes/bangumi/group/reply'));
router.get(config.urlPath + '/bangumi/group/:id', require('./routes/bangumi/group/topic'));
router.get(config.urlPath + '/bangumi/subject/:id', require('./routes/bangumi/subject'));
router.get(config.urlPath + '/bangumi/user/blog/:id', require('./routes/bangumi/user/blog'));

// 微博
router.get(config.urlPath + '/weibo/user/:uid/:displayVideo?', require('./routes/weibo/user'));
router.get(config.urlPath + '/weibo/keyword/:keyword', require('./routes/weibo/keyword'));
router.get(config.urlPath + '/weibo/search/hot', require('./routes/weibo/search/hot'));
router.get(config.urlPath + '/weibo/super_index/:id', require('./routes/weibo/super_index'));
router.get(config.urlPath + '/weibo/oasis/user/:userid', require('./routes/weibo/oasis/user'));

// 贴吧
router.get(config.urlPath + '/tieba/forum/:kw', require('./routes/tieba/forum'));
router.get(config.urlPath + '/tieba/forum/good/:kw/:cid?', require('./routes/tieba/forum'));
router.get(config.urlPath + '/tieba/post/:id', require('./routes/tieba/post'));
router.get(config.urlPath + '/tieba/post/lz/:id', require('./routes/tieba/post'));

// 网易云音乐
router.get(config.urlPath + '/ncm/playlist/:id', require('./routes/ncm/playlist'));
router.get(config.urlPath + '/ncm/user/playlist/:uid', require('./routes/ncm/userplaylist'));
router.get(config.urlPath + '/ncm/artist/:id', require('./routes/ncm/artist'));
router.get(config.urlPath + '/ncm/djradio/:id', require('./routes/ncm/djradio'));

// 掘金
router.get(config.urlPath + '/juejin/category/:category', require('./routes/juejin/category'));
router.get(config.urlPath + '/juejin/tag/:tag', require('./routes/juejin/tag'));
router.get(config.urlPath + '/juejin/trending/:category/:type', require('./routes/juejin/trending'));
router.get(config.urlPath + '/juejin/books', require('./routes/juejin/books'));
router.get(config.urlPath + '/juejin/pins', require('./routes/juejin/pins'));
router.get(config.urlPath + '/juejin/posts/:id', require('./routes/juejin/posts'));
router.get(config.urlPath + '/juejin/collections/:userId', require('./routes/juejin/favorites'));
router.get(config.urlPath + '/juejin/collection/:collectionId', require('./routes/juejin/collection'));
router.get(config.urlPath + '/juejin/shares/:userId', require('./routes/juejin/shares'));

// 自如
router.get(config.urlPath + '/ziroom/room/:city/:iswhole/:room/:keyword', require('./routes/ziroom/room'));

// 简书
router.get(config.urlPath + '/jianshu/home', require('./routes/jianshu/home'));
router.get(config.urlPath + '/jianshu/trending/:timeframe', require('./routes/jianshu/trending'));
router.get(config.urlPath + '/jianshu/collection/:id', require('./routes/jianshu/collection'));
router.get(config.urlPath + '/jianshu/user/:id', require('./routes/jianshu/user'));

// 知乎
router.get(config.urlPath + '/zhihu/collection/:id', require('./routes/zhihu/collection'));
router.get(config.urlPath + '/zhihu/people/activities/:id', require('./routes/zhihu/activities'));
router.get(config.urlPath + '/zhihu/people/answers/:id', require('./routes/zhihu/answers'));
router.get(config.urlPath + '/zhihu/people/posts/:id', require('./routes/zhihu/posts'));
router.get(config.urlPath + '/zhihu/zhuanlan/:id', require('./routes/zhihu/zhuanlan'));
router.get(config.urlPath + '/zhihu/daily', require('./routes/zhihu/daily'));
router.get(config.urlPath + '/zhihu/daily/section/:sectionId', require('./routes/zhihu/daily_section'));
router.get(config.urlPath + '/zhihu/hotlist', require('./routes/zhihu/hotlist'));
router.get(config.urlPath + '/zhihu/pin/hotlist', require('./routes/zhihu/pin/hotlist'));
router.get(config.urlPath + '/zhihu/question/:questionId', require('./routes/zhihu/question'));
router.get(config.urlPath + '/zhihu/topic/:topicId', require('./routes/zhihu/topic'));
router.get(config.urlPath + '/zhihu/people/pins/:id', require('./routes/zhihu/pin/people'));
router.get(config.urlPath + '/zhihu/bookstore/newest', require('./routes/zhihu/bookstore/newest'));
router.get(config.urlPath + '/zhihu/pin/daily', require('./routes/zhihu/pin/daily'));
router.get(config.urlPath + '/zhihu/weekly', require('./routes/zhihu/weekly'));

// 妹子图
router.get(config.urlPath + '/mzitu/home/:type?', require('./routes/mzitu/home'));
router.get(config.urlPath + '/mzitu/tags', require('./routes/mzitu/tags'));
router.get(config.urlPath + '/mzitu/category/:category', require('./routes/mzitu/category'));
router.get(config.urlPath + '/mzitu/post/:id', require('./routes/mzitu/post'));
router.get(config.urlPath + '/mzitu/tag/:tag', require('./routes/mzitu/tag'));

// pixiv
router.get(config.urlPath + '/pixiv/user/bookmarks/:id', require('./routes/pixiv/bookmarks'));
router.get(config.urlPath + '/pixiv/user/illustfollows', require('./routes/pixiv/illustfollow'));
router.get(config.urlPath + '/pixiv/user/:id', require('./routes/pixiv/user'));
router.get(config.urlPath + '/pixiv/ranking/:mode/:date?', require('./routes/pixiv/ranking'));
router.get(config.urlPath + '/pixiv/search/:keyword/:order?/:r18?', require('./routes/pixiv/search'));

// 豆瓣
router.get(config.urlPath + '/douban/movie/playing', require('./routes/douban/playing'));
router.get(config.urlPath + '/douban/movie/playing/:score', require('./routes/douban/playing'));
router.get(config.urlPath + '/douban/movie/playing/:score/:city', require('./routes/douban/playing'));
router.get(config.urlPath + '/douban/movie/later', require('./routes/douban/later'));
router.get(config.urlPath + '/douban/movie/ustop', require('./routes/douban/ustop'));
router.get(config.urlPath + '/douban/movie/weekly', require('./routes/douban/weekly_best'));
router.get(config.urlPath + '/douban/movie/classification/:sort?/:score?/:tags?', require('./routes/douban/classification.js'));
router.get(config.urlPath + '/douban/group/:groupid', require('./routes/douban/group'));
router.get(config.urlPath + '/douban/explore', require('./routes/douban/explore'));
router.get(config.urlPath + '/douban/music/latest/:area?', require('./routes/douban/latest_music'));
router.get(config.urlPath + '/douban/book/latest', require('./routes/douban/latest_book'));
router.get(config.urlPath + '/douban/event/hot/:locationId', require('./routes/douban/event/hot'));
router.get(config.urlPath + '/douban/commercialpress/latest', require('./routes/douban/commercialpress/latest'));
router.get(config.urlPath + '/douban/bookstore', require('./routes/douban/bookstore'));
router.get(config.urlPath + '/douban/book/rank/:type?', require('./routes/douban/book/rank'));
router.get(config.urlPath + '/douban/doulist/:id', require('./routes/douban/doulist'));
router.get(config.urlPath + '/douban/explore/column/:id', require('./routes/douban/explore_column'));
router.get(config.urlPath + '/douban/people/:userid/status', require('./routes/douban/people/status.js'));
router.get(config.urlPath + '/douban/topic/:id/:sort?', require('./routes/douban/topic.js'));
router.get(config.urlPath + '/douban/channel/:id/:nav?', require('./routes/douban/channel/topic.js'));
router.get(config.urlPath + '/douban/channel/:id/subject/:nav', require('./routes/douban/channel/subject.js'));
router.get(config.urlPath + '/douban/celebrity/:id/:sort?', require('./routes/douban/celebrity.js'));

// 法律白話文運動
router.get(config.urlPath + '/plainlaw/archives', require('./routes/plainlaw/archives.js'));

// 煎蛋
router.get(config.urlPath + '/jandan/:sub_model', require('./routes/jandan/pic'));

// 喷嚏
router.get(config.urlPath + '/dapenti/tugua', require('./routes/dapenti/tugua'));
router.get(config.urlPath + '/dapenti/subject/:id', require('./routes/dapenti/subject'));

// Dockone
router.get(config.urlPath + '/dockone/weekly', require('./routes/dockone/weekly'));

// 开发者头条
router.get(config.urlPath + '/toutiao/today', require('./routes/toutiao/today'));
router.get(config.urlPath + '/toutiao/user/:id', require('./routes/toutiao/user'));

// 众成翻译
router.get(config.urlPath + '/zcfy', require('./routes/zcfy/index'));
router.get(config.urlPath + '/zcfy/index', require('./routes/zcfy/index')); // 废弃
router.get(config.urlPath + '/zcfy/hot', require('./routes/zcfy/hot'));

// 今日头条
router.get(config.urlPath + '/jinritoutiao/keyword/:keyword', require('./routes/jinritoutiao/keyword'));

// Disqus
router.get(config.urlPath + '/disqus/posts/:forum', require('./routes/disqus/posts'));

// Twitter
router.get(config.urlPath + '/twitter/user/:id/:type?', require('./routes/twitter/user'));
router.get(config.urlPath + '/twitter/list/:id/:name', require('./routes/twitter/list'));
router.get(config.urlPath + '/twitter/likes/:id', require('./routes/twitter/likes'));
router.get(config.urlPath + '/twitter/followings/:id', require('./routes/twitter/followings'));
router.get(config.urlPath + '/twitter/keyword/:keyword', require('./routes/twitter/keyword'));
router.get(config.urlPath + '/twitter/trends/:woeid?', require('./routes/twitter/trends'));

// Youtube
router.get(config.urlPath + '/youtube/user/:username/:embed?', require('./routes/youtube/user'));
router.get(config.urlPath + '/youtube/channel/:id/:embed?', require('./routes/youtube/channel'));
router.get(config.urlPath + '/youtube/playlist/:id/:embed?', require('./routes/youtube/playlist'));

// 极客时间
router.get(config.urlPath + '/geektime/column/:cid', require('./routes/geektime/column'));
router.get(config.urlPath + '/geektime/news', require('./routes/geektime/news'));

// 界面新闻
router.get(config.urlPath + '/jiemian/list/:cid', require('./routes/jiemian/list.js'));

// 好奇心日报
router.get(config.urlPath + '/qdaily/:type/:id', require('./routes/qdaily/index'));

// 爱奇艺
router.get(config.urlPath + '/iqiyi/dongman/:id', require('./routes/iqiyi/dongman'));
router.get(config.urlPath + '/iqiyi/user/video/:uid', require('./routes/iqiyi/video'));

// 南方周末
router.get(config.urlPath + '/infzm/:id', require('./routes/infzm/news'));

// Dribbble
router.get(config.urlPath + '/dribbble/popular/:timeframe?', require('./routes/dribbble/popular'));
router.get(config.urlPath + '/dribbble/user/:name', require('./routes/dribbble/user'));
router.get(config.urlPath + '/dribbble/keyword/:keyword', require('./routes/dribbble/keyword'));

// 斗鱼
router.get(config.urlPath + '/douyu/room/:id', require('./routes/douyu/room'));

// 虎牙
router.get(config.urlPath + '/huya/live/:id', require('./routes/huya/live'));

// 浪Play(原kingkong)直播
router.get(config.urlPath + '/kingkong/room/:id', require('./routes/langlive/room'));
router.get(config.urlPath + '/langlive/room/:id', require('./routes/langlive/room'));

// SHOWROOM直播
router.get(config.urlPath + '/showroom/room/:id', require('./routes/showroom/room'));

// v2ex
router.get(config.urlPath + '/v2ex/topics/:type', require('./routes/v2ex/topics'));
router.get(config.urlPath + '/v2ex/post/:postid', require('./routes/v2ex/post'));
router.get(config.urlPath + '/v2ex/tab/:tabid', require('./routes/v2ex/tab'));

// Telegram
router.get(config.urlPath + '/telegram/channel/:username', require('./routes/telegram/channel'));
router.get(config.urlPath + '/telegram/stickerpack/:name', require('./routes/telegram/stickerpack'));
router.get(config.urlPath + '/telegram/blog', require('./routes/telegram/blog'));

// readhub
router.get(config.urlPath + '/readhub/category/:category', require('./routes/readhub/category'));

// GitHub
router.get(config.urlPath + '/github/repos/:user', require('./routes/github/repos'));
router.get(config.urlPath + '/github/trending/:since/:language?', require('./routes/github/trending'));
router.get(config.urlPath + '/github/issue/:user/:repo/:state?/:labels?', require('./routes/github/issue'));
router.get(config.urlPath + '/github/pull/:user/:repo', require('./routes/github/pulls'));
router.get(config.urlPath + '/github/user/followers/:user', require('./routes/github/follower'));
router.get(config.urlPath + '/github/stars/:user/:repo', require('./routes/github/star'));
router.get(config.urlPath + '/github/search/:query/:sort?/:order?', require('./routes/github/search'));
router.get(config.urlPath + '/github/branches/:user/:repo', require('./routes/github/branches'));
router.get(config.urlPath + '/github/file/:user/:repo/:branch/:filepath+', require('./routes/github/file'));
router.get(config.urlPath + '/github/starred_repos/:user', require('./routes/github/starred_repos'));
router.get(config.urlPath + '/github/contributors/:user/:repo/:order?/:anon?', require('./routes/github/contributors'));

// f-droid
router.get(config.urlPath + '/fdroid/apprelease/:app', require('./routes/fdroid/apprelease'));

// konachan
router.get(config.urlPath + '/konachan/post/popular_recent', require('./routes/konachan/post_popular_recent'));
router.get(config.urlPath + '/konachan.com/post/popular_recent', require('./routes/konachan/post_popular_recent'));
router.get(config.urlPath + '/konachan.net/post/popular_recent', require('./routes/konachan/post_popular_recent'));
router.get(config.urlPath + '/konachan/post/popular_recent/:period', require('./routes/konachan/post_popular_recent'));
router.get(config.urlPath + '/konachan.com/post/popular_recent/:period', require('./routes/konachan/post_popular_recent'));
router.get(config.urlPath + '/konachan.net/post/popular_recent/:period', require('./routes/konachan/post_popular_recent'));

// yande.re
router.get(config.urlPath + '/yande.re/post/popular_recent', require('./routes/yande.re/post_popular_recent'));
router.get(config.urlPath + '/yande.re/post/popular_recent/:period', require('./routes/yande.re/post_popular_recent'));

// 纽约时报
router.get(config.urlPath + '/nytimes/morning_post', require('./routes/nytimes/morning_post'));
router.get(config.urlPath + '/nytimes/:lang?', require('./routes/nytimes/index'));

// 3dm
router.get(config.urlPath + '/3dm/:name/:type', require('./routes/3dm/game'));
router.get(config.urlPath + '/3dm/news', require('./routes/3dm/news_center'));

// 旅法师营地
router.get(config.urlPath + '/lfsyd/:typecode', require('./routes/lfsyd/index'));

// 喜马拉雅
router.get(config.urlPath + '/ximalaya/album/:id/:all?', require('./routes/ximalaya/album'));

// EZTV
router.get(config.urlPath + '/eztv/torrents/:imdb_id', require('./routes/eztv/imdb'));

// 什么值得买
router.get(config.urlPath + '/smzdm/keyword/:keyword', require('./routes/smzdm/keyword'));
router.get(config.urlPath + '/smzdm/ranking/:rank_type/:rank_id/:hour', require('./routes/smzdm/ranking'));
router.get(config.urlPath + '/smzdm/haowen/:day?', require('./routes/smzdm/haowen'));
router.get(config.urlPath + '/smzdm/haowen/fenlei/:name/:sort?', require('./routes/smzdm/haowen_fenlei'));
router.get(config.urlPath + '/smzdm/article/:uid', require('./routes/smzdm/article'));

// 新京报
router.get(config.urlPath + '/bjnews/:cat', require('./routes/bjnews/news'));
router.get(config.urlPath + '/bjnews/epaper/:cat', require('./routes/bjnews/epaper'));

// 停水通知
router.get(config.urlPath + '/tingshuitz/hangzhou', require('./routes/tingshuitz/hangzhou'));
router.get(config.urlPath + '/tingshuitz/xiaoshan', require('./routes/tingshuitz/xiaoshan'));
router.get(config.urlPath + '/tingshuitz/dalian', require('./routes/tingshuitz/dalian'));
router.get(config.urlPath + '/tingshuitz/guangzhou', require('./routes/tingshuitz/guangzhou'));
router.get(config.urlPath + '/tingshuitz/dongguan', require('./routes/tingshuitz/dongguan'));
router.get(config.urlPath + '/tingshuitz/xian', require('./routes/tingshuitz/xian'));
router.get(config.urlPath + '/tingshuitz/yangjiang', require('./routes/tingshuitz/yangjiang'));
router.get(config.urlPath + '/tingshuitz/nanjing', require('./routes/tingshuitz/nanjing'));
router.get(config.urlPath + '/tingshuitz/wuhan', require('./routes/tingshuitz/wuhan'));

// 米哈游
router.get(config.urlPath + '/mihoyo/bh3/:type', require('./routes/mihoyo/bh3'));
router.get(config.urlPath + '/mihoyo/bh2/:type', require('./routes/mihoyo/bh2'));

// 新闻联播
router.get(config.urlPath + '/cctv/xwlb', require('./routes/cctv/xwlb'));
// 央视新闻
router.get(config.urlPath + '/cctv/:category', require('./routes/cctv/category'));

// 财新博客
router.get(config.urlPath + '/caixin/blog/:column', require('./routes/caixin/blog'));
// 财新
router.get(config.urlPath + '/caixin/:column/:category', require('./routes/caixin/category'));
// 财新首页
router.get(config.urlPath + '/caixin/article', require('./routes/caixin/article'));

// 草榴社区
router.get(config.urlPath + '/t66y/post/:tid', require('./routes/t66y/post'));
router.get(config.urlPath + '/t66y/:id/:type?', require('./routes/t66y/index'));

// 色中色
router.get(config.urlPath + '/sexinsex/:id/:type?', require('./routes/sexinsex/index'));

// 机核
router.get(config.urlPath + '/gcores/category/:category', require('./routes/gcores/category'));

// 国家地理
router.get(config.urlPath + '/natgeo/dailyphoto', require('./routes/natgeo/dailyphoto'));
router.get(config.urlPath + '/natgeo/:cat/:type?', require('./routes/natgeo/natgeo'));

// 一个
router.get(config.urlPath + '/one', require('./routes/one/index'));

// Firefox
router.get(config.urlPath + '/firefox/release/:platform', require('./routes/firefox/release'));
router.get(config.urlPath + '/firefox/addons/:id', require('./routes/firefox/addons'));

// Thunderbird
router.get(config.urlPath + '/thunderbird/release', require('./routes/thunderbird/release'));

// tuicool
router.get(config.urlPath + '/tuicool/mags/:type', require('./routes/tuicool/mags'));

// Hexo
router.get(config.urlPath + '/hexo/next/:url', require('./routes/hexo/next'));
router.get(config.urlPath + '/hexo/yilia/:url', require('./routes/hexo/yilia'));

// cpython
router.get(config.urlPath + '/cpython/:pre?', require('./routes/cpython'));

// 小米
router.get(config.urlPath + '/mi/golden', require('./routes/mi/golden'));
router.get(config.urlPath + '/mi/crowdfunding', require('./routes/mi/crowdfunding'));
router.get(config.urlPath + '/mi/youpin/crowdfunding', require('./routes/mi/youpin/crowdfunding'));
router.get(config.urlPath + '/mi/youpin/new', require('./routes/mi/youpin/new'));
router.get(config.urlPath + '/miui/:device/:type?/:region?', require('./routes/mi/miui/index'));
router.get(config.urlPath + '/mi/bbs/board/:boardId', require('./routes/mi/board'));

// Keep
router.get(config.urlPath + '/keep/user/:id', require('./routes/keep/user'));

// 起点
router.get(config.urlPath + '/qidian/chapter/:id', require('./routes/qidian/chapter'));
router.get(config.urlPath + '/qidian/forum/:id', require('./routes/qidian/forum'));
router.get(config.urlPath + '/qidian/free/:type?', require('./routes/qidian/free'));
router.get(config.urlPath + '/qidian/free-next/:type?', require('./routes/qidian/free-next'));

// 纵横
router.get(config.urlPath + '/zongheng/chapter/:id', require('./routes/zongheng/chapter'));

// 刺猬猫
router.get(config.urlPath + '/ciweimao/chapter/:id', require('./routes/ciweimao/chapter'));

// 中国美术馆
router.get(config.urlPath + '/namoc/announcement', require('./routes/namoc/announcement'));
router.get(config.urlPath + '/namoc/news', require('./routes/namoc/news'));
router.get(config.urlPath + '/namoc/media', require('./routes/namoc/media'));
router.get(config.urlPath + '/namoc/exhibition', require('./routes/namoc/exhibition'));
router.get(config.urlPath + '/namoc/specials', require('./routes/namoc/specials'));

// 懂球帝
router.get(config.urlPath + '/dongqiudi/daily', require('./routes/dongqiudi/daily'));
router.get(config.urlPath + '/dongqiudi/result/:team', require('./routes/dongqiudi/result'));
router.get(config.urlPath + '/dongqiudi/team_news/:team', require('./routes/dongqiudi/team_news'));
router.get(config.urlPath + '/dongqiudi/player_news/:id', require('./routes/dongqiudi/player_news'));
router.get(config.urlPath + '/dongqiudi/special/:id', require('./routes/dongqiudi/special'));
router.get(config.urlPath + '/dongqiudi/top_news/:id?', require('./routes/dongqiudi/top_news'));

// 维基百科 Wikipedia
router.get(config.urlPath + '/wikipedia/mainland', require('./routes/wikipedia/mainland'));

// 联合国 United Nations
router.get(config.urlPath + '/un/scveto', require('./routes/un/scveto'));

// e 公司
router.get(config.urlPath + '/egsea/flash', require('./routes/egsea/flash'));

// 选股宝
router.get(config.urlPath + '/xuangubao/subject/:subject_id', require('./routes/xuangubao/subject'));

// 雪球
router.get(config.urlPath + '/xueqiu/user/:id/:type?', require('./routes/xueqiu/user'));
router.get(config.urlPath + '/xueqiu/favorite/:id', require('./routes/xueqiu/favorite'));
router.get(config.urlPath + '/xueqiu/user_stock/:id', require('./routes/xueqiu/user_stock'));
router.get(config.urlPath + '/xueqiu/fund/:id', require('./routes/xueqiu/fund'));
router.get(config.urlPath + '/xueqiu/stock_info/:id/:type?', require('./routes/xueqiu/stock_info'));
router.get(config.urlPath + '/xueqiu/snb/:id', require('./routes/xueqiu/snb'));
router.get(config.urlPath + '/xueqiu/hots', require('./routes/xueqiu/hots'));

// Greasy Fork
router.get(config.urlPath + '/greasyfork/:language/:domain?', require('./routes/greasyfork/scripts'));

// LinkedKeeper
router.get(config.urlPath + '/linkedkeeper/:type/:id?', require('./routes/linkedkeeper/index'));

// 开源中国
router.get(config.urlPath + '/oschina/news/:category?', require('./routes/oschina/news'));
router.get(config.urlPath + '/oschina/user/:id', require('./routes/oschina/user'));
router.get(config.urlPath + '/oschina/u/:id', require('./routes/oschina/u'));
router.get(config.urlPath + '/oschina/topic/:topic', require('./routes/oschina/topic'));

// 安全客
router.get(config.urlPath + '/aqk/vul', require('./routes/aqk/vul'));
router.get(config.urlPath + '/aqk/:category', require('./routes/aqk/category'));

// 腾讯游戏开发者社区
router.get(config.urlPath + '/gameinstitute/community/:tag?', require('./routes/tencent/gameinstitute/community'));

// 腾讯视频 SDK
router.get(config.urlPath + '/qcloud/mlvb/changelog', require('./routes/tencent/qcloud/mlvb/changelog'));

// 腾讯吐个槽
router.get(config.urlPath + '/tucaoqq/post/:project/:key', require('./routes/tencent/tucaoqq/post'));

// Bugly SDK
router.get(config.urlPath + '/bugly/changelog/:platform', require('./routes/tencent/bugly/changelog'));

// wechat
router.get(config.urlPath + '/wechat/wemp/:id', require('./routes/tencent/wechat/wemp'));
router.get(config.urlPath + '/wechat/csm/:id', require('./routes/tencent/wechat/csm'));
router.get(config.urlPath + '/wechat/ce/:id', require('./routes/tencent/wechat/ce'));
router.get(config.urlPath + '/wechat/announce', require('./routes/tencent/wechat/announce'));
router.get(config.urlPath + '/wechat/miniprogram/plugins', require('./routes/tencent/wechat/miniprogram/plugins'));
router.get(config.urlPath + '/wechat/tgchannel/:id', require('./routes/tencent/wechat/tgchannel'));
router.get(config.urlPath + '/wechat/uread/:userid', require('./routes/tencent/wechat/uread'));
router.get(config.urlPath + '/wechat/ershicimi/:id', require('./routes/tencent/wechat/ershcimi'));
router.get(config.urlPath + '/wechat/wjdn/:id', require('./routes/tencent/wechat/wjdn'));
router.get(config.urlPath + '/wechat/mp/homepage/:biz/:hid/:cid?', require('./routes/tencent/wechat/mp'));

// All the Flight Deals
router.get(config.urlPath + '/atfd/:locations/:nearby?', require('./routes/atfd/index'));

// Fir
router.get(config.urlPath + '/fir/update/:id', require('./routes/fir/update'));

// Nvidia Web Driver
router.get(config.urlPath + '/nvidia/webdriverupdate', require('./routes/nvidia/webdriverupdate'));

// Google
router.get(config.urlPath + '/google/citations/:id', require('./routes/google/citations'));
router.get(config.urlPath + '/google/scholar/:query', require('./routes/google/scholar'));
router.get(config.urlPath + '/google/doodles/:language?', require('./routes/google/doodles'));
router.get(config.urlPath + '/google/album/:id', require('./routes/google/album'));
router.get(config.urlPath + '/google/sites/:id', require('./routes/google/sites'));

// Awesome Pigtals
router.get(config.urlPath + '/pigtails', require('./routes/pigtails'));

// 每日环球展览 iMuseum
router.get(config.urlPath + '/imuseum/:city/:type?', require('./routes/imuseum'));

// AppStore
router.get(config.urlPath + '/appstore/update/:country/:id', require('./routes/apple/appstore/update'));
router.get(config.urlPath + '/appstore/price/:country/:type/:id', require('./routes/apple/appstore/price'));
router.get(config.urlPath + '/appstore/iap/:country/:id', require('./routes/apple/appstore/in-app-purchase'));
router.get(config.urlPath + '/appstore/xianmian', require('./routes/apple/appstore/xianmian'));
router.get(config.urlPath + '/appstore/gofans', require('./routes/apple/appstore/gofans'));

// Hopper
router.get(config.urlPath + '/hopper/:lowestOnly/:from/:to?', require('./routes/hopper/index'));

// 马蜂窝
router.get(config.urlPath + '/mafengwo/note/:type', require('./routes/mafengwo/note'));
router.get(config.urlPath + '/mafengwo/ziyouxing/:code', require('./routes/mafengwo/ziyouxing'));

// 中国地震局震情速递（与地震台网同步更新）
router.get(config.urlPath + '/earthquake/:region?', require('./routes/earthquake'));

// 中国地震台网
router.get(config.urlPath + '/earthquake/ceic/:type', require('./routes/earthquake/ceic'));

// 小说
router.get(config.urlPath + '/novel/biquge/:id', require('./routes/novel/biquge'));
router.get(config.urlPath + '/novel/biqugeinfo/:id/:limit?', require('./routes/novel/biqugeinfo'));
router.get(config.urlPath + '/novel/uukanshu/:uid', require('./routes/novel/uukanshu'));
router.get(config.urlPath + '/novel/wenxuemi/:id1/:id2', require('./routes/novel/wenxuemi'));
router.get(config.urlPath + '/novel/booksky/:id', require('./routes/novel/booksky'));
router.get(config.urlPath + '/novel/shuquge/:id', require('./routes/novel/shuquge'));
router.get(config.urlPath + '/novel/ptwxz/:id1/:id2', require('./routes/novel/ptwxz'));
router.get(config.urlPath + '/novel/zhaishuyuan/:id', require('./routes/novel/zhaishuyuan'));

// 中国气象网
router.get(config.urlPath + '/weatheralarm/:province?', require('./routes/weatheralarm'));

// Gitlab
router.get(config.urlPath + '/gitlab/explore/:type', require('./routes/gitlab/explore'));

// 忧郁的loli
router.get(config.urlPath + '/mygalgame', require('./routes/galgame/hhgal')); // 废弃
router.get(config.urlPath + '/mmgal', require('./routes/galgame/hhgal')); // 废弃
router.get(config.urlPath + '/hhgal', require('./routes/galgame/hhgal'));

// say花火
router.get(config.urlPath + '/sayhuahuo', require('./routes/galgame/sayhuahuo'));

// 终点分享
router.get(config.urlPath + '/zdfx', require('./routes/galgame/zdfx'));

// 北京林业大学
router.get(config.urlPath + '/bjfu/grs', require('./routes/universities/bjfu/grs'));
router.get(config.urlPath + '/bjfu/kjc', require('./routes/universities/bjfu/kjc'));
router.get(config.urlPath + '/bjfu/jwc/:type', require('./routes/universities/bjfu/jwc/index'));
router.get(config.urlPath + '/bjfu/news/:type', require('./routes/universities/bjfu/news/index'));

// 北京理工大学
router.get(config.urlPath + '/bit/jwc', require('./routes/universities/bit/jwc/jwc'));
router.get(config.urlPath + '/bit/cs', require('./routes/universities/bit/cs/cs'));

// 大连工业大学
router.get(config.urlPath + '/dpu/jiaowu/news/:type?', require('./routes/universities/dpu/jiaowu/news'));
router.get(config.urlPath + '/dpu/wlfw/news/:type?', require('./routes/universities/dpu/wlfw/news'));

// 东南大学
router.get(config.urlPath + '/seu/radio/academic', require('./routes/universities/seu/radio/academic'));
router.get(config.urlPath + '/seu/yzb/:type', require('./routes/universities/seu/yzb'));
router.get(config.urlPath + '/seu/cse/:type?', require('./routes/universities/seu/cse'));

// 南京工业大学
router.get(config.urlPath + '/njtech/jwc', require('./routes/universities/njtech/jwc'));

// 南京航空航天大学
router.get(config.urlPath + '/nuaa/jwc/:type?', require('./routes/universities/nuaa/jwc/jwc'));
router.get(config.urlPath + '/nuaa/cs/:type?', require('./routes/universities/nuaa/cs/index'));
router.get(config.urlPath + '/nuaa/yjsy/:type?', require('./routes/universities/nuaa/yjsy/yjsy'));

// 哈尔滨工业大学
router.get(config.urlPath + '/hit/jwc', require('./routes/universities/hit/jwc'));
router.get(config.urlPath + '/hit/today/:category', require('./routes/universities/hit/today'));

// 哈尔滨工业大学（威海）
router.get(config.urlPath + '/hitwh/today', require('./routes/universities/hitwh/today'));

// 上海科技大学
router.get(config.urlPath + '/shanghaitech/activity', require('./routes/universities/shanghaitech/activity'));
router.get(config.urlPath + '/shanghaitech/sist/activity', require('./routes/universities/shanghaitech/sist/activity'));

// 上海交通大学
router.get(config.urlPath + '/sjtu/seiee/academic', require('./routes/universities/sjtu/seiee/academic'));
router.get(config.urlPath + '/sjtu/seiee/bjwb/:type', require('./routes/universities/sjtu/seiee/bjwb'));
router.get(config.urlPath + '/sjtu/seiee/xsb/:type?', require('./routes/universities/sjtu/seiee/xsb'));

router.get(config.urlPath + '/sjtu/gs/tzgg/:type?', require('./routes/universities/sjtu/gs/tzgg'));
router.get(config.urlPath + '/sjtu/jwc/:type?', require('./routes/universities/sjtu/jwc'));
router.get(config.urlPath + '/sjtu/tongqu', require('./routes/universities/sjtu/tongqu/activity'));
router.get(config.urlPath + '/sjtu/yzb/zkxx/:type', require('./routes/universities/sjtu/yzb/zkxx'));

// 江南大学
router.get(config.urlPath + '/ju/jwc/:type?', require('./routes/universities/ju/jwc'));

// 洛阳理工学院
router.get(config.urlPath + '/lit/jwc', require('./routes/universities/lit/jwc'));
router.get(config.urlPath + '/lit/xwzx/:name?', require('./routes/universities/lit/xwzx'));
router.get(config.urlPath + '/lit/tw/:name?', require('./routes/universities/lit/tw'));

// 清华大学
router.get(config.urlPath + '/thu/career', require('./routes/universities/thu/career'));
router.get(config.urlPath + '/thu/:type', require('./routes/universities/thu/index'));

// 北京大学
router.get(config.urlPath + '/pku/eecs/:type?', require('./routes/universities/pku/eecs'));
router.get(config.urlPath + '/pku/rccp/mzyt', require('./routes/universities/pku/rccp/mzyt'));
router.get(config.urlPath + '/pku/cls/lecture', require('./routes/universities/pku/cls/lecture'));
router.get(config.urlPath + '/pku/bbs/hot', require('./routes/universities/pku/bbs/hot'));

// 上海海事大学
router.get(config.urlPath + '/shmtu/www/:type', require('./routes/universities/shmtu/www'));
router.get(config.urlPath + '/shmtu/jwc/:type', require('./routes/universities/shmtu/jwc'));

// 西南科技大学
router.get(config.urlPath + '/swust/jwc/news', require('./routes/universities/swust/jwc_news'));
router.get(config.urlPath + '/swust/jwc/notice/:type?', require('./routes/universities/swust/jwc_notice'));
router.get(config.urlPath + '/swust/cs/:type?', require('./routes/universities/swust/cs'));

// 华南师范大学
router.get(config.urlPath + '/scnu/jw', require('./routes/universities/scnu/jw'));
router.get(config.urlPath + '/scnu/library', require('./routes/universities/scnu/library'));
router.get(config.urlPath + '/scnu/cs/match', require('./routes/universities/scnu/cs/match'));

// 广东工业大学
router.get(config.urlPath + '/gdut/news', require('./routes/universities/gdut/news'));

// 中国科学院
router.get(config.urlPath + '/cas/sim/academic', require('./routes/universities/cas/sim/academic'));

// 中国传媒大学
router.get(config.urlPath + '/cuc/yz', require('./routes/universities/cuc/yz'));

// 南京邮电大学
router.get(config.urlPath + '/njupt/jwc/:type?', require('./routes/universities/njupt/jwc'));

// 南昌航空大学
router.get(config.urlPath + '/nchu/jwc/:type?', require('./routes/universities/nchu/jwc'));

// 哈尔滨工程大学
router.get(config.urlPath + '/heu/ugs/news/:author?/:category?', require('./routes/universities/heu/ugs/news'));
router.get(config.urlPath + '/heu/yjsy/:type?', require('./routes/universities/heu/yjsy'));
router.get(config.urlPath + '/heu/gongxue/:type?', require('./routes/universities/heu/news'));
router.get(config.urlPath + '/heu/news/:type?', require('./routes/universities/heu/news'));
router.get(config.urlPath + '/heu/shuisheng/:type?', require('./routes/universities/heu/uae'));
router.get(config.urlPath + '/heu/uae/:type?', require('./routes/universities/heu/uae'));
router.get(config.urlPath + '/heu/job/:type?', require('./routes/universities/heu/job'));

// 重庆大学
router.get(config.urlPath + '/cqu/jwc/announcement', require('./routes/universities/cqu/jwc/announcement'));
router.get(config.urlPath + '/cqu/news/jzyg', require('./routes/universities/cqu/news/jzyg'));
router.get(config.urlPath + '/cqu/youth/:category', require('./routes/universities/cqu/youth/info'));
router.get(config.urlPath + '/cqu/sci/:category', require('./routes/universities/cqu/sci/info'));
router.get(config.urlPath + '/cqu/net/:category', require('./routes/universities/cqu/net/info'));

// 南京信息工程大学
router.get(config.urlPath + '/nuist/bulletin/:category?', require('./routes/universities/nuist/bulletin'));
router.get(config.urlPath + '/nuist/jwc/:category?', require('./routes/universities/nuist/jwc'));
router.get(config.urlPath + '/nuist/yjs/:category?', require('./routes/universities/nuist/yjs'));
router.get(config.urlPath + '/nuist/xgc', require('./routes/universities/nuist/xgc'));
router.get(config.urlPath + '/nuist/scs/:category?', require('./routes/universities/nuist/scs'));
router.get(config.urlPath + '/nuist/lib', require('./routes/universities/nuist/library/lib'));
router.get(config.urlPath + '/nuist/sese/:category?', require('./routes/universities/nuist/sese'));
router.get(config.urlPath + '/nuist/cas/:category?', require('./routes/universities/nuist/cas'));

// 成都信息工程大学
router.get(config.urlPath + '/cuit/cxxww/:type?', require('./routes/universities/cuit/cxxww'));

// 郑州大学
router.get(config.urlPath + '/zzu/news/:type', require('./routes/universities/zzu/news'));
router.get(config.urlPath + '/zzu/soft/news/:type', require('./routes/universities/zzu/soft/news'));

// 重庆科技学院
router.get(config.urlPath + '/cqust/jw/:type?', require('./routes/universities/cqust/jw'));
router.get(config.urlPath + '/cqust/lib/:type?', require('./routes/universities/cqust/lib'));

// 常州大学
router.get(config.urlPath + '/cczu/jwc/:category?', require('./routes/universities/cczu/jwc'));
router.get(config.urlPath + '/cczu/news/:category?', require('./routes/universities/cczu/news'));

// 南京理工大学
router.get(config.urlPath + '/njust/jwc/:type', require('./routes/universities/njust/jwc'));
router.get(config.urlPath + '/njust/cwc/:type', require('./routes/universities/njust/cwc'));
router.get(config.urlPath + '/njust/gs/:type', require('./routes/universities/njust/gs'));
router.get(config.urlPath + '/njust/eo/:grade?/:type?', require('./routes/universities/njust/eo'));

// 四川旅游学院
router.get(config.urlPath + '/sctu/xgxy', require('./routes/universities/sctu/information-engineer-faculty/index'));
router.get(config.urlPath + '/sctu/xgxy/:id', require('./routes/universities/sctu/information-engineer-faculty/context'));
router.get(config.urlPath + '/sctu/jwc/:type?', require('./routes/universities/sctu/jwc/index'));
router.get(config.urlPath + '/sctu/jwc/:type/:id', require('./routes/universities/sctu/jwc/context'));

// 电子科技大学
router.get(config.urlPath + '/uestc/jwc/:type?', require('./routes/universities/uestc/jwc'));
router.get(config.urlPath + '/uestc/news/:type?', require('./routes/universities/uestc/news'));
router.get(config.urlPath + '/uestc/auto/:type?', require('./routes/universities/uestc/auto'));
router.get(config.urlPath + '/uestc/cs/:type?', require('./routes/universities/uestc/cs'));

// 昆明理工大学
router.get(config.urlPath + '/kmust/jwc/:type?', require('./routes/universities/kmust/jwc'));
router.get(config.urlPath + '/kmust/job/careers/:type?', require('./routes/universities/kmust/job/careers'));
router.get(config.urlPath + '/kmust/job/jobfairs', require('./routes/universities/kmust/job/jobfairs'));

// 武汉大学
router.get(config.urlPath + '/whu/cs/:type', require('./routes/universities/whu/cs'));
router.get(config.urlPath + '/whu/news/:type?', require('./routes/universities/whu/news'));

// 华中科技大学
router.get(config.urlPath + '/hust/auto/notice/:type?', require('./routes/universities/hust/aia/notice'));
router.get(config.urlPath + '/hust/auto/news', require('./routes/universities/hust/aia/news'));
router.get(config.urlPath + '/hust/aia/news', require('./routes/universities/hust/aia/news'));
router.get(config.urlPath + '/hust/aia/notice/:type?', require('./routes/universities/hust/aia/notice'));

// 井冈山大学
router.get(config.urlPath + '/jgsu/jwc', require('./routes/universities/jgsu/jwc'));

// 中南大学
router.get(config.urlPath + '/csu/job/:type?', require('./routes/universities/csu/job'));

// 山东大学
router.get(config.urlPath + '/sdu/sc/:type?', require('./routes/universities/sdu/sc'));
router.get(config.urlPath + '/sdu/cs/:type?', require('./routes/universities/sdu/cs'));
router.get(config.urlPath + '/sdu/cmse/:type?', require('./routes/universities/sdu/cmse'));
router.get(config.urlPath + '/sdu/mech/:type?', require('./routes/universities/sdu/mech'));
router.get(config.urlPath + '/sdu/epe/:type?', require('./routes/universities/sdu/epe'));

// 中国海洋大学
router.get(config.urlPath + '/ouc/it/:type?', require('./routes/universities/ouc/it'));

// 大连大学
router.get(config.urlPath + '/dlu/jiaowu/news', require('./routes/universities/dlu/jiaowu/news'));

// 东莞理工学院
router.get(config.urlPath + '/dgut/jwc/:type?', require('./routes/universities/dgut/jwc'));
router.get(config.urlPath + '/dgut/xsc/:type?', require('./routes/universities/dgut/xsc'));

// 同济大学
router.get(config.urlPath + '/tju/sse/:type?', require('./routes/universities/tju/sse/notice'));

// 华南理工大学
router.get(config.urlPath + '/scut/jwc/notice/:category?', require('./routes/universities/scut/jwc/notice'));
router.get(config.urlPath + '/scut/jwc/news', require('./routes/universities/scut/jwc/news'));

// 温州商学院
router.get(config.urlPath + '/wzbc/:type?', require('./routes/universities/wzbc/news'));

// 河南大学
router.get(config.urlPath + '/henu/:type?', require('./routes/universities/henu/news'));

// 天津大学
router.get(config.urlPath + '/tjpyu/ooa/:type?', require('./routes/universities/tjpyu/ooa'));

// 南开大学
router.get(config.urlPath + '/nku/jwc/:type?', require('./routes/universities/nku/jwc/index'));

// 北京航空航天大学
router.get(config.urlPath + '/buaa/news/:type', require('./routes/universities/buaa/news/index'));

// 浙江工业大学
router.get(config.urlPath + '/zjut/:type', require('./routes/universities/zjut/index'));

// 上海大学
router.get(config.urlPath + '/shu/jwc/:type?', require('./routes/universities/shu/jwc'));

// 北京科技大学天津学院
router.get(config.urlPath + '/ustb/tj/news/:type?', require('./routes/universities/ustb/tj/news'));

// 深圳大学
router.get(config.urlPath + '/szu/yz/:type?', require('./routes/universities/szu/yz'));

// 中国石油大学（华东）
router.get(config.urlPath + '/upc/main/:type?', require('./routes/universities/upc/main'));
router.get(config.urlPath + '/upc/jsj/:type?', require('./routes/universities/upc/jsj'));

// 华北水利水电大学
router.get(config.urlPath + '/ncwu/notice', require('./routes/universities/ncwu/notice'));

// 中北大学
router.get(config.urlPath + '/nuc/:type', require('./routes/universities/nuc/index'));

// 安徽农业大学
router.get(config.urlPath + '/ahau/cs_news/:type', require('./routes/universities/ahau/cs_news/index'));
router.get(config.urlPath + '/ahau/jwc/:type', require('./routes/universities/ahau/jwc/index'));
router.get(config.urlPath + '/ahau/main/:type', require('./routes/universities/ahau/main/index'));

// 安徽医科大学研究生学院
router.get(config.urlPath + '/ahmu/news', require('./routes/universities/ahmu/news'));

// 安徽工业大学
router.get(config.urlPath + '/ahut/news', require('./routes/universities/ahut/news'));
router.get(config.urlPath + '/ahut/jwc', require('./routes/universities/ahut/jwc'));
router.get(config.urlPath + '/ahut/cstzgg', require('./routes/universities/ahut/cstzgg'));

// 上海理工大学
router.get(config.urlPath + '/usst/jwc', require('./routes/universities/usst/jwc'));

// ifanr
router.get(config.urlPath + '/ifanr/:channel?', require('./routes/ifanr/index'));

// 果壳网
router.get(config.urlPath + '/guokr/scientific', require('./routes/guokr/scientific'));
router.get(config.urlPath + '/guokr/:channel', require('./routes/guokr/calendar'));

// 联合早报
router.get(config.urlPath + '/zaobao/realtime/:section?', require('./routes/zaobao/realtime'));
router.get(config.urlPath + '/zaobao/znews/:section?', require('./routes/zaobao/znews'));
router.get(config.urlPath + '/zaobao/:type/:section', require('./routes/zaobao/index'));

// Apple
router.get(config.urlPath + '/apple/exchange_repair/:country?', require('./routes/apple/exchange_repair'));

// IPSW.me
router.get(config.urlPath + '/ipsw/index/:ptype/:pname', require('./routes/ipsw/index'));

// Minecraft CurseForge
router.get(config.urlPath + '/curseforge/files/:project', require('./routes/curseforge/files'));

// 少数派 sspai
router.get(config.urlPath + '/sspai/series', require('./routes/sspai/series'));
router.get(config.urlPath + '/sspai/shortcuts', require('./routes/sspai/shortcutsGallery'));
router.get(config.urlPath + '/sspai/matrix', require('./routes/sspai/matrix'));
router.get(config.urlPath + '/sspai/column/:id', require('./routes/sspai/column'));
router.get(config.urlPath + '/sspai/author/:id', require('./routes/sspai/author'));
router.get(config.urlPath + '/sspai/topics', require('./routes/sspai/topics'));
router.get(config.urlPath + '/sspai/topic/:id', require('./routes/sspai/topic'));
router.get(config.urlPath + '/sspai/tag/:keyword', require('./routes/sspai/tag'));
router.get(config.urlPath + '/sspai/activity/:slug', require('./routes/sspai/activity'));

// 异次元软件世界
router.get(config.urlPath + '/iplay/home', require('./routes/iplay/home'));

// xclient.info
router.get(config.urlPath + '/xclient/app/:name', require('./routes/xclient/app'));

// 中国驻外使领事馆
router.get(config.urlPath + '/embassy/:country/:city?', require('./routes/embassy/index'));

// 澎湃新闻
router.get(config.urlPath + '/thepaper/featured', require('./routes/thepaper/featured'));
router.get(config.urlPath + '/thepaper/channel/:id', require('./routes/thepaper/channel'));

// 澎湃美数课
router.get(config.urlPath + '/thepaper/839studio', require('./routes/thepaper/839studio/studio.js'));
router.get(config.urlPath + '/thepaper/839studio/:id', require('./routes/thepaper/839studio/category.js'));

// 电影首发站
router.get(config.urlPath + '/dysfz', require('./routes/dysfz/index'));
router.get(config.urlPath + '/dysfz/index', require('./routes/dysfz/index')); // 废弃

// きららファンタジア
router.get(config.urlPath + '/kirara/news', require('./routes/kirara/news'));

// 电影天堂
router.get(config.urlPath + '/dytt', require('./routes/dytt/index'));
router.get(config.urlPath + '/dytt/index', require('./routes/dytt/index')); // 废弃

// BT之家
router.get(config.urlPath + '/btzj/:type?', require('./routes/btzj/index'));

// 人生05电影网
router.get(config.urlPath + '/rs05/rs05', require('./routes/rs05/rs05'));

// 人人影视 (评测推荐)
router.get(config.urlPath + '/rrys/review', require('./routes/rrys/review'));

// 趣头条
router.get(config.urlPath + '/qutoutiao/category/:cid', require('./routes/qutoutiao/category'));

// NHK NEW WEB EASY
router.get(config.urlPath + '/nhk/news_web_easy', require('./routes/nhk/news_web_easy'));

// BBC
router.get(config.urlPath + '/bbc/:channel?', require('./routes/bbc/index'));

// FT 中文网
router.get(config.urlPath + '/ft/:language/:channel?', require('./routes/ft/channel'));

// The Verge
router.get(config.urlPath + '/verge', require('./routes/verge/index'));

// 看雪
router.get(config.urlPath + '/pediy/topic/:category?/:type?', require('./routes/pediy/topic'));

// 观止（每日一文）
router.get(config.urlPath + '/guanzhi', require('./routes/guanzhi/guanzhi'));

// 多维新闻网
router.get(config.urlPath + '/dwnews/yaowen/:region?', require('./routes/dwnews/yaowen'));
router.get(config.urlPath + '/dwnews/rank/:type?/:range?', require('./routes/dwnews/rank'));

// 知晓程序
router.get(config.urlPath + '/miniapp/article/:category', require('./routes/miniapp/article'));
router.get(config.urlPath + '/miniapp/store/newest', require('./routes/miniapp/store/newest'));

// 后续
router.get(config.urlPath + '/houxu/live/:id/:timeline?', require('./routes/houxu/live'));
router.get(config.urlPath + '/houxu/events', require('./routes/houxu/events'));
router.get(config.urlPath + '/houxu/lives/:type', require('./routes/houxu/lives'));

// 老司机
router.get(config.urlPath + '/laosiji/hot', require('./routes/laosiji/hot'));
router.get(config.urlPath + '/laosiji/feed', require('./routes/laosiji/feed'));
router.get(config.urlPath + '/laosiji/hotshow/:id', require('./routes/laosiji/hotshow'));

// Scientific American 60-Second Science
router.get(config.urlPath + '/60s-science/transcript', require('./routes/60s-science/transcript'));

// 99% Invisible
router.get(config.urlPath + '/99percentinvisible/transcript', require('./routes/99percentinvisible/transcript'));

// 青空文庫
router.get(config.urlPath + '/aozora/newbook/:count?', require('./routes/aozora/newbook'));

// solidot
router.get(config.urlPath + '/solidot/:type?', require('./routes/solidot/main'));

// Hermes UK
router.get(config.urlPath + '/parcel/hermesuk/:tracking', require('./routes/parcel/hermesuk'));

// 数字尾巴
router.get(config.urlPath + '/dgtle', require('./routes/dgtle/index'));
router.get(config.urlPath + '/dgtle/whale/category/:category', require('./routes/dgtle/whale'));
router.get(config.urlPath + '/dgtle/whale/rank/:type/:rule', require('./routes/dgtle/whale_rank'));
router.get(config.urlPath + '/dgtle/trade/:typeId?', require('./routes/dgtle/trade'));
router.get(config.urlPath + '/dgtle/trade/search/:keyword', require('./routes/dgtle/keyword'));

// 抽屉新热榜
router.get(config.urlPath + '/chouti/top/:hour?', require('./routes/chouti/top'));
router.get(config.urlPath + '/chouti/:subject?', require('./routes/chouti'));

// 西安电子科技大学
router.get(config.urlPath + '/xidian/jwc/:category?', require('./routes/universities/xidian/jwc'));

// Westore
router.get(config.urlPath + '/westore/new', require('./routes/westore/new'));

// 优酷
router.get(config.urlPath + '/youku/channel/:channelId/:embed?', require('./routes/youku/channel'));

// 油价
router.get(config.urlPath + '/oilprice/:area', require('./routes/oilprice'));

// nHentai
router.get(config.urlPath + '/nhentai/search/:keyword/:mode?', require('./routes/nhentai/search'));
router.get(config.urlPath + '/nhentai/:key/:keyword/:mode?', require('./routes/nhentai/other'));

// 龙腾网
router.get(config.urlPath + '/ltaaa/:type?', require('./routes/ltaaa/main'));

// AcFun
router.get(config.urlPath + '/acfun/bangumi/:id', require('./routes/acfun/bangumi'));
router.get(config.urlPath + '/acfun/user/video/:uid', require('./routes/acfun/video'));

// Auto Trader
router.get(config.urlPath + '/autotrader/:query', require('./routes/autotrader'));

// 极客公园
router.get(config.urlPath + '/geekpark/breakingnews', require('./routes/geekpark/breakingnews'));

// 百度
router.get(config.urlPath + '/baidu/doodles', require('./routes/baidu/doodles'));
router.get(config.urlPath + '/baidu/topwords/:boardId?', require('./routes/baidu/topwords'));
router.get(config.urlPath + '/baidu/daily', require('./routes/baidu/daily'));

// 搜狗
router.get(config.urlPath + '/sogou/doodles', require('./routes/sogou/doodles'));

// 香港天文台
router.get(config.urlPath + '/hko/weather', require('./routes/hko/weather'));

// sankakucomplex
router.get(config.urlPath + '/sankakucomplex/post', require('./routes/sankakucomplex/post'));

// 技术头条
router.get(config.urlPath + '/blogread/newest', require('./routes/blogread/newest'));

// gnn游戏新闻
router.get(config.urlPath + '/gnn/gnn', require('./routes/gnn/gnn'));

// a9vg游戏新闻
router.get(config.urlPath + '/a9vg/a9vg', require('./routes/a9vg/a9vg'));

// IT桔子
router.get(config.urlPath + '/itjuzi/invest', require('./routes/itjuzi/invest'));
router.get(config.urlPath + '/itjuzi/merge', require('./routes/itjuzi/merge'));

// 探物
router.get(config.urlPath + '/tanwu/products', require('./routes/tanwu/products'));

// GitChat
router.get(config.urlPath + '/gitchat/newest/:category?/:selected?', require('./routes/gitchat/newest'));

// The Guardian
router.get(config.urlPath + '/guardian/:type', require('./routes/guardian/guardian'));

// 下厨房
router.get(config.urlPath + '/xiachufang/user/cooked/:id', require('./routes/xiachufang/user/cooked'));
router.get(config.urlPath + '/xiachufang/user/created/:id', require('./routes/xiachufang/user/created'));
router.get(config.urlPath + '/xiachufang/popular/:timeframe?', require('./routes/xiachufang/popular'));

// 经济观察报
router.get(config.urlPath + '/eeo/:category?', require('./routes/eeo/index'));

// 腾讯视频
router.get(config.urlPath + '/tencentvideo/playlist/:id', require('./routes/tencent/video/playlist'));

// 看漫画
router.get(config.urlPath + '/manhuagui/comic/:id', require('./routes/manhuagui/comic'));
// 動漫狂
router.get(config.urlPath + '/cartoonmad/comic/:id', require('./routes/cartoonmad/comic'));
// Vol
router.get(config.urlPath + '/vol/:mode?', require('./routes/vol/lastupdate'));
// 咚漫
router.get(config.urlPath + '/dongmanmanhua/:category/:name/:id', require('./routes/dongmanmanhua/comic'));
// webtoons
router.get(config.urlPath + '/webtoons/:lang/:category/:name/:id', require('./routes/webtoons/comic'));
router.get(config.urlPath + '/webtoons/naver/:id', require('./routes/webtoons/naver'));

// Tits Guru
router.get(config.urlPath + '/tits-guru/home', require('./routes/titsguru/home'));
router.get(config.urlPath + '/tits-guru/daily', require('./routes/titsguru/daily'));
router.get(config.urlPath + '/tits-guru/category/:type', require('./routes/titsguru/category'));
router.get(config.urlPath + '/tits-guru/model/:name', require('./routes/titsguru/model'));

// typora
router.get(config.urlPath + '/typora/changelog', require('./routes/typora/changelog'));

// TSSstatus
router.get(config.urlPath + '/tssstatus/:board/:build', require('./routes/tssstatus'));

// Anime1
router.get(config.urlPath + '/anime1/anime/:time/:name', require('./routes/anime1/anime'));
router.get(config.urlPath + '/anime1/search/:keyword', require('./routes/anime1/search'));

// gitea
router.get(config.urlPath + '/gitea/blog', require('./routes/gitea/blog'));

// iDownloadBlog
router.get(config.urlPath + '/idownloadblog', require('./routes/idownloadblog/index'));

// 9to5
router.get(config.urlPath + '/9to5/:subsite/:tag?', require('./routes/9to5/subsite'));

// TesterHome
router.get(config.urlPath + '/testerhome/newest', require('./routes/testerhome/newest'));

// 刷屏
router.get(config.urlPath + '/weseepro/newest', require('./routes/weseepro/newest'));
router.get(config.urlPath + '/weseepro/newest-direct', require('./routes/weseepro/newest-direct'));
router.get(config.urlPath + '/weseepro/circle', require('./routes/weseepro/circle'));

// 玩物志
router.get(config.urlPath + '/coolbuy/newest', require('./routes/coolbuy/newest'));

// NGA
router.get(config.urlPath + '/nga/forum/:fid/:recommend?', require('./routes/nga/forum'));
router.get(config.urlPath + '/nga/post/:tid', require('./routes/nga/post'));

// Nautilus
router.get(config.urlPath + '/nautilus/topic/:tid', require('./routes/nautilus/topics'));

// JavBus
router.get(config.urlPath + '/javbus/home', require('./routes/javbus/home'));
router.get(config.urlPath + '/javbus/genre/:gid', require('./routes/javbus/genre'));
router.get(config.urlPath + '/javbus/star/:sid', require('./routes/javbus/star'));
router.get(config.urlPath + '/javbus/series/:seriesid', require('./routes/javbus/series'));
router.get(config.urlPath + '/javbus/uncensored/home', require('./routes/javbus/uncensored/home'));
router.get(config.urlPath + '/javbus/uncensored/genre/:gid', require('./routes/javbus/uncensored/genre'));
router.get(config.urlPath + '/javbus/uncensored/star/:sid', require('./routes/javbus/uncensored/star'));
router.get(config.urlPath + '/javbus/uncensored/series/:seriesid', require('./routes/javbus/uncensored/series'));
router.get(config.urlPath + '/javbus/western/home', require('./routes/javbus/western/home'));
router.get(config.urlPath + '/javbus/western/genre/:gid', require('./routes/javbus/western/genre'));
router.get(config.urlPath + '/javbus/western/star/:sid', require('./routes/javbus/western/star'));
router.get(config.urlPath + '/javbus/western/series/:seriesid', require('./routes/javbus/western/series'));

// 中山大学
router.get(config.urlPath + '/sysu/sdcs', require('./routes/universities/sysu/sdcs'));

// 動畫瘋
router.get(config.urlPath + '/anigamer/new_anime', require('./routes/anigamer/new_anime'));
router.get(config.urlPath + '/anigamer/anime/:sn', require('./routes/anigamer/anime'));

// Apkpure
router.get(config.urlPath + '/apkpure/versions/:region/:pkg', require('./routes/apkpure/versions'));

// 豆瓣美女
router.get(config.urlPath + '/dbmv/:category?', require('./routes/dbmv/index'));

// 中国药科大学
router.get(config.urlPath + '/cpu/home', require('./routes/universities/cpu/home'));
router.get(config.urlPath + '/cpu/jwc', require('./routes/universities/cpu/jwc'));
router.get(config.urlPath + '/cpu/yjsy', require('./routes/universities/cpu/yjsy'));

// 字幕组
router.get(config.urlPath + '/zimuzu/resource/:id?', require('./routes/zimuzu/resource'));

// 虎嗅
router.get(config.urlPath + '/huxiu/tag/:id', require('./routes/huxiu/tag'));
router.get(config.urlPath + '/huxiu/search/:keyword', require('./routes/huxiu/search'));
router.get(config.urlPath + '/huxiu/author/:id', require('./routes/huxiu/author'));
router.get(config.urlPath + '/huxiu/article', require('./routes/huxiu/article'));
router.get(config.urlPath + '/huxiu/collection/:id', require('./routes/huxiu/collection'));

// Steam
router.get(config.urlPath + '/steam/search/:params', require('./routes/steam/search'));
router.get(config.urlPath + '/steam/news/:appids', require('./routes/steam/news'));

// Steamgifts
router.get(config.urlPath + '/steamgifts/discussions/:category?', require('./routes/steam/steamgifts/discussions'));

// 扇贝
router.get(config.urlPath + '/shanbay/checkin/:id', require('./routes/shanbay/checkin'));
router.get(config.urlPath + '/shanbay/footprints/:category?', require('./routes/shanbay/footprints'));

// Facebook
router.get(config.urlPath + '/facebook/page/:id', require('./routes/facebook/page'));

// 币乎
router.get(config.urlPath + '/bihu/activaties/:id', require('./routes/bihu/activaties'));

// 停电通知
router.get(config.urlPath + '/tingdiantz/nanjing', require('./routes/tingdiantz/nanjing'));

// 36kr
router.get(config.urlPath + '/36kr/search/article/:keyword', require('./routes/36kr/search/article'));
router.get(config.urlPath + '/36kr/newsflashes', require('./routes/36kr/newsflashes'));
router.get(config.urlPath + '/36kr/news/:caty', require('./routes/36kr/news'));
router.get(config.urlPath + '/36kr/user/:uid', require('./routes/36kr/user'));
router.get(config.urlPath + '/36kr/motif/:mid', require('./routes/36kr/motif'));

// PMCAFF
router.get(config.urlPath + '/pmcaff/list/:typeid', require('./routes/pmcaff/list'));
router.get(config.urlPath + '/pmcaff/feed/:typeid', require('./routes/pmcaff/feed'));
router.get(config.urlPath + '/pmcaff/user/:userid', require('./routes/pmcaff/user'));

// icourse163
router.get(config.urlPath + '/icourse163/newest', require('./routes/icourse163/newest'));

// patchwork.kernel.org
router.get(config.urlPath + '/patchwork.kernel.org/comments/:id', require('./routes/patchwork.kernel.org/comments'));

// 京东众筹
router.get(config.urlPath + '/jingdong/zhongchou/:type/:status/:sort', require('./routes/jingdong/zhongchou'));

// 淘宝众筹
router.get(config.urlPath + '/taobao/zhongchou/:type?', require('./routes/taobao/zhongchou'));

// All Poetry
router.get(config.urlPath + '/allpoetry/:order?', require('./routes/allpoetry/order'));

// 华尔街见闻
router.get(config.urlPath + '/wallstreetcn/news/global', require('./routes/wallstreetcn/news'));

// 多抓鱼搜索
router.get(config.urlPath + '/duozhuayu/search/:wd', require('./routes/duozhuayu/search'));

// 创业邦
router.get(config.urlPath + '/cyzone/author/:id', require('./routes/cyzone/author'));
router.get(config.urlPath + '/cyzone/label/:name', require('./routes/cyzone/label'));

// 政府
router.get(config.urlPath + '/gov/zhengce/zuixin', require('./routes/gov/zhengce/zuixin'));
router.get(config.urlPath + '/gov/zhengce/wenjian/:pcodeJiguan?', require('./routes/gov/zhengce/wenjian'));
router.get(config.urlPath + '/gov/zhengce/govall/:advance?', require('./routes/gov/zhengce/govall'));
router.get(config.urlPath + '/gov/province/:name/:category', require('./routes/gov/province'));
router.get(config.urlPath + '/gov/city/:name/:category', require('./routes/gov/city'));
router.get(config.urlPath + '/gov/statecouncil/briefing', require('./routes/gov/statecouncil/briefing'));
router.get(config.urlPath + '/gov/news/:uid', require('./routes/gov/news'));

// 苏州
router.get(config.urlPath + '/gov/suzhou/news/:uid', require('./routes/gov/suzhou/news'));
router.get(config.urlPath + '/gov/suzhou/doc', require('./routes/gov/suzhou/doc'));

// 江苏
router.get(config.urlPath + '/gov/jiangsu/eea/:type?', require('./routes/gov/jiangsu/eea'));

// 山西
router.get(config.urlPath + '/gov/shanxi/rst/:category', require('./routes/gov/shanxi/rst'));

// 湖南
router.get(config.urlPath + '/gov/hunan/notice/:type', require('./routes/gov/hunan/notice'));

// 中华人民共和国-海关总署
router.get(config.urlPath + '/gov/customs/list/:gchannel', require('./routes/gov/customs/list'));

// 中华人民共和国生态环境部
router.get(config.urlPath + '/gov/mee/gs', require('./routes/gov/mee/gs'));

// 中华人民共和国教育部
router.get(config.urlPath + '/gov/moe/:type', require('./routes/gov/moe/moe'));

// 中华人民共和国外交部
router.get(config.urlPath + '/gov/fmprc/fyrbt', require('./routes/gov/fmprc/fyrbt'));

// 中华人民共和国住房和城乡建设部
router.get(config.urlPath + '/gov/mohurd/policy', require('./routes/gov/mohurd/policy'));

// 国家新闻出版广电总局
router.get(config.urlPath + '/gov/sapprft/approval/:channel/:detail?', require('./routes/gov/sapprft/7026'));

// 北京卫生健康委员会
router.get(config.urlPath + '/gov/beijing/mhc/:caty', require('./routes/gov/beijing/mhc'));

// 北京考试院
router.get(config.urlPath + '/gov/beijing/bjeea/:type', require('./routes/gov/beijing/eea'));

// 广东省教育厅
router.get(config.urlPath + '/gov/guangdong/edu/:caty', require('./routes/gov/guangdong/edu'));

// 小黑盒
router.get(config.urlPath + '/xiaoheihe/user/:id', require('./routes/xiaoheihe/user'));
router.get(config.urlPath + '/xiaoheihe/news', require('./routes/xiaoheihe/news'));
router.get(config.urlPath + '/xiaoheihe/discount/:platform?', require('./routes/xiaoheihe/discount'));

// 惠誉评级
router.get(config.urlPath + '/fitchratings/site/:type', require('./routes/fitchratings/site'));

// 移动支付
router.get(config.urlPath + '/mpaypass/news', require('./routes/mpaypass/news'));
router.get(config.urlPath + '/mpaypass/main/:type?', require('./routes/mpaypass/main'));

// 新浪科技探索
router.get(config.urlPath + '/sina/discovery/:type', require('./routes/sina/discovery'));

// 新浪科技滚动新闻
router.get(config.urlPath + '/sina/rollnews', require('./routes/sina/rollnews'));

// 新浪专栏创事记
router.get(config.urlPath + '/sina/csj', require('./routes/sina/chuangshiji'));

// 新浪财经－国內
router.get(config.urlPath + '/sina/finance', require('./routes/sina/finance'));

// Animen
router.get(config.urlPath + '/animen/news/:type', require('./routes/animen/news'));

// D2 资源库
router.get(config.urlPath + '/d2/daily', require('./routes/d2/daily'));

// ebb
router.get(config.urlPath + '/ebb', require('./routes/ebb'));

// Indienova
router.get(config.urlPath + '/indienova/:type', require('./routes/indienova/article'));

// JPMorgan Chase Institute
router.get(config.urlPath + '/jpmorganchase', require('./routes/jpmorganchase/research'));

// 美拍
router.get(config.urlPath + '/meipai/user/:uid', require('./routes/meipai/user'));

// 多知网
router.get(config.urlPath + '/duozhi', require('./routes/duozhi'));

// Docker Hub
router.get(config.urlPath + '/dockerhub/build/:owner/:image/:tag?', require('./routes/dockerhub/build'));

// 人人都是产品经理
router.get(config.urlPath + '/woshipm/popular', require('./routes/woshipm/popular'));
router.get(config.urlPath + '/woshipm/wen', require('./routes/woshipm/wen'));
router.get(config.urlPath + '/woshipm/bookmarks/:id', require('./routes/woshipm/bookmarks'));
router.get(config.urlPath + '/woshipm/user_article/:id', require('./routes/woshipm/user_article'));
router.get(config.urlPath + '/woshipm/latest', require('./routes/woshipm/latest'));

// 高清电台
router.get(config.urlPath + '/gaoqing/latest', require('./routes/gaoqing/latest'));

// 轻小说文库
router.get(config.urlPath + '/wenku8/chapter/:id', require('./routes/wenku8/chapter'));

// 鲸跃汽车
router.get(config.urlPath + '/whalegogo/home', require('./routes/whalegogo/home'));
router.get(config.urlPath + '/whalegogo/portal/:type_id/:tagid?', require('./routes/whalegogo/portal'));

// 爱思想
router.get(config.urlPath + '/aisixiang/column/:id', require('./routes/aisixiang/column'));
router.get(config.urlPath + '/aisixiang/ranking/:type?/:range?', require('./routes/aisixiang/ranking'));
router.get(config.urlPath + '/aisixiang/thinktank/:name/:type?', require('./routes/aisixiang/thinktank'));

// Hacker News
router.get(config.urlPath + '/hackernews/:section/:type?', require('./routes/hackernews/story'));

// LeetCode
router.get(config.urlPath + '/leetcode/articles', require('./routes/leetcode/articles'));
router.get(config.urlPath + '/leetcode/submission/us/:user', require('./routes/leetcode/check-us'));
router.get(config.urlPath + '/leetcode/submission/cn/:user', require('./routes/leetcode/check-cn'));

// segmentfault
router.get(config.urlPath + '/segmentfault/channel/:name', require('./routes/segmentfault/channel'));

// 虎扑
router.get(config.urlPath + '/hupu/bxj/:id/:order?', require('./routes/hupu/bbs'));
router.get(config.urlPath + '/hupu/bbs/:id/:order?', require('./routes/hupu/bbs'));

// 牛客网
router.get(config.urlPath + '/nowcoder/discuss/:type/:order', require('./routes/nowcoder/discuss'));
router.get(config.urlPath + '/nowcoder/schedule/:propertyId?/:typeId?', require('./routes/nowcoder/schedule'));

// Xiaomi.eu
router.get(config.urlPath + '/xiaomieu/releases', require('./routes/xiaomieu/releases'));

// sketch.com
router.get(config.urlPath + '/sketch/beta', require('./routes/sketch/beta'));
router.get(config.urlPath + '/sketch/updates', require('./routes/sketch/updates'));

// 每日安全
router.get(config.urlPath + '/security/pulses', require('./routes/security/pulses'));

// DoNews
router.get(config.urlPath + '/donews/:column?', require('./routes/donews/index'));

// WeGene
router.get(config.urlPath + '/wegene/column/:type/:category', require('./routes/wegene/column'));
router.get(config.urlPath + '/wegene/newest', require('./routes/wegene/newest'));

// instapaper
router.get(config.urlPath + '/instapaper/person/:name', require('./routes/instapaper/person'));

// UI 中国
router.get(config.urlPath + '/ui-cn/article', require('./routes/ui-cn/article'));
router.get(config.urlPath + '/ui-cn/user/:id', require('./routes/ui-cn/user'));

// Dcard
router.get(config.urlPath + '/dcard/:section/:type?', require('./routes/dcard/section'));

// 12306
router.get(config.urlPath + '/12306/zxdt/:id?', require('./routes/12306/zxdt'));

// 北京天文馆每日一图
router.get(config.urlPath + '/bjp/apod', require('./routes/bjp/apod'));

// 洛谷
router.get(config.urlPath + '/luogu/daily/:id?', require('./routes/luogu/daily'));
router.get(config.urlPath + '/luogu/contest', require('./routes/luogu/contest'));

// 决胜网
router.get(config.urlPath + '/juesheng', require('./routes/juesheng'));

// 播客IBCラジオ イヤーマイッタマイッタ
router.get(config.urlPath + '/maitta', require('./routes/maitta'));

// 一些博客
// 敬维-以认真的态度做完美的事情: https://jingwei.link/
router.get(config.urlPath + '/blogs/jingwei.link', require('./routes/blogs/jingwei_link'));

// 王垠的博客-当然我在扯淡
router.get(config.urlPath + '/blogs/wangyin', require('./routes/blogs/wangyin'));

// 王五四文集
router.get(config.urlPath + '/blogs/wang54/:id?', require('./routes/blogs/wang54'));

// 裏垢女子まとめ
router.get(config.urlPath + '/uraaka-joshi', require('./routes/uraaka-joshi/uraaka-joshi'));
router.get(config.urlPath + '/uraaka-joshi/:id', require('./routes/uraaka-joshi/uraaka-joshi-user'));

// 西祠胡同
router.get(config.urlPath + '/xici/:id?', require('./routes/xici'));

// 淘股吧论坛
router.get(config.urlPath + '/taoguba/index', require('./routes/taoguba/index'));
router.get(config.urlPath + '/taoguba/user/:uid', require('./routes/taoguba/user'));

// 今日热榜
router.get(config.urlPath + '/tophub/:id', require('./routes/tophub'));

// 游戏时光
router.get(config.urlPath + '/vgtime/news', require('./routes/vgtime/news.js'));
router.get(config.urlPath + '/vgtime/release', require('./routes/vgtime/release'));
router.get(config.urlPath + '/vgtime/keyword/:keyword', require('./routes/vgtime/keyword'));

// MP4吧
router.get(config.urlPath + '/mp4ba/:param', require('./routes/mp4ba'));

// anitama
router.get(config.urlPath + '/anitama/:channel?', require('./routes/anitama/channel'));

// 親子王國
router.get(config.urlPath + '/babykingdom/:id/:order?', require('./routes/babykingdom'));

// 四川大学
router.get(config.urlPath + '/scu/jwc/notice', require('./routes/universities/scu/jwc'));
router.get(config.urlPath + '/scu/xg/notice', require('./routes/universities/scu/xg'));

// 浙江工商大学
router.get(config.urlPath + '/zjgsu/tzgg', require('./routes/universities/zjgsu/tzgg/scripts'));
router.get(config.urlPath + '/zjgsu/gsgg', require('./routes/universities/zjgsu/gsgg/scripts'));
router.get(config.urlPath + '/zjgsu/xszq', require('./routes/universities/zjgsu/xszq/scripts'));

// 大众点评
router.get(config.urlPath + '/dianping/user/:id?', require('./routes/dianping/user'));

// 半月谈
router.get(config.urlPath + '/banyuetan/:name', require('./routes/banyuetan'));

// 人民日报
router.get(config.urlPath + '/people/opinion/:id', require('./routes/people/opinion'));
router.get(config.urlPath + '/people/env/:id', require('./routes/people/env'));
router.get(config.urlPath + '/people/xjpjh/:keyword?/:year?', require('./routes/people/xjpjh'));

// 北极星电力网
router.get(config.urlPath + '/bjx/huanbao', require('./routes/bjx/huanbao'));

// gamersky
router.get(config.urlPath + '/gamersky/news', require('./routes/gamersky/news'));
router.get(config.urlPath + '/gamersky/ent/:category', require('./routes/gamersky/ent'));

// 游研社
router.get(config.urlPath + '/yystv/category/:category', require('./routes/yystv/category'));

// psnine
router.get(config.urlPath + '/psnine/index', require('./routes/psnine/index'));
router.get(config.urlPath + '/psnine/shuzhe', require('./routes/psnine/shuzhe'));
router.get(config.urlPath + '/psnine/trade', require('./routes/psnine/trade'));
router.get(config.urlPath + '/psnine/game', require('./routes/psnine/game'));
router.get(config.urlPath + '/psnine/news', require('./routes/psnine/news'));

// 浙江大学
router.get(config.urlPath + '/zju/list/:type', require('./routes/universities/zju/list'));
router.get(config.urlPath + '/zju/physics/:type', require('./routes/universities/zju/physics'));
router.get(config.urlPath + '/zju/grs/:type', require('./routes/universities/zju/grs'));
router.get(config.urlPath + '/zju/career/:type', require('./routes/universities/zju/career'));
router.get(config.urlPath + '/zju/cst/:type', require('./routes/universities/zju/cst'));

// 浙江大学城市学院
router.get(config.urlPath + '/zucc/news/latest', require('./routes/universities/zucc/news'));
router.get(config.urlPath + '/zucc/cssearch/latest/:webVpn/:key', require('./routes/universities/zucc/cssearch'));

// 华中师范大学
router.get(config.urlPath + '/ccnu/career', require('./routes/universities/ccnu/career'));

// Infoq
router.get(config.urlPath + '/infoq/recommend', require('./routes/infoq/recommend'));
router.get(config.urlPath + '/infoq/topic/:id', require('./routes/infoq/topic'));

// checkee
router.get(config.urlPath + '/checkee/:dispdate', require('./routes/checkee/index'));

// 艾瑞
router.get(config.urlPath + '/iresearch/report', require('./routes/iresearch/report'));

// ZAKER
router.get(config.urlPath + '/zaker/:type/:id', require('./routes/zaker/source'));
router.get(config.urlPath + '/zaker/focusread', require('./routes/zaker/focusread'));

// Matters
router.get(config.urlPath + '/matters/topics', require('./routes/matters/topics'));
router.get(config.urlPath + '/matters/latest', require('./routes/matters/latest'));
router.get(config.urlPath + '/matters/hot', require('./routes/matters/hot'));
router.get(config.urlPath + '/matters/tags/:tid', require('./routes/matters/tags'));
router.get(config.urlPath + '/matters/author/:uid', require('./routes/matters/author'));

// MobData
router.get(config.urlPath + '/mobdata/report', require('./routes/mobdata/report'));

// 谷雨
router.get(config.urlPath + '/tencent/guyu/channel/:name', require('./routes/tencent/guyu/channel'));

// 古诗文网
router.get(config.urlPath + '/gushiwen/recommend', require('./routes/gushiwen/recommend'));

// 电商在线
router.get(config.urlPath + '/imaijia/category/:category', require('./routes/imaijia/category'));

// 21财经
router.get(config.urlPath + '/21caijing/channel/:name', require('./routes/21caijing/channel'));

// 北京邮电大学
router.get(config.urlPath + '/bupt/yz/:type', require('./routes/universities/bupt/yz'));
router.get(config.urlPath + '/bupt/grs', require('./routes/universities/bupt/grs'));
router.get(config.urlPath + '/bupt/portal', require('./routes/universities/bupt/portal'));
router.get(config.urlPath + '/bupt/news', require('./routes/universities/bupt/news'));
router.get(config.urlPath + '/bupt/funbox', require('./routes/universities/bupt/funbox'));

// VOCUS 方格子
router.get(config.urlPath + '/vocus/publication/:id', require('./routes/vocus/publication'));
router.get(config.urlPath + '/vocus/user/:id', require('./routes/vocus/user'));

// 一亩三分地 1point3acres
router.get(config.urlPath + '/1point3acres/user/:id/threads', require('./routes/1point3acres/threads'));
router.get(config.urlPath + '/1point3acres/user/:id/posts', require('./routes/1point3acres/posts'));
router.get(config.urlPath + '/1point3acres/offer/:year?/:major?/:school?', require('./routes/1point3acres/offer'));
router.get(config.urlPath + '/1point3acres/post/:category', require('./routes/1point3acres/post'));

// 广东海洋大学
router.get(config.urlPath + '/gdoujwc', require('./routes/universities/gdou/jwc/jwtz'));

// 中国高清网
router.get(config.urlPath + '/gaoqingla/:tag?', require('./routes/gaoqingla/latest'));

// 马良行
router.get(config.urlPath + '/mlhang', require('./routes/mlhang/latest'));

// PlayStation Store
router.get(config.urlPath + '/ps/list/:gridName', require('./routes/ps/list'));
router.get(config.urlPath + '/ps/trophy/:id', require('./routes/ps/trophy'));
router.get(config.urlPath + '/ps/ps4updates', require('./routes/ps/ps4updates'));
router.get(config.urlPath + '/ps/:lang?/product/:gridName', require('./routes/ps/product'));

// Quanta Magazine
router.get(config.urlPath + '/quantamagazine/archive', require('./routes/quantamagazine/archive'));

// Nintendo
router.get(config.urlPath + '/nintendo/eshop/jp', require('./routes/nintendo/eshop_jp'));
router.get(config.urlPath + '/nintendo/eshop/hk', require('./routes/nintendo/eshop_hk'));
router.get(config.urlPath + '/nintendo/eshop/us', require('./routes/nintendo/eshop_us'));
router.get(config.urlPath + '/nintendo/eshop/cn', require('./routes/nintendo/eshop_cn'));
router.get(config.urlPath + '/nintendo/news', require('./routes/nintendo/news'));
router.get(config.urlPath + '/nintendo/news/china', require('./routes/nintendo/news_china'));
router.get(config.urlPath + '/nintendo/direct', require('./routes/nintendo/direct'));
router.get(config.urlPath + '/nintendo/system-update', require('./routes/nintendo/system-update'));

// 世界卫生组织
router.get(config.urlPath + '/who/news-room/:type', require('./routes/who/news-room'));

// 福利资源-met.red
router.get(config.urlPath + '/metred/fuli', require('./routes/metred/fuli'));

// MIT
router.get(config.urlPath + '/mit/graduateadmissions/:type/:name', require('./routes/universities/mit/graduateadmissions'));

// 毕马威
router.get(config.urlPath + '/kpmg/insights', require('./routes/kpmg/insights'));

// Saraba1st
router.get(config.urlPath + '/saraba1st/thread/:tid', require('./routes/saraba1st/thread'));

// gradcafe
router.get(config.urlPath + '/gradcafe/result/:type', require('./routes/gradcafe/result'));
router.get(config.urlPath + '/gradcafe/result', require('./routes/gradcafe/result'));

// The Economist
router.get(config.urlPath + '/the-economist/gre-vocabulary', require('./routes/the-economist/gre-vocabulary'));
router.get(config.urlPath + '/the-economist/:endpoint', require('./routes/the-economist/full'));

// 鼠绘漫画
router.get(config.urlPath + '/shuhui/comics/:id', require('./routes/shuhui/comics'));

// 朝日新聞中文网（简体中文版）
router.get(config.urlPath + '/asahichinese-j/:category/:subCate', require('./routes/asahichinese-j/index'));
router.get(config.urlPath + '/asahichinese-j/:category', require('./routes/asahichinese-j/index'));

// 朝日新聞中文網（繁體中文版）
router.get(config.urlPath + '/asahichinese-f/:category/:subCate', require('./routes/asahichinese-f/index'));
router.get(config.urlPath + '/asahichinese-f/:category', require('./routes/asahichinese-f/index'));

// 7x24小时快讯
router.get(config.urlPath + '/fx678/kx', require('./routes/fx678/kx'));

// SoundCloud
router.get(config.urlPath + '/soundcloud/tracks/:user', require('./routes/soundcloud/tracks'));

// dilidili
router.get(config.urlPath + '/dilidili/fanju/:id', require('./routes/dilidili/fanju'));

// 且听风吟福利
router.get(config.urlPath + '/qtfyfl/:category', require('./routes/qtfyfl/category'));

// 派代
router.get(config.urlPath + '/paidai', require('./routes/paidai/index'));
router.get(config.urlPath + '/paidai/bbs', require('./routes/paidai/bbs'));
router.get(config.urlPath + '/paidai/news', require('./routes/paidai/news'));

// 中国银行
router.get(config.urlPath + '/boc/whpj/:format?', require('./routes/boc/whpj'));

// 漫画db
router.get(config.urlPath + '/manhuadb/comics/:id', require('./routes/manhuadb/comics'));

// 装备前线
router.get(config.urlPath + '/zfrontier/postlist/:type', require('./routes/zfrontier/postlist'));
router.get(config.urlPath + '/zfrontier/board/:boardId', require('./routes/zfrontier/board_postlist'));

// 观察者风闻话题
router.get(config.urlPath + '/guanchazhe/topic/:id', require('./routes/guanchazhe/topic'));
router.get(config.urlPath + '/guanchazhe/personalpage/:uid', require('./routes/guanchazhe/personalpage'));
router.get(config.urlPath + '/guanchazhe/index/:type', require('./routes/guanchazhe/index'));

// Hpoi 手办维基
router.get(config.urlPath + '/hpoi/info/:type?', require('./routes/hpoi/info'));
router.get(config.urlPath + '/hpoi/:category/:words', require('./routes/hpoi'));
router.get(config.urlPath + '/hpoi/user/:user_id/:caty', require('./routes/hpoi/user'));

// 通用CurseForge
router.get(config.urlPath + '/curseforge/:gameid/:catagoryid/:projectid/files', require('./routes/curseforge/generalfiles'));

// 西南财经大学
router.get(config.urlPath + '/swufe/seie/:type?', require('./routes/universities/swufe/seie'));

// Wired
router.get(config.urlPath + '/wired/tag/:tag', require('./routes/wired/tag'));

// 语雀文档
router.get(config.urlPath + '/yuque/doc/:repo_id', require('./routes/yuque/doc'));

// 飞地
router.get(config.urlPath + '/enclavebooks/category/:id?', require('./routes/enclavebooks/category'));
router.get(config.urlPath + '/enclavebooks/user/:uid', require('./routes/enclavebooks/user.js'));
router.get(config.urlPath + '/enclavebooks/collection/:uid', require('./routes/enclavebooks/collection.js'));

// 色花堂
router.get(config.urlPath + '/dsndsht23/picture/:subforumid', require('./routes/dsndsht23/index'));
router.get(config.urlPath + '/dsndsht23/bt/:subforumid?', require('./routes/dsndsht23/index'));
router.get(config.urlPath + '/dsndsht23/:subforumid?/:type?', require('./routes/dsndsht23/index'));
router.get(config.urlPath + '/dsndsht23/:subforumid?', require('./routes/dsndsht23/index'));
router.get(config.urlPath + '/dsndsht23', require('./routes/dsndsht23/index'));

// 数英网最新文章
router.get(config.urlPath + '/digitaling/index', require('./routes/digitaling/index'));

// 数英网文章专题
router.get(config.urlPath + '/digitaling/articles/:category/:subcate', require('./routes/digitaling/article'));

// 数英网项目专题
router.get(config.urlPath + '/digitaling/projects/:category', require('./routes/digitaling/project'));

// Bing壁纸
router.get(config.urlPath + '/bing', require('./routes/bing/index'));

// Maxjia News - DotA 2
router.get(config.urlPath + '/maxnews/dota2', require('./routes/maxnews/dota2'));

// 柠檬 - 私房歌
router.get(config.urlPath + '/ningmeng/song', require('./routes/ningmeng/song'));

// 紫竹张
router.get(config.urlPath + '/zzz', require('./routes/zzz/index'));

// AEON
router.get(config.urlPath + '/aeon/:cid', require('./routes/aeon/category'));

// AlgoCasts
router.get(config.urlPath + '/algocasts', require('./routes/algocasts/all'));

// aqicn
router.get(config.urlPath + '/aqicn/:city', require('./routes/aqicn/index'));

// 猫眼电影
router.get(config.urlPath + '/maoyan/hot', require('./routes/maoyan/hot'));
router.get(config.urlPath + '/maoyan/upcoming', require('./routes/maoyan/upcoming'));

// cnBeta
router.get(config.urlPath + '/cnbeta', require('./routes/cnbeta/home'));

// 国家退伍士兵信息
router.get(config.urlPath + '/gov/veterans/:type', require('./routes/gov/veterans/china'));

// 河北省退伍士兵信息
router.get(config.urlPath + '/gov/veterans/hebei/:type', require('./routes/gov/veterans/hebei'));

// Dilbert Comic Strip
router.get(config.urlPath + '/dilbert/strip', require('./routes/dilbert/strip'));

// 游戏打折情报
router.get(config.urlPath + '/yxdzqb/:type', require('./routes/yxdzqb'));

// 怪物猎人
router.get(config.urlPath + '/monsterhunter/update', require('./routes/mhw/update'));
router.get(config.urlPath + '/mhw/update', require('./routes/mhw/update'));
router.get(config.urlPath + '/mhw/news', require('./routes/mhw/news'));

// 005.tv
router.get(config.urlPath + '/005tv/zx/latest', require('./routes/005tv/zx'));

// Polimi News
router.get(config.urlPath + '/polimi/news/:language?', require('./routes/polimi/news'));

// dekudeals
router.get(config.urlPath + '/dekudeals/:type', require('./routes/dekudeals'));

// 直播吧
router.get(config.urlPath + '/zhibo8/forum/:id', require('./routes/zhibo8/forum'));
router.get(config.urlPath + '/zhibo8/post/:id', require('./routes/zhibo8/post'));

// 东方网-上海
router.get(config.urlPath + '/eastday/sh', require('./routes/eastday/sh'));

// Metacritic
router.get(config.urlPath + '/metacritic/release/:platform/:type/:sort?', require('./routes/metacritic/release'));

// 快科技（原驱动之家）
router.get(config.urlPath + '/kkj/news', require('./routes/kkj/news'));

// Outage.Report
router.get(config.urlPath + '/outagereport/:name/:count?', require('./routes/outagereport/service'));

// sixthtone
router.get(config.urlPath + '/sixthtone/news', require('./routes/sixthtone/news'));

// AI研习社
router.get(config.urlPath + '/aiyanxishe/:id/:sort?', require('./routes/aiyanxishe/home'));

// 活动行
router.get(config.urlPath + '/huodongxing/explore', require('./routes/hdx/explore'));

// 飞客茶馆优惠信息
router.get(config.urlPath + '/flyertea/preferential', require('./routes/flyertea/preferential'));
router.get(config.urlPath + '/flyertea/creditcard/:bank', require('./routes/flyertea/creditcard'));

// 中国广播
router.get(config.urlPath + '/radio/:channelname/:name', require('./routes/radio/radio'));

// TOPYS
router.get(config.urlPath + '/topys/:category', require('./routes/topys/article'));

// 巴比特作者专栏
router.get(config.urlPath + '/8btc/:authorid', require('./routes/8btc/author'));
router.get(config.urlPath + '/8btc/news/flash', require('./routes/8btc/news/flash'));

// VueVlog
router.get(config.urlPath + '/vuevideo/:userid', require('./routes/vuevideo/user'));

// 证监会
router.get(config.urlPath + '/csrc/news/:suffix?', require('./routes/csrc/news'));
router.get(config.urlPath + '/csrc/fashenwei', require('./routes/csrc/fashenwei'));
router.get(config.urlPath + '/csrc/auditstatus/:apply_id', require('./routes/csrc/auditstatus'));

// LWN.net Alerts
router.get(config.urlPath + '/lwn/alerts/:distributor', require('./routes/lwn/alerts'));

// 唱吧
router.get(config.urlPath + '/changba/:userid', require('./routes/changba/user'));

// 英雄联盟
router.get(config.urlPath + '/lol/newsindex/:type', require('./routes/lol/newsindex'));

// 掌上英雄联盟
router.get(config.urlPath + '/lolapp/recommend', require('./routes/lolapp/recommend'));

// 左岸读书
router.get(config.urlPath + '/zreading', require('./routes/zreading/home'));

// NBA
router.get(config.urlPath + '/nba/app_news', require('./routes/nba/app_news'));

// 天津产权交易中心
router.get(config.urlPath + '/tprtc/cqzr', require('./routes/tprtc/cqzr'));
router.get(config.urlPath + '/tprtc/qyzc', require('./routes/tprtc/qyzc'));
router.get(config.urlPath + '/tprtc/news', require('./routes/tprtc/news'));

// ArchDaily
router.get(config.urlPath + '/archdaily', require('./routes/archdaily/home'));

// aptonic Dropzone actions
router.get(config.urlPath + '/aptonic/action', require('./routes/aptonic/action'));

// 印记中文周刊
router.get(config.urlPath + '/docschina/jsweekly', require('./routes/docschina/jsweekly'));

// im2maker
router.get(config.urlPath + '/im2maker/:channel?', require('./routes/im2maker/index'));

// 巨潮资讯
router.get(config.urlPath + '/cninfo/announcement/:code?/:category?', require('./routes/cninfo/announcement'));
router.get(config.urlPath + '/cninfo/stock_announcement/:code', require('./routes/cninfo/stock_announcement'));
router.get(config.urlPath + '/cninfo/fund_announcement/:code?/:searchkey?', require('./routes/cninfo/fund_announcement'));

// 中央纪委国家监委网站
router.get(config.urlPath + '/ccdi/scdc', require('./routes/ccdi/scdc'));

// 中华人民共和国农业农村部
router.get(config.urlPath + '/gov/moa/:suburl(.*)', require('./routes/gov/moa/moa'));

// 香水时代
router.get(config.urlPath + '/nosetime/:id/:type/:sort?', require('./routes/nosetime/comment'));
router.get(config.urlPath + '/nosetime/home', require('./routes/nosetime/home'));

// 涂鸦王国
router.get(config.urlPath + '/gracg/:user/:love?', require('./routes/gracg/user'));

// 大侠阿木
router.get(config.urlPath + '/daxiaamu/home', require('./routes/daxiaamu/home'));

// 美团技术团队
router.get(config.urlPath + '/meituan/tech/home', require('./routes//meituan/tech/home'));

// 码农网
router.get(config.urlPath + '/codeceo/home', require('./routes/codeceo/home'));
router.get(config.urlPath + '/codeceo/:type/:category?', require('./routes/codeceo/category'));

// BOF
router.get(config.urlPath + '/bof/home', require('./routes/bof/home'));

// 爱发电
router.get(config.urlPath + '/afdian/explore/:type?/:category?', require('./routes/afdian/explore'));
router.get(config.urlPath + '/afdian/dynamic/:uid', require('./routes/afdian/dynamic'));

// Simons Foundation
router.get(config.urlPath + '/simonsfoundation/articles', require('./routes/simonsfoundation/articles'));
router.get(config.urlPath + '/simonsfoundation/recommend', require('./routes/simonsfoundation/recommend'));

// 王者荣耀
router.get(config.urlPath + '/pvp/newsindex/:type', require('./routes/pvp/newsindex'));

// 《明日方舟》游戏
router.get(config.urlPath + '/arknights/news', require('./routes/arknights/news'));

// ff14
router.get(config.urlPath + '/ff14/ff14_zh/:type', require('./routes/ff14/ff14_zh'));

// 学堂在线
router.get(config.urlPath + '/xuetangx/course/:cid/:type', require('./routes/xuetangx/course_info'));
router.get(config.urlPath + '/xuetangx/course/list/:mode/:credential/:status/:type?', require('./routes/xuetangx/course_list'));

// wikihow
router.get(config.urlPath + '/wikihow/index', require('./routes/wikihow/index.js'));
router.get(config.urlPath + '/wikihow/category/:category/:type', require('./routes/wikihow/category.js'));

// 正版中国
router.get(config.urlPath + '/getitfree/category/:category?', require('./routes/getitfree/category.js'));
router.get(config.urlPath + '/getitfree/search/:keyword?', require('./routes/getitfree/search.js'));

// 万联网
router.get(config.urlPath + '/10000link/news/:category?', require('./routes/10000link/news'));

// 站酷
router.get(config.urlPath + '/zcool/recommend/:type', require('./routes/zcool/recommend'));
router.get(config.urlPath + '/zcool/top/:type', require('./routes/zcool/top'));
router.get(config.urlPath + '/zcool/top', require('./routes/zcool/top')); // 兼容老版本
router.get(config.urlPath + '/zcool/user/:uid', require('./routes/zcool/user'));

// 第一财经
router.get(config.urlPath + '/yicai/brief', require('./routes/yicai/brief.js'));

// 一兜糖
router.get(config.urlPath + '/yidoutang/index', require('./routes/yidoutang/index.js'));
router.get(config.urlPath + '/yidoutang/guide', require('./routes/yidoutang/guide.js'));
router.get(config.urlPath + '/yidoutang/mtest', require('./routes/yidoutang/mtest.js'));
router.get(config.urlPath + '/yidoutang/case/:type', require('./routes/yidoutang/case.js'));

// 开眼
router.get(config.urlPath + '/kaiyan/index', require('./routes/kaiyan/index'));

// 龙空
router.get(config.urlPath + '/lkong/forum/:id/:digest?', require('./routes/lkong/forum'));
router.get(config.urlPath + '/lkong/thread/:id', require('./routes/lkong/thread'));
// router.get(config.urlPath + '/lkong/user/:id', require('./routes/lkong/user'));

// 坂道系列资讯
// 坂道系列官网新闻
router.get(config.urlPath + '/nogizaka46/news', require('./routes/nogizaka46/news'));
router.get(config.urlPath + '/keyakizaka46/news', require('./routes/keyakizaka46/news'));
router.get(config.urlPath + '/hinatazaka46/news', require('./routes/hinatazaka46/news'));
router.get(config.urlPath + '/keyakizaka46/blog', require('./routes/keyakizaka46/blog'));
router.get(config.urlPath + '/hinatazaka46/blog', require('./routes/hinatazaka46/blog'));

// 酷安
router.get(config.urlPath + '/coolapk/tuwen', require('./routes/coolapk/tuwen'));

// 模型网
router.get(config.urlPath + '/moxingnet', require('./routes/moxingnet'));

// 湖北大学
router.get(config.urlPath + '/hubu/news/:type', require('./routes/universities/hubu/news'));

// 大连海事大学
router.get(config.urlPath + '/dlmu/news/:type', require('./routes/universities/dlmu/news'));
router.get(config.urlPath + '/dlmu/grs/zsgz/:type', require('./routes/universities/dlmu/grs/zsgz'));

// Rockstar Games Social Club
router.get(config.urlPath + '/socialclub/events/:game?', require('./routes/socialclub/events'));

// CTFHub Event Calendar
router.get(config.urlPath + '/ctfhub/calendar/:limit?/:form?/:class?/:title?', require('./routes/ctfhub'));

// 阿里云
router.get(config.urlPath + '/aliyun/database_month', require('./routes/aliyun/database_month'));
router.get(config.urlPath + '/aliyun/notice/:type?', require('./routes/aliyun/notice'));
router.get(config.urlPath + '/aliyun/developer/group/:type', require('./routes/aliyun/developer/group'));

// 礼物说
router.get(config.urlPath + '/liwushuo/index', require('./routes/liwushuo/index.js'));

// 故事fm
router.get(config.urlPath + '/storyfm/index', require('./routes/storyfm/index.js'));

// 中国日报
router.get(config.urlPath + '/chinadaily/english/:category', require('./routes/chinadaily/english.js'));

// leboncoin
router.get(config.urlPath + '/leboncoin/ad/:query', require('./routes/leboncoin/ad.js'));

// DHL
router.get(config.urlPath + '/dhl/:id', require('./routes/dhl/shipment-tracking'));

// Japanpost
router.get(config.urlPath + '/japanpost/:reqCode/:locale?', require('./routes/japanpost/index'));

// 中华人民共和国商务部
router.get(config.urlPath + '/mofcom/article/:suffix', require('./routes/mofcom/article'));

// 字幕库
router.get(config.urlPath + '/zimuku/:type?', require('./routes/zimuku/index'));

// 品玩
router.get(config.urlPath + '/pingwest/status', require('./routes/pingwest/status'));
router.get(config.urlPath + '/pingwest/tag/:tag/:type', require('./routes/pingwest/tag'));
router.get(config.urlPath + '/pingwest/user/:uid/:type?', require('./routes/pingwest/user'));

// Hanime
router.get(config.urlPath + '/hanime/video', require('./routes/hanime/video'));

// 篝火营地
router.get(config.urlPath + '/gouhuo/news/:category', require('./routes/gouhuo'));
router.get(config.urlPath + '/gouhuo/strategy', require('./routes/gouhuo/strategy'));

// Soul
router.get(config.urlPath + '/soul/:id', require('./routes/soul'));

// 单向空间
router.get(config.urlPath + '/owspace/read/:type?', require('./routes/owspace/read'));

// 天涯论坛
router.get(config.urlPath + '/tianya/index/:type', require('./routes/tianya/index'));
router.get(config.urlPath + '/tianya/user/:userid', require('./routes/tianya/user'));
router.get(config.urlPath + '/tianya/comments/:userid', require('./routes/tianya/comments'));

// eleme
router.get(config.urlPath + '/eleme/open/announce', require('./routes/eleme/open/announce'));
router.get(config.urlPath + '/eleme/open-be/announce', require('./routes/eleme/open-be/announce'));

// 微信开放社区
router.get(config.urlPath + '/wechat-open/community/:type', require('./routes/tencent/wechat/wechat-open/community/announce'));
// 微信支付 - 商户平台公告
router.get(config.urlPath + '/wechat-open/pay/announce', require('./routes/tencent/wechat/wechat-open/pay/announce'));
router.get(config.urlPath + '/wechat-open/community/:type/:category', require('./routes/tencent/wechat/wechat-open/community/question'));

// 微店
router.get(config.urlPath + '/weidian/goods/:id', require('./routes/weidian/goods'));

// 有赞
router.get(config.urlPath + '/youzan/goods/:id', require('./routes/youzan/goods'));
// 币世界快讯
router.get(config.urlPath + '/bishijie/kuaixun', require('./routes/bishijie/kuaixun'));

// 顺丰丰桥
router.get(config.urlPath + '/sf/sffq-announce', require('./routes/sf/sffq-announce'));

// 缺书网
router.get(config.urlPath + '/queshu/sale', require('./routes/queshu/sale'));
router.get(config.urlPath + '/queshu/book/:bookid', require('./routes/queshu/book'));

// SANS
router.get(config.urlPath + '/sans/summit_archive', require('./routes/sans/summit_archive'));

// LaTeX 开源小屋
router.get(config.urlPath + '/latexstudio/home', require('./routes/latexstudio/home'));

// 上证债券信息网 - 可转换公司债券公告
router.get(config.urlPath + '/sse/convert/:query?', require('./routes/sse/convert'));
router.get(config.urlPath + '/sse/renewal', require('./routes/sse/renewal'));
router.get(config.urlPath + '/sse/inquire', require('./routes/sse/inquire'));

// 深圳证券交易所——上市公告
router.get(config.urlPath + '/szse/notice', require('./routes/szse/notice'));
router.get(config.urlPath + '/szse/inquire/:type', require('./routes/szse/inquire'));

// 前端艺术家每日整理&&飞冰早报
router.get(config.urlPath + '/jskou/:type?', require('./routes/jskou/index'));

// 国家应急广播
router.get(config.urlPath + '/cneb/yjxx', require('./routes/cneb/yjxx'));
router.get(config.urlPath + '/cneb/guoneinews', require('./routes/cneb/guoneinews'));

// 邮箱
router.get(config.urlPath + '/mail/imap/:email', require('./routes/mail/imap'));

// 好队友
router.get(config.urlPath + '/network360/jobs', require('./routes/network360/jobs'));

// 智联招聘
router.get(config.urlPath + '/zhilian/:city/:keyword', require('./routes/zhilian/index'));

// 电鸭社区
router.get(config.urlPath + '/eleduck/jobs', require('./routes/eleduck/jobs'));

// 北华航天工业学院 - 新闻
router.get(config.urlPath + '/nciae/news', require('./routes/universities/nciae/news'));

// 北华航天工业学院 - 通知公告
router.get(config.urlPath + '/nciae/tzgg', require('./routes/universities/nciae/tzgg'));

// 北华航天工业学院 - 学术信息
router.get(config.urlPath + '/nciae/xsxx', require('./routes/universities/nciae/xsxx'));

// cfan
router.get(config.urlPath + '/cfan/news', require('./routes/cfan/news'));

// 搜狐 - 搜狐号
router.get(config.urlPath + '/sohu/mp/:id', require('./routes/sohu/mp'));

// 腾讯企鹅号
router.get(config.urlPath + '/tencent/news/author/:mid', require('./routes/tencent/news/author'));

// 奈菲影视
router.get(config.urlPath + '/nfmovies/:id?', require('./routes/nfmovies/index'));

// 书友社区
router.get(config.urlPath + '/andyt/:view?', require('./routes/andyt/index'));

// 品途商业评论
router.get(config.urlPath + '/pintu360/:type?', require('./routes/pintu360/index'));

// engadget中国版
router.get(config.urlPath + '/engadget-cn', require('./routes/engadget/home'));

// engadget
router.get(config.urlPath + '/engadget/:lang', require('./routes/engadget/home'));

// 吹牛部落
router.get(config.urlPath + '/chuiniu/column/:id', require('./routes/chuiniu/column'));
router.get(config.urlPath + '/chuiniu/column_list', require('./routes/chuiniu/column_list'));

// leemeng
router.get(config.urlPath + '/leemeng', require('./routes/blogs/leemeng'));

// 中国地质大学
router.get(config.urlPath + '/cug/graduate', require('./routes/cug/graduate'));
router.get(config.urlPath + '/cug/undergraduate', require('./routes/cug/undergraduate'));
router.get(config.urlPath + '/cug/xgxy', require('./routes/cug/xgxy'));

// 网易 - 网易号
router.get(config.urlPath + '/netease/dy/:id', require('./routes/netease/dy'));

// 海猫吧
router.get(config.urlPath + '/haimaoba/:id?', require('./routes/haimaoba/comics'));

// 蒲公英
router.get(config.urlPath + '/pgyer/:app?', require('./routes/pgyer/app'));

// 微博个人时间线
router.get(config.urlPath + '/weibo/timeline/:uid/:feature?', require('./routes/weibo/timeline'));

// TAPTAP
router.get(config.urlPath + '/taptap/topic/:id/:label?', require('./routes/taptap/topic'));
router.get(config.urlPath + '/taptap/changelog/:id', require('./routes/taptap/changelog'));
router.get(config.urlPath + '/taptap/review/:id/:order?', require('./routes/taptap/review'));

// lofter
router.get(config.urlPath + '/lofter/tag/:name/:type?', require('./routes/lofter/tag'));
router.get(config.urlPath + '/lofter/user/:username', require('./routes/lofter/posts'));

// 米坛社区表盘
router.get(config.urlPath + '/watchface/:watch_type?/:list_type?', require('./routes/watchface/update'));

// CNU视觉联盟
router.get(config.urlPath + '/cnu/selected', require('./routes/cnu/selected'));
router.get(config.urlPath + '/cnu/discovery/:type?/:category?', require('./routes/cnu/discovery'));

// 战旗直播
router.get(config.urlPath + '/zhanqi/room/:id', require('./routes/zhanqi/room'));

// 酒云网
router.get(config.urlPath + '/wineyun/:category', require('./routes/wineyun'));

// 小红书
router.get(config.urlPath + '/xiaohongshu/user/:user_id/:category', require('./routes/xiaohongshu/user'));
router.get(config.urlPath + '/xiaohongshu/board/:board_id', require('./routes/xiaohongshu/board'));

// 重磅原创-每经网
router.get(config.urlPath + '/nbd/daily', require('./routes/nbd/article'));

// 快知
router.get(config.urlPath + '/kzfeed/topic/:id', require('./routes/kzfeed/topic'));

// 腾讯新闻较真查证平台
router.get(config.urlPath + '/factcheck', require('./routes/tencent/factcheck'));

// X-MOL化学资讯平台
router.get(config.urlPath + '/x-mol/news/:tag?', require('./routes/x-mol/news.js'));
router.get(config.urlPath + '/x-mol/paper/:type/:magazine', require('./routes/x-mol/paper'));

// 知识分子
router.get(config.urlPath + '/zhishifenzi/news/:type?', require('./routes/zhishifenzi/news'));
router.get(config.urlPath + '/zhishifenzi/depth', require('./routes/zhishifenzi/depth'));
router.get(config.urlPath + '/zhishifenzi/innovation/:type?', require('./routes/zhishifenzi/innovation'));

// 電撃Online
router.get(config.urlPath + '/dengekionline/:type?', require('./routes/dengekionline/new'));

// 4Gamers
router.get(config.urlPath + '/4gamers/category/:category', require('./routes/4gamers/category'));
router.get(config.urlPath + '/4gamers/tag/:tag', require('./routes/4gamers/tag'));

// 大麦网
router.get(config.urlPath + '/damai/activity/:city/:category/:subcategory/:keyword?', require('./routes/damai/activity'));

// 桂林电子科技大学新闻资讯
router.get(config.urlPath + '/guet/xwzx/:type?', require('./routes/guet/news'));

// はてな匿名ダイアリー
router.get(config.urlPath + '/hatena/anonymous_diary/archive', require('./routes/hatena/anonymous_diary/archive'));

// kaggle
router.get(config.urlPath + '/kaggle/discussion/:forumId/:sort?', require('./routes/kaggle/discussion'));
router.get(config.urlPath + '/kaggle/competitions/:category?', require('./routes/kaggle/competitions'));

// PubMed Trending
router.get(config.urlPath + '/pubmed/trending', require('./routes/pubmed/trending'));

// 领科 (linkresearcher.com)
router.get(config.urlPath + '/linkresearcher/:params', require('./routes/linkresearcher/index'));

// eLife [Sci Journal]
router.get(config.urlPath + '/elife/:tid', require('./routes/elife/index'));

// PNAS [Sci Journal]
router.get(config.urlPath + '/pnas/:topic?', require('./routes/pnas/index'));

// cell [Sci Journal]
router.get(config.urlPath + '/cell/cell/:category', require('./routes/cell/cell/index'));
router.get(config.urlPath + '/cell/cover', require('./routes/cell/cover'));

// nature + nature 子刊 [Sci Journal]
router.get(config.urlPath + '/nature/research/:journal?', require('./routes/nature/research'));
router.get(config.urlPath + '/nature/news-and-comment/:journal?', require('./routes/nature/news-and-comment'));
router.get(config.urlPath + '/nature/cover', require('./routes/nature/cover'));
router.get(config.urlPath + '/nature/news', require('./routes/nature/news'));
router.get(config.urlPath + '/nature/highlight', require('./routes/nature/highlight'));

// science [Sci Journal]
router.get(config.urlPath + '/sciencemag/current/:journal?', require('./routes/sciencemag/current'));
router.get(config.urlPath + '/sciencemag/cover', require('./routes/sciencemag/cover'));
router.get(config.urlPath + '/sciencemag/early/science', require('./routes/sciencemag/early'));

// dlsite
router.get(config.urlPath + '/dlsite/new/:type', require('./routes/dlsite/new'));
router.get(config.urlPath + '/dlsite/campaign/:type/:free?', require('./routes/dlsite/campaign'));

// mcbbs
router.get(config.urlPath + '/mcbbs/forum/:type', require('./routes/mcbbs/forum'));
router.get(config.urlPath + '/mcbbs/post/:tid/:authorid?', require('./routes/mcbbs/post'));

// Pocket
router.get(config.urlPath + '/pocket/trending', require('./routes/pocket/trending'));

// HK01
router.get(config.urlPath + '/hk01/zone/:id', require('./routes/hk01/zone'));
router.get(config.urlPath + '/hk01/channel/:id', require('./routes/hk01/channel'));
router.get(config.urlPath + '/hk01/issue/:id', require('./routes/hk01/issue'));
router.get(config.urlPath + '/hk01/tag/:id', require('./routes/hk01/tag'));
router.get(config.urlPath + '/hk01/hot', require('./routes/hk01/hot'));
router.get(config.urlPath + '/hk01/ebook', require('./routes/hk01/ebook'));

// 码农周刊
router.get(config.urlPath + '/manong-weekly', require('./routes/manong-weekly/issues'));

// 每日猪价
router.get(config.urlPath + '/pork-price', require('./routes/pork-price'));

// NOI 全国青少年信息学奥林匹克竞赛
router.get(config.urlPath + '/noi', require('./routes/noi'));
router.get(config.urlPath + '/noi/winners-list', require('./routes/noi/winners-list'));
router.get(config.urlPath + '/noi/province-news', require('./routes/noi/province-news'));
router.get(config.urlPath + '/noi/rg-news', require('./routes/noi/rg-news'));

// 中国工业化和信息部
router.get(config.urlPath + '/gov/miit/zcwj', require('./routes/gov/miit/zcwj'));
router.get(config.urlPath + '/gov/miit/wjgs', require('./routes/gov/miit/wjgs'));
router.get(config.urlPath + '/gov/miit/zcjd', require('./routes/gov/miit/zcjd'));

// 中国国家认证认可监管管理员会
router.get(config.urlPath + '/gov/cnca/jgdt', require('./routes/gov/cnca/jgdt'));
router.get(config.urlPath + '/gov/cnca/hydt', require('./routes/gov/cnca/hydt'));

router.get(config.urlPath + '/gov/cnca/zxtz', require('./routes/gov/cnca/zxtz'));

// clickme
router.get(config.urlPath + '/clickme/:site/:grouping/:name', require('./routes/clickme'));

// 文汇报
router.get(config.urlPath + '/whb/:category', require('./routes/whb/zhuzhan'));

// 三界异次元
router.get(config.urlPath + '/3ycy/home', require('./routes/3ycy/home.js'));

// Emi Nitta official website
router.get(config.urlPath + '/emi-nitta/:type', require('./routes/emi-nitta/home'));

// Alter China
router.get(config.urlPath + '/alter-cn/news', require('./routes/alter-cn/news'));

// Visual Studio Code Marketplace
router.get(config.urlPath + '/vscode/marketplace/:type?', require('./routes/vscode/marketplace'));

// 饭否
router.get(config.urlPath + '/fanfou/user_timeline/:uid', require('./routes/fanfou/user_timeline'));
router.get(config.urlPath + '/fanfou/home_timeline', require('./routes/fanfou/home_timeline'));
router.get(config.urlPath + '/fanfou/favorites/:uid', require('./routes/fanfou/favorites'));
router.get(config.urlPath + '/fanfou/trends', require('./routes/fanfou/trends'));
router.get(config.urlPath + '/fanfou/public_timeline/:keyword', require('./routes/fanfou/public_timeline'));

// ITSlide
router.get(config.urlPath + '/itslide/new', require('./routes/itslide/new'));

// Remote Work
router.get(config.urlPath + '/remote-work/:caty?', require('./routes/remote-work/index'));

// China Times
router.get(config.urlPath + '/chinatimes/:caty', require('./routes/chinatimes/index'));

// TransferWise
router.get(config.urlPath + '/transferwise/pair/:source/:target', require('./routes/transferwise/pair'));

// chocolatey
router.get(config.urlPath + '/chocolatey/software/:name?', require('./routes/chocolatey/software'));

// Nyaa
router.get(config.urlPath + '/nyaa/search/:query?', require('./routes/nyaa/search'));

// 片源网
router.get(config.urlPath + '/pianyuan/:media?', require('./routes/pianyuan/app'));

// ITHome
router.get(config.urlPath + '/ithome/:caty', require('./routes/ithome/index'));
router.get(config.urlPath + '/ithome/ranking/:type?', require('./routes/ithome/ranking'));

// 巴哈姆特
router.get(config.urlPath + '/bahamut/creation/:author/:category?', require('./routes/bahamut/creation'));
router.get(config.urlPath + '/bahamut/creation_index/:category?/:subcategory?/:type?', require('./routes/bahamut/creation_index'));

// CentBrowser
router.get(config.urlPath + '/centbrowser/history', require('./routes/centbrowser/history'));

// 755
router.get(config.urlPath + '/755/user/:username', require('./routes/755/user'));

// IKEA
router.get(config.urlPath + '/ikea/uk/new', require('./routes/ikea/uk/new'));
router.get(config.urlPath + '/ikea/uk/offer', require('./routes/ikea/uk/offer'));

// Mastodon
router.get(config.urlPath + '/mastodon/timeline/:site/:only_media?', require('./routes/mastodon/timeline'));

// Kernel Aliyun
router.get(config.urlPath + '/aliyun-kernel/index', require('./routes/aliyun-kernel/index'));

// Vulture
router.get(config.urlPath + '/vulture/:tag/:excludetags?', require('./routes/vulture/index'));

// xinwenlianbo
router.get(config.urlPath + '/xinwenlianbo/index', require('./routes/xinwenlianbo/index'));

// Paul Graham - Essays
router.get(config.urlPath + '/blogs/paulgraham', require('./routes/blogs/paulgraham'));

// invisionapp
router.get(config.urlPath + '/invisionapp/inside-design', require('./routes/invisionapp/inside-design'));

// producthunt
router.get(config.urlPath + '/producthunt/today', require('./routes/producthunt/today'));

// mlog.club
router.get(config.urlPath + '/mlog-club/topics/:node', require('./routes/mlog-club/topics'));
router.get(config.urlPath + '/mlog-club/projects', require('./routes/mlog-club/projects'));

// Chrome 网上应用店
router.get(config.urlPath + '/chrome/webstore/extensions/:id', require('./routes/chrome/extensions'));

// RTHK
router.get(config.urlPath + '/rthk-news/:lang/:category', require('./routes/rthk-news/index'));

// yahoo
router.get(config.urlPath + '/yahoo-news/:region/:category?', require('./routes/yahoo-news/index'));

// Yahoo!テレビ
router.get(config.urlPath + '/yahoo-jp-tv/:query', require('./routes/yahoo-jp-tv/index'));

// 白鲸出海
router.get(config.urlPath + '/baijing', require('./routes/baijing'));

// 低端影视
router.get(config.urlPath + '/ddrk/update/:name/:season?', require('./routes/ddrk/index'));
router.get(config.urlPath + '/ddrk/tag/:tag', require('./routes/ddrk/list'));
router.get(config.urlPath + '/ddrk/category/:category', require('./routes/ddrk/list'));
router.get(config.urlPath + '/ddrk/index', require('./routes/ddrk/list'));

// avgle
router.get(config.urlPath + '/avgle/videos/:order?/:time?/:top?', require('./routes/avgle/videos.js'));
router.get(config.urlPath + '/avgle/search/:keyword/:order?/:time?/:top?', require('./routes/avgle/videos.js'));

// 公主链接公告
router.get(config.urlPath + '/pcr/news', require('./routes/pcr/news'));
router.get(config.urlPath + '/pcr/news-tw', require('./routes/pcr/news-tw'));
router.get(config.urlPath + '/pcr/news-cn', require('./routes/pcr/news-cn'));

// project-zero issues
router.get(config.urlPath + '/project-zero-issues', require('./routes/project-zero-issues/index'));

// 平安银河实验室
router.get(config.urlPath + '/galaxylab', require('./routes/galaxylab/index'));

// NOSEC 安全讯息平台
router.get(config.urlPath + '/nosec/:keykind?', require('./routes/nosec/index'));

// Hex-Rays News
router.get(config.urlPath + '/hex-rays/news', require('./routes/hex-rays/index'));

// 新趣集
router.get(config.urlPath + '/xinquji/today', require('./routes/xinquji/today'));
router.get(config.urlPath + '/xinquji/today/internal', require('./routes/xinquji/internal'));

// 英中协会
router.get(config.urlPath + '/gbcc/trust', require('./routes/gbcc/trust'));

// Associated Press
router.get(config.urlPath + '/apnews/topics/:topic', require('./routes/apnews/topics'));

// discuz
router.get(config.urlPath + '/discuz/:ver([7|x])/:cid([0-9]{2})/:link(.*)', require('./routes/discuz/discuz'));
router.get(config.urlPath + '/discuz/:ver([7|x])/:link(.*)', require('./routes/discuz/discuz'));
router.get(config.urlPath + '/discuz/:link(.*)', require('./routes/discuz/discuz'));

// China Dialogue 中外对话
router.get(config.urlPath + '/chinadialogue/topics/:topic', require('./routes/chinadialogue/topics'));
router.get(config.urlPath + '/chinadialogue/:column', require('./routes/chinadialogue/column'));

// 人民日报社 国际金融报
router.get(config.urlPath + '/ifnews/:cid', require('./routes/ifnews/column'));

// Scala Blog
router.get(config.urlPath + '/scala/blog/:part?', require('./routes/scala-blog/scala-blog'));

// Minecraft Java版游戏更新
router.get(config.urlPath + '/minecraft/version', require('./routes/minecraft/version'));

// 微信更新日志
router.get(config.urlPath + '/weixin/miniprogram/release', require('./routes/tencent/wechat/miniprogram/framework')); // 基础库更新日志
router.get(config.urlPath + '/weixin/miniprogram/framework', require('./routes/tencent/wechat/miniprogram/framework')); // 基础库更新日志
router.get(config.urlPath + '/weixin/miniprogram/devtools', require('./routes/tencent/wechat/miniprogram/devtools')); // 开发者工具更新日志
router.get(config.urlPath + '/weixin/miniprogram/wxcloud/:caty?', require('./routes/tencent/wechat/miniprogram/wxcloud')); // 云开发更新日志

// 武汉肺炎疫情动态
router.get(config.urlPath + '/coronavirus/caixin', require('./routes/coronavirus/caixin'));
router.get(config.urlPath + '/coronavirus/dxy/data/:province?/:city?', require('./routes/coronavirus/dxy-data'));
router.get(config.urlPath + '/coronavirus/dxy', require('./routes/coronavirus/dxy'));
router.get(config.urlPath + '/coronavirus/scmp', require('./routes/coronavirus/scmp'));
router.get(config.urlPath + '/coronavirus/nhc', require('./routes/coronavirus/nhc'));
router.get(config.urlPath + '/coronavirus/mogov-2019ncov/:lang', require('./routes/coronavirus/mogov-2019ncov'));
router.get(config.urlPath + '/coronavirus/qq/fact', require('./routes/tencent/factcheck'));
router.get(config.urlPath + '/coronavirus/sg-moh', require('./routes/coronavirus/sg-moh'));

// 南京林业大学教务处
router.get(config.urlPath + '/njfu/jwc/:category?', require('./routes/universities/njfu/jwc'));

// 日本経済新聞
router.get(config.urlPath + '/nikkei/index', require('./routes/nikkei/index'));

// MQube
router.get(config.urlPath + '/mqube/user/:user', require('./routes/mqube/user'));
router.get(config.urlPath + '/mqube/tag/:tag', require('./routes/mqube/tag'));
router.get(config.urlPath + '/mqube/latest', require('./routes/mqube/latest'));
router.get(config.urlPath + '/mqube/top', require('./routes/mqube/top'));

// Letterboxd
router.get(config.urlPath + '/letterboxd/user/diary/:username', require('./routes/letterboxd/userdiary'));
router.get(config.urlPath + '/letterboxd/user/followingdiary/:username', require('./routes/letterboxd/followingdiary'));

// 网易大神
router.get(config.urlPath + '/netease/ds/:id', require('./routes/netease/ds'));

// javlibrary
router.get(config.urlPath + '/javlibrary/users/:uid/:utype', require('./routes/javlibrary/users'));
router.get(config.urlPath + '/javlibrary/videos/:vtype', require('./routes/javlibrary/videos'));
router.get(config.urlPath + '/javlibrary/stars/:sid', require('./routes/javlibrary/stars'));
router.get(config.urlPath + '/javlibrary/bestreviews', require('./routes/javlibrary/bestreviews'));

// Last.FM
router.get(config.urlPath + '/lastfm/recent/:user', require('./routes/lastfm/recent'));
router.get(config.urlPath + '/lastfm/loved/:user', require('./routes/lastfm/loved'));
router.get(config.urlPath + '/lastfm/top/:country?', require('./routes/lastfm/top'));

// piapro
router.get(config.urlPath + '/piapro/user/:pid', require('./routes/piapro/user'));
router.get(config.urlPath + '/piapro/public/:type/:tag?/:category?', require('./routes/piapro/public'));

// 凤凰网
router.get(config.urlPath + '/ifeng/feng/:id/:type', require('./routes/ifeng/feng'));

// 网易公开课
router.get(config.urlPath + '/open163/vip', require('./routes/netease/open/vip'));
router.get(config.urlPath + '/open163/latest', require('./routes/netease/open/latest'));

// 第一版主
router.get(config.urlPath + '/novel/d1bz/:category/:id', require('./routes/d1bz/novel'));

// 爱下电子书
router.get(config.urlPath + '/axdzs/:id1/:id2', require('./routes/novel/axdzs'));

// HackerOne
router.get(config.urlPath + '/hackerone/hacktivity', require('./routes/hackerone/hacktivity'));

// 奶牛关
router.get(config.urlPath + '/cowlevel/element/:id', require('./routes/cowlevel/element'));

// 2048
router.get(config.urlPath + '/2048/bbs/:fid', require('./routes/2048/bbs'));

// Google News
router.get(config.urlPath + '/google/news/:category/:locale', require('./routes/google/news'));

// 虛詞
router.get(config.urlPath + '/p-articles/section/:section', require('./routes/p-articles/section'));
router.get(config.urlPath + '/p-articles/contributors/:author', require('./routes/p-articles/contributors'));

// finviz

router.get(config.urlPath + '/finviz/news/:ticker', require('./routes/finviz/news'));

// 好好住
router.get(config.urlPath + '/haohaozhu/whole-house/:keyword?', require('./routes/haohaozhu/whole-house'));
router.get(config.urlPath + '/haohaozhu/discover/:keyword?', require('./routes/haohaozhu/discover'));

// 东北大学
router.get(config.urlPath + '/neu/news/:type', require('./routes/universities/neu/news'));

// 快递100
router.get(config.urlPath + '/kuaidi100/track/:number/:id/:phone?', require('./routes/kuaidi100/index'));
router.get(config.urlPath + '/kuaidi100/company', require('./routes/kuaidi100/supported_company'));

// 稻草人书屋
router.get(config.urlPath + '/dcrsw/:name/:count?', require('./routes/novel/dcrsw'));

// 魔法纪录
router.get(config.urlPath + '/magireco/announcements', require('./routes/magireco/announcements'));
router.get(config.urlPath + '/magireco/event_banner', require('./routes/magireco/event_banner'));

// wolley
router.get(config.urlPath + '/wolley', require('./routes/wolley/index'));
router.get(config.urlPath + '/wolley/user/:id', require('./routes/wolley/user'));
router.get(config.urlPath + '/wolley/host/:host', require('./routes/wolley/host'));

// 西安交大
router.get(config.urlPath + '/xjtu/gs/tzgg', require('./routes/universities/xjtu/gs/tzgg'));
router.get(config.urlPath + '/xjtu/dean/:subpath+', require('./routes/universities/xjtu/dean'));

// booksource
router.get(config.urlPath + '/booksource', require('./routes/booksource/index'));

// ku
router.get(config.urlPath + '/ku/:name?', require('./routes/ku/index'));

// 我有一片芝麻地
router.get(config.urlPath + '/blogs/hedwig/:type', require('./routes/blogs/hedwig'));

// LoveHeaven
router.get(config.urlPath + '/loveheaven/update/:slug', require('./routes/loveheaven/update'));

// 拉勾
router.get(config.urlPath + '/lagou/jobs/:position/:city', require('./routes/lagou/jobs'));

// 扬州大学
router.get(config.urlPath + '/yzu/home/:type', require('./routes/universities/yzu/home'));
router.get(config.urlPath + '/yzu/yjszs/:type', require('./routes/universities/yzu/yjszs'));

// 国家自然科学基金委员会
router.get(config.urlPath + '/nsfc/news/:type?', require('./routes/nsfc/news'));

// 德国新闻社卫健新闻
router.get(config.urlPath + '/krankenkassen', require('./routes/krankenkassen'));

// 桂林航天工业学院
router.get(config.urlPath + '/guat/news/:type?', require('./routes/guat/news'));

// 国家留学网
router.get(config.urlPath + '/csc/notice/:type?', require('./routes/csc/notice'));

// LearnKu
router.get(config.urlPath + '/learnku/:community/:category?', require('./routes/learnku/topic'));

// NEEA
router.get(config.urlPath + '/neea/:type', require('./routes/neea'));

// 中国农业大学
router.get(config.urlPath + '/cauyjs', require('./routes/universities/cauyjs/cauyjs'));

// 南方科技大学
router.get(config.urlPath + '/sustyjs', require('./routes/universities/sustyjs/sustyjs'));

// 广州大学
router.get(config.urlPath + '/gzyjs', require('./routes/universities/gzyjs/gzyjs'));

// 深圳大学
router.get(config.urlPath + '/szuyjs', require('./routes/universities/szuyjs/szuyjs'));

// 中国传媒大学
router.get(config.urlPath + '/cucyjs', require('./routes/universities/cucyjs/cucyjs'));

// 中国农业大学信电学院
router.get(config.urlPath + '/cauele', require('./routes/universities/cauyjs/cauyjs'));

// moxingfans
router.get(config.urlPath + '/moxingfans', require('./routes/moxingfans'));

// Chiphell
router.get(config.urlPath + '/chiphell/forum/:forumId?', require('./routes/chiphell/forum'));

// 华东理工大学研究生院
router.get(config.urlPath + '/ecustyjs', require('./routes/universities/ecustyjs/ecustyjs'));

// 同济大学研究生院
router.get(config.urlPath + '/tjuyjs', require('./routes/universities/tjuyjs/tjuyjs'));

// 中国石油大学研究生院
router.get(config.urlPath + '/upcyjs', require('./routes/universities/upcyjs/upcyjs'));

// 中国海洋大学研究生院
router.get(config.urlPath + '/outyjs', require('./routes/universities/outyjs/outyjs'));

// 中科院人工智能所
router.get(config.urlPath + '/zkyai', require('./routes/universities/zkyai/zkyai'));

// 中科院自动化所
router.get(config.urlPath + '/zkyyjs', require('./routes/universities/zkyyjs/zkyyjs'));

// 中国海洋大学信电学院
router.get(config.urlPath + '/outele', require('./routes/universities/outele/outele'));

// 华东师范大学研究生院
router.get(config.urlPath + '/ecnuyjs', require('./routes/universities/ecnuyjs/ecnuyjs'));

// 考研帮调剂信息
router.get(config.urlPath + '/kaoyan', require('./routes/kaoyan/kaoyan'));

// 华中科技大学研究生院
router.get(config.urlPath + '/hustyjs', require('./routes/universities/hustyjs/hustyjs'));

// 华中师范大学研究生院
router.get(config.urlPath + '/ccnuyjs', require('./routes/universities/ccnu/ccnuyjs'));

// 华中师范大学计算机学院
router.get(config.urlPath + '/ccnucs', require('./routes/universities/ccnu/ccnucs'));

// 华中师范大学伍论贡学院
router.get(config.urlPath + '/ccnuwu', require('./routes/universities/ccnu/ccnuwu'));

// WEEX
router.get(config.urlPath + '/weexcn/news/:typeid', require('./routes/weexcn/index'));

// 天天基金
router.get(config.urlPath + '/eastmoney/user/:uid', require('./routes/eastmoney/user'));

// 紳士漫畫
router.get(config.urlPath + '/ssmh', require('./routes/ssmh'));

// 武昌首义学院
router.get(config.urlPath + '/wsyu/news/:type?', require('./routes/universities/wsyu/news'));

// 华南师范大学研究生学院
router.get(config.urlPath + '/scnuyjs', require('./routes/universities/scnu/scnuyjs'));

// 华南师范大学软件学院
router.get(config.urlPath + '/scnucs', require('./routes/universities/scnu/scnucs'));

// 华南理工大学研究生院
router.get(config.urlPath + '/scutyjs', require('./routes/universities/scut/scutyjs'));

// 华南农业大学研究生院通知公告
router.get(config.urlPath + '/scauyjs', require('./routes/universities/scauyjs/scauyjs'));

// 北京大学研究生招生网通知公告
router.get(config.urlPath + '/pkuyjs', require('./routes/universities/pku/pkuyjs'));

// 北京理工大学研究生通知公告
router.get(config.urlPath + '/bityjs', require('./routes/universities/bit/bityjs'));

// 湖南科技大学教务处
router.get(config.urlPath + '/hnust/jwc', require('./routes/universities/hnust/jwc/index'));
router.get(config.urlPath + '/hnust/computer', require('./routes/universities/hnust/computer/index'));
router.get(config.urlPath + '/hnust/art', require('./routes/universities/hnust/art/index'));
router.get(config.urlPath + '/hnust/graduate/:type?', require('./routes/universities/hnust/graduate/index'));

// AGE动漫
router.get(config.urlPath + '/agefans/detail/:id', require('./routes/agefans/detail'));

// Checkra1n
router.get(config.urlPath + '/checkra1n/releases', require('./routes/checkra1n/releases'));

// 四川省科学技术厅
router.get(config.urlPath + '/sckjt/news/:type?', require('./routes/sckjt/news'));

// 绝对领域
router.get(config.urlPath + '/jdlingyu/:type', require('./routes/jdlingyu/index'));

// Hi, DIYgod
router.get(config.urlPath + '/blogs/diygod/animal-crossing', require('./routes/blogs/diygod/animal-crossing'));
router.get(config.urlPath + '/blogs/diygod/gk', require('./routes/blogs/diygod/gk'));

// 湖北工业大学
router.get(config.urlPath + '/hbut/news/:type', require('./routes/universities/hbut/news'));
router.get(config.urlPath + '/hbut/cs/:type', require('./routes/universities/hbut/cs'));

// acwifi
router.get(config.urlPath + '/acwifi', require('./routes/acwifi'));

// a岛匿名版
router.get(config.urlPath + '/adnmb/:pid', require('./routes/adnmb/index'));

// MIT科技评论
router.get(config.urlPath + '/mittrchina/article', require('./routes/mittrchina'));

// 消费者报道
router.get(config.urlPath + '/ccreports/article', require('./routes/ccreports'));

// iYouPort
router.get(config.urlPath + '/iyouport/article', require('./routes/iyouport'));

// girlimg
router.get(config.urlPath + '/girlimg/album/:tag?/:mode?', require('./routes/girlimg/album'));

// etoland
router.get(config.urlPath + '/etoland/:bo_table', require('./routes/etoland/board'));

// 辽宁工程技术大学教务在线公告
router.get(config.urlPath + '/lntu/jwnews', require('./routes/universities/lntu/jwnews'));

// 51voa
router.get(config.urlPath + '/51voa/:channel', require('./routes/51voa/channel'));

// zhuixinfan
router.get(config.urlPath + '/zhuixinfan/list', require('./routes/zhuixinfan/list'));

// scoresaber
router.get(config.urlPath + '/scoresaber/user/:id', require('./routes/scoresaber/user'));

// blur-studio
router.get(config.urlPath + '/blur-studio', require('./routes/blur-studio/index'));

// Sun-Creature
router.get(config.urlPath + '/sun-creature', require('./routes/sun-creature/index'));

// method-studios
router.get(config.urlPath + '/method-studios/:menu?', require('./routes/method-studios/index'));

// blow-studio
router.get(config.urlPath + '/blow-studio', require('./routes/blow-studio/work'));

// axis-studios
router.get(config.urlPath + '/axis-studios/:type/:tag?', require('./routes/axis-studios/work'));

// 人民邮电出版社
router.get(config.urlPath + '/ptpress/book/:type?', require('./routes/ptpress/book'));

// uniqlo styling book
router.get(config.urlPath + '/uniqlo/stylingbook/:category?', require('./routes/uniqlo/stylingbook'));

// 本地宝焦点资讯
router.get(config.urlPath + '/bendibao/news/:city', require('./routes/bendibao/news'));

// unit-image
router.get(config.urlPath + '/unit-image/films/:type?', require('./routes/unit-image/films'));

// digic-picture
router.get(config.urlPath + '/digic-pictures/:menu/:tags?', require('./routes/digic-pictures/index'));

// cve.mitre.org
router.get(config.urlPath + '/cve/search/:keyword', require('./routes/cve/search'));

// Xposed Module Repository
router.get(config.urlPath + '/xposed/module/:mod', require('./routes/xposed/module'));

// Microsoft Edge
router.get(config.urlPath + '/edge/addon/:crxid', require('./routes/edge/addon'));

// 上海立信会计金融学院
router.get(config.urlPath + '/slu/tzgg/:id', require('./routes/universities/slu/tzgg'));
router.get(config.urlPath + '/slu/jwc/:id', require('./routes/universities/slu/jwc'));
router.get(config.urlPath + '/slu/tyyjkxy/:id', require('./routes/universities/slu/tyyjkxy'));
router.get(config.urlPath + '/slu/kjxy/:id', require('./routes/universities/slu/kjxy'));
router.get(config.urlPath + '/slu/xsc/:id', require('./routes/universities/slu/xsc'));
router.get(config.urlPath + '/slu/csggxy/:id', require('./routes/universities/slu/csggxy'));

// Ruby China
router.get(config.urlPath + '/ruby-china/topics/:type?', require('./routes/ruby-china/topics'));
router.get(config.urlPath + '/ruby-china/jobs', require('./routes/ruby-china/jobs'));

// 中国人事考试网
router.get(config.urlPath + '/cpta/notice', require('./routes/cpta/notice'));

// 广告网
router.get(config.urlPath + '/adquan/:type?', require('./routes/adquan/index'));

// 齐鲁晚报
router.get(config.urlPath + '/qlwb/news', require('./routes/qlwb/news'));
router.get(config.urlPath + '/qlwb/city/:city', require('./routes/qlwb/city'));

// 蜻蜓FM
router.get(config.urlPath + '/qingting/channel/:id', require('./routes/qingting/channel'));

// 金色财经
router.get(config.urlPath + '/jinse/lives', require('./routes/jinse/lives'));

// deeplearning.ai
router.get(config.urlPath + '/deeplearningai/thebatch', require('./routes/deeplearningai/thebatch'));

// Fate Grand Order
router.get(config.urlPath + '/fgo/news', require('./routes/fgo/news'));

// RF技术社区
router.get(config.urlPath + '/rf/article', require('./routes/rf/article'));

// University of Massachusetts Amherst
router.get(config.urlPath + '/umass/amherst/ecenews', require('./routes/umass/amherst/ecenews'));
router.get(config.urlPath + '/umass/amherst/csnews', require('./routes/umass/amherst/csnews'));

// 飘花电影网
router.get(config.urlPath + '/piaohua/hot', require('./routes/piaohua/hot'));

// 快媒体
router.get(config.urlPath + '/kuai', require('./routes/kuai/index'));
router.get(config.urlPath + '/kuai/:id', require('./routes/kuai/id'));

// 生物帮
router.get(config.urlPath + '/biobio/:id', require('./routes/biobio/index'));
router.get(config.urlPath + '/biobio/:column/:id', require('./routes/biobio/others'));

// 199it
router.get(config.urlPath + '/199it', require('./routes/199it/index'));

// 唧唧堂
router.get(config.urlPath + '/jijitang/article/:id', require('./routes/jijitang/article'));
router.get(config.urlPath + '/jijitang/publication', require('./routes/jijitang/publication'));

// 新闻联播
router.get(config.urlPath + '/xwlb', require('./routes/xwlb/index'));

// 网易新闻专栏
router.get(config.urlPath + '/netease/news/special/:type?', require('./routes/netease/news/special'));

// 端传媒
router.get(config.urlPath + '/initium/:type?/:language?', require('./routes/initium/full'));

// Grub Street
router.get(config.urlPath + '/grubstreet', require('./routes/grubstreet/index'));

// 漫画堆
router.get(config.urlPath + '/manhuadui/manhua/:name/:serial?', require('./routes/manhuadui/manhua'));

// 风之漫画
router.get(config.urlPath + '/fzdm/manhua/:id', require('./routes/fzdm/manhua'));

// Aljazeera 半岛网
router.get(config.urlPath + '/aljazeera/news', require('./routes/aljazeera/news'));

// CFD indices dividend adjustment
router.get(config.urlPath + '/cfd/gbp_div', require('./routes/cfd/gbp_div'));

// 中国人民银行
router.get(config.urlPath + '/pbc/goutongjiaoliu', require('./routes/pbc/goutongjiaoliu'));
router.get(config.urlPath + '/pbc/tradeAnnouncement', require('./routes/pbc/tradeAnnouncement'));

// Monotype
router.get(config.urlPath + '/monotype/article', require('./routes/monotype/article'));

// Stork
router.get(config.urlPath + '/stork/keyword/:trackID/:displayKey', require('./routes/stork/keyword'));

// 致美化
router.get(config.urlPath + '/zhutix/latest', require('./routes/zhutix/latest'));

// arXiv
router.get(config.urlPath + '/arxiv/:query', require('./routes/arxiv/query'));

// 生物谷
router.get(config.urlPath + '/shengwugu/:uid?', require('./routes/shengwugu/index'));

// 环球律师事务所文章
router.get(config.urlPath + '/law/hq', require('./routes/law/hq'));

// 海问律师事务所文章
router.get(config.urlPath + '/law/hw', require('./routes/law/hw'));

// 国枫律师事务所文章
router.get(config.urlPath + '/law/gf', require('./routes/law/gf'));

// 通商律师事务所文章
router.get(config.urlPath + '/law/ts', require('./routes/law/ts'));

// 锦天城律师事务所文章
router.get(config.urlPath + '/law/jtc', require('./routes/law/jtc'));

// 中伦律师事务所文章
router.get(config.urlPath + '/law/zl', require('./routes/law/zl'));

// 君合律师事务所文章
router.get(config.urlPath + '/law/jh', require('./routes/law/jh'));

// 德恒律师事务所文章
router.get(config.urlPath + '/law/dh', require('./routes/law/dh'));

// 金诚同达律师事务所文章
router.get(config.urlPath + '/law/jctd', require('./routes/law/jctd'));

// Mobilism
router.get(config.urlPath + '/mobilism/release', require('./routes/mobilism/release'));

// 三星盖乐世社区
router.get(config.urlPath + '/samsungmembers/latest', require('./routes/samsungmembers/latest'));

// 东莞教研网
router.get(config.urlPath + '/dgjyw/:type', require('./routes/dgjyw/index'));

// 中国信息通信研究院
router.get(config.urlPath + '/gov/caict/bps', require('./routes/gov/caict/bps'));
router.get(config.urlPath + '/gov/caict/qwsj', require('./routes/gov/caict/qwsj'));
router.get(config.urlPath + '/gov/caict/caictgd', require('./routes/gov/caict/caictgd'));

// 中证网
router.get(config.urlPath + '/cs/news/:caty', require('./routes/cs/news'));

// 财联社
router.get(config.urlPath + '/cls/telegraph', require('./routes/cls/telegraph'));
router.get(config.urlPath + '/cls/depth', require('./routes/cls/depth'));

// hentai-cosplays
router.get(config.urlPath + '/hentai-cosplays/:type?/:name?', require('./routes/hentai-cosplays/hentai-cosplays'));
router.get(config.urlPath + '/porn-images-xxx/:type?/:name?', require('./routes/hentai-cosplays/porn-images-xxx'));

// dcinside
router.get(config.urlPath + '/dcinside/board/:id', require('./routes/dcinside/board'));

// 企鹅电竞
router.get(config.urlPath + '/egameqq/room/:id', require('./routes/tencent/egame/room'));

// 国家税务总局
router.get(config.urlPath + '/gov/chinatax/latest', require('./routes/gov/chinatax/latest'));

// 荔枝FM
router.get(config.urlPath + '/lizhi/user/:id', require('./routes/lizhi/user'));

// 富途牛牛
router.get(config.urlPath + '/futunn/highlights', require('./routes/futunn/highlights'));

// 外接大脑
router.get(config.urlPath + '/waijiedanao/article/:caty', require('./routes/waijiedanao/article'));

// 即刻
router.get(config.urlPath + '/jike/topic/:id', require('./routes/jike/topic'));
router.get(config.urlPath + '/jike/topic/text/:id', require('./routes/jike/topicText'));
router.get(config.urlPath + '/jike/user/:id', require('./routes/jike/user'));

// 网易新闻
router.get(config.urlPath + '/netease/news/rank/:category?/:type?/:time?', require('./routes/netease/news/rank'));

// 中国邮政速递物流
router.get(config.urlPath + '/ems/news', require('./routes/ems/news'));

// 场库
router.get(config.urlPath + '/changku', require('./routes/changku/index'));

// 上海市生态环境局
router.get(config.urlPath + '/gov/shanghai/sthj', require('./routes/gov/shanghai/sthj'));

module.exports = router;
