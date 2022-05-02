window.onload = function () {
  initIframe();
};

// events available
const EVENT_MODULE = {
  INIT_MODULE: "INIT_MODULE",
  PROCESS_INIT: "PROCESS_INIT",
  PROCESS_ERROR: "PROCESS_ERROR",
  PROCESS_COMPLETED: "PROCESS_COMPLETED",
  MODULE_READY: "MODULE_READY",
  CAMERA_ACCEPTED: 'CAMERA_ACCEPTED',
  MODULE_CLOSED: 'MODULE_CLOSED'
};

// mandatory, videoagreement legend
const LEGEND = "Yo Nombre del firmante, con fecha de nacimiento 20 de Junio, con credencial de elector número: 1234134134 declaro que soy Soltero, con ingresos mensuales de $15,667.21, cuento con Casa o depto propio actualmente SI cuento con tarjetas de crédito y reconozco que la información que he proporcionado es verídica";


// optional, the app has default configuration, legends and colors
const CONFIGURATION = {
  views: {
    instructions: true,
    preview: true
  },
  customization: {
    fadCustomization: {
      colors: {
        primary: "#A70635",
        secondary: "#A70635",
        tertiary: "#363636",
      },
      buttons: {
        primary: {
          backgroundColor: "#A70635",
          backgroundColorDisabled: "#dcdcdc",
          labelColor: "#ffffff",
          labelColorDisabled: "#8e8e8e",
          border: "1px solid #A70635",
        },
      },
      fonts: {
        title: {
          fontSize: '25px',
          fontFamily: 'system-ui'
        },
        subtitle: {
          fontSize: '17px',
          fontFamily: 'system-ui'
        },
        content: {
          fontSize: '15px',
          fontFamily: 'system-ui'
        },
        informative: {
          fontSize: '12px',
          fontFamily: 'system-ui'
        },
        button: {
          fontSize: '17px',
          fontFamily: 'system-ui'
        }
      }
    },
    moduleCustomization: {
      legends: {
        buttonRecord: "Iniciar grabación",
        buttonFinish: "Terminar",
        initializing: "iniciando",
        processing: "procesando",
        acceptancetInstruction: "Graba el siguiente texto de forma clara y fuerte",
        recording: "Grabando",
        focusface: "Enfoca tu rostro dentro de la guía",
      },
      legendsInstructions: {
        title: 'Video acuerdo',
        subtitle: 'Confirma por voz la aceptación del documento',
        buttonNext: 'Continuar',
        instructions: 'Recuerda no hacer uso de lentes de sol, gorras u otros elementos que dificulten la identificación de tu rostro.'
      },
      legendsPreview: {
        title: 'Video acuerdo',
        buttonRetry: 'Volver a grabar',
        buttonNext: 'Confirmar grabación'
      }
    },
  },
  pathDependencies: {
    imageDirectory: 'ASSETS_URL/'
  }
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
  NOT_READABLE_CAMERA: -8
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
  constructor(data) {
    this.video = data;
  }
}

// subscribe to message event to recive the events from the iframe
window.addEventListener("message", (message) => {
  // IMPORTANT: check the origin of the data
  if (message.origin.includes("firmaautografa.com")) {
    if (message.data.event === EVENT_MODULE.MODULE_READY) { // MODULE_READY
      initModule();
    } else if (message.data.event === EVENT_MODULE.PROCESS_INIT) { // PROCESS_INIT
      // only informative
      console.log("Process init");
    } else if (message.data.event === EVENT_MODULE.CAMERA_ACCEPTED) { // PRROCESS_ERROR
      // only informative
      console.log("Camera accepted");
    } else if (message.data.event === EVENT_MODULE.MODULE_CLOSED) { // PRROCESS_ERROR
      // module closed, the user clicked (X)
      console.log("module closed");
    } else if (message.data.event === EVENT_MODULE.PROCESS_ERROR) { // PRROCESS_ERROR
      console.error(message.data.data);
    } else if (message.data.event === EVENT_MODULE.PROCESS_COMPLETED) { // PROCESS_COMPLETED
      alert("Process completed");
      const result = new Result(message.data.data);
      const videoUrl = URL.createObjectURL(result.video);
      // // show result example

      const containerResult = document.getElementById("container-result");
      const containerIframe = document.getElementById("container-iframe-videoagreement");
      const videoId = document.getElementById("video-id");
      const downloadAncord = document.getElementById("donwload-ancord");

      containerIframe.style.display = "none";
      containerResult.style.display = "flex";
      videoId.src = videoUrl;
      downloadAncord.href = videoUrl;
    }
  }
});

function initIframe() {
  // get iframe
  const iframe = document.getElementById("fad-iframe-videoagreement");
  // url - https://devapiframe.firmaautografa.com/fad-iframe-videoagreement
  const username = "exapmle@email.com";
  const password = "password";
  const url = `https://devapiframe.firmaautografa.com/fad-iframe-videoagreement?user=${username}&pwd=${password}`;
  // set src to iframe
  iframe.src = url;
}

function initModule() {
  const iframe = document.getElementById("fad-iframe-videoagreement");
  iframe.contentWindow.postMessage(
    new ResponseEvent(EVENT_MODULE.INIT_MODULE, {
      legend: LEGEND,
      configuration: CONFIGURATION,
    }),
    iframe.src
  );
}