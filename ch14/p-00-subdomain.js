const express = require('express');
const vhost = require('vhost');
const app = express();

// 建立admin子網域,它會出現在你的所有其他路由之前
const admin = express.Router();
app.use(vhost('admin.meadowlark.js', admin));

// 建立admin路由,它們可以在任何地方定義
admin.get('*', (req, res) => res.send('歡迎光臨, Admin!'));

// 建立一般路由
app.get('*', (req, res) => res.send('歡迎光臨, User!'));
const port = process.env.PORT || 3000;
app.listen(port, () => console.log("\nmake sure you've added the following to your hosts file:" +
"\n" +
"\n  127.0.0.1 admin.meadowlark.local" +
"\n  127.0.0.1 meadowlark.local" +
"\n" +
"\nthen navigate to:" +
"\n" +
`\n  http://meadowlark.local:${port}` +
"\n" +
"\n and" +
`\n  http://admin.meadowlark.local:${port}\n`));