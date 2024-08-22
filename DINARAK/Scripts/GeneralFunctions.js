var formValidator;


Array.prototype.FirstOrDefault = function (propName, propVal) {
    for (var i = 0, len = this.length; i < len; i++) {

        if ((this[i][propName] == propVal)) {
            return this[i];
        }
    }
};


$.fn.getContainerData = function () {

    var formData = $(this).find('[data-form-data]');

    var formDataItems = [];
    $.each(formData, function (i, item) {

        var formDataItem = {};
        formDataItem.FieldName = $(item).data('form-data');
        formDataItem.FieldValue = $(item).val();
        formDataItem.FieldType = '';
        formDataItem.Extra = '';

        formDataItems.push(formDataItem);
    });

    return formDataItems;
};

$.fn.doValidate = function () {
    if (!formValidator) {
        var form = $(this).closest("form");
        formValidator = form.data("validator");
    }

    var fields = $(this).find(":input");

    var $valid = fields.valid();
    if (!$valid) {
        formValidator.focusInvalid();
        return false;
    }
    return true;
};
$.fn.validateParentTab = function () {
    if (!formValidator) {
        var form = $(this).closest("form");
        formValidator = form.data("validator");
    }
    //var targetTabId = $($this).data('target-tab');
    var section = $(this).closest(".tab-pane");
    var fields = section.find(":input");

    var $valid = fields.length == 0 || fields.valid();
    if (!$valid) {
        formValidator.focusInvalid();
        return false;
    }
    return true;
};

//$(document).ajaxStart(
//    function () {
//        ShowHideAjaxLoader(true);
//    }

//).ajaxStop(function () { ShowHideAjaxLoader(false); });
//function ShowHideAjaxLoader(doShow) {
//    if (doShow)
//        $('#AjaxLoaderContainer').stop().show();
//    //$.blockUI({ message: $('#dvLoader') });
//    else
//        $('#AjaxLoaderContainer').fadeOut(500);
//    // $.unblockUI();
//}
function ShowHideAjaxLoader(doShow, thenFunction) {
    //check if the function null ios bug 
    if (doShow) {
        if (thenFunction) {
            $('#AjaxLoaderContainer').show(100, function () { setTimeout(thenFunction, 100); });

        }
        else {
            $('#AjaxLoaderContainer').stop().show();
            //$('#AjaxLoaderContainer').show(100, function () {
            //    setTimeout(function () {
            //        return false;
            //    }, 100);
            //});
            

        }
    }
    else {
        if (thenFunction == null) {
            $('#AjaxLoaderContainer').fadeOut(500);

        }
        else {
            $('#AjaxLoaderContainer').fadeOut(500, function () { setTimeout(thenFunction, 100); });
        }
    }
    // $.unblockUI();
}
function goToView(actionName, controllerName, queryString) {
    ShowHideAjaxLoader(true);
    window.location.href = __RootName + (!controllerName ? __ControllerName : controllerName) + "/" + actionName + (!queryString ? "" : "?" + queryString);
}
String.prototype.IsDecimal = function () {
    return (this.match(/^\d+(?:\.\d+)?$/));
}
String.prototype.StartWith = function (str) {
    return (this.indexOf(str) == 0);
}
String.prototype.EndsWith = function (str) {
    return (this.lastIndexOf(str) == this.length - str.length);
}
function isValidEmail(sEmail) {
    var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (filter.test(sEmail)) {
        return true;
    }
    else {
        return false;
    }
}
String.prototype.Contains = function (str) {
    if (this.indexOf(str) >= 0)
        return true;
    return false;
};


String.prototype.ToFloat = function () {
    return parseFloat(this);
};
String.prototype.ToInt = function () {
    return parseInt(this);
};
String.prototype.format = function () {
    var s = this,
        i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};
String.prototype.ReplaceBetween = function (start, end, what) {
    return this.substring(0, start) + what + this.substring(end);
};
function CallAction(Action_ControllerName, Data, CallBack, withOutLoader, ignoreSucessMessage) {

    if (!withOutLoader)
        ShowHideAjaxLoader(true, function () { CallActionWork(Action_ControllerName, Data, CallBack, ignoreSucessMessage); });
    else
        CallActionWork(Action_ControllerName, Data, CallBack, ignoreSucessMessage);

}

