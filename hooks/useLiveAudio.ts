import { useState, useEffect, useRef, useCallback } from 'react';
import { Modality, LiveServerMessage, Type, FunctionDeclaration } from '@google/genai';
import { createLiveSession, performSearch } from '../services/geminiService';
import { pcmToBlob, decodeAudioData, base64ToArrayBuffer } from '../utils/audioUtils';
import { ConnectionStatus } from '../types';

export const useLiveAudio = () => {
  const [status, setStatus] = useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
  const [volume, setVolume] = useState(0);
  const [terminalText, setTerminalText] = useState("System ready. Initializing...");
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

  // Audio Context refs
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  
  // Session handling
  const sessionPromiseRef = useRef<Promise<any> | null>(null);

  const connect = useCallback(async () => {
    try {
      setStatus(ConnectionStatus.CONNECTING);
      setTerminalText("Establishing secure connection to Gemini Live...");

      const ai = createLiveSession();
      
      // Initialize Audio Contexts
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const inputCtx = new AudioContextClass({ sampleRate: 16000 });
      const outputCtx = new AudioContextClass({ sampleRate: 24000 });
      
      inputAudioContextRef.current = inputCtx;
      outputAudioContextRef.current = outputCtx;

      // Audio Input Setup
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = inputCtx.createMediaStreamSource(stream);
      
      // Analyser for visualization
      const analyserNode = inputCtx.createAnalyser();
      analyserNode.fftSize = 256;
      source.connect(analyserNode);
      setAnalyser(analyserNode);

      // Processor for capturing audio chunks
      const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
      
      scriptProcessor.onaudioprocess = (e) => {
        if (!sessionPromiseRef.current) return;
        
        const inputData = e.inputBuffer.getChannelData(0);
        // Calculate volume for UI
        let sum = 0;
        for (let i = 0; i < inputData.length; i++) {
           sum += inputData[i] * inputData[i];
        }
        setVolume(Math.sqrt(sum / inputData.length));

        const pcmBlob = pcmToBlob(inputData);
        sessionPromiseRef.current.then(session => {
          session.sendRealtimeInput({ media: pcmBlob });
        });
      };
      
      source.connect(scriptProcessor);
      scriptProcessor.connect(inputCtx.destination);

      // Tool Definition
      const searchTool: FunctionDeclaration = {
        name: 'search_web',
        parameters: {
          type: Type.OBJECT,
          description: 'Search the web for up-to-date information.',
          properties: {
            query: {
               type: Type.STRING,
               description: 'The search query to send to Google Search.'
            }
          },
          required: ['query']
        }
      };

      // Connect to Live API
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            console.log('Gemini Live Connected');
            setStatus(ConnectionStatus.CONNECTED);
            setTerminalText("Connection established. Link stable.");
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle Audio
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio && outputAudioContextRef.current) {
              const ctx = outputAudioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              
              const audioBuffer = await decodeAudioData(
                new Uint8Array(base64ToArrayBuffer(base64Audio)),
                ctx
              );
              
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
              });
              
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            // Handle Interruption
            if (message.serverContent?.interrupted) {
              setTerminalText("Interruption detected. Clearing buffer.");
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }

            // Handle Tool Calls
            if (message.toolCall) {
              for (const fc of message.toolCall.functionCalls) {
                if (fc.name === 'search_web') {
                  const query = (fc.args as any).query;
                  setTerminalText(`> Executing Search Protocol: "${query}"...`);
                  
                  // Call Gemini 3 Flash
                  const result = await performSearch(query);
                  
                  setTerminalText(`> Data received. Synthesizing response...`);
                  
                  // Send response back to Live model
                  sessionPromise.then(session => {
                    session.sendToolResponse({
                      functionResponses: {
                         id: fc.id,
                         name: fc.name,
                         response: { result: result }
                      }
                    });
                  });
                }
              }
            }
            
            // Handle Transcription (Optional UI feedback)
            if (message.serverContent?.modelTurn?.parts?.[0]?.text) {
                 // Often text is empty in audio mode, but if it exists
            }
          },
          onclose: () => {
            console.log('Gemini Live Closed');
            setStatus(ConnectionStatus.DISCONNECTED);
            setTerminalText("Connection terminated.");
          },
          onerror: (err) => {
            console.error('Gemini Live Error', err);
            setStatus(ConnectionStatus.ERROR);
            setTerminalText("Error: " + err);
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          tools: [{ functionDeclarations: [searchTool] }],
          systemInstruction: "You are Timeless Droid, an advanced AI system. You are helpful, concise, and have a slightly robotic but friendly personality. If the user asks for current information, use the search_web tool.",
          speechConfig: {
             voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
          }
        }
      });
      
      sessionPromiseRef.current = sessionPromise;

    } catch (e) {
      console.error(e);
      setStatus(ConnectionStatus.ERROR);
      setTerminalText("Initialization failed.");
    }
  }, []);

  const disconnect = useCallback(() => {
    if (sessionPromiseRef.current) {
        sessionPromiseRef.current.then(s => s.close()); // Just close it, the hook catches onclose
    }
    
    if (inputAudioContextRef.current) {
      inputAudioContextRef.current.close();
      inputAudioContextRef.current = null;
    }
    if (outputAudioContextRef.current) {
      outputAudioContextRef.current.close();
      outputAudioContextRef.current = null;
    }
    setAnalyser(null);
    setStatus(ConnectionStatus.DISCONNECTED);
  }, []);

  return {
    connect,
    disconnect,
    status,
    volume,
    terminalText,
    analyser
  };
};
