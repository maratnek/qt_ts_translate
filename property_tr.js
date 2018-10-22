console.log('Property translate js');
console.log('Find all labels');

let option = {
    path_xml: 'ru',
    path_out: 'ru/trans',
    tag_attrib: [
        { tag: 'PropertyGroup', attrib: 'label' },
        { tag: 'SourceProxy', attrib: 'label' },
        { tag: 'ContextViewProxy', attrib: 'label' },
        { tag: 'ComparativeViewProxy', attrib: 'label' },
        { tag: 'OrthographicSliceViewProxy', attrib: 'label' },
        { tag: 'PlotMatrixViewProxy', attrib: 'label' },
        { tag: 'MultiSliceViewProxy', attrib: 'label' },
        { tag: 'ViewProxy', attrib: 'label' },
        
    ],
    dictionary_file: 'dictionary_prop.json'
};

// find all xml files
// create phrase map use labels
// create from phrase map to dictionary_file (for the accumulate)
// get new phrase map with translation
// create path out 
// create new translate xml files with use translation phrase map

let fs = require('fs');
let DOMParser = require('xmldom').DOMParser;
var xmlserializer = require('xmlserializer');

let parser = new DOMParser();

function getXMLDoc(fileNameFull) {
    let xmlData = fs.readFileSync(fileNameFull);
    return parser.parseFromString(xmlData.toString(), "application/xml");
}

function addNewContext(doc, map, tag, label) {
    let tagDoc = doc.getElementsByTagName(tag);
    for (let elem in tagDoc) {
        if (tagDoc[elem].hasAttribute) {
            //console.log(tag, label, tagDoc[elem].getAttribute(label));
            map.set(tagDoc[elem].getAttribute(label), '');
        }
    }
}

function everyContext(fileNameFull, map, option) {
    console.log('File name: ', fileNameFull);
    let doc = getXMLDoc(fileNameFull);
    for (let attr of option.tag_attrib) {
        addNewContext(doc, map, attr.tag, attr.attrib);
    }
}

function replaceContext(doc, map, tag, label) {
    let tagDoc = doc.getElementsByTagName(tag);
    let j = 0;
    for (let elem in tagDoc) {
        if (tagDoc[elem].hasAttribute) {
            let name = tagDoc[elem].getAttribute(label);
            if (name) {
                name = map.get(name);
                //console.log(name);
                if (name)
                    tagDoc[elem].setAttribute(label, name);
            }
        }
    }
    return doc;
}

function replaceEveryContext(fileNameFull, map, newPath, option) {
    console.log('File name: ', fileNameFull, newPath);
    let doc = getXMLDoc(fileNameFull);
    for (let attr of option.tag_attrib) {
        replaceContext(doc, map, attr.tag, attr.attrib);
    }
    let data = xmlserializer.serializeToString(doc);
    fs.writeFile(newPath, data, (err) => {
        console.log(err);
    });
}


function findLabels(fileNameFull, map) {
    let doc = getXMLDoc(fileNameFull);
    addNewContext(doc, map, 'PropertyGroup', 'label');
}

function replaceLabels(fileNameFull, map, newPath) {
    let doc = getXMLDoc(fileNameFull);
    replaceContext(doc, map, newPath, 'PropertyGroup', 'label');
    let data = xmlserializer.serializeToString(doc);
    fs.writeFile(newPath, data, (err) => {
        console.log(err);
    });
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
                        //findLabels(file, LabelMap);
                        everyContext(file, LabelMap, option);
                        if (i + 1 == files.length)
                            res(count);
                    }

                }).then((count) => {
                    let i = 0;
                    console.log(count);
                    console.log(LabelMap.size);
                    const Dictionary = require('./create_dictonary');
                    let dict = new Dictionary();
                    dict.addNewValues(LabelMap);
                    //console.log(dict.getMap());
                    LabelMap = dict.getMap();
                    for (let i = 0; i < files.length; i++) {
                        let file = files[i];
                        file = 'ru/' + file;
                        let new_file = 'trans/' + file;
                        //replaceLabels(file, LabelMap, new_file);
                        replaceEveryContext(file, LabelMap, new_file, option);
                        console.log('replace');
                    }

                })
            })
        }
    })
})

