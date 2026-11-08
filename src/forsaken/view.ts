import * as THREE from "three";
import { MINION_VISUAL, getChar, type CharColors } from "./content";
import { WORLD, surfaceY } from "./maps";
import type { Actor, Sim } from "./sim";

interface Parts {
  lLeg: THREE.Mesh;
  rLeg: THREE.Mesh;
  lArm: THREE.Mesh;
  rArm: THREE.Mesh;
}

const THEME = {
  forest: { bg: 0x0c1210, sky: 0x243044, ground: 0x1a120e, hemi: 0.55, dir: 0.7, near: 12, far: 42, floor: 0x1a2614 },
  city: { bg: 0x12141a, sky: 0x2a3344, ground: 0x14110e, hemi: 0.5, dir: 0.55, near: 16, far: 52, floor: 0x2a2c30 },
  hq: { bg: 0xc4beb4, sky: 0xf2efe8, ground: 0xb7aea4, hemi: 0.95, dir: 1.05, near: 24, far: 78, floor: 0xd5d0c8 },
  classic: { bg: 0x6a5640, sky: 0xc6a57a, ground: 0x4a3824, hemi: 0.9, dir: 1, near: 16, far: 68, floor: 0x8d6b3e },
} as const;

function std(hex: number, rough = 0.72) {
  return new THREE.MeshStandardMaterial({ color: hex, roughness: rough, metalness: 0.05 });
}

function buildAvatar(charId: string) {
  const colors: CharColors = charId === "minion" ? MINION_VISUAL : getChar(charId).colors;
  const scale = charId === "minion" ? 0.62 : getChar(charId).scale;
  const g = new THREE.Group();
  const mats: THREE.MeshStandardMaterial[] = [];
  const mat = (hex: number) => {
    const m = std(hex);
    mats.push(m);
    return m;
  };
  const box = (w: number, h: number, d: number, material: THREE.Material) =>
    new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);

  const head = box(0.92, 0.86, 0.84, mat(colors.head));
  head.position.y = 2.32;
  const torso = box(1.12, 1.16, 0.58, mat(colors.torso));
  torso.position.y = 1.36;
  const armGeo = new THREE.BoxGeometry(0.36, 1.16, 0.36);
  const lArm = new THREE.Mesh(armGeo, mat(colors.arm));
  lArm.position.set(-0.78, 1.36, 0);
  const rArm = new THREE.Mesh(armGeo, mat(colors.arm));
  rArm.position.set(0.78, 1.36, 0);
  const legGeo = new THREE.BoxGeometry(0.42, 1.05, 0.44);
  const lLeg = new THREE.Mesh(legGeo, mat(colors.leg));
  lLeg.position.set(-0.28, 0.52, 0);
  const rLeg = new THREE.Mesh(legGeo, mat(colors.leg));
  rLeg.position.set(0.28, 0.52, 0);

  const eyeMat = mat(charId === "johndoe" || charId === "onex" ? 0xe23b3b : charId === "coolkid" ? 0xf4efe6 : 0x1a1a1a);
  const eyeGeo = new THREE.BoxGeometry(0.12, 0.12, 0.06);
  const e1 = new THREE.Mesh(eyeGeo, eyeMat);
  const e2 = new THREE.Mesh(eyeGeo, eyeMat);
  e1.position.set(-0.18, 0.08, 0.44);
  e2.position.set(0.18, 0.08, 0.44);
  if (charId !== "onex") {
    if (charId !== "johndoe") head.add(e2);
    else e1.scale.set(1.4, 1.4, 1);
    head.add(e1);
  }

  if (charId === "noob" || charId === "shedletsky" || charId === "elliot" || charId === "chance") {
    const smile = box(0.32, 0.07, 0.06, mat(0x24180f));
    smile.position.set(0, -0.18, 0.44);
    head.add(smile);
  }
  if (charId === "jason") {
    const mark = box(0.16, 0.16, 0.05, mat(0xc4313a));
    mark.position.set(0, -0.16, 0.44);
    head.add(mark);
  }
  if (charId === "coolkid" || charId === "minion") {
    const mouth = box(0.42, 0.1, 0.06, mat(0x14080a));
    mouth.position.set(0, -0.18, 0.44);
    head.add(mouth);
  }
  if (charId === "shedletsky") {
    const hair = box(0.98, 0.28, 0.92, mat(0x6b3a1f));
    hair.position.y = 0.42;
    head.add(hair);
    const blade = box(0.1, 0.95, 0.08, mat(0xd9dde2));
    blade.position.set(0.05, -0.15, 0.28);
    rArm.add(blade);
  }
  if (charId === "elliot") {
    const cap = box(0.98, 0.16, 0.96, mat(0xc4313a));
    cap.position.y = 0.48;
    const brim = box(0.72, 0.06, 0.28, mat(0xc4313a));
    brim.position.set(0, 0.36, 0.46);
    head.add(cap, brim);
  }
  if (charId === "chance") {
    const brim = box(1.2, 0.08, 1.08, mat(0x141414));
    brim.position.set(0, 0.46, 0.06);
    const crown = box(0.62, 0.32, 0.62, mat(0x141414));
    crown.position.y = 0.64;
    const band = box(0.66, 0.08, 0.66, mat(0xd4a017));
    band.position.y = 0.5;
    head.add(brim, crown, band);
    const gun = box(0.12, 0.12, 0.62, mat(0x3a3a3a));
    gun.position.set(0.02, -0.2, 0.46);
    rArm.add(gun);
  }
  if (charId === "onex") {
    const grin = box(0.55, 0.1, 0.06, mat(0x7CFF4A));
    grin.position.set(0, -0.2, 0.44);
    head.add(grin);
    const eye = box(0.16, 0.1, 0.06, mat(0xff2a2a));
    eye.position.set(-0.18, 0.08, 0.44);
    const eye2 = eye.clone();
    eye2.position.x = 0.18;
    head.add(eye2);
    const bladeL = box(0.08, 0.9, 0.08, mat(0x7CFF4A));
    bladeL.position.set(-0.02, -0.2, 0.34);
    lArm.add(bladeL);
    const bladeR = box(0.08, 0.9, 0.08, mat(0x7CFF4A));
    bladeR.position.set(0.02, -0.2, 0.34);
    rArm.add(bladeR);
  }
  if (charId === "jason" || charId === "johndoe") {
    const blade = box(0.12, 1.05, 0.08, mat(charId === "johndoe" ? 0x6e1c22 : 0xd9dde2));
    blade.position.set(0.02, -0.25, 0.32);
    rArm.add(blade);
  }
  if (charId === "johndoe") {
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.5, 4), mat(0x8a2028));
    spike.rotation.x = Math.PI / 2;
    spike.position.set(0.2, 0.2, -0.42);
    const spike2 = spike.clone();
    spike2.position.x = -0.2;
    torso.add(spike, spike2);
  }

  const blob = new THREE.Mesh(
    new THREE.CircleGeometry(0.72, 14),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35 }),
  );
  blob.rotation.x = -Math.PI / 2;
  blob.position.y = 0.03;

  g.add(head, torso, lArm, rArm, lLeg, rLeg, blob);
  g.scale.setScalar(scale);
  const parts: Parts = { lLeg, rLeg, lArm, rArm };
  g.userData = { parts, mats, mode: "norm" };
  for (const m of mats) m.userData.base = m.color.getHex();
  return g;
}

