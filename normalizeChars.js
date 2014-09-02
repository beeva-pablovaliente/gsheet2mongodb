exports.normalize = function (string){
    var res = '';
    var i=0;

    var toLower = string.toLowerCase();

    for (i = 0; i < toLower.length ; i++){
        res += replaceChar(toLower[i]);
    }

    return res;
}

function replaceChar(char){
    switch(char){
        case 'á': return 'a';
        case 'é': return 'e';
        case 'í': return 'i';
        case 'ó': return 'o';
        case 'ú': return 'u';
        case ' ': return '_';
        case 'ñ': return 'n';
        case '@': return '';
        case '.': return '_';
        default: return char;
    }
}