/* eslint-disable no-shadow */
const request = require("request");
const cheerio = require("cheerio");

const URL =
  "https://www.downloadpirate.com/tropic-colour-slide-film-free-download/";

const dlLinks = (links) => {
  links.forEach((link) => {
    const server = link.split("/")[2];
    findLinks(link, server);
  });
};

const findLinks = (link, match) => {
  const links = [];
  request(link, function (error, response, body) {
    if (error) {
      return console.error("There was an error!");
    }

    const $ = cheerio.load(body);

    $("a").each(function () {
      const link = $(this).attr("href");

      if (link && link.includes(match)) {
        links.push(link);
        console.log(link);
      }
    });

    dlLinks(links);
  });
};

findLinks(URL, "zippyshare");
