/* eslint-disable no-shadow */
const request = require("request-promise");
const cheerio = require("cheerio");
const url = require("url");
const path = require("path");
const mtd = require("zeltice-mt-downloader");
const URL =
  "https://www.downloadpirate.com/school-of-motion-design-bootcamp-free-download";

const downloadFile = () => {
  const target_url =
    "https://www38.zippyshare.com/d/8QprSulv/26836/AstGrElPlug_v1.2.4_DownloadPirate.com.rar";
  const options = {
    //To set the total number of download threads
    count: 8, //(Default: 2)

    //To set custom headers, such as cookies etc.
    headers: { cookies: "abc=pqr;" },

    //HTTP method
    method: "GET", //(Default: GET)

    //HTTP port
    port: 80, //(Default: 80)

    //If no data is received the download times out. It is measured in seconds.
    timeout: 5, //(Default: 5 seconds)

    //Control the part of file that needs to be downloaded.
    range: "0-100", //(Default: '0-100')

    //Triggered when the download is started
    onStart: function (meta) {
      console.log("Download Started", meta);
    },

    //Triggered when the download is completed
    onEnd: function (err, result) {
      if (err) console.error(err);
      else console.log("Download Complete");
    },
  };
  const file_name = path.basename(url.parse(target_url).pathname);
  const file_path = path.join(__dirname, file_name);

  const downloader = new mtd(file_path, target_url, options);

  downloader.start();
};
// downloadFile();

const getDomainName = (domain) => {
  try {
    let finalDomain = domain
      .replace(/^(?:https?:\/\/)?(?:www\.)?/i, "")
      .split("/")[0];
    finalDomain = finalDomain.charAt(0).toUpperCase() + finalDomain.slice(1);
    return finalDomain;
  } catch (error) {
    return domain;
  }
};
const getFileLinks = (links) => {
  const originalLinks = [];

  links.forEach((link) => {
    let options = {
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "Accept-Language": "en-US,en;q=0.9",
      "Cache-Control": "max-age=0",
      Connection: "keep-alive",
      Host: getDomainName(link),
      Referer: URL,

      "cache-control": "no-cache",
      pragma: "no-cache",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "Sec-Fetch-Site": "same-origin",
      "Sec-Fetch-User": "?1",
      "Upgrade-Insecure-Requests": 1,
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36",

      cookie:
        "zippyadb=0; JSESSIONID=775C190D3C1D8B7194F3DEBDFAC01C63; zippop=6",
    };
    request({
      uri: link,
      headers: options,
      gzip: true,
    }).then((body) => {
      const $ = cheerio.load(body);
      const t = $("body").text();
      console.log("getFileLinks -> t", t);
      // const fileLink = $("#dlbutton").prop("href");
      // originalLinks.push(fileLink);
      // console.log("getFileLinks -> fileLink", fileLink);
    }, console.log);
  });
};

const findLinks = (link) => {
  return new Promise((res, reject) => {
    const links = [];
    request(link, function (error, response, body) {
      if (error) {
        return reject("There was an error!");
      }
      const $ = cheerio.load(body);
      $(".button-center > a.btn_red ").each((i, el) => {
        const item = $(el).prop("href");
        links.push(item);
      });
      res(links);
    });
  });
};

findLinks(URL)
  .then((links) => {
    getFileLinks(links.slice(0, 1));
  })
  .catch((err) => {
    console.log("err", err);
    console.error("There was an error finding links");
  });
