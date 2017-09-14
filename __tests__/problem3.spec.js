const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio')
const htmllint = require('htmllint');
const stylelint = require('stylelint');
const inlineCss = require('inline-css'); //for css testing

const { toMatchImageSnapshot } = require('jest-image-snapshot');

//load the HTML file, since we're gonna need it.
const html = fs.readFileSync('problem3/index.html', 'utf-8');
//absolute path for relative loading (if needed)
const baseDir = 'file://'+path.dirname(path.resolve('problem3/index.html'))+'/';

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
    let cssValidityObj = await stylelint.lint({files:'problem3/css/style.css'});
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

  test('Fresh page matches reference image', async () => {
    await page.setViewport({width:900, height:600});
    let capture = await page.screenshot();
    expect(capture).toMatchImageSnapshot({customDiffConfig:{
      threshold:0.001 //very small threshold
    }});
  }, 10000)

  test('Includes hover effects', async () => {
    await page.hover('a[href="#"]'); //check the first link
    
    await page.setViewport({width:900, height:200});
    let capture = await page.screenshot();
    expect(capture).toMatchImageSnapshot({customDiffConfig:{
      threshold:0.001 //very small threshold
    }});
  }, 10000)

  test('Shows skip link', async () => {
    await page.reload();
    await page.press('Tab'); //tab to skip link (should be first!)

    await page.setViewport({width:900, height:200});
    let capture = await page.screenshot({clip:{x:0,y:0,width:400,height:100}});
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