exports.normalize = function (string){
    var res = '';
    var i=0;

    for (i = 0; i < string.length ; i++){
        res += replaceChar(string[i]);
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
        default: return char;
    }
}