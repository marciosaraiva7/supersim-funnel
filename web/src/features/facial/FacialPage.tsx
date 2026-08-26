import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Camera, Lock, Shield, Zap } from 'lucide-react'
import { OfertasHeader } from '@/components/brand/OfertasHeader'
import { TrustFooter } from '@/components/brand/TrustFooter'
import { useFlow } from '@/context/FlowContext'
import { useUtmCapture } from '@/hooks/useUtmCapture'
import { buildUrlWithUtms } from '@/lib/utm'

type Step = 'consent' | 'camera' | 'preview'

export function FacialPage() {
  const navigate = useNavigate()
  useUtmCapture()
  const { nome, cpf, analiseData, setFacialVerified, setFacialPhoto } = useFlow()
  const [step, setStep] = useState<Step>('consent')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [cameraError, setCameraError] = useState(false)
  const [useFallback, setUseFallback] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    if (!cpf || !analiseData.analiseComplete) navigate('/analise')
  }, [cpf, analiseData.analiseComplete, navigate])

  useEffect(() => {
    if (step !== 'camera' || useFallback) return

    let active = true
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } },
          audio: false,
        })
        if (!active) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }
        setCameraError(false)
      } catch {
        setCameraError(true)
        setUseFallback(true)
      }
    }

    startCamera()
    return () => {
      active = false
      streamRef.current?.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
  }, [step, useFallback])

  function stopCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
  }

  function capturePhoto() {
    if (useFallback) {
      setPreviewUrl('/assets/attendant.png')
      stopCamera()
      setStep('preview')
      return
    }

    const video = videoRef.current
    if (!video) return
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 640
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
    setPreviewUrl(dataUrl)
    stopCamera()
    setStep('preview')
  }

  function finish() {
    if (previewUrl) setFacialPhoto(previewUrl)
    setFacialVerified(true)
    navigate(buildUrlWithUtms('/vencimento'))
  }

  function retake() {
    setPreviewUrl(null)
    setStep('camera')
  }

  if (step === 'camera' || step === 'preview') {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-black text-white">
        <div className="flex items-center justify-between px-4 py-4">
          <button
            type="button"
            aria-label="Voltar"
            onClick={() => {
              stopCamera()
              setStep('consent')
            }}
            className="flex size-10 items-center justify-center rounded-full bg-white/10"
          >
            <ArrowLeft className="size-5" />
          </button>
          <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold">
            <span className="size-2 animate-pulse rounded-full bg-green-400" />
            Verificação ativa
          </div>
          <div className="size-10" />
        </div>

        <div className="relative flex flex-1 flex-col items-center justify-center px-6">
          {step === 'camera' ? (
            <>
              <div className="relative mb-8 flex size-64 items-center justify-center overflow-hidden rounded-[50%]">
                <div className="absolute inset-0 rounded-[50%] border-2 border-dashed border-primary/60" />
                {useFallback ? (
                  <div className="absolute inset-4 flex items-center justify-center rounded-[50%] bg-[#1F2937]">
                    <Camera className="size-12 text-white/40" />
                  </div>
                ) : (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-4 size-[calc(100%-2rem)] rounded-[50%] object-cover"
                  />
                )}
              </div>
              {cameraError && (
                <p className="mb-2 text-center text-xs text-yellow-300">
                  Câmera indisponível — usando modo simulado
                </p>
              )}
              <p className="text-center text-sm text-white/80">
                Posicione seu rosto dentro do contorno
              </p>
              <div className="mt-8 flex items-center gap-2 text-xs text-white/60">
                <Lock className="size-4" />
                Conexão segura e criptografada
              </div>
              <button
                type="button"
                onClick={capturePhoto}
                className="mt-10 size-16 rounded-full border-4 border-white bg-white/10"
                aria-label="Capturar"
              />
            </>
          ) : (
            <>
              <div className="mb-6 size-64 overflow-hidden rounded-[50%] border-4 border-primary">
                {previewUrl && (
                  <img src={previewUrl} alt="Preview" className="size-full object-cover" />
                )}
              </div>
              <p className="mb-6 text-center text-sm text-white/80">
                Confira se sua foto está nítida e bem iluminada
              </p>
              <div className="flex w-full max-w-xs flex-col gap-3">
                <button
                  type="button"
                  onClick={retake}
                  className="rounded-xl border border-white/30 px-4 py-3 text-sm font-semibold"
                >
                  Tentar novamente
                </button>
                <button
                  type="button"
                  onClick={finish}
                  className="rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white"
                >
                  Usar esta foto
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh flex-col bg-bg-app pt-[72px] text-text">
      <OfertasHeader nome={nome} cpf={cpf} />

      <div className="mx-auto w-full max-w-[420px] flex-1 px-5 pb-8">
        <div className="rounded-[18px] border border-border bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <h1 className="mb-3 text-center text-xl font-bold">Verificação facial</h1>
          <p className="mb-6 text-center text-sm leading-relaxed text-text-light">
            Para sua segurança, precisamos validar sua identidade com uma selfie. O processo é
            rápido e seguro.
          </p>

          <div className="mb-6 space-y-4">
            {[
              {
                icon: Shield,
                title: 'Uso limitado',
                text: 'A foto será usada apenas para validação de identidade no processo de contratação.',
              },
              {
                icon: Lock,
                title: 'Proteção de dados',
                text: 'Seus dados e imagem não serão compartilhados com terceiros sem autorização.',
              },
              {
                icon: Zap,
                title: 'Rápido e simples',
                text: 'Leva menos de 1 minuto — confirme e tire a foto.',
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle text-primary-dark">
                  <item.icon className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="text-xs leading-relaxed text-text-light">{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="mb-6 text-xs leading-relaxed text-text-light">
            Ao confirmar você autoriza a captura e o uso da imagem para validação desta operação,
            conforme a LGPD.
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 rounded-xl border border-border px-4 py-3.5 text-sm font-semibold text-text-mid"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => setStep('camera')}
              className="flex-1 rounded-xl bg-primary px-4 py-3.5 text-sm font-semibold text-white"
            >
              Concordo e prosseguir
            </button>
          </div>
        </div>
      </div>

      <TrustFooter />
    </div>
  )
}
