import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const SNOISE = `
vec3 mod289(vec3 x){return x - floor(x * (1.0/289.0)) * 289.0;}
vec2 mod289(vec2 x){return x - floor(x * (1.0/289.0)) * 289.0;}
vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
`

function WavePlane() {
  const matRef = useRef<THREE.MeshStandardMaterial>(null)
  const shaderRef = useRef<THREE.WebGLProgramParametersWithUniforms | null>(null)

  useFrame((state) => {
    if (shaderRef.current) shaderRef.current.uniforms.uTime.value = state.clock.elapsedTime
  })

  return (
    <mesh rotation={[-1.05, 0, 0]} position={[0, -1.35, -0.4]}>
      <planeGeometry args={[9, 7, 128, 128]} />
      <meshStandardMaterial
        ref={matRef}
        color="#EAE6DF"
        transparent
        opacity={0.5}
        roughness={0.9}
        metalness={0}
        side={THREE.DoubleSide}
        onBeforeCompile={(shader) => {
          shader.uniforms.uTime = { value: 0 }
          shader.vertexShader =
            'uniform float uTime;\n' +
            SNOISE +
            shader.vertexShader.replace(
              '#include <begin_vertex>',
              `#include <begin_vertex>
               float n = snoise(vec2(position.x * 0.55 + uTime * 0.12, position.y * 0.45 - uTime * 0.08));
               float n2 = snoise(vec2(position.x * 1.4 - uTime * 0.06, position.y * 1.1 + uTime * 0.1));
               transformed.z += n * 0.42 + n2 * 0.12;`
            )
          shaderRef.current = shader
        }}
      />
    </mesh>
  )
}

/** Barely-visible atmospheric wave — hero background only */
export default function HeroWave({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none ${className}`} aria-hidden>
      <Canvas
        camera={{ position: [0, 0.5, 3.2], fov: 52 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.1} />
        <directionalLight position={[3, 4, 5]} intensity={0.7} />
        <WavePlane />
      </Canvas>
    </div>
  )
}
