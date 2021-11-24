import { launchChromium } from "playwright-aws-lambda";
import { NextApiRequest, NextApiResponse } from "next";
import Font from "../../components/font";
import floor from "lodash/floor";
import map from "lodash/map";
import times from "lodash/times";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    authorName,
    authorAvatar,
    review,
    courseIllustration,
    courseTitle,
    rating,
  }: any = req.query;
  const browser = await launchChromium();

  const context = await browser.newContext();
  const page = await context.newPage();
  page.setViewportSize({
    width: 1200,
    height: 1200,
  });

  // rating as stars
  const remainder = parseFloat((rating % 1).toFixed(1));
  const roundedRemainder = Math.ceil(remainder);
  const showHalfStar = roundedRemainder === 1;
  const emptyStarCount = 5 - roundedRemainder - floor(rating);

  const stars = `
${map(
  times(rating),
  () =>
    `<img src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1637567935/share-learner-review/star_2x.png" width="48" height="46" />`
).join("")}
${
  showHalfStar
    ? `<img src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1637567935/share-learner-review/star-half_2x.png" width="48" height="46" />`
    : ""
}
${map(
  times(emptyStarCount),
  () =>
    `<img src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1637567935/share-learner-review/star-empty_2x.png" width="48" height="46" />`
).join("")}
`;

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
    padding:0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 1200px;
    height: 1200px;
    background-color: rgba(17,24,39,1);
    font-family: 'Adelle Sans', sans-serif;
}

.resize{
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 1000px;
    height: 100%;
    max-height: 300px;
    color: #ffffff;
    line-height: 1.3;
    margin: 50px 0;
}


.created{
    position: absolute;
    left: 200px;
    top: 475px;
}

</style>

 <header class="absolute top-24">
    <img src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1637569318/share-learner-review/egghead-logo_2x.png" width="274" height="73" />
</header> 
<main class="flex flex-col items-center justify-center h-full pt-40">
  ${rating && `<div class="space-x-2 flex items-center">${stars}</div>`}
  <div class="resize">${review}</div>
  ${
    authorName &&
    `<div class="flex items-center">
    <img width="80px" height="80px" class="rounded-full" src="${authorAvatar}"/>
    <div class="pl-4 text-white text-3xl">${authorName || "learner"}</div>
    </div>`
  }
</main>
<footer class="flex items-center justify-center top-0 left-0 w-full py-10 px-24 bg-black bg-opacity-30">
   <img src="${courseIllustration}" width="160" height="160" />
   ${
     courseTitle &&
     `<div class="pl-6 text-white text-4xl leading-tight">${courseTitle}</div>`
   }
</footer>
<script src="https://unpkg.com/textfit@2.4.0/textFit.js"></script>
<script>
    textFit(document.querySelector('.resize'), { multiLine: true });
</script>
</body>
</html>
`.trim();

  await page.setContent(content);

  const screenshotBuffer = await page.screenshot();
  await browser.close();

  res.setHeader("Content-Type", "image/png");
  res.setHeader("Content-Length", screenshotBuffer.length);
  res.statusCode = 200;

  res.send(screenshotBuffer);
};

/**
 *   const decoded = screenshotBuffer
    .toString()
    .replace('data:image/png;base64,', '')

  const buf = Buffer.from(decoded)
  res.setHeader('Content-Type', 'image/png')
  res.setHeader('Content-Length', buf.length)

  res.statusCode = 200

  res.send(buf.toString('base64'))
 */