function groundTexture(mapId: Sim["opts"]["mapId"]) {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 256;
  const g = c.getContext("2d")!;
  if (mapId === "forest") {
    g.fillStyle = "#1a2614";
    g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 1800; i++) {
      g.fillStyle = i % 2 ? "#24361c" : "#121c10";
      g.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
    }
  } else if (mapId === "city") {
    g.fillStyle = "#2a2c30";
    g.fillRect(0, 0, 256, 256);
    g.strokeStyle = "#3c4048";
    g.lineWidth = 4;
    for (let i = 0; i <= 256; i += 32) {
      g.beginPath();
      g.moveTo(i, 0);
      g.lineTo(i, 256);
      g.stroke();
      g.beginPath();
      g.moveTo(0, i);
      g.lineTo(256, i);
      g.stroke();
    }
    g.strokeStyle = "#c9a15a";
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(128, 0);
    g.lineTo(128, 256);
    g.stroke();
    g.beginPath();
    g.moveTo(0, 128);
    g.lineTo(256, 128);
    g.stroke();
  } else if (mapId === "classic") {
    g.fillStyle = "#8d6a3c";
    g.fillRect(0, 0, 256, 256);
    for (let y = 8; y < 256; y += 16) {
      for (let x = 8; x < 256; x += 16) {
        g.fillStyle = (x / 16 + y / 16) % 2 === 0 ? "#a07c48" : "#6d512c";
        g.beginPath();
        g.arc(x, y, 5, 0, Math.PI * 2);
        g.fill();
      }
    }
  } else {
    g.fillStyle = "#d5d0c8";
    g.fillRect(0, 0, 256, 256);
    g.strokeStyle = "#c4b8aa";
    g.lineWidth = 3;
    for (let i = 0; i <= 256; i += 32) {
      g.beginPath();
      g.moveTo(i, 0);
      g.lineTo(i, 256);
      g.stroke();
      g.beginPath();
      g.moveTo(0, i);
      g.lineTo(256, i);
      g.stroke();
    }
    g.fillStyle = "#c4313a";
    g.fillRect(116, 0, 24, 256);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(8, 8);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function windowTexture() {
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 64;
  const g = c.getContext("2d")!;
  g.fillStyle = "#23262e";
  g.fillRect(0, 0, 64, 64);
  for (let y = 6; y < 64; y += 16) {
    for (let x = 6; x < 64; x += 16) {
      g.fillStyle = (x + y) % 32 === 0 ? "#2a3140" : "#f0d7a0";
      g.fillRect(x, y, 8, 10);
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

function floorGeometry(b: Sim["bunker"]) {
  if (!b) return new THREE.CircleGeometry(WORLD + 8, 48);
  const shape = new THREE.Shape();
  shape.absarc(0, 0, WORLD + 8, 0, Math.PI * 2, false);
  const hole = new THREE.Path();
  const x0 = b.x - b.hw;
  const x1 = b.x + b.hw;
  const ySouth = -(b.z - b.hd);
  const yNorth = -(b.z + b.hd);
  hole.moveTo(x0, ySouth);
  hole.lineTo(x1, ySouth);
  hole.lineTo(x1, yNorth);
  hole.lineTo(x0, yNorth);
  hole.closePath();
  shape.holes.push(hole);
  return new THREE.ShapeGeometry(shape, 12);
}

function flagTexture(color: string, mark: string) {
  const c = document.createElement("canvas");
  c.width = 80;
  c.height = 48;
  const g = c.getContext("2d")!;
  g.fillStyle = color;
  g.fillRect(0, 0, 80, 48);
  g.strokeStyle = "#f4efe6";
  g.lineWidth = 4;
  g.strokeRect(3, 3, 74, 42);
  g.fillStyle = "#f7f1e6";
  g.font = "bold 30px sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(mark, 40, 26);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function dressClassic(
  scene: THREE.Scene,
  sim: Sim,
  disposables: { dispose: () => void }[],
  fires: THREE.Object3D[],
  dusts: THREE.Object3D[],
) {
  const dirt = std(0x6b4e30, 1);
  const road = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 58), dirt);
  road.rotation.x = -Math.PI / 2;
  road.position.y = 0.04;
  const cross = new THREE.Mesh(new THREE.PlaneGeometry(46, 3.4), dirt);
  cross.rotation.x = -Math.PI / 2;
  cross.position.set(4, 0.05, -8);
  scene.add(road, cross);
  disposables.push(road.geometry, cross.geometry, dirt);

  const bunker = sim.bunker;
  if (bunker) {
    const pit = std(0x5a432c, 0.95);
    const floor = new THREE.Mesh(new THREE.BoxGeometry(bunker.hw * 2, 0.24, bunker.hd * 2), pit);
    floor.position.set(bunker.x, -bunker.depth, bunker.z);
    const wallH = bunker.depth + 0.2;
    const lip = std(0x6d5640, 0.9);
    const thick = 0.4;
    const north = new THREE.Mesh(new THREE.BoxGeometry(bunker.hw * 2 + thick, wallH, thick), lip);
    north.position.set(bunker.x, -bunker.depth + wallH / 2, bunker.z + bunker.hd);
    const south = north.clone();
    south.position.z = bunker.z - bunker.hd;
    const west = new THREE.Mesh(new THREE.BoxGeometry(thick, wallH, bunker.hd * 2), lip);
    west.position.set(bunker.x - bunker.hw, -bunker.depth + wallH / 2, bunker.z);
    const side = (bunker.hd * 2 - bunker.door) / 2;
    const eastA = new THREE.Mesh(new THREE.BoxGeometry(thick, wallH, side), lip);
    eastA.position.set(bunker.x + bunker.hw, -bunker.depth + wallH / 2, bunker.z + bunker.door / 2 + side / 2);
    const eastB = eastA.clone();
    eastB.position.z = bunker.z - bunker.door / 2 - side / 2;
    const ramp = new THREE.Mesh(new THREE.BoxGeometry(bunker.ramp, 0.16, bunker.door), std(0x735636, 0.95));
    ramp.position.set(bunker.x + bunker.hw + bunker.ramp / 2, -bunker.depth / 2, bunker.z);
    ramp.rotation.z = Math.atan2(bunker.depth, bunker.ramp);
    const lamp = new THREE.PointLight(0xff9a55, 0.55, 14, 2);
    lamp.position.set(bunker.x, -bunker.depth + 2.2, bunker.z);
    scene.add(floor, north, south, west, eastA, eastB, ramp, lamp);
    disposables.push(floor.geometry, north.geometry, west.geometry, eastA.geometry, ramp.geometry, pit, lip);
  }

  const studs = sim.obstacles.filter((o) => o.kind === "stud");
  if (studs.length) {
    const geo = new THREE.CylinderGeometry(0.28, 0.32, 0.16, 8);
    const mat = std(0xc4a36a, 0.55);
    const mesh = new THREE.InstancedMesh(geo, mat, studs.length);
    const dummy = new THREE.Object3D();
    studs.forEach((o, i) => {
      dummy.position.set(o.x, 0.08, o.z);
      dummy.rotation.set(0, o.x * 0.2, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    scene.add(mesh);
    disposables.push(geo, mat);
  }

  for (const o of sim.obstacles) {
    const y = surfaceY(sim.bunker, o.x, o.z);
    if (o.kind === "wall") {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(2.25, 1.25, 0.72), std(0xc6ae78, 0.9));
      mesh.position.set(o.x, y + 0.62, o.z);
      mesh.rotation.y = o.yaw ?? 0;
      scene.add(mesh);
    } else if (o.kind === "house") {
      const g = new THREE.Group();
      const brick = std(0x8d4a38, 0.88);
      const dark = std(0x241812, 0.95);
      const wood = std(0x6a5038, 0.82);
      const body = new THREE.Mesh(new THREE.BoxGeometry(5.2, 3.1, 4.2), brick);
      body.position.y = 1.55;
      const hole = new THREE.Mesh(new THREE.BoxGeometry(1.35, 1.55, 0.28), dark);
      hole.position.set(0.85, 1.45, 2.12);
      const crack = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.3, 0.08), dark);
      crack.position.set(-0.7, 1.7, 2.16);
      crack.rotation.z = 0.45;
      const crack2 = crack.clone();
      crack2.position.set(-0.15, 1.15, 2.16);
      crack2.rotation.z = -0.8;
      const roof = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.26, 4.5), wood);
      roof.position.set(0.35, 3.05, -0.15);
      roof.rotation.z = -0.2;
      const rubble = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.42, 1.05), brick);
      rubble.position.set(2.3, 0.22, 1.5);
      rubble.rotation.y = 0.5;
      g.add(body, hole, crack, crack2, roof, rubble);
      g.position.set(o.x, y, o.z);
      g.rotation.y = o.yaw ?? 0;
      scene.add(g);
    } else if (o.kind === "artillery") {
      const g = new THREE.Group();
      const metal = std(0x3a3e34, 0.45);
      const wood = std(0x5c4030, 0.8);
      const carriage = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.35, 1.1), wood);
      carriage.position.y = 0.55;
      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.18, 2.3, 8), metal);
      barrel.rotation.z = Math.PI / 2.4;
      barrel.position.set(0.7, 0.95, 0);
      const wgeo = new THREE.CylinderGeometry(0.42, 0.42, 0.12, 8);
      const left = new THREE.Mesh(wgeo, metal);
      left.rotation.x = Math.PI / 2;
      left.position.set(-0.15, 0.42, 0.62);
      const right = left.clone();
      right.position.z = -0.62;
      g.add(carriage, barrel, left, right);
      g.position.set(o.x, y, o.z);
      g.rotation.y = o.yaw ?? 0;
      scene.add(g);
    } else if (o.kind === "tank") {
      const g = new THREE.Group();
      const paint = std(0x4d5a38, 0.62);
      const dark = std(0x1a1c18, 0.75);
      const hull = new THREE.Mesh(new THREE.BoxGeometry(3.5, 1.05, 2.05), paint);
      hull.position.y = 0.85;
      const turret = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.65, 1.45), std(0x3d4a2e, 0.6));
      turret.position.y = 1.62;
      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.16, 2.5, 8), dark);
      barrel.rotation.z = Math.PI / 2;
      barrel.position.set(1.9, 1.62, 0);
      const track = new THREE.Mesh(new THREE.BoxGeometry(3.7, 0.62, 0.32), dark);
      track.position.set(0, 0.38, 1.12);
      const track2 = track.clone();
      track2.position.z = -1.12;
      g.add(hull, turret, barrel, track, track2);
      g.position.set(o.x, y, o.z);
      g.rotation.y = o.yaw ?? 0;
      scene.add(g);
    } else if (o.kind === "flag") {
      const g = new THREE.Group();
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 3.4, 6), std(0xd7d2c6, 0.45));
      pole.position.y = 1.7;
      const red = (o.tint ?? 0xc4313a) > 0x880000;
      const tex = flagTexture(red ? "#c4313a" : "#2a5fbf", red ? "R" : "B");
      const cloth = new THREE.Mesh(
        new THREE.PlaneGeometry(1.35, 0.78),
        new THREE.MeshStandardMaterial({ map: tex, roughness: 0.7, side: THREE.DoubleSide }),
      );
      cloth.position.set(0.72, 2.85, 0);
      g.add(pole, cloth);
      g.position.set(o.x, y, o.z);
      g.rotation.y = o.yaw ?? 0;
      scene.add(g);
      disposables.push(tex);
    } else if (o.kind === "fire") {
      const log = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.12, 0.16), std(0x3a2414, 0.9));
      log.position.set(o.x, y + 0.08, o.z);
      const log2 = log.clone();
      log2.rotation.y = 1.1;
      log2.position.y = y + 0.16;
      const flame = new THREE.Mesh(
        new THREE.ConeGeometry(0.22, 0.62, 6),
        new THREE.MeshBasicMaterial({ color: 0xff7424 }),
      );
      flame.position.set(o.x, y + 0.55, o.z);
      const glow = new THREE.PointLight(0xff6a22, 0.7, 8, 2);
      glow.position.set(o.x, y + 0.7, o.z);
      scene.add(log, log2, flame, glow);
      fires.push(flame);
    } else if (o.kind === "dust") {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(1.1, 8, 6),
        new THREE.MeshBasicMaterial({ color: 0xd2b48a, transparent: true, opacity: 0.22 }),
      );
      mesh.position.set(o.x, y + 0.7, o.z);
      mesh.scale.y = 0.35;
      mesh.userData.base = mesh.position.y;
      scene.add(mesh);
      dusts.push(mesh);
    } else if (o.kind === "grenade") {
      const g = new THREE.Group();
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 6), std(0x3e4a30, 0.55));
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.14, 6), std(0x222420, 0.4));
      cap.position.y = 0.2;
      const lever = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.22, 0.05), std(0xd5d5cc, 0.3));
      lever.position.set(0.1, 0.2, 0);
      g.add(body, cap, lever);
      g.position.set(o.x, y + 0.2, o.z);
      g.rotation.z = 0.7;
      g.rotation.y = o.x;
      scene.add(g);
    } else if (o.kind === "corpse") {
      const g = new THREE.Group();
      const skin = std(0xc49a6c, 0.8);
      const cloth = std(0x4a5a32, 0.85);
      const helm = std(0x2e3228, 0.6);
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.5, 0.5), skin);
      head.position.y = 0.28;
      const helmet = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.22, 0.55), helm);
      helmet.position.y = 0.5;
      const torso = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.85, 0.38), cloth);
      torso.position.y = -0.25;
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.7, 0.28), cloth);
      leg.position.set(-0.16, -0.95, 0);
      const leg2 = leg.clone();
      leg2.position.x = 0.16;
      g.add(head, helmet, torso, leg, leg2);
      g.rotation.z = Math.PI / 2;
      g.rotation.y = o.yaw ?? 0;
      g.position.set(o.x, y + 0.32, o.z);
      scene.add(g);
    }
  }
}

