/**
 * Createx Wicked Colors Paint Database
 * RGB values are approximations based on official color charts.
 * Categories: Transparent, Opaque, Detail, Pearl, Metallic, Fluorescent
 */

export interface Paint {
  code: string;
  name: string;
  category: 'transparent' | 'opaque' | 'detail' | 'pearl' | 'metallic' | 'fluorescent';
  rgb: [number, number, number];
  opacity: number; // 0-1, how opaque the paint is (affects mixing)
}

export const wickedColors: Paint[] = [
  // === TRANSPARENT (Standard Wicked Colors) ===
  { code: 'W001', name: 'White', category: 'transparent', rgb: [255, 255, 255], opacity: 0.3 },
  { code: 'W002', name: 'Black', category: 'transparent', rgb: [20, 20, 20], opacity: 0.7 },
  { code: 'W003', name: 'Yellow', category: 'transparent', rgb: [242, 214, 0], opacity: 0.4 },
  { code: 'W004', name: 'Orange', category: 'transparent', rgb: [255, 102, 0], opacity: 0.5 },
  { code: 'W005', name: 'Red', category: 'transparent', rgb: [204, 0, 33], opacity: 0.5 },
  { code: 'W006', name: 'Violet', category: 'transparent', rgb: [77, 38, 115], opacity: 0.5 },
  { code: 'W007', name: 'Blue', category: 'transparent', rgb: [0, 51, 153], opacity: 0.5 },
  { code: 'W008', name: 'Deep Blue', category: 'transparent', rgb: [0, 26, 77], opacity: 0.6 },
  { code: 'W009', name: 'Phthalo Green', category: 'transparent', rgb: [0, 77, 64], opacity: 0.5 },
  { code: 'W010', name: 'Brown', category: 'transparent', rgb: [102, 51, 0], opacity: 0.5 },
  { code: 'W011', name: 'Golden Yellow', category: 'transparent', rgb: [255, 170, 0], opacity: 0.4 },
  { code: 'W012', name: 'Red Oxide', category: 'transparent', rgb: [153, 51, 0], opacity: 0.6 },
  { code: 'W013', name: 'Laguna Blue', category: 'transparent', rgb: [0, 128, 204], opacity: 0.4 },
  { code: 'W014', name: 'Grey', category: 'transparent', rgb: [128, 128, 128], opacity: 0.4 },
  { code: 'W015', name: 'Crimson', category: 'transparent', rgb: [179, 0, 45], opacity: 0.5 },
  { code: 'W016', name: 'Apple Green', category: 'transparent', rgb: [51, 179, 51], opacity: 0.4 },

  // === OPAQUE ===
  { code: 'W030', name: 'Opaque White', category: 'opaque', rgb: [255, 255, 255], opacity: 0.95 },
  { code: 'W031', name: 'Opaque Jet Black', category: 'opaque', rgb: [5, 5, 5], opacity: 0.95 },
  { code: 'W032', name: 'Opaque Flat White', category: 'opaque', rgb: [250, 250, 245], opacity: 0.95 },
  { code: 'W033', name: 'Opaque Yellow', category: 'opaque', rgb: [255, 220, 0], opacity: 0.85 },
  { code: 'W034', name: 'Opaque Orange', category: 'opaque', rgb: [255, 120, 0], opacity: 0.85 },
  { code: 'W035', name: 'Opaque Red', category: 'opaque', rgb: [210, 0, 30], opacity: 0.85 },
  { code: 'W036', name: 'Opaque Blue', category: 'opaque', rgb: [0, 60, 160], opacity: 0.85 },
  { code: 'W037', name: 'Opaque Green', category: 'opaque', rgb: [0, 128, 64], opacity: 0.85 },
  { code: 'W038', name: 'Opaque Violet', category: 'opaque', rgb: [90, 30, 130], opacity: 0.85 },

  { code: 'W080', name: 'Opaque Hansa Yellow', category: 'opaque', rgb: [255, 230, 0], opacity: 0.9 },
  { code: 'W081', name: 'Opaque Dioxazine Purple', category: 'opaque', rgb: [60, 0, 100], opacity: 0.9 },
  { code: 'W082', name: 'Opaque Phthalo Blue', category: 'opaque', rgb: [0, 40, 130], opacity: 0.9 },
  { code: 'W083', name: 'Opaque Pyrrole Red', category: 'opaque', rgb: [220, 20, 20], opacity: 0.9 },
  { code: 'W084', name: 'Opaque Naphthol Red Light', category: 'opaque', rgb: [230, 50, 30], opacity: 0.9 },
  { code: 'W085', name: 'Opaque Phthalo Green', category: 'opaque', rgb: [0, 100, 70], opacity: 0.9 },
  { code: 'W086', name: 'Opaque Burnt Sienna', category: 'opaque', rgb: [150, 60, 20], opacity: 0.9 },
  { code: 'W087', name: 'Opaque Raw Umber', category: 'opaque', rgb: [100, 70, 40], opacity: 0.9 },
  { code: 'W088', name: 'Opaque Burnt Umber', category: 'opaque', rgb: [70, 35, 15], opacity: 0.9 },
  { code: 'W090', name: 'Opaque Warm Grey', category: 'opaque', rgb: [140, 130, 120], opacity: 0.9 },
  { code: 'W091', name: 'Opaque Cool Grey', category: 'opaque', rgb: [120, 125, 135], opacity: 0.9 },
  { code: 'W098', name: 'Opaque Flat Black', category: 'opaque', rgb: [15, 15, 15], opacity: 0.95 },

  // === DETAIL COLORS ===
  { code: 'W050', name: 'Detail White', category: 'detail', rgb: [255, 255, 255], opacity: 0.8 },
  { code: 'W051', name: 'Detail Black', category: 'detail', rgb: [15, 15, 15], opacity: 0.8 },
  { code: 'W052', name: 'Detail Yellow', category: 'detail', rgb: [245, 215, 0], opacity: 0.7 },
  { code: 'W053', name: 'Detail Scarlet', category: 'detail', rgb: [210, 25, 25], opacity: 0.7 },
  { code: 'W054', name: 'Detail Orange', category: 'detail', rgb: [245, 110, 0], opacity: 0.7 },
  { code: 'W055', name: 'Detail Violet', category: 'detail', rgb: [75, 30, 110], opacity: 0.7 },
  { code: 'W056', name: 'Detail Red Violet', category: 'detail', rgb: [140, 20, 80], opacity: 0.7 },
  { code: 'W057', name: 'Detail Blue Violet', category: 'detail', rgb: [50, 30, 120], opacity: 0.7 },
  { code: 'W058', name: 'Detail Blue Green', category: 'detail', rgb: [0, 90, 90], opacity: 0.7 },
  { code: 'W059', name: 'Detail Moss Green', category: 'detail', rgb: [40, 70, 30], opacity: 0.7 },
  { code: 'W060', name: 'Detail Viridian', category: 'detail', rgb: [0, 100, 60], opacity: 0.7 },
  { code: 'W061', name: 'Detail Cobalt Blue', category: 'detail', rgb: [0, 60, 150], opacity: 0.7 },
  { code: 'W062', name: 'Detail Cerulean Blue', category: 'detail', rgb: [0, 120, 190], opacity: 0.7 },
  { code: 'W063', name: 'Detail Carmine', category: 'detail', rgb: [180, 0, 50], opacity: 0.7 },
  { code: 'W064', name: 'Detail Magenta', category: 'detail', rgb: [200, 0, 100], opacity: 0.7 },
  { code: 'W065', name: 'Detail Yellow Ochre', category: 'detail', rgb: [180, 130, 40], opacity: 0.7 },
  { code: 'W066', name: 'Detail Burnt Orange', category: 'detail', rgb: [180, 60, 0], opacity: 0.7 },
  { code: 'W067', name: 'Detail Raw Sienna', category: 'detail', rgb: [160, 100, 40], opacity: 0.7 },
  { code: 'W068', name: 'Detail Raw Umber', category: 'detail', rgb: [90, 70, 40], opacity: 0.7 },
  { code: 'W069', name: 'Detail Burnt Umber', category: 'detail', rgb: [65, 35, 20], opacity: 0.7 },
  { code: 'W070', name: 'Detail Sepia', category: 'detail', rgb: [50, 25, 5], opacity: 0.7 },
  { code: 'W071', name: 'Detail Paynes Grey', category: 'detail', rgb: [50, 55, 65], opacity: 0.7 },
  { code: 'W072', name: 'Detail Smoke Black', category: 'detail', rgb: [30, 30, 30], opacity: 0.6 },
  { code: 'W073', name: 'Detail Flesh Tone', category: 'detail', rgb: [235, 170, 120], opacity: 0.7 },
  { code: 'W074', name: 'Detail Burnt Sienna', category: 'detail', rgb: [155, 55, 25], opacity: 0.7 },
  { code: 'W075', name: 'Detail Black Magenta', category: 'detail', rgb: [50, 5, 30], opacity: 0.7 },
  { code: 'W076', name: 'Detail Universal Fleshtone', category: 'detail', rgb: [220, 175, 130], opacity: 0.7 },

  // === PEARL COLORS ===
  { code: 'W300', name: 'Pearl Black', category: 'pearl', rgb: [25, 25, 30], opacity: 0.6 },
  { code: 'W301', name: 'Pearl White', category: 'pearl', rgb: [240, 240, 235], opacity: 0.6 },
  { code: 'W302', name: 'Pearl Yellow', category: 'pearl', rgb: [255, 230, 50], opacity: 0.5 },
  { code: 'W303', name: 'Pearl Red', category: 'pearl', rgb: [200, 30, 40], opacity: 0.5 },
  { code: 'W304', name: 'Pearl Blue', category: 'pearl', rgb: [30, 80, 180], opacity: 0.5 },
  { code: 'W305', name: 'Pearl Lime Green', category: 'pearl', rgb: [100, 200, 50], opacity: 0.5 },
  { code: 'W306', name: 'Pearl Orange', category: 'pearl', rgb: [240, 120, 20], opacity: 0.5 },
  { code: 'W307', name: 'Pearl Plum', category: 'pearl', rgb: [100, 20, 80], opacity: 0.5 },
  { code: 'W308', name: 'Pearl Green', category: 'pearl', rgb: [0, 130, 80], opacity: 0.5 },
  { code: 'W309', name: 'Pearl Teal', category: 'pearl', rgb: [0, 120, 130], opacity: 0.5 },
  { code: 'W310', name: 'Pearl Magenta', category: 'pearl', rgb: [180, 20, 90], opacity: 0.5 },
  { code: 'W311', name: 'Pearl Purple', category: 'pearl', rgb: [80, 20, 140], opacity: 0.5 },
  { code: 'W350', name: 'Pearl Gold', category: 'pearl', rgb: [200, 170, 50], opacity: 0.5 },
  { code: 'W351', name: 'Pearl Silver', category: 'pearl', rgb: [180, 185, 190], opacity: 0.5 },
  { code: 'W352', name: 'Pearl Platinum', category: 'pearl', rgb: [200, 200, 205], opacity: 0.5 },
  { code: 'W353', name: 'Pearl Fastback Green', category: 'pearl', rgb: [0, 80, 50], opacity: 0.5 },
  { code: 'W354', name: 'Pearl Aluminum', category: 'pearl', rgb: [160, 165, 170], opacity: 0.5 },

  // === METALLIC COLORS ===
  { code: 'W355', name: 'Metallic Gold', category: 'metallic', rgb: [200, 160, 40], opacity: 0.6 },
  { code: 'W358', name: 'Gold Chrome', category: 'metallic', rgb: [210, 180, 50], opacity: 0.7 },
  { code: 'W359', name: 'Metallic Charcoal', category: 'metallic', rgb: [60, 60, 65], opacity: 0.7 },
  { code: 'W360', name: 'Metallic Copper', category: 'metallic', rgb: [180, 100, 50], opacity: 0.6 },
  { code: 'W361', name: 'Metallic Red', category: 'metallic', rgb: [180, 30, 30], opacity: 0.6 },
  { code: 'W362', name: 'Metallic Violet', category: 'metallic', rgb: [90, 30, 120], opacity: 0.6 },
  { code: 'W363', name: 'Metallic Blue', category: 'metallic', rgb: [30, 60, 150], opacity: 0.6 },
  { code: 'W364', name: 'Metallic Blue Silver', category: 'metallic', rgb: [120, 140, 170], opacity: 0.6 },
  { code: 'W365', name: 'Metallic Burnt Orange', category: 'metallic', rgb: [180, 80, 20], opacity: 0.6 },
  { code: 'W370', name: 'Metallic Light Brown', category: 'metallic', rgb: [150, 110, 60], opacity: 0.6 },
  { code: 'W371', name: 'Metallic Dark Brown', category: 'metallic', rgb: [80, 50, 25], opacity: 0.6 },

  // === FLUORESCENT COLORS ===
  { code: 'W019', name: 'Fluorescent Aqua', category: 'fluorescent', rgb: [0, 230, 200], opacity: 0.4 },
  { code: 'W020', name: 'Fluorescent Purple', category: 'fluorescent', rgb: [160, 0, 200], opacity: 0.4 },
  { code: 'W021', name: 'Fluorescent Raspberry', category: 'fluorescent', rgb: [230, 0, 100], opacity: 0.4 },
  { code: 'W022', name: 'Fluorescent Red', category: 'fluorescent', rgb: [255, 30, 30], opacity: 0.4 },
  { code: 'W023', name: 'Fluorescent Green', category: 'fluorescent', rgb: [0, 230, 50], opacity: 0.4 },
  { code: 'W024', name: 'Fluorescent Yellow', category: 'fluorescent', rgb: [255, 255, 0], opacity: 0.3 },
  { code: 'W025', name: 'Fluorescent Sunburst', category: 'fluorescent', rgb: [255, 200, 0], opacity: 0.4 },
  { code: 'W026', name: 'Fluorescent Pink', category: 'fluorescent', rgb: [255, 50, 150], opacity: 0.4 },
  { code: 'W027', name: 'Fluorescent Orange', category: 'fluorescent', rgb: [255, 130, 0], opacity: 0.4 },
  { code: 'W028', name: 'Fluorescent Blue', category: 'fluorescent', rgb: [0, 100, 255], opacity: 0.4 },
  { code: 'W029', name: 'Fluorescent Magenta', category: 'fluorescent', rgb: [255, 0, 150], opacity: 0.4 },
];

export function getPaintByCode(code: string): Paint | undefined {
  return wickedColors.find(p => p.code === code);
}

export function getPaintsByCategory(category: Paint['category']): Paint[] {
  return wickedColors.filter(p => p.category === category);
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

export function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [0, 0, 0];
  return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
}
