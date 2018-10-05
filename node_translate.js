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

transObj(tsJsObj, (newObj)=>{
  let xmlNew = convert.js2xml(newObj);
  fs.writeFileSync('GeoNew_ru.ts', xmlNew);
});

async function rusTranslate(sentence) {
  console.log(sentence);
  let result = await (new Promise((res,rej)=>{

    translate.translate(sentence, { to: 'ru' }, (err, trResult) => {
      if (err) 
	res('error translate');
      else
      {
      	res(trResult.text);
	console.log(trResult.text);
      }
    });
  }));
  return result;
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

function show(result)
{
    for(let elem of result.elements[1].elements)
    {
        for(let subelem of elem.elements)
        {
          console.log(subelem);
            if (subelem.name == 'name')
                console.log(subelem);
            else if (subelem.name == 'message') {
                console.log(subelem.elements);
                console.log(subelem.elements[1]);
            }
        }
    }
}
