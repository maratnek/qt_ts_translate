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


var xml = fs.readFileSync('GeoMehanika_ru.ts', 'utf8');
//var options = { compact: true, ignoreComment: true, spaces: 4 };
var tsJsObj = convert.xml2js(xml);
console.log(tsJsObj);

let jsonTS = [];
let allSentence = getAllSentence(tsJsObj);
////for (let sentence of allSentence)
for (let i = 0; i < allSentence.length; i++)
{
    //console.log(allSentence[i]);
    jsonTS.push({id: i, sT: allSentence[i]});
}
//fs.writeFileSync('all_sentence.json', JSON.stringify(jsonTS));

try {
//    if (jsonTS.length)
//        creatyDictionary(jsonTS);
}
catch(error)
{
    console.log('Error change translation dictionary');
}

MergeTsAndXmlTs();

///////////////////////////////////////////////////////////////////////
// All the merge
function findDictionaryWord(word, obj)
{
    for (let elem of obj)
    {
        //console.log(elem);
        if (elem.sT === word)
            return elem.translru;
    }
    return false;

}

function MergeTsAndXmlTs()
{
    let json = fs.readFileSync('dictionary_ru.json', 'utf8');
    let obj = JSON.parse(json);
    // for by all ts tags

    for(let elem of tsJsObj.elements[1].elements)
    {
        for(let subelem of elem.elements)
        {
            //console.log(subelem);

            if (subelem.name == 'message') {
                let transRu = '';
                for (let [i,elem] of subelem.elements.entries())
                {
                    console.log(elem);
                    if (elem.name == 'source')
                    {
                        console.log(elem.elements[0].text);
                        transRu = findDictionaryWord(elem.elements[0].text, obj);
                        console.log(transRu[0]);
                    }
                    else if (elem.name == 'translation' && transRu)
                    {
                        subelem.elements[i].elements = [];
                        subelem.elements[i].elements.push(
                            { 
                                type: 'text', text: transRu[0] 
                            }
                        );
                    }
                }
            }
        }
    }

    show(tsJsObj);

  let xmlNew = convert.js2xml(tsJsObj);
  fs.writeFileSync('GeoNew_ru.ts', xmlNew);

}


///////////////////////////////////////////////////////////////////////
// old old
//transObj(tsJsObj, (newObj)=>{
//  let xmlNew = convert.js2xml(newObj);
//  fs.writeFileSync('GeoNew_ru.ts', xmlNew);
//});
//show(tsJsObj);

async function rusTranslate(sentence) {
    console.log(sentence);
  let promise = new Promise((resolve,reject)=>{
      //setTimeout(() => resolve(sentence + 'translate my'), 2000);
      //resolve(sentence);
      if (sentence)
      {
          translate.translate(sentence, { to: 'ru' }, (err, trResult) => {
              if (err) 
                  resolve('error translate');
              else
              {
                  console.log(trResult.text);
                  resolve(trResult.text);
              }
          });
      }
  });
  let result = await promise;
  return result;
}

// create translation dictionary
async function creatyDictionary(jsonTS)
{
    let readFile = false;
    let json;
    try {
        let json = fs.readFileSync('dictionary_ru.json', 'utf8');
        let readFile = true;
        //console.log('not undefined');
    }
    catch (err)
    {
        console.log(err);
    }
    if (readFile)
    {
        let dicJson = JSON.parse(json);
        for (let i = 0; i < jsonTS.length; i++)
        {
            let transRu = findDictionaryWord(jsonTS[i], dicJson);
            if (transRu)
                jsonTS[i].translru = transRu;
            else
                jsonTS[i].translru = await rusTranslate(jsonTS[i].sT);
            console.log(jsonTS[i]);
        } 
    }
    else
    {
        console.log('translate');
        console.log(jsonTS.length);
        for (let i = 0; i < jsonTS.length; i++)
        {
            console.log(jsonTS[i]);
            jsonTS[i].translru = await rusTranslate(jsonTS[i].sT);
            console.log(jsonTS[i]);
        }
    }
    console.log('write file');
    fs.writeFileSync('dictionary_ru.json', JSON.stringify(jsonTS));
    return jsonTS;
}


function getAllSentence(xmlTS)
{
    let allSentence = [];
    //console.log('xmlTs', xmlTS);
    for(let elem of xmlTS.elements[1].elements)
    {
        for(let subelem of elem.elements)
        {
            if (subelem.name == 'message') {
                for (source of subelem.elements)
                {
                    if (source.name == 'source')
                    {
                        console.log(source.elements[0].text);
                        allSentence.push(source.elements[0].text);
                    }
                }
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
                console.log(subelem.elements[0]);
                console.log(subelem.elements[1]);
            }
        }
    }
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
