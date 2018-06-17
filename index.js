const puppeteer = require("puppeteer");
const { extractMarvelHeros } = require("./extractor");
const fs = require("fs");
//config
const MARVEL_HEROS_LINK = "http://marvel.com/characters/browse";
const HEADLESS = true;

 
(async () =>{
  const browser = await puppeteer.launch({ headless : HEADLESS });
  //we initialized browser i.e created a browser window just like opening it.
  //adding an headless option will make driver run fast and without actual brow
  //ser opening it . i.e browser will run in background isnt it cool?
  const marvelPage = await browser.newPage();
  //now you can assemble your avengers
  await marvelPage.goto(MARVEL_HEROS_LINK,  { waitUntil : "networkidle2" });

  const marvelHeros = await extractMarvelHeros(
    browser,
    marvelPage 
  );
  
  marvelHeros.each( hero =>{
    fs.appendFile("heros.json",hero); 
  });
  await browser.close();
})();
