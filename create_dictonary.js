let translate = require('yandex-translate')('trnsl.1.1.20181004T120928Z.b906e018477d23d6.f087473879a9a774d61c762c5ea92e96b28c11dd');
let fs = require('fs');

function mapToJson(map) {
    return JSON.stringify([...map]);
}
function jsonToMap(jsonStr) {
    return new Map(JSON.parse(jsonStr));
}

class Dictionary {
    constructor(fileName = 'dictionary_prop.json') {
        this._fileName = fileName;
        console.log('Dictionary constructor create');
        if (this.readFile()){
            //console.log('Read File', this._json);
            try {
                this._map = jsonToMap(this._json);
            } catch(err){
                //console.log(err, 'Create new map');
                this._map = new Map();
            }
        } else {
            console.log('Not Read File');
            fs.writeFileSync(this._fileName, mapToJson(new Map()));
        }
    };
        ///////////////
        readFile() {
            try {
                this._json = fs.readFileSync(this._fileName, 'utf8');
                return true;
            }
            catch (err) {
                //console.log(err);
                return false;
            }
        };
        async addNewValues(map){
            //console.log(map.size);
            let i = 0;
            for (let [key, value] of map.entries()) {
                let value = this._map.get(key)
                if (value) {
                   //console.log(++i, ' ', key, ' -found- ' , value);
                } else {
                    console.log('translate');
                    if (key)
                    {
                        let translate = await rusTranslate(key);
                        this._map.set(key, translate);
                        console.log(translate);
                    }
                }
            }
            fs.writeFileSync(this._fileName, mapToJson(this._map) );
    };
    ////////////////////
    //findDictionaryWord(word){
    //    for (let [key,value] of this._map.entries()) {
    //        //console.log(elem);
    //        if (key === word)
    //            return value;
    //    }
    //return false;
    //}
            getMap() {
                return this._map;
            }
}

module.exports = Dictionary;


async function rusTranslate(sentence) {
    console.log(sentence);
    let promise = new Promise((resolve,reject)=>{
        if (sentence)
        {
            translate.translate(sentence, { to: 'ru' }, (err, trResult) => {
                if (err) 
                    resolve('error translate');
                else
                    resolve(trResult.text);
            });
        }
    });
    let result = await promise;
    return result;
}

