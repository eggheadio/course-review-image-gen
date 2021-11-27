import { launchChromium } from "playwright-aws-lambda";
import { NextApiRequest, NextApiResponse } from "next";
import Font from "../../components/font";
import floor from "lodash/floor";
import map from "lodash/map";
import times from "lodash/times";
import twemoji from "twemoji";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    authorName,
    authorAvatar,
    review,
    courseIllustration,
    courseTitle,
    rating,
    author,
  }: any = req.query;
  const browser = await launchChromium();

  const context = await browser.newContext();
  const page = await context.newPage();
  page.setViewportSize({
    width: 1200,
    height: 630,
  });

  const displayAuthor = author ? author === "true" : true;

  // rating as stars
  const remainder = parseFloat((rating % 1).toFixed(1));
  const roundedRemainder = Math.ceil(remainder);
  const showHalfStar = roundedRemainder === 1;
  const emptyStarCount = 5 - roundedRemainder - floor(rating);

  const stars = `
${map(
  times(rating),
  () =>
    `<img src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1637567935/share-learner-review/star_2x.png" width="38" height="36" />`
).join("")}
${
  showHalfStar
    ? `<img src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1637567935/share-learner-review/star-half_2x.png" width="38" height="36" />`
    : ""
}
${map(
  times(emptyStarCount),
  () =>
    `<img src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1637567935/share-learner-review/star-empty_2x.png" width="38" height="36" />`
).join("")}
`;

  const emojify = (text: string) => twemoji.parse(text);

  const content = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
<style>
    ${Font}
</style>
<link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet">

<style>
body{
    margin: 0; 
    padding: 80px 60px 140px 60px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-items: center;
    width: 1200px;
    height: 630px;
    background-color: rgba(17,24,39,1);
    font-family: "Adelle Sans";
}

.resize{
    display: flex;
    align-items: center;
    text-align: left;
    width: 100%;
    height: 100%;
    max-height: 340px;
    color: #ffffff;
    line-height: 1.3;
    margin: 0 0 30px 0;
    font-family: "Adelle Sans";
}

.created{
    position: absolute;
    left: 200px;
    top: 475px;
}

img.emoji {
  height: 1em;
  width: 1em;
  margin: 0 .05em 0 .1em;
  vertical-align: -0.1em;
  display: inline-block;
}
</style>
<div class="flex-shrink-0">
<img src="${courseIllustration}" width="300" height="300" />
</div>
<main class="flex flex-col justify-center h-full w-full pl-16">

  <div class="resize">
  ${
    courseTitle &&
    `<div class="pb-8 text-3xl leading-tight opacity-90 text-blue-100">${courseTitle}</div>`
  }
  ${emojify(review)}</div>
</main>
<div class="flex items-center justify-center w-full space-x-16 absolute left-0 bottom-10">
${rating ? `<div class="space-x-3 flex items-center">${stars}</div>` : ``}
${
  displayAuthor
    ? `<div class="flex items-center">
  <img width="70px" height="70px" class="rounded-full" src="${authorAvatar}"/>
  <div class="pl-4 text-white text-3xl pt-1">${authorName || "Learner"}</div>
  </div>`
    : ``
}
<img class="" src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1637569318/share-learner-review/egghead-logo_2x.png" width="250" height="65" />
</div>
<script src="https://unpkg.com/textfit@2.4.0/textFit.js"></script>
<script>
    textFit(document.querySelector('.resize'), { multiLine: true, maxFontSize: 52 });
</script>
</body>
</html>
`.trim();

  await page.setContent(content);

  const screenshotBuffer = await page.screenshot();
  await browser.close();

  res.setHeader("Content-Type", "image/png");
  res.setHeader("Content-Length", screenshotBuffer.length);
  // download
  // res.setHeader("Content-disposition", "attachment; filename=review@2x.png");
  res.statusCode = 200;

  res.send(screenshotBuffer);
};
