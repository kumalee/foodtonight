var areas = require('./area.js');
var fs = require('fs');

var newArea = {};

for (var i in areas){
    newArea[i] = [];
    areas[i].forEach(function(n,k){
        if(n.name!='市辖区'){
            newArea[i].push(n);
        }
    });
}

var str = JSON.stringify(newArea, ' ', 2) + '\n';

console.log(str);


fs.writeFileSync('areaNew.js', str);