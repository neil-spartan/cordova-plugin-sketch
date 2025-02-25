(function () {
  'use strict';
  var confirmOnSuccess, confirmOnError;

  appendCanvasHtmlJs();

  var html = '<link rel="stylesheet" href="/www/cordova-plugin-sketch/css/cordova-plugin-sketch.css" /><link rel="stylesheet" href="/www/cordova-plugin-sketch/css/ui-dark.css" /><link rel="stylesheet" href="/www/cordova-plugin-sketch/css/program.css" />';

  var popupHtml = '<div id="cordova-plugin-sketch-popup" class="cordova-plugin-sketch-nativePopUp cordova-plugin-sketch-layout-withOrientation"><div id="cordova-plugin-sketch-sketchDiv" class="cordova-plugin-sketch-nativePopUp__content"></div></div>';

  function appendVeapicoreJs(){
      var head = document.getElementsByTagName('head').item(0);

      var script1;
      script1 = document.createElement('script');
      script1.setAttribute('type', 'text/javascript');
      script1.setAttribute('src', '/www/cordova-plugin-sketch/base.js');
      head.appendChild(script1);

      var script;
      script = document.createElement('script');
      script.setAttribute('type', 'text/javascript');
      script.setAttribute('src', '/www/cordova-plugin-sketch/ui.js');
      head.appendChild(script);
  }

  function appendCanvasHtmlJs(){
      var head = document.getElementsByTagName('head').item(0);
      var script = document.createElement('script');
      script.setAttribute('type', 'text/javascript');
      script.setAttribute('src', '/www/cordova-plugin-sketch/canvasHtml.js');
      head.appendChild(script);
  }

  function appendProgramJs(){
      var head = document.getElementsByTagName('head').item(0);
      var script = document.createElement('script');
      script.setAttribute('type', 'text/javascript');
      script.setAttribute('src', '/www/cordova-plugin-sketch/program.js');
      head.appendChild(script);
  }

  function callbackFunction(){};

  function openPopup() {
    appendVeapicoreJs();
    document.head.insertAdjacentHTML('beforeend', html);
    var body = document.getElementsByTagName('body').item(0);
    body.setAttribute('role', 'application');
    document.body.insertAdjacentHTML('beforeend', popupHtml);
    var popup = document.getElementById('cordova-plugin-sketch-popup');
    var sketchDiv = document.getElementById('cordova-plugin-sketch-sketchDiv');
    sketchDiv.insertAdjacentHTML('beforeend', Sketch.canvasHtml);
    appendProgramJs();
    if(Sketch.inputType > 0){
      var canvas = document.getElementById('InkCanvas');
      var ctx = canvas.getContext("2d");
      var img = document.getElementById("canvasImg");
      img.setAttribute('src', Sketch.inputData);
    }
    popup.classList.add('cordova-plugin-sketch-nativePopUp-open');
  }

  function closePopup(stream) {
    callbackFunction(stream);
    deletePopup();
  }

  function cancelPopup() {
    callbackFunction(null);
    deletePopup();
  }

  function deletePopup(){
    var popup = document.getElementById("cordova-plugin-sketch-popup");
    popup.classList.remove('cordova-plugin-sketch-nativePopUp-open');
    popup.parentNode.removeChild(popup);
  }

  var Sketch = {
    InputType:{
      NO_INPUT: 0,         // no input as background image, use as signature plugin
      DATA_URL: 1,         // base64 encoded string stream
      FILE_URI: 2,         // file uri (content://media/external/images/media/2 for Android)
    },

    DestinationType:{
      DATA_URL: 0,         // Return base64 encoded string
      FILE_URI: 1          // Return file uri (content://media/external/images/media/2 for Android)
    },

    EncodingType:{
      JPEG: 0,             // Return JPEG encoded image
      PNG: 1              // Return PNG encoded image
    },

    DataURLType:{
      0: 'image/jpeg',
      1: 'image/png'
    }
  };

  Sketch.canvasHtml = '';

  Sketch.destinationType = Sketch.DestinationType.DATA_URL;

  Sketch.encodingType = Sketch.EncodingType.PNG;

  Sketch.inputType = Sketch.InputType.NO_INPUT;

  Sketch.inputData = '';

  //options will contain:
  // 0 destinationType:Sketch.DestinationType.FILE_URI,Sketch.DestinationType.DATA_URL
  // 1 encodingType:Sketch.EncodingType.PNG,Sketch.EncodingType.JPEG
  Sketch.getSketch = function (onSuccess, onError, options) {
    callbackFunction = onSuccess;
    confirmOnSuccess = onSuccess;
    confirmOnError = onError;

    if(options.destinationType != null)
      Sketch.destinationType = options.destinationType;

    if(options.encodingType != null)
      Sketch.encodingType = options.encodingType;

    if(options.inputType != null)
      Sketch.inputType = options.inputType;

    if(Sketch.inputType > 0 && options.inputData){
      Sketch.inputData = options.inputData;
    }

    openPopup();
  };

  Sketch.done = function (stream) {
    closePopup(stream);
  };

  Sketch.cancel = function () {
    cancelPopup();
  };

  navigator.sketch = Sketch;

}());

cordova.commandProxy.add("SketchPlugin",{
  getSketch:navigator.sketch.getSketch
});
