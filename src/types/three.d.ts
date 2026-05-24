declare module "three" {
  export const SRGBColorSpace: string;

  export class Vector2 {
    constructor(x?: number, y?: number);
    x: number;
    y: number;
    set(x: number, y: number): this;
    copy(vector: Vector2): this;
    lerp(vector: Vector2, alpha: number): this;
  }

  export class Vector3 {
    constructor(x?: number, y?: number, z?: number);
    set(x: number, y: number, z: number): this;
    copy(vector: Vector3): this;
  }

  export class Scene {
    add(object: unknown): void;
  }

  export class OrthographicCamera {
    constructor(left: number, right: number, top: number, bottom: number, near: number, far: number);
  }

  export class PlaneGeometry {
    constructor(width: number, height: number);
    dispose(): void;
  }

  export class ShaderMaterial {
    constructor(parameters: {
      vertexShader: string;
      fragmentShader: string;
      uniforms: Record<string, { value: unknown }>;
      premultipliedAlpha?: boolean;
      transparent?: boolean;
    });
    uniforms: Record<string, { value: unknown }>;
    dispose(): void;
  }

  export class Mesh {
    constructor(geometry: PlaneGeometry, material: ShaderMaterial);
  }

  export class WebGLRenderer {
    constructor(parameters?: { antialias?: boolean; powerPreference?: string; alpha?: boolean });
    domElement: HTMLCanvasElement;
    outputColorSpace: string;
    setPixelRatio(value: number): void;
    setClearColor(color: number, alpha?: number): void;
    setSize(width: number, height: number, updateStyle?: boolean): void;
    render(scene: Scene, camera: OrthographicCamera): void;
    dispose(): void;
    forceContextLoss(): void;
  }

  export class Clock {
    elapsedTime: number;
    getDelta(): number;
  }
}
