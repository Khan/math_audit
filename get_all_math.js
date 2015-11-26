var denodeify = require('denodeify');
var fs = require('fs');
var readFile = denodeify(fs.readFile);
var writeFile = denodeify(fs.writeFile);
var rp = require('request-promise');

const MATH_REGEX = /\$(\\\$|[^\$])*\$/g;

var maths = {};

function walk(node) {
    if (!node) {
        return;
    }
    if (typeof node === 'object') {
        if (Array.isArray(node)) {
            node.forEach(function(child) {
                walk(child);
            });
        } else {
            Object.keys(node).forEach(function(key) {
                walk(node[key]);
            });
        }
    } else if (typeof node === 'string') {
        if (MATH_REGEX.test(node)) {

            var regex = /\$(\\\$|[^\$])*\$/g;
            var matches = regex.exec(node);
            while (matches != null) {
                var math = matches[0];
                maths[math.substring(1,math.length-1)] = true;
                matches = regex.exec(node);
            }
        }
    }
}


async function main() {
    var json = await readFile('item_ids.json');
    var ids = JSON.parse(json);
    console.log(ids.length);
    var count = ids.length;
    
    for (var i = 0; i < count; i++) {
        if (i % 25 === 0) {
            console.log((100 * i / count).toFixed(2) + '%');
        }
        var id = ids[i];
        var url = 'http://localhost:8080/api/v1/assessment_items/' + id;
        var body = await rp(url);
        
        var item = JSON.parse(body);
        var item_data = JSON.parse(item.item_data);
        
        walk(item_data);
    }

    maths = Object.keys(maths);
    maths.sort();
    maths = JSON.stringify(maths);
    
    try {
        await writeFile('maths.json', maths, { encoding: 'utf8' });
    } catch(e) {
        console.log(e);
    }
}

main();
