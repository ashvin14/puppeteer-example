const puppeteer = require("puppeteer");

const extractMarvelHeros = async (browser,page) =>{
  let marvelHeros =[];
  const marvelHeroLinks =  await extractMarvelHeroLinksFromPages(page);
  await page.close();
  for ( let marvelHeroLink of marvelHeroLinks ){
     console.log(`working on ${marverHeroLink} ...`); 
     let myMarvelHeroPage = await browser.newPage();
      await myMarvelHeroPage.goto(marvelHeroLink,{ waitUntil : "networkidle2", timeout : 80000 });
      let extractedSuperHero =  await extractSuperHero(marvelHeroLink,myMarvelHeroPage);
      await marvelHeros.push(extractedSuperHero);
      console.log(marvelHeros);
      await myMarvelHeroPage.close();
  }
  return marvelHeros;
}

const extractMarvelHeroLinksFromPages = page =>{
  return page.evaluate(() =>{
  // The active div's where Our hero links resides are encapsulated in JCMultiRow>row-item>row-item-image 
  const marvelHeroGrid = document.querySelector(".JCMultiRow"); 
  const marvelHeroProfiles = marvelHeroGrid.querySelectorAll(".row-item"); 
  const marvelHeroLinks = []; 

     marvelHeroProfiles.forEach( marvelHero => { 
        if(!marvelHero) return false;
        else {
          const marvelHeroLink = marvelHero.querySelector(".row-item-image > a");
          marvelHeroLinks.push(marvelHeroLink.href);          
        }
     })
   return marvelHeroLinks;  
  });  
}

const extractSuperHero = async (heroUrl,page) =>{
  console.log(heroUrl);
  let myMarvelHeroJSON = await extractJSONfromHero(page);
  return myMarvelHeroJSON; 
}

const extractJSONfromHero = page =>{
  return page.evaluate(()=>{
     let marvelJSON = {} 
     marvelJSON.name = document.querySelector(".featured-item-title > a.nameTitle").innerText;
     let metaDetails  = document.querySelector(".featured-item-meta").querySelectorAll("div");
    if (!metaDetails) return {  };
     metaDetails.forEach ( (metaDetail) =>{
       let innerElement =  metaDetail.querySelector("span");
        if(innerElement){
           marvelJSON[metaDetail.querySelector("strong").innerText] = metaDetail.querySelector("span").innerText;
         }
  
     })
     return marvelJSON;
  })
 
}
module.exports = {
  extractMarvelHeros
}
