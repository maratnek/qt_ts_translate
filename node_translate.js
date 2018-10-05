var translate = require('yandex-translate')('trnsl.1.1.20181004T120928Z.b906e018477d23d6.f087473879a9a774d61c762c5ea92e96b28c11dd');
var fs = require('fs');
var convert = require('xml-js');

//translate.translate('Hi. How are you bro?', { to: 'ru' }, (err, res) => {
//  console.log(res.text);
//});

//translate.detect('Граждане Российской Федерации имеют право собираться мирно без оружия, проводить собрания, митинги и демонстрации, шествия и пикетирование', function(err, res) {
//   // res.lang -> 'ru'
//    console.log(res.lang);
//});


var xml = require('fs').readFileSync('GeoMehanika_ru.ts', 'utf8');
//var options = { compact: true, ignoreComment: true, spaces: 4 };
var tsJsObj = convert.xml2js(xml);
console.log(tsJsObj);

///////////////////////////////////////////////////////////////////////
// All the merge
function findWord(word, obj)
{
    for (let elem of obj)
    {
        //console.log(elem);
        if (elem.sT === word)
            return elem.translRu;
    }
    return false;

}

function MergeTsAndXmlTs()
{
    let json = fs.readFileSync('translate.json', 'utf8');
    let obj = JSON.parse(json);
    // for by all ts tags

    for(let elem of tsJsObj.elements[1].elements)
    {
        for(let subelem of elem.elements)
        {
            //console.log(subelem);
            if (subelem.name == 'message') {
                let source_text = subelem.elements[0].elements[0].text;
                {
                    console.log('source' + source_text);
                    subelem.elements[1].elements = [];
                    subelem.elements[1].elements.push(
                        { 
                            type: 'text', text: findWord(source_text,obj) 
                        }
                    );
                }
            }
        }
    }

    show(tsJsObj);

  let xmlNew = convert.js2xml(tsJsObj);
  fs.writeFileSync('GeoNew_ru.ts', xmlNew);

}

MergeTsAndXmlTs();

///////////////////////////////////////////////////////////////////////

//transObj(tsJsObj, (newObj)=>{
//  let xmlNew = convert.js2xml(newObj);
//  fs.writeFileSync('GeoNew_ru.ts', xmlNew);
//});
//show(tsJsObj);
//let jsonTS = [];
//let allSentence = getAllSentence(tsJsObj);
////for (let sentence of allSentence)
//for (let i = 0; i < allSentence.length; i++)
//{
//    console.log(allSentence[i]);
//    jsonTS.push({id: i, sT: allSentence[i]});
//}



//fs.writeFileSync('allSentence.json', JSON.stringify(jsonTS));
async function rusTranslate(sentence) {
  let promise = new Promise((resolve,reject)=>{
      //setTimeout(() => resolve(sentence + 'translate my'), 2000);
      //resolve(sentence);
      translate.translate(sentence, { to: 'ru' }, (err, trResult) => {
          if (err) 
              resolve('error translate');
          else
          {
              resolve(trResult.text);
              console.log(trResult.text);
          }
      });
  });
  let result = await promise;
  return result;
}

async function WriteFileTs()
{
   // await (new Promise((res2, rej2)=>{
        for (let i = 0; i < jsonTS.length; i++)
        {
            console.log(jsonTS[i].sT);
            jsonTS[i].translRu = await rusTranslate(jsonTS[i].sT);
            console.log(jsonTS[i]);

            //translate.translate('Hi.Howareyoubro?', { to: 'ru' }, (err, res) => {
            //    if (err)
            //        console.log('Error',err);
            //    else
            //        console.log(res.text);
            //});
        } 
    //    res2(true);
    //}));
    console.log('write file');
    fs.writeFileSync('translate2.json', JSON.stringify(jsonTS));
}

try {
    //WriteFileTs();
}
catch(error)
{
    fs.writeFileSync('translate2.json', JSON.stringify(jsonTS));
}

async function transObj(result, cb)
{
    for(let elem of result.elements[1].elements)
    {
        for(let subelem of elem.elements)
        {
            if (subelem.name == 'name')
                console.log(subelem);
            else if (subelem.name == 'message') {
                let source_text = subelem.elements[0].elements[0].text;
                {
                    //console.log('source' + source_text);
                    subelem.elements[1].elements = [];

                    let promise = new Promise((resolve, reject)=>{
                      resolve(rusTranslate(source_text));
                    });
                    let translation = await promise;
                    subelem.elements[1].elements.push({ type: 'text', text: translation });
                }
            }
        }
	cb(result);
    }
}

function getAllSentence(xmlTS)
{
    let allSentence = [];
    for(let elem of xmlTS.elements[1].elements)
    {
        for(let subelem of elem.elements)
        {
            if (subelem.name == 'name')
                console.log(subelem);
            else if (subelem.name == 'message') {
                //console.log(subelem.elements);
                //console.log(subelem.elements[0].elements[0].text);
                //console.log(subelem.elements[1]);
                let text = subelem.elements[0].elements[0].text;
                console.log(text);
                allSentence.push(text);
            }
        }
    }
    return allSentence;
}

function show(result)
{
    for(let elem of result.elements[1].elements)
    {
        for(let subelem of elem.elements)
        {
            if (subelem.name == 'name')
                console.log(subelem);
            else if (subelem.name == 'message') {
                console.log(subelem.elements);
                console.log(subelem.elements[0].elements[0].text);
                console.log(subelem.elements[1]);
            }
        }
    }
}
