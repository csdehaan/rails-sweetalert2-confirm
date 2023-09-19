var sweetAlertConfirmDefaults = sweetAlertConfirmDefaults || {};
sweetAlertConfirmDefaults.sweetSelector = sweetAlertConfirmDefaults.sweetSelector || '[data-swal]';

var sweetAlertConfirm = function(event) {
  var $linkToConfirm = $(this);
  var $railsLink = this;

  var swalOptions = {
    confirmButtonText:   sweetAlertConfirmDefaults.confirmButtonText   || "OK",
    cancelButtonText:    sweetAlertConfirmDefaults.cancelButtonText    || "Cancel",
    confirmButtonColor:  sweetAlertConfirmDefaults.confirmButtonColor  || "#3085d6",
    denyButtonColor:     sweetAlertConfirmDefaults.denyButtonColor     || "#3085d6",
    cancelButtonColor:   sweetAlertConfirmDefaults.cancelButtonColor   || "#aaa",
    width:               sweetAlertConfirmDefaults.width               || 500,
    padding:             sweetAlertConfirmDefaults.padding             || 20,
    background:          sweetAlertConfirmDefaults.background          || '#fff',
    allowOutsideClick:                                                    true,
    allowEscapeKey:                                                       true,
    showConfirmButton:                                                    true,
    showDenyButton:                                                       false,
    showCancelButton:                                                     true,
    buttonsStyling:                                                       true,
    reverseButtons:                                                       false,
    showCloseButton:                                                      false,
    showLoaderOnConfirm:                                                  false,
    preConfirm:                                                           false,
    inputAutoTrim:                                                        true,
  };

  var truthyOptions = [
    'allowOutsideClick',
    'allowEscapeKey',
    'showConfirmButton',
    'showDenyButton',
    'showCancelButton',
    'buttonsStyling',
    'reverseButtons',
    'showCloseButton',
    'showLoaderOnConfirm',
    'preConfirm',
    'inputAutoTrim'
  ]

  $.each(truthyOptions, function(index, option) {
    if(sweetAlertConfirmDefaults[option] != undefined) {
      swalOptions[option] = sweetAlertConfirmDefaults[option]
    };
  });

  var canBeNullOptions = [
    'title',
    'text',
    'html',
    'type',
    'customClass',
    'confirmButtonClass',
    'denyButtonText',
    'denyButtonClass',
    'cancelButtonClass',
    'imageUrl',
    'imageWidth',
    'imageHeight',
    'imageClass',
    'timer',
    'input',
    'inputPlaceholder',
    'inputValue',
    'inputOptions',
    'inputValidator',
    'inputClass',
    'onOpen',
    'onClose'
  ]

  $.each(canBeNullOptions, function(index, option) {
    if(sweetAlertConfirmDefaults[option]) {
      swalOptions[option] = sweetAlertConfirmDefaults[option]
    };
  });

  var remoteSubmit =
    sweetAlertConfirmDefaults.remote || $linkToConfirm.data('swal').remote || false

  var swalOptionsMappings = {
    "title":"title",
    "text":"text",
    "html":"html",
    "type":"type",
    "custom_class":"customClass",
    "allow_outside_click":"allowOutsideClick",
    "allow_escape_key":"allowEscapeKey",
    "show_confirm_button":"showConfirmButton",
    "show_deny_button":"showDenyButton",
    "show_cancel_button":"showCancelButton",
    "confirm_button_text":"confirmButtonText",
    "deny_button_text":"denyButtonText",
    "cancel_button_text":"cancelButtonText",
    "confirm_button_color":"confirmButtonColor",
    "deny_button_color":"denyButtonColor",
    "cancel_button_color":"cancelButtonColor",
    "confirm_button_class":"confirmButtonClass",
    "deny_button_class":"denyButtonClass",
    "cancel_button_class":"cancelButtonClass",
    "buttons_styling":"buttonsStyling",
    "reverse_buttons":"reverseButtons",
    "show_close_button":"showCloseButton",
    "show_loader_on_confirm":"showLoaderOnConfirm",
    "pre_confirm":"preConfirm",
    "image_url":"imageUrl",
    "image_width":"imageWidth",
    "image_height":"imageHeight",
    "image_class":"imageClass",
    "timer":"timer",
    "width":"width",
    "padding":"padding",
    "background":"background",
    "input":"input",
    "input_placeholder":"inputPlaceholder",
    "input_value":"inputValue",
    "input_options":"inputOptions",
    "input_auto_trim":"inputAutoTrim",
    "input_validator":"inputValidator",
    "input_class":"inputClass",
    "on_open":"onOpen",
    "on_close":"onClose",
    "method":"method"
  };

  function afterConfirmCallback() {
    if (afterConfirm) {
      window[afterConfirm]();
      return false
    };

    if (remoteSubmit === true) {
      Rails.handleRemote.call($railsLink, event)
    } else if($linkToConfirm.data().method !== undefined) {
      Rails.handleMethod.call($railsLink, event);
    } else {
      if($linkToConfirm.attr('type') == 'submit'){
        var name = $linkToConfirm.attr('name'),
        data = name ? {name: name, value:$linkToConfirm.val()} : null;
        $linkToConfirm.closest('form').data('ujs:submit-button', data);
        $linkToConfirm.closest('form').submit();
      } else {
        window.location.href = $linkToConfirm.attr('href');
      };
    };
  }

  function afterDismissCallback(dismiss) {
    if(afterDismiss) {
      window[afterDismiss](dismiss)
      return false
    }
  };

  var skipConfirm = $linkToConfirm.data('swal').skip_confirm || null;

  if(skipConfirm != null) {
    if(skipConfirm === true || window[skipConfirm]($linkToConfirm) === true) {
      return afterAlertCallback(true);
    };
  };

  var optionKeys = [];
  for(var option in swalOptionsMappings) { optionKeys.push(option) }

  $.each($linkToConfirm.data('swal'), function(key, val){
    if ($.inArray(key, optionKeys) >= 0) {
      swalOptions[swalOptionsMappings[key]] = val
    }
  });

  var afterConfirm = sweetAlertConfirmDefaults.afterConfirm || $linkToConfirm.data('swal').after_confirm || null
  var afterDismiss = sweetAlertConfirmDefaults.afterDismiss || $linkToConfirm.data('swal').after_dismiss || null

  Swal.fire(swalOptions).then(result => {
    if (result.value) {
      afterConfirmCallback();
    } else {
      afterDismissCallback();
    };
  });
  return false;
};

$(document).on('ready turbolinks:load page:update ajaxComplete', function() {
  $(sweetAlertConfirmDefaults.sweetSelector).on('click', sweetAlertConfirm);
});

$(document).on('ready turbolinks:load page:load', function() {
  //To avoid "Uncaught TypeError: Cannot read property 'querySelector' of null" on turbolinks
  if (typeof window.sweetAlertInitialize === 'function') {
    window.sweetAlertInitialize();
  };
});
