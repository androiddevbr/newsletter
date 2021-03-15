const minify = require("html-minifier").minify;
const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const inlineCss = require("inline-css");
var moment = require("moment");
const fetch = require("node-fetch");
const { htmlToText } = require("html-to-text");
const { markdownToTxt } = require("markdown-to-txt");

const urlMetadata = require("url-metadata");
const getUrls = require("get-urls");

const { Octokit } = require("@octokit/rest");

const creds = require("./service-account.json"); // the file saved above
const { GoogleSpreadsheet } = require("google-spreadsheet");

moment.locale("pt-br");

const doc = new GoogleSpreadsheet(
  "12iUrJRBE79WwmZh0DUAGK2D4-NjAlkU-JVszLXKpOtg"
);

(async function () {
  await doc.useServiceAccountAuth(creds);
})();

const octokit = new Octokit({
  auth: "f551ff5acc676e3c51a09428836c5201d2ab3554",
});

const loadNews = async () => {
  await doc.loadInfo(); // loads document properties and worksheets
  const newsSheet = doc.sheetsByTitle["News"];
  const rows = await (await newsSheet.getRows()).filter((row) => {
    const date = new Date(row["DATE"]);
    return date.getMonth() == new Date().getMonth();
  });
  const urls = [];
  rows.forEach((row) => {
    urls.push(...Array.from(getUrls(row["BODY"])));
  });
  const metadata = await Promise.all(
    urls.map(async (url) => {
      try {
        return await urlMetadata(url);
      } catch (error) {
        console.error(url, error);
      }
    })
  );
  return metadata.reverse().map((data) =>
    data
      ? {
          title: data.title,
          date: new Date(data["datePublished"]),
          text: data.description,
          url: data.url,
          image: data.image,
        }
      : undefined
  );
};

const loadArticles = async () => {
  const data = await fetch(
    "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fmedium.com%2Ffeed%2Fandroid-dev-br"
  ).then((res) => res.json());
  const res = data.items;
  const posts = res.filter(
    (item) => new Date(item.pubDate).getMonth() == new Date().getMonth()
  );
  return posts.map((post) =>
    post
      ? {
          title: post.title,
          date: new Date(post.pubDate),
          text:
            htmlToText(post.content, {
              wordwrap: 130,
              tags: {
                img: { format: "skip" },
                a: { options: { ignoreHref: true } },
                p: { options: { leadingLineBreaks: 1, trailingLineBreaks: 1 } },
                pre: {
                  options: { leadingLineBreaks: 1, trailingLineBreaks: 1 },
                },
                h1: { options: { uppercase: false } },
                h2: { options: { uppercase: false } },
                h3: { options: { uppercase: false } },
                h4: { options: { uppercase: false } },
                h5: { options: { uppercase: false } },
              },
            }).replaceAll(/\r?\n|\r/g, ". ") || "",
          image: post.thumbnail,
          url: post.link,
          author: {
            name: post.author,
          },
        }
      : undefined
  );
};

const loadJobs = async () => {
  const date = new Date();
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const issues = await octokit.issues.listForRepo({
    repo: "vagas",
    owner: "androiddevbr",
    state: "open",
    sort: "created",
    direction: "desc",
    since: firstDay.toISOString(),
  });
  return issues.data
    .map((issue) => ({
      title: issue.title,
      description: markdownToTxt(issue.body),
      url: issue.html_url,
    }))
    .reduce((result, value, index, array) => {
      if (index % 2 === 0) result.push(array.slice(index, index + 2));
      return result;
    }, []);
};

(async () => {
  try {
    const jobs = await loadJobs();
    const articles = Array.from(await loadArticles()).filter(Boolean);
    const data = [
      {
        section: "🗞️ Novidades",
        articles: Array.from(await loadNews()).filter(Boolean),
      },
    ];
    ejs.renderFile(
      path.resolve(__dirname, `newsletter.ejs`),
      { moment, data, articles, jobs },
      {},
      (e, html) => {
        if (e) console.error(e);

        fs.mkdir(
          path.resolve(__dirname, "output"),
          { recursive: true },
          async (e) => {
            if (e) console.error(e);

            fs.writeFileSync(
              path.resolve(__dirname, `output/newsletter.html`),
              minify(
                await inlineCss(html, {
                  url: "androiddevbr.org",
                  removeLinkTags: false,
                  applyTableAttributes: true,
                  preserveMediaQueries: true,
                }),
                {
                  minifyCSS: true,
                  removeEmptyElements: true,
                  removeEmptyAttributes: true,
                  collapseWhitespace: true,
                  removeComments: true,
                }
              )
            );
          }
        );
      }
    );
  } catch (e) {
    console.error(e);
  }
})();
