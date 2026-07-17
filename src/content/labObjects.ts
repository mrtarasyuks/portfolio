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

  // Second batch — assets sourced for the Game-shooter project, reused here as showcase pieces
  // (same Sketchfab Standard License, commercial use/modification permitted). Scattered on a wider
  // outer ring so they don't crowd the original seven near the platform's center.
  { slug: "warden-boss", src: "/model/3d_objects/warden-boss.glb", label: "Warden Boss", targetSize: 3.4, position: [13.5, 0, 3.6], rotationSpeed: 0.06 },
  { slug: "patrol-unit", src: "/model/3d_objects/patrol-unit.glb", label: "Patrol Unit", targetSize: 1.9, position: [8.5, 0, 8.5], rotationSpeed: 0.15 },
  { slug: "breacher-unit", src: "/model/3d_objects/breacher-unit.glb", label: "Breacher Unit", targetSize: 2.2, position: [3.4, 0, 12.6], rotationSpeed: 0.1 },
  { slug: "scout-drone", src: "/model/3d_objects/scout-drone.glb", label: "Scout Drone", targetSize: 0.8, position: [-2.8, 0, 10.6], rotationSpeed: 0.25 },
  { slug: "rivet-rifle", src: "/model/3d_objects/rivet-rifle.glb", label: "Rivet Rifle", targetSize: 1.1, position: [-7.1, 0, 7.1], rotationSpeed: 0.18 },
  { slug: "triple-barrel-shotgun", src: "/model/3d_objects/triple-barrel-shotgun.glb", label: "Triple-Barrel Shotgun", targetSize: 1.1, position: [-9.7, 0, 2.6], rotationSpeed: 0.18 },
  { slug: "salvaged-sidearm", src: "/model/3d_objects/salvaged-sidearm.glb", label: "Salvaged Sidearm", targetSize: 0.35, position: [-8.7, 0, -2.3], rotationSpeed: 0.3 },
  { slug: "crashed-car-01", src: "/model/3d_objects/crashed-car-01.glb", label: "Crashed Car", targetSize: 4.0, position: [-10.6, 0, -10.6], rotationSpeed: 0 },
  { slug: "crashed-car-02", src: "/model/3d_objects/crashed-car-02.glb", label: "Crashed Car", targetSize: 4.0, position: [-3.9, 0, -14.5], rotationSpeed: 0 },
  { slug: "crashed-car-03", src: "/model/3d_objects/crashed-car-03.glb", label: "Crashed Car", targetSize: 4.0, position: [3.9, 0, -14.5], rotationSpeed: 0 },
  { slug: "armor-plate", src: "/model/3d_objects/armor-plate.glb", label: "Armor Plate", targetSize: 0.4, position: [6.4, 0, -6.4], rotationSpeed: 0.28 },
  { slug: "medkit", src: "/model/3d_objects/medkit.glb", label: "First Aid Kit", targetSize: 0.35, position: [8.7, 0, -2.3], rotationSpeed: 0.28 },
];
