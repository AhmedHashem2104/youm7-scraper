const PORT = 8000;
const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.post('/send-url', async (req, res) => {
  const { first, last, url } = req.body;
  const swapper = url.substr(url.indexOf(`{`), url.indexOf(`}`));
  var pathArray = url.split('/');
  var protocol = pathArray[0];
  var host = pathArray[2];
  var baseURL = protocol + '//' + host;
  //   await fs.appendFileSync('output.json', '[\n');
  for (let i = Number(first); i <= Number(last); i++) {
    var newURL = url.replace(swapper, i);
    await axios(newURL)
      .then(async (response) => {
        const html = response.data;
        const $ = await cheerio.load(html);
        await $(`.bigOneSec`, html).each(async function () {
          let title = await $(this).find(`div > h3 > a`).text();
          let link = await $(this).find(`a`).attr('href');
          let img = await $(this).find(`a > img`).attr('src');
          let description = await $(this).find(`div > p`).text();
          let created_at = await $(this).find(`div > span`).text();
          //   await fs.appendFileSync(
          //     'output.json',
          //     `${JSON.stringify({
          //       title,
          //       baseURL,
          //       link: baseURL + link,
          //       img,
          //       description,
          //       created_at,
          //     })},\n`
          //   );
          console.log({
            title,
            baseURL,
            link: baseURL + link,
            img,
            description,
            created_at,
          });
        });
      })
      .catch((err) => console.log(err));
  }
  //   await fs.appendFileSync('output.json', '\n]');

  return res.json({ h: 'g' });
});

app.listen(PORT, () =>
  console.log(`Server is running on http://127.0.0.1:${PORT}`)
);