function CallActionWork(Action_ControllerName, Data, CallBack, ignoreSucessMessage) {


    if (ignoreSucessMessage !== true) ignoreSucessMessage = false;
    var PostedData;
    if (Data != null) {
        if ((typeof (Data)).toString().indexOf('object') > -1)
            PostedData = JSON.stringify(Data);
        else
            PostedData = JSON.stringify(Data);
    }


    var ReturnValue;
    var xhr = $.ajax(
        {
            //url: Action_ControllerName, //(Action_ControllerName.indexOf(__RootName) == 0 ? Action_ControllerName : __RootName + __ControllerName + '/' + Action_ControllerName),
            url: (Action_ControllerName.indexOf(__RootName) == 0 ? Action_ControllerName : __RootName + Action_ControllerName),
            cache: false,
            contentType: "application/json; charset=utf-8",
            data: PostedData,
            async: CallBack == null ? false : true,
            type: "POST",
            success: function (r) {

                if (r.IsPassed) {
                    if (CallBack) {
                        CallBack.call(this, r.ReturnedObject);
                    }
                    else {
                        ReturnValue = r;
                    }
                }

                if (r.Message && r.Message.Text) {
                    ShowHideAjaxLoader(false);
                    switch (r.Message.Type) {
                        case 'Success':
                            if (!ignoreSucessMessage)
                                toastr.success(r.Message.Text);
                            break;
                        case 'Info':
                            toastr.info(r.Message.Text);
                            break;
                        case 'Warning':
                            toastr.warning(r.Message.Text);
                            break;
                        case 'Error':
                            toastr.error(r.Message.Text);
                            break;
                    }
                }

                if (r.RedirectUrl) {
                    ShowHideAjaxLoader(true);
                    window.location = r.RedirectUrl;
                }

                else
                    ShowHideAjaxLoader(false);
            },
            error: function (httpReguest, d, b, c) {
                if (httpReguest.status === 401) {
                    window.location.reload();
                }
                var r = {};
                if (httpReguest && httpReguest.responseText) {
                    r = JSON.parse(httpReguest.responseText);
                }
                if (r.Message && r.Message.Text) {
                    ShowHideAjaxLoader(false);
                    switch (r.Message.Type) {
                        case 'Success':
                            toastr.success(r.Message.Text);
                            break;
                        case 'Info':
                            toastr.info(r.Message.Text);
                            break;
                        case 'Warning':
                            toastr.warning(r.Message.Text);
                            break;
                        case 'Error':
                            toastr.error(r.Message.Text);
                            break;
                    }
                }

                if (r.RedirectUrl) {
                    ShowHideAjaxLoader(true);
                    window.location = r.RedirectUrl;
                }
            }
        }
    );
    return ReturnValue;
}
function Timer(fn, t) {
    var timerObj = setInterval(fn, t);

    this.stop = function () {
        if (timerObj) {
            clearInterval(timerObj);
            timerObj = null;
        }
        return this;
    };

    this.start = function () {
        if (!timerObj) {
            this.stop();
            timerObj = setInterval(fn, t);
        }
        return this;
    };

    this.UpdateTime = function (newT) {
        t = newT;
        return this.stop().start();
    };
    this.reset = function () {
        return this.stop().start();
    };
}
function renderPartialViewModal(viewName, controllerName) {
    CallAction((controllerName ? controllerName : __ControllerName) + "/GetJsonPartialView", { viewName: viewName, model: null }, function (data) {
        if (data.ReturnedObject) {
            $('#dvPartialViewModalContent').html(data.ReturnedObject);
            $('#dvPartialViewModalContainer').modal();
        }
    });
}
$(function () {
    $('#dvPartialViewModalContainer').on('hidden.bs.modal', function () {
        $('#dvPartialViewModalContent').html('');
    });
});

