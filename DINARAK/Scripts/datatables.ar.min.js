var refreshInterval;
$(document).ready(function () {
    $(".transaction-state").each(function () {
        var cell = this;
        var stateVal = $(cell).attr('data-Val');
        renderStatusLabel(stateVal, cell);
        //$(cell).html('<span id="lblStatus"><span  class="label label-info">loading..</span></span>');
    });
    getTransactionsState();
    refreshInterval = setInterval(getTransactionsState, 5000);
});

function getTransactionsState() {
    $(".transaction-state").each(function () {
        //ShowHideAjaxLoader(false);
        var cell = this;
        var id = parseInt($(cell).attr('data-id'));
        var stateVal = $(cell).attr('data-Val');
        
        var arr = getEnumArray("DNK.Core.Transactions.EntryState");
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].val === stateVal) {
                stateVal = arr[i].val;
                break;
            }
        }
        if (stateVal != "1" && stateVal != "3") {
            CallAction("TransactionStatus/GetTransactionStatus", id, function (data) {
                $(cell).attr('data-Val', data.val);
                renderStatusLabel(data.val, cell);
            }, true);
        }
        else {
            renderStatusLabel(stateVal, cell);
        }
    })

}
function renderStatusLabel(stateVal, cell) {
    var arr = getEnumArray("DNK.Core.Transactions.EntryState");
    var stateString = arr[stateVal].name;
    if (stateVal == '1' )
        return $(cell).html('<span id="lblStatus"><span  class="label label-success">' + stateString + '</span></span>');
    else if (stateVal == '4')
        return $(cell).html('<span id="lblStatus"><span  class="label label-warning">' + stateString + '</span></span>');
    else if (stateVal == '5')
        return $(cell).html('<span id="lblStatus"><span  class="label label-danger">' + stateString + '</span></span>');
    else if (stateVal == '-1')
        return $(cell).html('<span id="lblStatus"><span  class="label label-warning">' + stateString + '</span></span>');
    else if (stateVal == '0')
        return $(cell).html('<span id="lblStatus"><span  class="label label-success">' + stateString + '</span></span>');
    else if (stateVal == '2')
        return $(cell).html('<span id="lblStatus"><span class="label label-info">' + stateString + '</span></span>');
    else if (stateVal == '3')
        return $(cell).html('<span id="lblStatus"><span class="label label-danger">' + stateString + '</span></span>');
    else
        return $(cell).html('<span id="lblStatus"><span class="label label-info"> loading..</span></span>');
}
