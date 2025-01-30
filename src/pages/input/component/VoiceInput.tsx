import React, { forwardRef, HTMLAttributes, Ref } from 'react';
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";
import { VoiceInputProps } from '../utils/type';

export const voiceInputVariants = cva(
  "w-full",
  {
    variants: {
      variant: {
        default: "border rounded-lg",
        filled: "bg-muted border-transparent",
        ghost: "border-transparent",
      },
      size: {
        sm: "p-2",
        md: "p-3",
        lg: "p-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);



const VoiceInput = forwardRef<HTMLDivElement, VoiceInputProps>(
  (
    {
      className,
      variant,
      size,
      value,
      onChange,
      onAudioData,
      error,
      hint,
      language = "en-US",
      continuous = false,
      interimResults = true,
      maxDuration = 0,
      autoStart = false,
      visualizer = true,
      disabled = false,
      label,
      ...props
    },
    ref
  ) => {
   
    const [isRecording, setIsRecording] = React.useState(false);
    const [transcript, setTranscript] = React.useState("");
    const [audioURL, setAudioURL] = React.useState<string | null>(null);
    const [duration, setDuration] = React.useState(0);
    const [volumeLevel, setVolumeLevel] = React.useState(0);

    const recognitionRef = React.useRef<any>(null);
    const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
    const audioChunksRef = React.useRef<Blob[]>([]);
    const animationFrameRef = React.useRef<number>();
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const audioContextRef = React.useRef<AudioContext | null>(null);
    const analyserRef = React.useRef<AnalyserNode | null>(null);
    const sourceRef = React.useRef<MediaStreamAudioSourceNode | null>(null);
    const durationIntervalRef = React.useRef<number>();

    React.useEffect(() => {
      // Initialize Web Speech API
      if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
        const SpeechRecognition = (window as any).webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = continuous;
        recognitionRef.current.interimResults = interimResults;
        recognitionRef.current.lang = language;

        interface CustomChangeEvent {
          target: {
            value: Blob; // The value is a Blob
          };
        }
        
        // Assuming recognitionRef is a ref to the SpeechRecognition instance
        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = "";
          let interimTranscript = "";
        
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }
        
          const newTranscript = finalTranscript || interimTranscript;
          setTranscript(newTranscript);
        
          // Create a Blob from the newTranscript and call onChange
          const blob = new Blob([newTranscript], { type: 'text/plain' }); // Specify the MIME type if needed
          onChange?.({ target: { value: blob } } as CustomChangeEvent);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          stopRecording();
        };
      }

      return () => {
        stopRecording();
      };
    }, [continuous, interimResults, language, onChange]);

    const startRecording = async () => {
      if (disabled || isRecording) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        // Set up audio context and analyser for visualization
        if (visualizer) {
          audioContextRef.current = new AudioContext();
          analyserRef.current = audioContextRef.current.createAnalyser();
          sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
          sourceRef.current.connect(analyserRef.current);
          analyserRef.current.fftSize = 256;
        }

        // Set up media recorder
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
          const url = URL.createObjectURL(audioBlob);
          setAudioURL(url);
          onAudioData?.(audioBlob);
        };

        // Start recording
        mediaRecorderRef.current.start();
        recognitionRef.current?.start();
        setIsRecording(true);

        // Start duration timer
        if (maxDuration > 0) {
          durationIntervalRef.current = setInterval(() => {
            setDuration((prev) => {
              if (prev >= maxDuration) {
                stopRecording();
                return 0;
              }
              return prev + 1;
            });
          }, 1000);
        }

        // Start visualization
        if (visualizer) {
          animateVisualizer();
        }
      } catch (error) {
        console.error("Error starting recording:", error);
      }
    };

    const stopRecording = () => {
      if (!isRecording) return;
    
      // Stop media recorder
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    
      // Stop speech recognition
      recognitionRef.current?.stop();
    
      // Stop audio context
      if (audioContextRef.current?.state !== "closed") {
        sourceRef.current?.disconnect();
        analyserRef.current?.disconnect();
        audioContextRef.current?.close();
      }
    
      // Clean up
      setIsRecording(false);
      setDuration(0);
      clearInterval(durationIntervalRef.current);
      cancelAnimationFrame(animationFrameRef.current!);
      
      // Create audio blob and call onAudioData
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);
      onAudioData?.(audioBlob); // Call the onAudioData callback
      onChange?.({ target: { value: audioBlob } }); // Update the form value
    };

    const toggleRecording = () => {
      if (isRecording) {
        stopRecording();
      } else {
        startRecording();
      }
    };

    const animateVisualizer = () => {
      if (!canvasRef.current || !analyserRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d")!;
      const analyser = analyserRef.current;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const draw = () => {
        animationFrameRef.current = requestAnimationFrame(draw);

        analyser.getByteFrequencyData(dataArray);

        ctx.fillStyle = "rgb(200, 200, 200)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i] / 2;

          const gradient = ctx.createLinearGradient(
            0,
            canvas.height - barHeight,
            0,
            canvas.height
          );
          gradient.addColorStop(0, "rgb(0, 122, 255)");
          gradient.addColorStop(1, "rgb(0, 122, 255, 0.5)");

          ctx.fillStyle = gradient;
          ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

          x += barWidth + 1;
        }

        // Update volume level for the microphone icon
        const sum = dataArray.reduce((a, b) => a + b, 0);
        const average = sum / bufferLength;
        setVolumeLevel(average / 256);
      };

      draw();
    };

    React.useEffect(() => {
      if (autoStart) {
        startRecording();
      }
    }, [autoStart]);

    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div
          className={cn(
            "border rounded-md p-3",
            error && "border-red-500",
            className
          )}
        >
          <div
            className={cn(
              voiceInputVariants({ variant, size }),
              "flex items-center gap-3"
            )}
          >
            <button
              type="button"
              onClick={toggleRecording}
              disabled={disabled}
              className={cn(
                "p-3 rounded-full transition-colors",
                isRecording
                  ? "bg-destructive text-destructive-foreground"
                  : "bg-primary text-primary-foreground",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {isRecording ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path d="M5.25 3A2.25 2.25 0 003 5.25v9.5A2.25 2.25 0 005.25 17h9.5A2.25 2.25 0 0017 14.75v-9.5A2.25 2.25 0 0014.75 3h-9.5z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className={cn(
                    "w-6 h-6 transition-transform",
                    volumeLevel > 0 && "scale-125"
                  )}
                >
                  <path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z" />
                  <path d="M5.5 9.643a.75.75 0 00-1.5 0V10c0 3.06 2.29 5.585 5.25 5.954V17.5h-1.5a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-1.5v-1.546A6.001 6.001 0 0016 10v-.357a.75.75 0 00-1.5 0V10a4.5 4.5 0 01-9 0v-.357z" />
                </svg>
              )}
            </button>
            <div className="flex-1 space-y-1">
              <div className="text-sm">
                {isRecording ? "Recording..." : "Click to start recording"}
              </div>
              {maxDuration > 0 && (
                <div className="text-xs text-muted-foreground">
                  {Math.floor((maxDuration - duration) / 60)}:
                  {((maxDuration - duration) % 60).toString().padStart(2, "0")}
                </div>
              )}
            </div>

            {audioURL && !isRecording && (
              <audio
                src={audioURL}
                controls
                className="max-w-[200px]"
              />
            )}
          </div>

          {visualizer && (
            <canvas
              ref={canvasRef}
              width={300}
              height={50}
              className={cn(
                "w-full h-[50px] rounded-md",
                !isRecording && "hidden"
              )}
            />
          )}

          {transcript && (
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm whitespace-pre-wrap">{transcript}</p>
            </div>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

    
export { VoiceInput };