$.fn.enterKey = function (fnc) {
    if ($.isFunction(fnc)) {
        return this.each(function () {
            $(this).keypress(function (ev) {
                var keycode = (ev.keyCode ? ev.keyCode : ev.which);
                if (keycode == '13') {
                    ev.preventDefault();
                    fnc.call(this, ev);
                }
            });
        });
    }
};
function ReloadPage() {
    ShowHideAjaxLoader(true);
    window.location = window.location.href;
}
$.fn.serializeObject = function () {
    var array = $(this).serializeArray();
    var newObj = {};
    $.each(array, function (i, obj) {
        newObj[obj.name] = obj.value;
    });
    $(this).find("input.HRM-Checkbox").each(function (i, obj) {
        newObj[$(obj).attr("name")] = $(obj)[0].checked;
    });
    $(this).find("select.HRM-DropDownList").each(function (i, obj) {
        obj = $(obj);
        if ($(obj).attr("_Nullable") != null && $(obj).val() == DropDownListSetting.SelectNullOption[0]) {
            newObj[$(obj).attr("name")] = null;
        }
    });
    return newObj;
};
function _submitForm(_objbtn) {
    var _e = {};
    $_objbtn = $(_objbtn);
    var _successMessage = $(_objbtn).attr("_successMessage");

    var _onClick = $(_objbtn).attr("_onClick");
    var _afterError = $(_objbtn).attr("_onError");
    var _afterSuccess = $(_objbtn).attr("_onSuccess");

    var _returnView = $(_objbtn).attr("_returnView");
    var _returnController = $(_objbtn).attr("_returnController");
    var _viewName = $(_objbtn).attr("_viewName");
    var _controllerName = $(_objbtn).attr("_controllerName");
    var _confirmMessage = $(_objbtn).attr("_confirmMessage");
    var _causeValidation = $(_objbtn).attr("_causeValidation");

    _e.form = $_objbtn.closest("form");
    _e.model = _e.form.serializeObject();
    _e.response = null;
    _e.error = null;
    _e.showErrorMessage = true;

    if (_e.form.length > 0) {
        _e.url = _e.form.attr("action");
    }
    _e.valid = true;
    if (_causeValidation == "false" || _e.form.length == 0)
        _e.valid = true;
    //else
    //    if (_e.form.length > 0)
    //        _e.valid = _e.form.valid();

    if (_viewName) {
        _e.url = (!_controllerName ? __ControllerName : _controllerName) + "/" + _viewName;
    }

    if (_onClick != null && _e.valid) {/// no calling when the form is not valid
        var doSubmit;

        if (_onClick.indexOf("(") > -1) {
            var data = _onClick.split('(')[1].split(')')[0];
            _onClick = _onClick.split('(')[0]
            doSubmit = window[_onClick](_objbtn, _e, data);
        }
        else {
            doSubmit = window[_onClick](_objbtn, _e);
        }
        if (doSubmit === false) return false;

    }

    if (!_e.valid) return false;

    if (_causeValidation != "false") {
        _e.form.bind("submit", function () {
            return false;
        }).submit();
        var formModel = _e.form.serializeObject();
        $.extend(_e.model, _e.model, formModel);
    }

    function IfConfirm() {
        CallAction(_e.url, _e.model, function (response) {
            if (response == -1 && _afterError != null) {
                if (_afterError.indexOf("(") > -1)
                    eval(_afterError);
                else
                    window[_afterError](_objbtn, _e);
            }
            if (_afterSuccess != null && _successMessage == null && response != -1) {
                if (_afterSuccess.indexOf("(") > -1)
                    new Function("response", _afterSuccess).call(this, response)
                else
                    window[_afterSuccess](response);
            }


            if (response == "" || response == null) {
                _e.response = response;
                if (_successMessage) {

                    if (_afterSuccess != null) {
                        if (_afterSuccess.indexOf("(") > -1) eval(_afterSuccess);
                        else {
                            window[_afterSuccess](_objbtn, _e);
                        }
                    }
                    if (_returnView != null)
                        goToView(_returnView, _returnController);

                    ;
                }
                else if (_returnView != null)
                    goToView(_returnView, _returnController);
            }
            else {
                //if (response.Message)
                //    ShowMessage(response.Message);
            }
        });
    }

    if (_confirmMessage)
        ShowConfirm(_confirmMessage, IfConfirm);
    else IfConfirm();
}

$.fn.enableGridLoader = function (loaderId) {
    $(this).on('processing.dt', function (e, settings, processing) {
        if (processing)
            $('#' + loaderId).show();
        else
            $('#' + loaderId).hide();
    });
};