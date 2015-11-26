var http = require('http');
var fs = require('fs');

http.get({
    host: 'localhost',
    path: '/api/v1/exercises',
    port: 8080
}, function(response) {
    var body = '';
    response.on('data', function(d) {
        body += d;
    });
    response.on('end', function() {
        var exercises = JSON.parse(body);
        var ids = [];

        exercises.forEach(function(exercise) {
            if (!exercise.deleted && exercise.uses_assessment_items) {
                exercise.problem_types.forEach(function(problem_type) {
                    problem_type.items.forEach(function(item) {
                        return ids.push(item.id);
                    });
                });
            }
        });

        fs.writeFile('item_ids.json', JSON.stringify(ids));
    });
});
