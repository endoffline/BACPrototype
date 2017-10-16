/**
 * Created by Stefan on 22.04.2017.
 */
var log = [],
    logPosition = 0,
    parserResult,
    isEven = false;

if (typeof(jQuery) != 'undefined') {

    //check if html is loaded and only then execute javascript
    $(document).ready(function () {

        //check if DOM elements exist, then act
        var rollLog = document.querySelector('#rollLog');
        var diceForm = document.querySelector('.diceForm');
        var rollMsg = document.querySelector('#rollMsg');

        if (rollLog) $('#rollLog').html('');
        if (diceForm) $('.diceForm').submit(rollDice);
        if (rollMsg) $('#rollMsg').keyup(getLastMessage);
    });
}

function rollDice(event) {

    var messageText = $('#rollMsg').val();

    $('#rollMsg').val('');

    if (messageText.length > 0) {
        log.push(messageText);
        logPosition = log.length;
        $.post(
            "/dice",
            {rollMsg: messageText},
            function (data) {
                parserResult = data.rollResult;
                displayDiceResult(parserResult);
                $('#rollLog').scrollTop($('#rollLog')[0].scrollHeight + 6);
            },
            "json"
        );
    }

    event.preventDefault();
}

function displayDiceResult(result) {
    if (result) {
        if (result.result === 'error') {
            var errorMessage = result.input.substring(0, result.exception.col - 1)
                + '<span class="bg-danger">'
                + result.input.substring(result.exception.col - 1, result.exception.col)
                + '</span>'
                + result.input.substring(result.exception.col)
                + '<br>'
                + result.exception.message
                + '<br>';

            $('#rollLog').append(errorMessage);
        } else if (result.content.length > 0) {
            var classStr = "rollMessage ";
            classStr += (isEven) ? "even" : "odd";
            isEven = !isEven;
            var rollMessage = '<div class="' + classStr + '">';

            for (var i = 0; i < result.content.length; i++) {
                if (result.content[i].type === 'dice') {
                    if (result.content[i].value === result.content[i].sides) {
                        rollMessage += '<span class="rollCriticalSuccess">';
                    } else if (result.content[i].value === 1) {
                        rollMessage += '<span class="rollCriticalFailure">';
                    }
                    rollMessage += '<strong>';
                }
                rollMessage += result.content[i].value;

                if (result.content[i].type === 'dice') {
                    rollMessage += '</strong>';
                    if (result.content[i].value === result.content[i].sides || result.content[i].value === 1) {
                        rollMessage += '</span>';
                    }

                    rollMessage += '[d' + result.content[i].sides + ']';
                }

                rollMessage += ' ';
            }

            rollMessage += '= <strong>' + result.result + '</strong></div>';
            $('#rollLog').append(rollMessage);
            
            diceRoll = DiceRoll.createDiceRoll(result, simulator);
        }
    }
}

function getLastMessage(event) {
    if (event.keyCode === 38 || event.which === 38) {
        if (logPosition > 0) {
            logPosition--;
        }
        $('#rollMsg').val(log[logPosition]);

    } else if (event.keyCode === 40 || event.which === 40) {
        if (logPosition < log.length - 1) {
            logPosition++;
        }
        $('#rollMsg').val(log[logPosition]);
    }
}