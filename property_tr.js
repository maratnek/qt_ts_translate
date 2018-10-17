console.log('Property translate js');

console.log('Find all labels');

let convert = require('xml-js');
let fs = require('fs');
let DOMParser = require('xmldom').DOMParser;

//let xml = fs.readFileSync('ru/views_and_representations.xml');
let xml = fs.readFileSync('ru/3d_widgets.xml');
let json = convert.xml2json(xml);
//console.log(json);

//let map = new Map();
//let doc = new DOMParser().parseFromString(xml, 'text/xml');

let parser = new DOMParser();
let doc = parser.parseFromString(xml.toString(), "application/xml");

//let propGroup = doc.documentElement;
//console.log(propGroup);
let label = doc.documentElement.getAttribute('label');
console.log(label);


label = doc.getElementsByTagName('PropertyGroup');
//label = doc.getAttributeNode('label');
for(let elem in label)
{
    //console.log(elem);
    //console.log(label[elem]);
    //console.info(label[elem]);
    //label[elem].getAttributeNode('label');
    console.log(label[elem].tagName);
    if (label[elem].hasAttribute)
        console.log(label[elem].getAttribute('label'));
}
//console.log(label);
