/**
 * Created by Stefan on 22.04.2017.
 */
if (typeof(jQuery) != 'undefined') {

    var log = [],
        logPosition = 0,
        parserResult;


    //check if html elements are all loaded and only then execute javascript
    $(document).ready(function() {
        $('#rollLog').html('');
        $('.diceForm').submit(rollDice);
        $('#rollMsg').keyup(getLastMessage)
    });
}

function rollDice(event) {

    var messageText = $('#rollMsg').val();
    $('#rollMsg').val('');

    if (messageText.length !== 0) {
        log.push(messageText);
        logPosition = log.length;
        $.post(
            "/dice",
            { rollMsg: messageText },
            function( data ) {
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
    } else {
        var rollMessage = '';

        for (var i = 0; i < result.content.length; i++) {
            if (result.content[i].type === 'dice') {
                if (result.content[i].value === result.content[i].sides) {
                    rollMessage += '<span class="rollCriticalSuccess">';
                } else if (result.content[i].value === 1) {
                    rollMessage += '<span class="rollCriticalFailure">';
                }
            }
            rollMessage += result.content[i].value;

            if (result.content[i].type === 'dice') {
                if (result.content[i].value === result.content[i].sides || result.content[i].value === 1) {
                    rollMessage += '</span>';
                }

                rollMessage += '[d' + result.content[i].sides + ']';
            }

            rollMessage += ' ';
        }

        rollMessage += '= ' + result.result;
        $('#rollLog').append(rollMessage + '<br>');
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