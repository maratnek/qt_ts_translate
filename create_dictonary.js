// Dictionary class for work with translations
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
        if (this.readFile()) {
            try {
                this._map = jsonToMap(this._json);
            } catch(err){
                this._map = new Map();
            }
        } else {
            console.log('Not Read File');
            fs.writeFileSync(this._fileName, mapToJson(new Map()));
        }
    };
    ///////////////
    // try to read dictonary_prop.json
    readFile() {
       try {
           this._json = fs.readFileSync(this._fileName, 'utf8');
           return true;
       }
       catch (err) {
           return false;
       }
    };
    // add new key word for our dictionary
    async addNewValues(map) {
        let i = 0;
        for (let [key, value] of map.entries()) {
            let value = this._map.get(key)
            if (!value) {
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
        map = this._map;
    };
    getMap() {
        return this._map;
    }
}

module.exports = Dictionary;

// function for the translate from english to russian
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

