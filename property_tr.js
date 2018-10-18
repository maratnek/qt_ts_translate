console.log('Property translate js');

console.log('Find all labels');

let convert = require('xml-js');
let fs = require('fs');
let DOMParser = require('xmldom').DOMParser;
let XMLSerializer = require('xmldom').XMLSerializer;

//let xml = fs.readFileSync('ru/views_and_representations.xml');
//let json = convert.xml2json(xml);
//console.log(json);

//let map = new Map();
//let doc = new DOMParser().parseFromString(xml, 'text/xml');

let parser = new DOMParser();
//let doc = parser.parseFromString(xml.toString(), "application/xml");

function DocPutAllLabel() { }

function findLabels(fileNameFull, map) {
    //let map = new Map();
    console.log('Size: ', map.size);
    console.log(fileNameFull);
    let xmlData = fs.readFileSync(fileNameFull);
    let doc = parser.parseFromString(xmlData.toString(), "application/xml");
    let label = doc.getElementsByTagName('PropertyGroup');
    let j = 0;
    for (let elem in label) {
        if (label[elem].hasAttribute) {
            map.set(label[elem].getAttribute('label'), '');
            //console.log(++j, label[elem].getAttribute('label'));
        }
    }
    //return map;
}

function replaceLabels(fileNameFull, map, newPath) {
    //let map = new Map();
    console.log('Replace -- map Size: ', map.size);
    console.log(fileNameFull, newPath);
    let xmlData = fs.readFileSync(fileNameFull);
    let doc = parser.parseFromString(xmlData.toString(), "application/xml");
    let label = doc.getElementsByTagName('PropertyGroup');
    let j = 0;
    for (let elem in label) {
        if (label[elem].hasAttribute) {
            let name = label[elem].getAttribute('label');
            if (name) {
                console.log('label',name);
                name = map.get(name);
                console.log('label',name);
                if (name)
                    label[elem].setAttribute('label', name);
            }
        }
    }
    let data = XMLSerializer.serializeToString(doc);
    console.log(data);
    fs.writeFileSync(newPath, data);
}


let LabelMap = new Map();

let path = 'ru';
let count = 0;
fs.exists(path, (exists) => {
    console.log(exists ? 'it\'s there' : 'not exist');
    fs.lstat(path, (err, stat) => {
        if (err) throw Error('Stat exception');
        if (stat.isDirectory()) {
            console.log('Stat Directory');
            fs.readdir(path, (err, files) => {
                if (err) throw Error('Read dir error')
                new Promise((res, rej) => {
                    for (let i = 0; i < files.length; i++) {
                        let file = files[i];
                        file = 'ru/' + file;
                        findLabels(file, LabelMap);
                        //count += LabelMap.size;

                        if (i + 1 == files.length)
                            res(count);
                    }

                }).then((count) => {
                    let i = 0;
                    //for (var key of LabelMap.keys()) {
                    //    console.log(++i, key);
                    //}
                    console.log(count);
                    console.log(LabelMap.size);
                    const Dictionary = require('./create_dictonary');
                    let dict = new Dictionary();
                    dict.addNewValues(LabelMap);
                    //console.log(dict.getMap());
                    for (let i = 0; i < files.length; i++) {
                        let file = files[i];
                        file = 'ru/' + file;
                        let new_file = 'trans/' + file;
                        replaceLabels(file, LabelMap, new_file);
                        //count += LabelMap.size;

                        //if (i + 1 == files.length)
                        //    res(count);
                    }

                })
            })
        }
    })
})

