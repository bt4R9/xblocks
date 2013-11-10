if (typeof require == 'function') {
    /*jshint -W020 */
    //strftime = require('../../strftime');
    /*jshint -W020 */
    expect = require('expect.js');
}

describe('button', function() {

    it('по умолчанию текущая дата', function() {
        var data = {
            content: 'nop',
            attrs: {
                name: 'test',
                //href: 'http://ya.ru',
                //target: '_blank',
                //'xb-checked': true,
                'xb-size': 's',
                disabled: false
                //'xb-theme': 'normal'
            }
        };

        var div = document.createElement('div');
        div.innerHTML = yr.run('xb-button', data, 'xb-button');

        document.getElementById('mocha').appendChild(div.firstChild);

        div = document.createElement('div');
        div.innerHTML = yr.run('xb-field', data, 'xb-field');

        document.getElementById('mocha').appendChild(div.firstChild);

        //console.log(div.firstChild, mocha);
    });


});