export function createView(canvas: HTMLCanvasElement, sim: Sim) {
  const mapId = sim.opts.mapId;
  const theme = THEME[mapId];
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 900 ? 1.25 : 1.6));
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(theme.bg);
  scene.fog = new THREE.Fog(theme.bg, theme.near, theme.far);
  const camera = new THREE.PerspectiveCamera(62, 1, 0.1, 140);

  scene.add(new THREE.HemisphereLight(theme.sky, theme.ground, theme.hemi));
  const hemi = scene.children[scene.children.length - 1] as THREE.HemisphereLight;
  const dir = new THREE.DirectionalLight(mapId === "hq" ? 0xfff6ea : mapId === "classic" ? 0xffe2b8 : 0xd5def0, theme.dir);
  dir.position.set(-14, 28, 10);
  scene.add(dir);

  const floorTex = groundTexture(mapId);
  const floorMat = std(0xffffff, 0.95);
  floorMat.map = floorTex;
  const floor = new THREE.Mesh(floorGeometry(sim.bunker), floorMat);
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);
  const curb = new THREE.Mesh(
    new THREE.TorusGeometry(WORLD, 0.18, 6, 64),
    new THREE.MeshStandardMaterial({ color: mapId === "hq" ? 0xe23b3b : mapId === "classic" ? 0x4a3420 : 0x1a1214, roughness: 0.8 }),
  );
  curb.rotation.x = Math.PI / 2;
  curb.position.y = 0.08;
  scene.add(curb);

  const disposables: { dispose: () => void }[] = [floorTex];

  if (mapId === "forest") {
    const moon = new THREE.Mesh(new THREE.SphereGeometry(2.1, 16, 12), new THREE.MeshBasicMaterial({ color: 0xf3e6df }));
    moon.position.set(16, 20, -24);
    scene.add(moon);
  }

  const trees = sim.obstacles.filter((o) => o.kind === "tree");
  if (trees.length) {
    const trunkGeo = new THREE.CylinderGeometry(0.22, 0.34, 1.7, 5);
    const leafGeo = new THREE.ConeGeometry(1.25, 2.6, 6);
    const trunkMat = new THREE.MeshLambertMaterial({ color: 0x3a2a1c });
    const leafMat = new THREE.MeshLambertMaterial({ color: 0x1d3a22 });
    const trunks = new THREE.InstancedMesh(trunkGeo, trunkMat, trees.length);
    const leaves = new THREE.InstancedMesh(leafGeo, leafMat, trees.length);
    const dummy = new THREE.Object3D();
    trees.forEach((o, i) => {
      dummy.position.set(o.x, 0.85, o.z);
      dummy.rotation.set(0, o.x * 0.4, 0);
      dummy.scale.set(1, 0.85 + (i % 4) * 0.12, 1);
      dummy.updateMatrix();
      trunks.setMatrixAt(i, dummy.matrix);
      dummy.position.y = 2.35;
      dummy.updateMatrix();
      leaves.setMatrixAt(i, dummy.matrix);
    });
    scene.add(trunks, leaves);
    disposables.push(trunkGeo, leafGeo, trunkMat, leafMat);
  }

  const winTex = mapId === "city" ? windowTexture() : null;
  if (winTex) disposables.push(winTex);
  for (const o of sim.obstacles) {
    if (o.kind === "building") {
      const h = mapId === "hq" ? 4.2 : 5 + (Math.abs(Math.sin(o.x * 0.35 + o.z)) * 6);
      const mat = std(mapId === "hq" ? 0xf4efe6 : 0x2c313c, 0.8);
      if (winTex && mapId === "city") mat.map = winTex;
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(o.r * 1.85, h, o.r * 1.85), mat);
      mesh.position.set(o.x, h / 2, o.z);
      scene.add(mesh);
      disposables.push(mesh.geometry, mat);
    } else if (o.kind === "rock") {
      const mesh = new THREE.Mesh(new THREE.DodecahedronGeometry(o.r, 0), std(0x4a463f, 0.9));
      mesh.position.set(o.x, o.r * 0.45, o.z);
      mesh.scale.y = 0.7;
      scene.add(mesh);
      disposables.push(mesh.geometry);
    } else if (o.kind === "pillar") {
      const mesh = new THREE.Mesh(new THREE.CylinderGeometry(o.r, o.r * 1.05, 6.5, 8), std(0xf4efe6, 0.45));
      mesh.position.set(o.x, 3.25, o.z);
      const cap = new THREE.Mesh(new THREE.BoxGeometry(o.r * 2.2, 0.35, o.r * 2.2), std(0xe23b3b, 0.5));
      cap.position.set(o.x, 6.4, o.z);
      scene.add(mesh, cap);
    } else if (o.kind === "monument") {
      const white = std(0xf4efe6, 0.4);
      const red = std(0xe23b3b, 0.45);
      const tower = new THREE.Mesh(new THREE.BoxGeometry(7.2, 11, 7.2), white);
      tower.position.set(o.x, 5.5, o.z);
      const band = new THREE.Mesh(new THREE.BoxGeometry(7.7, 1.25, 7.7), red);
      band.position.set(o.x, 8.1, o.z);
      const cap = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.8, 3.6), red);
      cap.position.set(o.x, 11.5, o.z);
      scene.add(tower, band, cap);
    }
  }

  const fires: THREE.Object3D[] = [];
  const dusts: THREE.Object3D[] = [];
  if (mapId === "classic") dressClassic(scene, sim, disposables, fires, dusts);

  if (mapId === "city") {
    const metal = std(0x22262e, 0.4);
    for (const [x, z] of [
      [3, 12],
      [3, -12],
      [12, 3],
      [-12, 3],
    ] as const) {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 4.2, 6), metal);
      pole.position.set(x, 2.1, z);
      const lamp = new THREE.PointLight(0xffc98a, 0.7, 16, 2);
      lamp.position.set(x, 4, z);
      scene.add(pole, lamp);
    }
  }

  const genGroups: THREE.Group[] = [];
  const genGeoCore = new THREE.CylinderGeometry(0.32, 0.32, 1.15, 8);
  const genGeoBase = new THREE.CylinderGeometry(1.05, 1.2, 0.7, 8);
  const genGeoRing = new THREE.TorusGeometry(0.9, 0.055, 6, 18);
  for (const g of sim.gens) {
    const group = new THREE.Group();
    const base = new THREE.Mesh(genGeoBase, std(0x241c1a, 0.85));
    base.position.y = 0.35;
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xe4b15a,
      emissive: 0xe4b15a,
      emissiveIntensity: 0.25,
      roughness: 0.35,
    });
    const core = new THREE.Mesh(genGeoCore, coreMat);
    core.position.y = 1.15;
    const ring = new THREE.Mesh(
      genGeoRing,
      new THREE.MeshStandardMaterial({ color: 0xe23b3b, emissive: 0xe23b3b, emissiveIntensity: 0.6, roughness: 0.4 }),
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 1.45;
    group.add(base, core, ring);
    const gy = surfaceY(sim.bunker, g.x, g.z);
    group.position.set(g.x, gy, g.z);
    group.userData = { coreMat, ring };
    scene.add(group);
    genGroups.push(group);
  }

  const avatars = new Map<string, THREE.Group>();
  const pizzas = new Map<number, THREE.Group>();

  const desired = new THREE.Vector3();
  const look = new THREE.Vector3();

  function ensureAvatar(a: Actor) {
    let g = avatars.get(a.id);
    if (!g) {
      g = buildAvatar(a.charId);
      avatars.set(a.id, g);
      scene.add(g);
    }
    return g;
  }

  function syncAvatar(a: Actor, group: THREE.Group) {
    const sunk = a.alive ? 0 : Math.min(1.3, Math.max(0, 0.8 - a.corpse) * 0.7);
    group.position.set(a.x, surfaceY(sim.bunker, a.x, a.z) - sunk, a.z);
    group.rotation.y = a.yaw + Math.PI;
    group.rotation.z = a.alive ? 0 : 1.15;
    const blind = sim.player.ghost > 0 && (a.team === "killer" || a.team === "minion");
    group.visible = !blind && (a.alive || a.corpse > 0);
    const parts = group.userData.parts as Parts;
    const swing = Math.sin(sim.elapsed * 9 + a.x) * Math.min(a.speed / 7, 1) * 0.65;
    if (a.alive) {
      parts.lLeg.rotation.x = swing;
      parts.rLeg.rotation.x = -swing;
      parts.lArm.rotation.x = -swing * 0.8;
      parts.rArm.rotation.x = a.attackCd > 0 && a.attackCd > a.attackDur - 0.16 ? -1.45 : swing * 0.8;
    }
    let mode = "norm";
    if (a.flash > 0) mode = "flash";
    else if (a.buff > 0) mode = "stone";
    else if (a.stun > 0) mode = "stun";
    const mats = group.userData.mats as THREE.MeshStandardMaterial[];
    if (group.userData.mode !== mode) {
      group.userData.mode = mode;
      for (const m of mats) {
        const base = (m.userData.base as number) ?? m.color.getHex();
        if (mode === "flash") m.color.setHex(0xffffff);
        else if (mode === "stone") m.color.setHex(0x9aa0a6);
        else m.color.setHex(base);
        m.emissive.setHex(mode === "stun" ? 0xe4b15a : 0x000000);
        m.emissiveIntensity = mode === "stun" ? 0.35 : 0;
      }
    }
    const ghosted = a.isPlayer && a.ghost > 0;
    for (const m of mats) {
      if (ghosted) {
        m.transparent = true;
        m.opacity = 0.25;
      } else if (m.opacity !== 1) {
        m.opacity = 1;
        m.transparent = false;
      }
    }
  }

  let sizedW = 0;
  let sizedH = 0;
  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w < 2 || h < 2 || (w === sizedW && h === sizedH)) return;
    sizedW = w;
    sizedH = h;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  const ro = new ResizeObserver(() => resize());
  ro.observe(canvas);
  resize();

  const baseBg = new THREE.Color(theme.bg);
  const baseSky = new THREE.Color(theme.sky);
  const baseGround = new THREE.Color(theme.ground);
  const baseDir = dir.color.clone();
  const lmsBg = new THREE.Color(0x3a0610);
  const lmsSky = new THREE.Color(0xff3a3a);
  const lmsGround = new THREE.Color(0x140204);
  const lmsDir = new THREE.Color(0xff5a5a);
  const skyColor = new THREE.Color();
  let skyMix = 0;

  return {
    resize,
    render(dt: number) {
      const goal = sim.lms ? 1 : 0;
      skyMix += (goal - skyMix) * Math.min(1, dt * 1.15);
      skyColor.copy(baseBg).lerp(lmsBg, skyMix);
      (scene.background as THREE.Color).copy(skyColor);
      const fog = scene.fog as THREE.Fog;
      fog.color.copy(skyColor);
      fog.near = theme.near + (5 - theme.near) * skyMix;
      fog.far = theme.far + (24 - theme.far) * skyMix;
      hemi.color.copy(baseSky).lerp(lmsSky, skyMix);
      hemi.groundColor.copy(baseGround).lerp(lmsGround, skyMix);
      dir.color.copy(baseDir).lerp(lmsDir, skyMix);
      resize();
      const seen = new Set<string>();
      for (const a of sim.actors) {
        const g = ensureAvatar(a);
        syncAvatar(a, g);
        seen.add(a.id);
      }
      for (const [id, g] of avatars) {
        if (!seen.has(id)) {
          scene.remove(g);
          avatars.delete(id);
        }
      }

      sim.gens.forEach((g, i) => {
        const group = genGroups[i];
        if (!group) return;
        const ring = group.userData.ring as THREE.Mesh;
        const coreMat = group.userData.coreMat as THREE.MeshStandardMaterial;
        ring.rotation.z = sim.elapsed * (g.done ? 0.4 : 2.2);
        coreMat.emissiveIntensity = g.done ? 1.7 : 0.15 + g.progress * 1.3;
      });

      const alivePizza = new Set<number>();
      for (const p of sim.pizzas) {
        alivePizza.add(p.id);
        let mesh = pizzas.get(p.id);
        if (!mesh) {
          mesh = new THREE.Group();
          const crust = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.1, 10), std(0xd8a15a, 0.6));
          const top = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.08, 10), std(0xc4313a, 0.5));
          top.position.y = 0.08;
          mesh.add(crust, top);
          scene.add(mesh);
          pizzas.set(p.id, mesh);
        }
        mesh.position.set(p.x, surfaceY(sim.bunker, p.x, p.z) + 0.35 + Math.sin(sim.elapsed * 4 + p.id) * 0.06, p.z);
      }
      for (const [key, mesh] of pizzas) {
        if (!alivePizza.has(key)) {
          scene.remove(mesh);
          pizzas.delete(key);
        }
      }

      const p = sim.player;
      const gy = surfaceY(sim.bunker, p.x, p.z);
      const yaw = sim.camYaw;
      const pitch = sim.camPitch;
      const fx = -Math.sin(yaw);
      const fz = -Math.cos(yaw);
      const back = Math.cos(pitch) * 9.2;
      const height = Math.sin(pitch) * 9.2;
      desired.set(p.x - fx * back, 1.35 + height + gy, p.z - fz * back);
      camera.position.copy(desired);
      look.set(p.x + fx * 1.1, 1.45 + gy, p.z + fz * 1.1);
      if (sim.shake > 0.01) {
        camera.position.x += (Math.random() - 0.5) * sim.shake;
        camera.position.y += (Math.random() - 0.5) * sim.shake * 0.5;
      }
      camera.lookAt(look);
      for (const flame of fires) {
        const s = 0.82 + Math.sin(sim.elapsed * 9 + flame.position.x) * 0.18;
        flame.scale.set(s, 0.75 + Math.sin(sim.elapsed * 13 + flame.position.z) * 0.28, s);
      }
      for (const dust of dusts) {
        const base = (dust.userData.base as number) ?? 0.6;
        dust.position.y = base + Math.sin(sim.elapsed * 0.7 + dust.position.x) * 0.12;
      }
      renderer.render(scene, camera);
    },
    dispose() {
      ro.disconnect();
      const geos = new Set<THREE.BufferGeometry>();
      const mats = new Set<THREE.Material>();
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) geos.add(mesh.geometry);
        const mat = mesh.material;
        if (Array.isArray(mat)) mat.forEach((m) => mats.add(m));
        else if (mat) mats.add(mat);
      });
      geos.forEach((g) => g.dispose());
      mats.forEach((m) => m.dispose());
      for (const d of disposables) d.dispose();
      renderer.dispose();
    },
  };
}
