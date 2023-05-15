window.onload = function () {
 initIframe();
};

// events available
const EVENT_MODULE = {
 INIT_MODULE: 'INIT_MODULE',
 PROCESS_INIT: 'PROCESS_INIT',
 PROCESS_ERROR: 'PROCESS_ERROR',
 PROCESS_COMPLETED: 'PROCESS_COMPLETED',
 MODULE_READY: 'MODULE_READY',
 CAMERA_ACCEPTED: 'CAMERA_ACCEPTED',
 MODULE_CLOSED: 'MODULE_CLOSED',
};

// mandatory, videoagreement legend
const LEGEND =
 'Yo Nombre del firmante, con fecha de nacimiento 20 de Junio, con credencial de elector número: 1234134134 declaro que soy Soltero, con ingresos mensuales de $15,667.21, cuento con Casa o depto propio actualmente SI cuento con tarjetas de crédito y reconozco que la información que he proporcionado es verídica';

// optional, the app has default configuration, legends and colors
const CONFIGURATION = {
 views: {
  instructions: true,
  preview: true,
 },
 selfie: {
  captureSelfie: false,
  imageType: 'image/png',
  imageQuality: 1,
 },
 timer: {
  recording: { min: 5, max: 40 },
  faceUndetected: 5,
 },
 customization: {
  fadCustomization: {
   colors: {
    primary: '#A70635',
    secondary: '#A70635',
    tertiary: '#363636',
    succesful: '#5A9A92',
   },
   buttons: {
    primary: {
     backgroundColor: '#A70635',
     labelColor: '#ffffff',
     borderColor: '#A70635',
     borderStyle: 'solid',
     borderWidth: '1px',
    },
    secondary: {
     backgroundColor: '#363636ad',
     labelColor: '#ffffff',
     borderColor: '#ffffff',
    },
    common: {
     backgroundColorDisabled: '#dcdcdc',
     labelColorDisabled: '#8e8e8e',
    },
   },
   fonts: {
    title: {
     fontSize: '25px',
     fontFamily: 'system-ui',
    },
    subtitle: {
     fontSize: '17px',
     fontFamily: 'system-ui',
    },
    content: {
     fontSize: '15px',
     fontFamily: 'system-ui',
    },
    informative: {
     fontSize: '12px',
     fontFamily: 'system-ui',
    },
    button: {
     fontSize: '17px',
     fontFamily: 'system-ui',
    },
   },
  },
  moduleCustomization: {
   legends: {
    buttonRecord: 'Iniciar grabación',
    buttonFinish: 'Terminar',
    initializing: 'iniciando',
    processing: 'procesando',
    acceptancetInstruction: 'Graba el siguiente texto de forma clara y fuerte',
    recording: 'Grabando',
    focusface: 'Enfoca tu rostro dentro de la guía',
   },
   legendsInstructions: {
    title: 'Video acuerdo',
    subtitle: 'Confirma por voz la aceptación del documento',
    buttonNext: 'Continuar',
    instructions: 'Recuerda no hacer uso de lentes de sol, gorras u otros elementos que dificulten la identificación de tu rostro.',
   },
   legendsPreview: {
    title: 'Video acuerdo',
    buttonRetry: 'Volver a grabar',
    buttonNext: 'Confirmar grabación',
   },
   style: {
    common: {
     loader: {
      animationColor: '#FFFFFF',
      backgroundColor: '#000000',
      labelColor: '#FFFFFF',
     },
    },
   },
  },
 },
 iOS: {
  videoConstraints: {
   video: {
    width: { min: 640, ideal: 640, max: 1920 },
    height: { min: 480, ideal: 480, max: 1080 },
    facingMode: 'user',
   },
   audio: true,
  },
 },
 android: {
  videoConstraints: {
   video: {
    width: { min: 640, ideal: 640, max: 1920 },
    height: { min: 480, ideal: 480, max: 1080 },
    facingMode: 'user',
   },
   audio: true,
  },
 },
 pathDependencies: {
  imagesInstructions: {
   instruction: 'Custom image URL',
  },
 },
};

// errors
const ERROR_CODE = {
 BROWSER_NOT_SUPPORTED: -1,
 NOT_ACCEPT_CAMERA_PERMISSION: -2,
 VIDEO_CREATION_FAIL: -3,
 MEDIA_RECORDER_ERROR: -4,
 FACE_UNDETECTED: -5,
 REQUIRED_LEGEND: -6,
 VIDEO_EMPTY: -7,
 NOT_READABLE_CAMERA: -8,
 MEDIA_RECORDER_NOT_SUPPORTED: -9,
 NO_AUDIO: -10,
 CONTEXT_SWITCH: -11,
 VIDEO_PLAYING_ERROR: -12,
};

// models
class ResponseEvent {
 event;
 data;
 constructor(event, data) {
  this.event = event;
  this.data = data;
 }
}

class Result {
 video; // video as Blob
 selfie; //image as base64 string
 constructor(data) {
  this.video = data.video;
  this.selfie = data.selfie;
 }
}

// subscribe to message event to recive the events from the iframe
window.addEventListener('message', (message) => {
 // IMPORTANT: check the origin of the data
 if (message.origin.includes('firmaautografa.com')) {
  if (message.data.event === EVENT_MODULE.MODULE_READY) {
   // MODULE_READY
   // the modules is reaady for receive configuration
   initModule();
  } else if (message.data.event === EVENT_MODULE.PROCESS_INIT) {
   // PROCESS_INIT
   // only informative
   console.log('Process init');
  } else if (message.data.event === EVENT_MODULE.CAMERA_ACCEPTED) {
   // CAMERA_ACCEPTED
   // only informative
   console.log('Camera accepted');
  } else if (message.data.event === EVENT_MODULE.MODULE_CLOSED) {
   // MODULE_CLOSED
   // module closed, the user clicked (X)
   console.log('module closed');
  } else if (message.data.event === EVENT_MODULE.PROCESS_ERROR) {
   // PRROCESS_ERROR
   // show the error and try again
   console.error(message.data.data);
  } else if (message.data.event === EVENT_MODULE.PROCESS_COMPLETED) {
   // PROCESS_COMPLETED
   // use the result as yuo fit
   alert('Process completed');
   const result = new Result(message.data.data);
   const videoUrl = URL.createObjectURL(result.video);
   // // show result example

   const containerResult = document.getElementById('container-result');
   const containerIframe = document.getElementById('container-iframe-videoagreement');
   const videoId = document.getElementById('video-id');
   const downloadAncord = document.getElementById('donwload-ancord');

   containerIframe.style.display = 'none';
   containerResult.style.display = 'flex';
   videoId.src = videoUrl;
   downloadAncord.href = videoUrl;
  }
 }
});

function initIframe() {
 // get iframe
 const iframe = document.getElementById('fad-iframe-videoagreement');
 // url - https://devapiframe.firmaautografa.com/fad-iframe-videoagreement
 const tkn = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
 const url = `https://devapiframe.firmaautografa.com/fad-iframe-videoagreement?tkn=${tkn}`;
 iframe.src = url;
}

function initModule() {
 const iframe = document.getElementById('fad-iframe-videoagreement');
 iframe.contentWindow.postMessage(
  new ResponseEvent(EVENT_MODULE.INIT_MODULE, {
   legend: LEGEND,
   configuration: CONFIGURATION,
  }),
  iframe.src
 );
}
