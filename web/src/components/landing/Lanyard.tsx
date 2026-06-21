'use client'

// Crachá 3D pendurado num cordão (React Bits — variante JS/CSS), adaptado para
// Next.js + TypeScript estrito:
//  • Assets carregados por URL de /public/lanyard/ (Next não importa .glb como módulo).
//  • Tipagem forte (sem `any`): refs de física como RapierRigidBody, geometria do
//    cordão como MeshLineGeometry; o "lerped" do snippet vira um WeakMap tipado.
//  • Elementos JSX customizados do meshline declarados via ThreeElements (R3F v9).
import { useEffect, useMemo, useRef, useState, Suspense, type RefObject } from 'react'
import { Canvas, extend, useFrame, type ThreeElement, type ThreeEvent } from '@react-three/fiber'
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei'
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
} from '@react-three/rapier'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'
import * as THREE from 'three'

extend({ MeshLineGeometry, MeshLineMaterial })

declare module '@react-three/fiber' {
  interface ThreeElements {
    meshLineGeometry: ThreeElement<typeof MeshLineGeometry>
    meshLineMaterial: ThreeElement<typeof MeshLineMaterial>
  }
}

const DEFAULT_CARD = '/lanyard/card.glb'
const DEFAULT_BAND = '/lanyard/lanyard.png'

// 1x1 transparente — permite chamar useTexture incondicionalmente quando uma face
// não recebe imagem (regras de hooks).
const BLANK_PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='

// A face frontal do modelo mapeia para a metade ESQUERDA do atlas; a traseira, à
// direita. Cada imagem é composta na sua metade, preservando proporção.
const FRONT_UV_RECT = { x: 0, y: 0, w: 0.5, h: 0.755 }
const BACK_UV_RECT = { x: 0.5, y: 0, w: 0.5, h: 0.757 }

type LanyardProps = {
  readonly position?: [number, number, number]
  readonly gravity?: [number, number, number]
  readonly fov?: number
  readonly transparent?: boolean
  readonly frontImage?: string | null
  readonly backImage?: string | null
  readonly imageFit?: 'cover' | 'contain'
  readonly lanyardImage?: string | null
  readonly lanyardWidth?: number
}

export default function Lanyard({
  position = [0, 0, 30],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardImage = null,
  lanyardWidth = 1,
}: LanyardProps) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768,
  )

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className='relative z-0 flex h-full w-full items-center justify-center'>
      <Canvas
        camera={{ position, fov }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <Suspense fallback={null}>
            <Band
              isMobile={isMobile}
              frontImage={frontImage}
              backImage={backImage}
              imageFit={imageFit}
              lanyardImage={lanyardImage}
              lanyardWidth={lanyardWidth}
            />
          </Suspense>
        </Physics>
        <Environment blur={0.75}>
          <Lightformer intensity={2} color='white' position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color='white' position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color='white' position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={10} color='white' position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
        </Environment>
      </Canvas>
    </div>
  )
}

type BandProps = {
  readonly maxSpeed?: number
  readonly minSpeed?: number
  readonly isMobile?: boolean
  readonly frontImage?: string | null
  readonly backImage?: string | null
  readonly imageFit?: 'cover' | 'contain'
  readonly lanyardImage?: string | null
  readonly lanyardWidth?: number
}

// Formato narrado do card.glb (medido no modelo): malhas e materiais usados.
type CardGLTF = {
  nodes: { card: THREE.Mesh; clip: THREE.Mesh; clamp: THREE.Mesh }
  materials: { base: THREE.MeshPhysicalMaterial; metal: THREE.MeshStandardMaterial }
}

