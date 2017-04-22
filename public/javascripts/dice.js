/**
 * Created by Stefan on 22.04.2017.
 */
var messageText;
var parserResult;

$(document).ready(function() {
    $('#rollLog').html('');
    $('.diceForm').submit(rollDice);

    //$('#rollMsg').keyup(getLastMessage)
});

function rollDice(event) {

    messageText = $('#rollMsg').val();
    $('#rollMsg').val('');

    if (messageText.length !== 0) {
        $.post(
            "/dice",
            { rollMsg: messageText },
            function( data ) {
                alert( "DataLoaded: " + data);
            },
            "json"
        );
        //displayDiceResult(parserResult);
    }
    //noinspection JSJQueryEfficiency,JSJQueryEfficiency
    $('#rollLog').scrollTop($('#rollLog')[0].scrollHeight);

    event.preventDefault();
}
