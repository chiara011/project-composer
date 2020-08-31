import { ComposerState, EditorOptions, SoundFrame, Channel } from "types";

function initSketch(state: ComposerState) {
  let options = state.system.editorOptions

}

export default class Compiler {
  options: EditorOptions;
  sound: (SoundFrame | null)[];
  actuators: Channel[];
  constructor(state: ComposerState) {
    this.options = state.system.editorOptions;
    this.sound = state.sound;
    this.actuators = state.actuators;
  }

  build = () => {
    return this.header()
    + this.speaker()
    + this.getActuatorsDefs()
    + this.setup()
    + this.loop()
  }

  header = () => {
    return `
    #0. DEFINES
    import RPI.GPIO as GPIO
    
   #1. FRAME SIZE AND TOTAL LENGTH
    int FRAME_LENGTH_MS ${this.options.resolution}
    int FILE_LENGTH ${this.options.width / this.options.frameSize}
  `
  }

  setup = () => {
    return `void setup() {
    # SOUND BUZZER
  
    # SETUP LED, MOTORS
    ${this.getActuatorsSetup()}
  }
`
  }

  loop = () => {
    return `// 4. HANDLE UPDATE RATE
    long lastUpdate = 0;
    int updates = 0;

    void loop() {
    unsigned long currentUpdate = millis();
  
      if (currentUpdate - lastUpdate > FRAME_LENGTH_MS && updates < FILE_LENGTH) {
      lastUpdate = currentUpdate;
      # Every frame, execute this block of code
      # SETUP LED, MOTORS
      ${this.getActuatorsLoop()}
    updates++;
    }
}
`
  }

  // TODO: Fix PIN 9
  speaker = () => {
    return `// 2. INITIALIZE SPEAKER
    #define SPEAKER_PIN 9
    ${this.generateNotes()}
    #define SOUND_SIZE ${this.sound.length}
`
  }

  generateNotes = () => {
    let code = "const int SOUND[] = {"
    this.sound.forEach(value => {
      if (value === null) code += "0,"
      else {
        code += Math.round(value.note.freq).toString() + ","
      }
    })
    code += "};"
    return code
  }

  getActuatorsDefs = () => {}

  getActuatorsSetup = () => {
    return `
    #LEDS
    GPIO(12,GPIO.OUT)
    `
  }

  getActuatorsLoop = () => {}

}