function Band({
  maxSpeed = 50,
  minSpeed = 0,
  isMobile = false,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardImage = null,
  lanyardWidth = 1,
}: BandProps) {
  const band = useRef<THREE.Mesh>(null)
  const fixed = useRef<RapierRigidBody>(null)
  const j1 = useRef<RapierRigidBody>(null)
  const j2 = useRef<RapierRigidBody>(null)
  const j3 = useRef<RapierRigidBody>(null)
  const card = useRef<RapierRigidBody>(null)

  const vec = useMemo(() => new THREE.Vector3(), [])
  const ang = useMemo(() => new THREE.Vector3(), [])
  const rot = useMemo(() => new THREE.Vector3(), [])
  const dir = useMemo(() => new THREE.Vector3(), [])
  // "lerped" do snippet original — guardado fora do RigidBody (tipado) via WeakMap.
  const lerped = useRef(new WeakMap<RapierRigidBody, THREE.Vector3>())

  const segmentProps = {
    type: 'dynamic' as const,
    canSleep: true,
    colliders: false as const,
    angularDamping: 4,
    linearDamping: 4,
  }
  const { nodes, materials } = useGLTF(DEFAULT_CARD) as unknown as CardGLTF
  // wrap configurado no onLoad (onde a textura é construída) — a faixa repete ao
  // longo do cordão sem mutar um valor de hook no render (react-hooks/immutability).
  const texture = useTexture(lanyardImage ?? DEFAULT_BAND, (loaded) => {
    const t = Array.isArray(loaded) ? loaded[0] : loaded
    if (t) {
      t.wrapS = THREE.RepeatWrapping
      t.wrapT = THREE.RepeatWrapping
    }
  })
  const frontTex = useTexture(frontImage ?? BLANK_PIXEL)
  const backTex = useTexture(backImage ?? BLANK_PIXEL)

  // Compõe as imagens das faces no atlas do card (frente = metade esquerda,
  // verso = direita), preservando proporção (sem esticar).
  const cardMap = useMemo(() => {
    const baseMap = materials.base.map
    if ((!frontImage && !backImage) || !baseMap) return baseMap

    const baseImg = baseMap.image as HTMLImageElement
    const W = baseImg.width
    const H = baseImg.height
    const canvas = document.createElement('canvas')
    canvas.width = W
    canvas.height = H
    const ctx = canvas.getContext('2d')
    if (!ctx) return baseMap
    ctx.drawImage(baseImg, 0, 0, W, H)

    const drawFitted = (img: CanvasImageSource, rect: { x: number; y: number; w: number; h: number }) => {
      const iw = (img as HTMLImageElement).width
      const ih = (img as HTMLImageElement).height
      const rx = rect.x * W
      const ry = rect.y * H
      const rw = rect.w * W
      const rh = rect.h * H
      const pick = imageFit === 'contain' ? Math.min : Math.max
      const scale = pick(rw / iw, rh / ih)
      const dw = iw * scale
      const dh = ih * scale
      const dx = rx + (rw - dw) / 2
      const dy = ry + (rh - dh) / 2
      ctx.save()
      ctx.beginPath()
      ctx.rect(rx, ry, rw, rh)
      ctx.clip()
      ctx.drawImage(img, dx, dy, dw, dh)
      ctx.restore()
    }

    if (frontImage && frontTex.image) drawFitted(frontTex.image as CanvasImageSource, FRONT_UV_RECT)
    if (backImage && backTex.image) drawFitted(backTex.image as CanvasImageSource, BACK_UV_RECT)

    const composite = new THREE.CanvasTexture(canvas)
    composite.colorSpace = THREE.SRGBColorSpace
    composite.flipY = baseMap.flipY
    composite.anisotropy = 16
    composite.needsUpdate = true
    return composite
  }, [frontImage, backImage, imageFit, frontTex, backTex, materials.base.map])

  // Material do cordão instanciado uma vez (resolution é obrigatório no ctor) e
  // anexado via <primitive> — evita que o R3F reconstrua o material a cada render.
  const bandMaterial = useMemo(() => {
    const m = new MeshLineMaterial({
      color: 'white',
      resolution: new THREE.Vector2(1000, isMobile ? 2000 : 1000),
      useMap: 1,
      map: texture,
      repeat: new THREE.Vector2(-4, 1),
      lineWidth: lanyardWidth,
    })
    m.depthTest = false
    return m
  }, [isMobile, texture, lanyardWidth])

  const [curve] = useState(() => {
    const c = new THREE.CatmullRomCurve3([
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
    ])
    c.curveType = 'chordal'
    return c
  })
  const [dragged, drag] = useState<THREE.Vector3 | false>(false)
  const [hovered, hover] = useState(false)

  // Os hooks de junta esperam RefObject<RapierRigidBody> (não-nulo); no React 19
  // useRef<T>(null) é RefObject<T | null>, então afunilamos o tipo aqui.
  type RB = RefObject<RapierRigidBody>
  useRopeJoint(fixed as RB, j1 as RB, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j1 as RB, j2 as RB, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j2 as RB, j3 as RB, [[0, 0, 0], [0, 0, 0], 1])
  useSphericalJoint(j3 as RB, card as RB, [[0, 0, 0], [0, 1.5, 0]])

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab'
      return () => {
        document.body.style.cursor = 'auto'
      }
    }
    return undefined
  }, [hovered, dragged])

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
      dir.copy(vec).sub(state.camera.position).normalize()
      vec.add(dir.multiplyScalar(state.camera.position.length()))
      ;[card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp())
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      })
    }
    if (fixed.current && j1.current && j2.current && j3.current && band.current) {
      ;[j1, j2].forEach((ref) => {
        const body = ref.current
        if (!body) return
        const t = body.translation()
        const tvec = new THREE.Vector3(t.x, t.y, t.z)
        let lp = lerped.current.get(body)
        if (!lp) {
          lp = new THREE.Vector3().copy(tvec)
          lerped.current.set(body, lp)
        }
        const clampedDistance = Math.max(0.1, Math.min(1, lp.distanceTo(tvec)))
        lp.lerp(tvec, delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)))
      })

      const lp1 = lerped.current.get(j1.current)
      const lp2 = lerped.current.get(j2.current)
      const [p0, p1, p2, p3] = curve.points
      if (p0 && p1 && p2 && p3 && lp1 && lp2) {
        const j3t = j3.current.translation()
        const fxt = fixed.current.translation()
        p0.set(j3t.x, j3t.y, j3t.z)
        p1.copy(lp2)
        p2.copy(lp1)
        p3.set(fxt.x, fxt.y, fxt.z)
        ;(band.current.geometry as MeshLineGeometry).setPoints(curve.getPoints(isMobile ? 16 : 32))
      }

      const av = card.current?.angvel()
      const cr = card.current?.rotation()
      if (av && cr) {
        ang.set(av.x, av.y, av.z)
        rot.set(cr.x, cr.y, cr.z)
        card.current?.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true)
      }
    }
  })

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type='fixed' />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[2, 0, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e: ThreeEvent<PointerEvent>) => {
              ;(e.target as Element).releasePointerCapture(e.pointerId)
              drag(false)
            }}
            onPointerDown={(e: ThreeEvent<PointerEvent>) => {
              ;(e.target as Element).setPointerCapture(e.pointerId)
              if (card.current) {
                const ct = card.current.translation()
                drag(new THREE.Vector3().copy(e.point).sub(vec.set(ct.x, ct.y, ct.z)))
              }
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={cardMap}
                map-anisotropy={16}
                clearcoat={isMobile ? 0 : 1}
                clearcoatRoughness={0.15}
                roughness={0.9}
                metalness={0.8}
              />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <primitive object={bandMaterial} attach='material' />
      </mesh>
    </>
  )
}

useGLTF.preload(DEFAULT_CARD)
