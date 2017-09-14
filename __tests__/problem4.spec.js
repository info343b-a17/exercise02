const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio')
const htmllint = require('htmllint');
const stylelint = require('stylelint');
const inlineCss = require('inline-css'); //for css testing

const { toMatchImageSnapshot } = require('jest-image-snapshot');

//load the HTML file, since we're gonna need it.
const html = fs.readFileSync('problem4/index.html', 'utf-8');
//absolute path for relative loading (if needed)
const baseDir = 'file://'+path.dirname(path.resolve('problem4/index.html'))+'/';

describe('Source code is valid', () => {
  test('HTML validates without errors', async () => {
    const lintOpts = {
      'attr-bans':['align', 'background', 'bgcolor', 'border', 'frameborder', 'marginwidth', 'marginheight', 'scrolling', 'style', 'width', 'height'], //adding height, allow longdesc
      'tag-bans':['style','b'], //<i> allowed for font-awesome
      'doctype-first':true,
      'doctype-html5':true,
      'html-req-lang':true,
      'line-end-style':false, //either way
      'indent-style':false, //can mix/match
      'indent-width':false, //don't need to beautify
      'class-style':'none', //I like dashes in classnames
      'img-req-alt':false, //for this test; captured later!
    }

    let htmlValidityObj = await htmllint(html, lintOpts);
    expect(htmlValidityObj).htmlLintResultsContainsNoErrors();    
  })

  test('CSS validates without errors', async () => {
    let cssValidityObj = await stylelint.lint({files:'problem4/css/style.css'});
    expect(cssValidityObj).cssLintResultsContainsNoErrors();
  })
});

describe('Produces the expected visual output', () => {
  const puppeteer = require('puppeteer'); //use puppeteer for screencaptures
  let browser, page;

  beforeAll(async () => {
    //launch chrome headless, navigate to page
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto(baseDir+'/index.html'); //literally load the file
  });

  test('Test screenshot matches reference image on wide screen', async () => {
    await page.setViewport({width:1200, height:768}); //main image
    let capture = await page.screenshot(); //path:'problem3/img/screenshot.png'}
    expect(capture).toMatchImageSnapshot({customDiffConfig:{
      threshold:0.001 //very small threshold
    }});

  }, 10000)

  test('Test screenshot matches reference image on narrow screen', async () => {
    await page.setViewport({width:800, height:1000}); //skinny (full-paging)
    let capture = await page.screenshot();
    expect(capture).toMatchImageSnapshot({customDiffConfig:{
      threshold:0.001 //very small threshold
    }});

  }, 10000)

  afterAll(async () => {
    //close chrome headless
    browser.close();    
  });
})


//Custom code validation matchers (for error output)
expect.extend({
  //image matching
  toMatchImageSnapshot,   

  //using htmllint
  htmlLintResultsContainsNoErrors(validityObj) {
    const pass = validityObj.length === 0;
    if(pass){
      return { pass:true, message:() => "expected html to contain validity errors" };  
    }
    else {
      return { pass: false, message:() => (
        //loop through and build the result string
        //these error messages could be more detailed; maybe do manually later
        validityObj.reduce((out, msg)=> {
          return out + `Error: '${msg.rule}' at line ${msg.line}, column ${msg.column}.\n`
        }, '')
      )};      
    }
  },

  //using stylelint errors
  cssLintResultsContainsNoErrors(validityObj) {
    const pass = validityObj.errored === false;
    if(pass){
      return { pass:true, message:() => "expected CSS to contain validity errors" };
    }
    else {
      return { pass: false, message:() => (
        //loop through and build the result string
        JSON.parse(validityObj.output)[0].warnings.reduce((out, msg) => {
          return out + `${msg.severity}: ${msg.text}\n       At line ${msg.line}, column ${msg.column}.\n`
        }, '')
      )};
    }
  }
});