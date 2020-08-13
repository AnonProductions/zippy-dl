/* eslint-disable no-shadow */
const request = require('request');
const cheerio = require('cheerio');

const URL =
  'https://www.downloadpirate.com/tropic-colour-slide-film-free-download/';

const links = [];

const findLinks = (link, match) => {
  request(link, function(error, response, body) {
    if (error) {
      return console.error('There was an error!');
    }

    const $ = cheerio.load(body);

    $('a').each(function() {
      const link = $(this).attr('href');

      if (link && link.includes(match)) {
        // links.push(link);
        console.log(link);
        const prefix = link.split('/')[2];
      }
    });
  });
};

findLinks(URL, 'zippyshare');
