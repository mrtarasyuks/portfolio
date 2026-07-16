export type LabObject = {
  slug: string;
  src: string;
  label: string;
  /** Target size (meters) for the object's largest dimension once normalized — curated per object
   * rather than one uniform size for every model, so the platform still reads as a coherent set of
   * real-world objects at believable relative scale (the car is bigger than the bike, the bike is
   * bigger than the helmet) instead of every wildly-different source model being stretched or
   * shrunk to identical bounds. */
  targetSize: number;
  position: [number, number, number];
  rotationSpeed: number;
  /** Fixed one-time orientation correction (radians) — some source .glb exports don't land
   * upright on their own after auto-scaling; tune per object here rather than guessing in code. */
  rotation?: [number, number, number];
};

/**
 * The 3D Lab platform's showcase objects — real .glb exports dropped in `public/model/3d_objects/`.
 * Each entry's own real-world unit scale in the source file is unknown/inconsistent (Blender exports
 * at whatever unit the modeler used), so `LabObject` (the R3F component, not this content list)
 * measures each model's own bounding box at runtime and rescales it to `targetSize` — this file only
 * decides what that target size, position, and idle spin should be.
 */
export const labObjects: LabObject[] = [
  { slug: "spaceshuttle", src: "/model/3d_objects/spaceshuttle.glb", label: "Space Shuttle", targetSize: 6.2, position: [0, 0, -7], rotationSpeed: 0.05 },
  { slug: "mersedes_benz", src: "/model/3d_objects/mersedes_benz.glb", label: "Mercedes-Benz", targetSize: 4.2, position: [-6.5, 0, 1.5], rotationSpeed: 0.08 },
  { slug: "one_tree", src: "/model/3d_objects/one_tree.glb", label: "Tree", targetSize: 3.6, position: [6, 0, -2], rotationSpeed: 0 },
  { slug: "mountain_bike", src: "/model/3d_objects/mountain_bike.glb", label: "Mountain Bike", targetSize: 1.8, position: [5.5, 0, 4], rotationSpeed: 0.12 },
  { slug: "android-robot", src: "/model/3d_objects/android-robot.glb", label: "Android Robot", targetSize: 1.7, position: [-3.5, 0, 4.5], rotationSpeed: 0.18 },
  { slug: "helmet-with-stand", src: "/model/3d_objects/helmet-with-stand.glb", label: "Helmet", targetSize: 0.6, position: [-1.5, 0, -4.5], rotationSpeed: 0.22 },
  { slug: "turntable", src: "/model/3d_objects/Turntable.glb", label: "Turntable", targetSize: 0.9, position: [2, 0, 2], rotationSpeed: 0.2 },
];
