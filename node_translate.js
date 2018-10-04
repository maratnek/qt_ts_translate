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

//fs.readFile('GeoMehanika_ru.ts', (err, data) => {
//    if (err) throw err;
//    console.log(data)
//});
var xml = require('fs').readFileSync('GeoMehanika_ru.ts', 'utf8');
//var options = { compact: true, ignoreComment: true, spaces: 4 };
var result = convert.xml2js(xml);
console.log(result);
async function transObj(result)
{
    for(let elem of result.elements[1].elements)
    {
    //console.log(elem);
        for(let subelem of elem.elements)
        {
            if (subelem.name == 'name')
                console.log(subelem);
            else if (subelem.name == 'message') {
                //console.log(subelem);
                let source_text = subelem.elements[0].elements[0].text;
                //let source_text = subelem.elements[1].elements[0].text;
                {
                    console.log(source_text);
                    subelem.elements[1].elements = [];

                    let promise = new Promise((resolve, reject)=>{
                        translate.translate(source_text, { to: 'ru' }, (err, res) => {
                            subelem.elements[1].elements.push({ type: 'text', text: res.text });
                            resolve(res.text);
                        });
                    });
                    let result = await promise;

                }
            }
        }
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
                //let source_text = subelem.elements[0].elements[0].text;
                ////let source_text = subelem.elements[1].elements[0].text;
                //{
                //    console.log(source_text);
                //    subelem.elements[1].elements = [];
                //    subelem.elements[1].elements.push({ type: 'text', text: source_text + 'translate' });

                //}
            }
        }
    }
}

transObj(result);
show(result);
let xmlNew = convert.js2xml(result);

fs.writeFileSync('GeoNew_ru.ts', xmlNew);

//var json = convert.xml2json(xml);
//console.log(json);
//var res = convert.xml2js()

//console.log(convert);