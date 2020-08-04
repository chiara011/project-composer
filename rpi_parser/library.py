import math
import gpiozero
import pyaudio
import scipy.signal
from js2py.base import xrange

# <----------------------------------------------  SOUNDS ---------------------------------------------->
PyAudio = pyaudio.PyAudio


# main sound function
def playsound(freq, wave, volume, resolution):
    bitrate = 16000
    secondsForFrame = resolution / 1000
    length = secondsForFrame

    if freq > bitrate:
        bitrate = freq + 100

    NUMBEROFFRAMES = int(bitrate * length)
    RESTFRAMES = NUMBEROFFRAMES % bitrate
    WAVEDATA = ''

    if wave == "sine":
        for x in xrange(NUMBEROFFRAMES):
            WAVEDATA = WAVEDATA + chr(int(math.sin(x / ((bitrate / freq) / math.pi)) * volume + 128))

        for x in xrange(RESTFRAMES):
            WAVEDATA = WAVEDATA + chr(128)

    if wave == "sawtooth":
        for x in xrange(NUMBEROFFRAMES):
            WAVEDATA = WAVEDATA + chr(int(scipy.signal.sawtooth((1 / freq)) * volume + 128))

        for x in xrange(RESTFRAMES):
            WAVEDATA = WAVEDATA + chr(128)

    if wave == "square":
        for x in xrange(NUMBEROFFRAMES):
            WAVEDATA = WAVEDATA + chr(int(scipy.signal.square((1 / freq), 0.5) * volume + 128))

        for x in xrange(RESTFRAMES):
            WAVEDATA = WAVEDATA + chr(128)

    if wave == "triangle":
        for x in xrange(NUMBEROFFRAMES):
            WAVEDATA = WAVEDATA + chr(int(scipy.signal.sawtooth((1 / freq), 0.5) * volume + 128))

        for x in xrange(RESTFRAMES):
            WAVEDATA = WAVEDATA + chr(128)

    p = PyAudio()
    stream = p.open(format=p.get_format_from_width(1),
                    channels=1,
                    rate=bitrate,
                    output=True)

    stream.write(WAVEDATA)
    stream.stop_stream()
    stream.close()
    p.terminate()

# <----------------------------------------------  LIGHTS ---------------------------------------------->