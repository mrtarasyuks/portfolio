import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Color } from "three";

export function useLerpedColor(targetHex: string, speed = 2.2) {
  const color = useRef(new Color(targetHex));
  const target = useRef(new Color(targetHex));

  useEffect(() => {
    target.current.set(targetHex);
  }, [targetHex]);

  useFrame((_, delta) => {
    color.current.lerp(target.current, Math.min(1, delta * speed));
  });

  return color;
}
