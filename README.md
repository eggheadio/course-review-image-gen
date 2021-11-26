Generate an image of egghead.io course review that can be shared on social media.

## Develop

- run `vercel dev`
- visit `http://localhost:3000/api/image`

## Usage

```js
queryString.stringifyUrl({
    url: 'https://share-learner-review.vercel.app/api/image',
    query: {
     review,
     rating,
     authorName,
     authorAvatar,
     courseIllustration,
     courseTitle,
     author, // boolean, default is true, pass false to hide author details
    }
```

Try it out with [ScriptKit](https://www.scriptkit.com/):<br/>
https://stackblitz.com/edit/node-y87rgy?file=scripts%2Fshare-review.js

## Example

<img src="https://share-learner-review.vercel.app/api/image?authorAvatar=https%3A%2F%2Fgravatar.com%2Favatar%2Fc44960e16988a85b6591e0c1b981da1b.png%3Fs%3D128%26d%3Dmp&authorName=Zac%20Jones&courseIllustration=https%3A%2F%2Fd2eip9sf3oo6c2.cloudfront.net%2Fplaylists%2Fsquare_covers%2F000%2F530%2F989%2Fthumb%2Fimage.png&courseTitle=Introduction%20to%20GROQ%20Query%20Language&rating=5&review=This%20course%20gave%20a%20clear%20picture%20of%20how%20to%20filter%20and%20build%20your%20data%20exactly%20how%20you%20need%20with%20GROQ.%20%0A%0AI%20loved%20the%20latter%20half%20of%20the%20course%20where%20John%20shows%20how%20to%20access%20and%20utilize%20parent%20scope%20in%20nested%20queries.%20%0A%0AThanks%20for%20this%20John%21" width="500" />
