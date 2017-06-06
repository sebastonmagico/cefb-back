'use strict';

module.exports = (function() {
    var utils = {
        strictFields: ['isbn', 'cdu'],
        nonStrictFields: ['name', 'author', 'editor'],
        strictFilter: function(obj, param){
            if(obj[param.name]){
                return obj[param.name] == param.value;
            }
            return false;
        },
        nonStrictFilter: function(obj, param){
            if(obj[param.name]){
                return obj[param.name].search(param.value) >= 0;
            }
            return false;
        },
        filter: function(obj, param){
            if(this.strictFields.indexOf(param.name) > 0){
                return this.strictFilter(obj, param);
            }
            if(this.nonStrictFields.indexOf(param.name) > 0){
                return this.nonStrictFilter(obj, param);
            }
            return false;
        },
        validateUserData: function(obj){
            console.log(obj);
            return true;
        },
        randomNumber: function(){
            return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
        }
    };
    return utils;
})();