exports.parse = function (input) {
    var inputString = input.toString();
    // ------- Tokenizer ------- //
    var sym = {
        none: 'none', eof: 'eof', error: 'error',
        plus: 'plus', minus: 'minus',
        times: 'times', div: 'div',
        dice: 'dice',
        leftParenthesis: 'leftParenthesis', rightParenthesis: 'rightParenthesis',
        number: 'number', identifier: 'identifier'
    };

    var sy = '';
    var syCnr = 0;
    var syLnr = 0;
    var syCnrPrev = 0;
    var numberVal = 0;
    var identifierStr = '';

    var eof = String.fromCharCode(0);
    var tab = String.fromCharCode(9);
    var ws = String.fromCharCode(32);

    var ch = '';
    var chCnr = 0;


    function newCh() {
        //console.log('chCnr: ', chCnr, ' inputString.length: ', inputString.length);
        if (chCnr < (inputString.length)) {
            ch = inputString.charAt(chCnr);
            //console.log('ch1: ', inputString.charAt(chCnr));
            chCnr++;
        } else {
            ch = eof;
        }
    }

    function newSy() {
        var numberStr = '';

        while ((ch == ws) || (ch == tab)) {
            newCh();
        }
        syCnrPrev = syCnr;
        syCnr = chCnr;
        //console.log('ch: ', ch);
        switch (ch) {
            case eof:
                sy = sym.eof;
                newCh();
                break;
            case '+':
                sy = sym.plus;
                newCh();
                break;
            case '-':
                sy = sym.minus;
                newCh();
                break;
            case '*':
                sy = sym.times;
                newCh();
                break;
            case '/':
                sy = sym.div;
                newCh();
                break;
            case '(':
                sy = sym.leftParenthesis;
                newCh();
                break;
            case ')':
                sy = sym.rightParenthesis;
                newCh();
                break;
            case (ch.match(/^[a-zA-Z]+$/) || {}).input:
                identifierStr = '';
                while (ch.match(/^[a-zA-Z_]+$/)) {
                    identifierStr = identifierStr.concat(ch.toLowerCase());
                    newCh();
                }

                if (identifierStr == 'd') {
                    sy = sym.dice;
                } else {
                    sy = sym.identifier;
                }
                break;
            case (ch.match(/^[0-9]/) || {}).input:
                sy = sym.number;
                numberStr = '';
                while (ch.match(/^[0-9]/)) {
                    numberStr = numberStr.concat(ch);
                    newCh();
                }
                numberVal = parseInt(numberStr);
                break;
        }

    }

    function initScanner() {
        chCnr = 0;
        newCh();
        newSy();
    }

    // ------- Parser ------- //
    var success = false;
    var result = {type: '', content: [], input: inputString, exception: '', result: ''};


    function syIsNot(expected) {
        success = success && (sy == expected);
        return !success;
    }

    function syntaxError(message, syLnr, syCnr) {
        success = false;
        result.exception = {message: message, ln: syLnr, col: syCnr};
        return 'error';
    }

    function s() {
        var resultS;
        success = true;
        resultS = expr();
        if (!success) {
            return 'error';
        }

        return resultS;
    }

    function expr() {
        var resultExpr;
        resultExpr = term();
        if (!success) {
            return 'error';
        }
        while ((sy == sym.plus) || (sy == sym.minus)) {
            switch (sy) {
                case sym.plus:
                    result.content.push({type: 'operator', value: '+'});
                    newSy();
                    resultExpr += term();
                    if (!success) {
                        return 'error';
                    }
                    break;
                case sym.minus:
                    result.content.push({type: 'operator', value: '-'});
                    newSy();
                    resultExpr -= term();
                    if (!success) {
                        return 'error';
                    }
                    break;
            }
        }

        return resultExpr;
    }

    function term() {
        var resultTerm;
        resultTerm = dice();
        if (!success) {
            return 'error';
        }
        //console.log('Term: ' + resultTerm);
        while ((sy == sym.times) || (sy == sym.div)) {
            switch (sy) {
                case sym.times:
                    result.content.push({type: 'operator', value: '*'});
                    newSy();
                    resultTerm *= dice();
                    if (!success) {
                        return 'error';
                    }
                    break;
                case sym.div:
                    result.content.push({type: 'operator', value: '/'});
                    newSy();
                    resultTerm /= dice();
                    if (!success) {
                        return 'error';
                    }
                    if (resultTerm == Infinity) {
                        return syntaxError('Error: Division by zero!', syLnr, syCnrPrev);
                    }
                    break;
            }
        }
        return resultTerm;
    }

    function dice() {
        var resultDice;
        var quantity;
        var sides;
        var resultRoll;
        resultDice = fact();
        if (!success) {
            return 'error';
        }
        if (sy == sym.dice) {
            quantity = resultDice;
            resultDice = 0;
            newSy();
            if (syIsNot(sym.number)) {
                return syntaxError('Error: expected number!', syLnr, syCnr);
            }
            result.content.splice(result.content.length - 1, 1);
            sides = fact();
            if (!success) {
                return 'error';
            }
            result.content.splice(result.content.length - 1, 1);

            result.content.push({type: 'parenthesis', value: '('});

            for (var i = 0; i < quantity; i++) {
                resultRoll = Math.floor((Math.random() * sides) + 1);
                result.content.push({type: 'dice', value: resultRoll, sides: sides});
                if (i < quantity - 1) {
                    result.content.push({type: 'operator', value: '+'});
                }
                resultDice += resultRoll;
            }

            result.content.push({type: 'parenthesis', value: ')'});
        }
        return resultDice;
    }

    function fact() {
        var resultFact = 0;
        switch (sy) {
            case sym.number:
                result.content.push({type: 'number', value: numberVal});
                resultFact = numberVal;
                newSy();
                break;
            case sym.identifier:

                return syntaxError('Error: "' + identifierStr + '" not found!', syLnr, syCnr);
                /*var identifierVal = document.getElementById(identifierStr);

                 if (!identifierVal) {

                 } else if (identifierVal.value) {
                 identifierVal = identifierVal.value;
                 } else if (identifierVal.innerHTML) {
                 identifierVal = identifierVal.innerHTML;
                 } else {
                 return syntaxError('Error: "' + identifierStr + '" has no content!', syLnr, syCnr);
                 }

                 if (isNaN(parseFloat(identifierVal))) {
                 return syntaxError('Error: "' + identifierStr + '" is not a number!', syLnr, syCnr);
                 }

                 resultFact = parseFloat(identifierVal);*/
                resultFact = identifierStr;
                result.content.push({type: 'identifier', value: resultFact});
                newSy();
                break;
            case sym.leftParenthesis:
                result.content.push({type: 'parenthesis', value: '('});
                newSy();
                resultFact = expr();
                if (!success) {
                    return 'error';
                }

                if (sy != sym.rightParenthesis) {
                    return syntaxError('Error: expected right parenthesis!', syLnr, syCnr);
                }

                result.content.push({type: 'parenthesis', value: ')'});
                newSy();
                break;
            default:
                return syntaxError('Error: "' + sy + '" not expected!', syLnr, syCnr);
        }

        return resultFact;
    }

    initScanner();
    result.result = s(result);
    console.log(result);
    return result;
}

exports.diceResultToString = function (result) {

    var entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": '&#39;',
        "/": '&#x2F;'
    };

    function escapeHtml(string) {
        return String(string).replace(/[&<>"'\/]/g, function (s) {
            return entityMap[s];
        });
    }

    var message = '';

    if (result.result !== 'error') {

        for (var i = 0; i < result.content.length; i++) {
            /*if (result.content[i].type === 'dice') {
             if (result.content[i].value === result.content[i].sides) {
             message += '<span class="rollCriticalSuccess">';
             } else if (result.content[i].value === 1) {
             message += '<span class="rollCriticalFailure">';
             }
             }*/
            message += result.content[i].value;

            if (result.content[i].type === 'dice') {
                /*if (result.content[i].value === result.content[i].sides || result.content[i].value === 1) {
                 message += '</span>';
                 }*/

                message += '[d' + result.content[i].sides + ']';
            }

            message += ' ';
        }

        message += '= ' + result.result;
    } else {
        //noinspection JSCheckFunctionSignatures,JSCheckFunctionSignatures
        message = result.exception.message;
    }
    return message;
}