var maths = require('./maths.json');
var katex = require('katex');

console.log(maths.length);
console.log();

var errors = {};

for (var i = 0; i < maths.length; i++) {
    var math = maths[i].trim();
    if (math !== '') {
        try {
            var html = katex.renderToString(math);
        } catch (e) {
            var msg = e.message.substring('KaTeX parse error: '.length);

            // print out only some of the messages to see examples of a 
            // particular error
            if (msg.indexOf("as argument to '\\blue'") !== -1) {
                console.log(msg + '    ' + math);
            }
            
            msg = msg.replace(/\n/g, '');
            msg = msg.replace(/at position [0-9]+.*/g, '');
            
            if (!errors.hasOwnProperty(msg)) {
                errors[msg] = 1;
            }
            errors[msg] += 1;
        }
    }
}

console.log();

Object.keys(errors).forEach(function(msg) { 
    var count = errors[msg];
    console.log(count + "\t" + msg);
});
