var translate = require('yandex-translate')('trnsl.1.1.20181004T120928Z.b906e018477d23d6.f087473879a9a774d61c762c5ea92e96b28c11dd');
var fs = require('fs');
 
//translate.translate('Hi. How are you bro?', { to: 'ru' }, (err, res) => {
//  console.log(res.text);
//});
 
//translate.detect('Граждане Российской Федерации имеют право собираться мирно без оружия, проводить собрания, митинги и демонстрации, шествия и пикетирование', function(err, res) {
//   // res.lang -> 'ru'
//    console.log(res.lang);
//});

fs.readFile('GeoMehanika_ru.ts', (err, data) => {
    if (err) throw err;
    console.log(data)
});
