/**
 * Multi-Brand Airbrush Paint Database
 * 
 * Brands included:
 * - Createx Wicked Colors
 * - Createx Illustration Colors
 * - Vallejo Model Air
 * - Vallejo Game Air
 * - E'TAC EFX / Private Stock
 * - Badger Minitaire
 * - Com-Art (Iwata/Medea)
 * 
 * RGB values are approximations based on official color charts and swatches.
 */

export type PaintCategory = 'transparent' | 'opaque' | 'detail' | 'pearl' | 'metallic' | 'fluorescent' | 'standard' | 'primer' | 'wash' | 'ink';

export type PaintBrand = 
  | 'createx-wicked'
  | 'createx-illustration'
  | 'createx-candy2o'
  | 'createx-autoair'
  | 'vallejo-model-air'
  | 'vallejo-game-air'
  | 'etac'
  | 'badger-minitaire'
  | 'com-art';

export interface BrandInfo {
  id: PaintBrand;
  name: string;
  shortName: string;
  description: string;
  website: string;
}

export const brands: BrandInfo[] = [
  { id: 'createx-wicked', name: 'Createx Wicked Colors', shortName: 'Wicked', description: 'Multi-surface water-based airbrush paint for automotive & custom work', website: 'createxcolors.com' },
  { id: 'createx-illustration', name: 'Createx Illustration Colors', shortName: 'Illustration', description: 'Ultra-fine pigment airbrush colors for illustration & fine art', website: 'createxcolors.com' },
  { id: 'createx-candy2o', name: 'Createx Candy2o', shortName: 'Candy2o', description: 'Transparent candy colors for deep, rich custom automotive finishes', website: 'createxcolors.com' },
  { id: 'createx-autoair', name: 'Createx Auto-Air Colors', shortName: 'Auto-Air', description: 'Automotive airbrush paints — semi-opaque, pearl, metallic & candy', website: 'createxcolors.com' },
  { id: 'vallejo-model-air', name: 'Vallejo Model Air', shortName: 'Model Air', description: 'Airbrush-ready acrylic colors for scale models & military vehicles', website: 'acrylicosvallejo.com' },
  { id: 'vallejo-game-air', name: 'Vallejo Game Air', shortName: 'Game Air', description: 'Airbrush colors for miniatures, wargaming & fantasy models', website: 'acrylicosvallejo.com' },
  { id: 'etac', name: "E'TAC Airbrush Colors", shortName: "E'TAC", description: 'Professional textile & fine art airbrush paints, no clogging', website: 'etacpaints.com' },
  { id: 'badger-minitaire', name: 'Badger Minitaire', shortName: 'Minitaire', description: 'Finely ground acrylics for miniatures, models & wargaming', website: 'badgerairbrush.com' },
  { id: 'com-art', name: 'Com-Art (Iwata/Medea)', shortName: 'Com-Art', description: 'Non-toxic water-based acrylics for illustration & fine art', website: 'iwata-medea.com' },
];

export interface Paint {
  code: string;
  name: string;
  brand: PaintBrand;
  category: PaintCategory;
  rgb: [number, number, number];
  opacity: number; // 0-1
  /** Pigment dominance multiplier, separate from opacity. Default 1.0. Tuned per-pigment from real-world spray-outs later. */
  tintingStrength: number;
}

// ============ CREATEX WICKED COLORS ============
const createxWicked: Paint[] = [
  // Transparent
  { code: 'W001', name: 'White', brand: 'createx-wicked', category: 'transparent', rgb: [255, 255, 255], opacity: 0.3, tintingStrength: 1 },
  { code: 'W002', name: 'Black', brand: 'createx-wicked', category: 'transparent', rgb: [20, 20, 20], opacity: 0.7, tintingStrength: 1 },
  { code: 'W003', name: 'Yellow', brand: 'createx-wicked', category: 'transparent', rgb: [242, 214, 0], opacity: 0.4, tintingStrength: 1 },
  { code: 'W004', name: 'Orange', brand: 'createx-wicked', category: 'transparent', rgb: [255, 102, 0], opacity: 0.5, tintingStrength: 1 },
  { code: 'W005', name: 'Red', brand: 'createx-wicked', category: 'transparent', rgb: [204, 0, 33], opacity: 0.5, tintingStrength: 1 },
  { code: 'W006', name: 'Violet', brand: 'createx-wicked', category: 'transparent', rgb: [77, 38, 115], opacity: 0.5, tintingStrength: 1 },
  { code: 'W007', name: 'Blue', brand: 'createx-wicked', category: 'transparent', rgb: [0, 51, 153], opacity: 0.5, tintingStrength: 1 },
  { code: 'W008', name: 'Deep Blue', brand: 'createx-wicked', category: 'transparent', rgb: [0, 26, 77], opacity: 0.6, tintingStrength: 1 },
  { code: 'W009', name: 'Phthalo Green', brand: 'createx-wicked', category: 'transparent', rgb: [0, 77, 64], opacity: 0.5, tintingStrength: 1 },
  { code: 'W010', name: 'Brown', brand: 'createx-wicked', category: 'transparent', rgb: [102, 51, 0], opacity: 0.5, tintingStrength: 1 },
  { code: 'W011', name: 'Golden Yellow', brand: 'createx-wicked', category: 'transparent', rgb: [255, 170, 0], opacity: 0.4, tintingStrength: 1 },
  { code: 'W012', name: 'Red Oxide', brand: 'createx-wicked', category: 'transparent', rgb: [153, 51, 0], opacity: 0.6, tintingStrength: 1 },
  { code: 'W013', name: 'Laguna Blue', brand: 'createx-wicked', category: 'transparent', rgb: [0, 128, 204], opacity: 0.4, tintingStrength: 1 },
  { code: 'W014', name: 'Grey', brand: 'createx-wicked', category: 'transparent', rgb: [128, 128, 128], opacity: 0.4, tintingStrength: 1 },
  { code: 'W015', name: 'Crimson', brand: 'createx-wicked', category: 'transparent', rgb: [179, 0, 45], opacity: 0.5, tintingStrength: 1 },
  { code: 'W016', name: 'Apple Green', brand: 'createx-wicked', category: 'transparent', rgb: [51, 179, 51], opacity: 0.4, tintingStrength: 1 },
  // Opaque
  { code: 'W030', name: 'Opaque White', brand: 'createx-wicked', category: 'opaque', rgb: [255, 255, 255], opacity: 0.95, tintingStrength: 1 },
  { code: 'W031', name: 'Opaque Jet Black', brand: 'createx-wicked', category: 'opaque', rgb: [5, 5, 5], opacity: 0.95, tintingStrength: 1 },
  { code: 'W032', name: 'Opaque Flat White', brand: 'createx-wicked', category: 'opaque', rgb: [250, 250, 245], opacity: 0.95, tintingStrength: 1 },
  { code: 'W033', name: 'Opaque Yellow', brand: 'createx-wicked', category: 'opaque', rgb: [255, 220, 0], opacity: 0.85, tintingStrength: 1 },
  { code: 'W034', name: 'Opaque Orange', brand: 'createx-wicked', category: 'opaque', rgb: [255, 120, 0], opacity: 0.85, tintingStrength: 1 },
  { code: 'W035', name: 'Opaque Red', brand: 'createx-wicked', category: 'opaque', rgb: [210, 0, 30], opacity: 0.85, tintingStrength: 1 },
  { code: 'W036', name: 'Opaque Blue', brand: 'createx-wicked', category: 'opaque', rgb: [0, 60, 160], opacity: 0.85, tintingStrength: 1 },
  { code: 'W037', name: 'Opaque Green', brand: 'createx-wicked', category: 'opaque', rgb: [0, 128, 64], opacity: 0.85, tintingStrength: 1 },
  { code: 'W038', name: 'Opaque Violet', brand: 'createx-wicked', category: 'opaque', rgb: [90, 30, 130], opacity: 0.85, tintingStrength: 1 },
  { code: 'W080', name: 'Opaque Hansa Yellow', brand: 'createx-wicked', category: 'opaque', rgb: [255, 230, 0], opacity: 0.9, tintingStrength: 1 },
  { code: 'W081', name: 'Opaque Dioxazine Purple', brand: 'createx-wicked', category: 'opaque', rgb: [60, 0, 100], opacity: 0.9, tintingStrength: 1 },
  { code: 'W082', name: 'Opaque Phthalo Blue', brand: 'createx-wicked', category: 'opaque', rgb: [0, 40, 130], opacity: 0.9, tintingStrength: 1 },
  { code: 'W083', name: 'Opaque Pyrrole Red', brand: 'createx-wicked', category: 'opaque', rgb: [220, 20, 20], opacity: 0.9, tintingStrength: 1 },
  { code: 'W084', name: 'Opaque Naphthol Red Light', brand: 'createx-wicked', category: 'opaque', rgb: [230, 50, 30], opacity: 0.9, tintingStrength: 1 },
  { code: 'W085', name: 'Opaque Phthalo Green', brand: 'createx-wicked', category: 'opaque', rgb: [0, 100, 70], opacity: 0.9, tintingStrength: 1 },
  { code: 'W086', name: 'Opaque Burnt Sienna', brand: 'createx-wicked', category: 'opaque', rgb: [150, 60, 20], opacity: 0.9, tintingStrength: 1 },
  { code: 'W087', name: 'Opaque Raw Umber', brand: 'createx-wicked', category: 'opaque', rgb: [100, 70, 40], opacity: 0.9, tintingStrength: 1 },
  { code: 'W088', name: 'Opaque Burnt Umber', brand: 'createx-wicked', category: 'opaque', rgb: [70, 35, 15], opacity: 0.9, tintingStrength: 1 },
  { code: 'W090', name: 'Opaque Warm Grey', brand: 'createx-wicked', category: 'opaque', rgb: [140, 130, 120], opacity: 0.9, tintingStrength: 1 },
  { code: 'W091', name: 'Opaque Cool Grey', brand: 'createx-wicked', category: 'opaque', rgb: [120, 125, 135], opacity: 0.9, tintingStrength: 1 },
  { code: 'W098', name: 'Opaque Flat Black', brand: 'createx-wicked', category: 'opaque', rgb: [15, 15, 15], opacity: 0.95, tintingStrength: 1 },
  // Detail
  { code: 'W050', name: 'Detail White', brand: 'createx-wicked', category: 'detail', rgb: [255, 255, 255], opacity: 0.8, tintingStrength: 1 },
  { code: 'W051', name: 'Detail Black', brand: 'createx-wicked', category: 'detail', rgb: [15, 15, 15], opacity: 0.8, tintingStrength: 1 },
  { code: 'W052', name: 'Detail Yellow', brand: 'createx-wicked', category: 'detail', rgb: [245, 215, 0], opacity: 0.7, tintingStrength: 1 },
  { code: 'W053', name: 'Detail Scarlet', brand: 'createx-wicked', category: 'detail', rgb: [210, 25, 25], opacity: 0.7, tintingStrength: 1 },
  { code: 'W054', name: 'Detail Orange', brand: 'createx-wicked', category: 'detail', rgb: [245, 110, 0], opacity: 0.7, tintingStrength: 1 },
  { code: 'W055', name: 'Detail Violet', brand: 'createx-wicked', category: 'detail', rgb: [75, 30, 110], opacity: 0.7, tintingStrength: 1 },
  { code: 'W056', name: 'Detail Red Violet', brand: 'createx-wicked', category: 'detail', rgb: [140, 20, 80], opacity: 0.7, tintingStrength: 1 },
  { code: 'W057', name: 'Detail Blue Violet', brand: 'createx-wicked', category: 'detail', rgb: [50, 30, 120], opacity: 0.7, tintingStrength: 1 },
  { code: 'W058', name: 'Detail Blue Green', brand: 'createx-wicked', category: 'detail', rgb: [0, 90, 90], opacity: 0.7, tintingStrength: 1 },
  { code: 'W059', name: 'Detail Moss Green', brand: 'createx-wicked', category: 'detail', rgb: [40, 70, 30], opacity: 0.7, tintingStrength: 1 },
  { code: 'W060', name: 'Detail Viridian', brand: 'createx-wicked', category: 'detail', rgb: [0, 100, 60], opacity: 0.7, tintingStrength: 1 },
  { code: 'W061', name: 'Detail Cobalt Blue', brand: 'createx-wicked', category: 'detail', rgb: [0, 60, 150], opacity: 0.7, tintingStrength: 1 },
  { code: 'W062', name: 'Detail Cerulean Blue', brand: 'createx-wicked', category: 'detail', rgb: [0, 120, 190], opacity: 0.7, tintingStrength: 1 },
  { code: 'W063', name: 'Detail Carmine', brand: 'createx-wicked', category: 'detail', rgb: [180, 0, 50], opacity: 0.7, tintingStrength: 1 },
  { code: 'W064', name: 'Detail Magenta', brand: 'createx-wicked', category: 'detail', rgb: [200, 0, 100], opacity: 0.7, tintingStrength: 1 },
  { code: 'W065', name: 'Detail Yellow Ochre', brand: 'createx-wicked', category: 'detail', rgb: [180, 130, 40], opacity: 0.7, tintingStrength: 1 },
  { code: 'W066', name: 'Detail Burnt Orange', brand: 'createx-wicked', category: 'detail', rgb: [180, 60, 0], opacity: 0.7, tintingStrength: 1 },
  { code: 'W067', name: 'Detail Raw Sienna', brand: 'createx-wicked', category: 'detail', rgb: [160, 100, 40], opacity: 0.7, tintingStrength: 1 },
  { code: 'W068', name: 'Detail Raw Umber', brand: 'createx-wicked', category: 'detail', rgb: [90, 70, 40], opacity: 0.7, tintingStrength: 1 },
  { code: 'W069', name: 'Detail Burnt Umber', brand: 'createx-wicked', category: 'detail', rgb: [65, 35, 20], opacity: 0.7, tintingStrength: 1 },
  { code: 'W070', name: 'Detail Sepia', brand: 'createx-wicked', category: 'detail', rgb: [50, 25, 5], opacity: 0.7, tintingStrength: 1 },
  { code: 'W071', name: 'Detail Paynes Grey', brand: 'createx-wicked', category: 'detail', rgb: [50, 55, 65], opacity: 0.7, tintingStrength: 1 },
  { code: 'W072', name: 'Detail Smoke Black', brand: 'createx-wicked', category: 'detail', rgb: [30, 30, 30], opacity: 0.6, tintingStrength: 1 },
  { code: 'W073', name: 'Detail Flesh Tone', brand: 'createx-wicked', category: 'detail', rgb: [235, 170, 120], opacity: 0.7, tintingStrength: 1 },
  { code: 'W074', name: 'Detail Burnt Sienna', brand: 'createx-wicked', category: 'detail', rgb: [155, 55, 25], opacity: 0.7, tintingStrength: 1 },
  { code: 'W075', name: 'Detail Black Magenta', brand: 'createx-wicked', category: 'detail', rgb: [50, 5, 30], opacity: 0.7, tintingStrength: 1 },
  { code: 'W076', name: 'Detail Universal Fleshtone', brand: 'createx-wicked', category: 'detail', rgb: [220, 175, 130], opacity: 0.7, tintingStrength: 1 },
  // Pearl
  { code: 'W300', name: 'Pearl Black', brand: 'createx-wicked', category: 'pearl', rgb: [25, 25, 30], opacity: 0.6, tintingStrength: 1 },
  { code: 'W301', name: 'Pearl White', brand: 'createx-wicked', category: 'pearl', rgb: [240, 240, 235], opacity: 0.6, tintingStrength: 1 },
  { code: 'W302', name: 'Pearl Yellow', brand: 'createx-wicked', category: 'pearl', rgb: [255, 230, 50], opacity: 0.5, tintingStrength: 1 },
  { code: 'W303', name: 'Pearl Red', brand: 'createx-wicked', category: 'pearl', rgb: [200, 30, 40], opacity: 0.5, tintingStrength: 1 },
  { code: 'W304', name: 'Pearl Blue', brand: 'createx-wicked', category: 'pearl', rgb: [30, 80, 180], opacity: 0.5, tintingStrength: 1 },
  { code: 'W305', name: 'Pearl Lime Green', brand: 'createx-wicked', category: 'pearl', rgb: [100, 200, 50], opacity: 0.5, tintingStrength: 1 },
  { code: 'W306', name: 'Pearl Orange', brand: 'createx-wicked', category: 'pearl', rgb: [240, 120, 20], opacity: 0.5, tintingStrength: 1 },
  { code: 'W307', name: 'Pearl Plum', brand: 'createx-wicked', category: 'pearl', rgb: [100, 20, 80], opacity: 0.5, tintingStrength: 1 },
  { code: 'W308', name: 'Pearl Green', brand: 'createx-wicked', category: 'pearl', rgb: [0, 130, 80], opacity: 0.5, tintingStrength: 1 },
  { code: 'W309', name: 'Pearl Teal', brand: 'createx-wicked', category: 'pearl', rgb: [0, 120, 130], opacity: 0.5, tintingStrength: 1 },
  { code: 'W310', name: 'Pearl Magenta', brand: 'createx-wicked', category: 'pearl', rgb: [180, 20, 90], opacity: 0.5, tintingStrength: 1 },
  { code: 'W311', name: 'Pearl Purple', brand: 'createx-wicked', category: 'pearl', rgb: [80, 20, 140], opacity: 0.5, tintingStrength: 1 },
  { code: 'W350', name: 'Pearl Gold', brand: 'createx-wicked', category: 'pearl', rgb: [200, 170, 50], opacity: 0.5, tintingStrength: 1 },
  { code: 'W351', name: 'Pearl Silver', brand: 'createx-wicked', category: 'pearl', rgb: [180, 185, 190], opacity: 0.5, tintingStrength: 1 },
  { code: 'W352', name: 'Pearl Platinum', brand: 'createx-wicked', category: 'pearl', rgb: [200, 200, 205], opacity: 0.5, tintingStrength: 1 },
  { code: 'W353', name: 'Pearl Fastback Green', brand: 'createx-wicked', category: 'pearl', rgb: [0, 80, 50], opacity: 0.5, tintingStrength: 1 },
  { code: 'W354', name: 'Pearl Aluminum', brand: 'createx-wicked', category: 'pearl', rgb: [160, 165, 170], opacity: 0.5, tintingStrength: 1 },
  // Metallic
  { code: 'W355', name: 'Metallic Gold', brand: 'createx-wicked', category: 'metallic', rgb: [200, 160, 40], opacity: 0.6, tintingStrength: 1 },
  { code: 'W358', name: 'Gold Chrome', brand: 'createx-wicked', category: 'metallic', rgb: [210, 180, 50], opacity: 0.7, tintingStrength: 1 },
  { code: 'W359', name: 'Metallic Charcoal', brand: 'createx-wicked', category: 'metallic', rgb: [60, 60, 65], opacity: 0.7, tintingStrength: 1 },
  { code: 'W360', name: 'Metallic Copper', brand: 'createx-wicked', category: 'metallic', rgb: [180, 100, 50], opacity: 0.6, tintingStrength: 1 },
  { code: 'W361', name: 'Metallic Red', brand: 'createx-wicked', category: 'metallic', rgb: [180, 30, 30], opacity: 0.6, tintingStrength: 1 },
  { code: 'W362', name: 'Metallic Violet', brand: 'createx-wicked', category: 'metallic', rgb: [90, 30, 120], opacity: 0.6, tintingStrength: 1 },
  { code: 'W363', name: 'Metallic Blue', brand: 'createx-wicked', category: 'metallic', rgb: [30, 60, 150], opacity: 0.6, tintingStrength: 1 },
  { code: 'W364', name: 'Metallic Blue Silver', brand: 'createx-wicked', category: 'metallic', rgb: [120, 140, 170], opacity: 0.6, tintingStrength: 1 },
  { code: 'W365', name: 'Metallic Burnt Orange', brand: 'createx-wicked', category: 'metallic', rgb: [180, 80, 20], opacity: 0.6, tintingStrength: 1 },
  { code: 'W370', name: 'Metallic Light Brown', brand: 'createx-wicked', category: 'metallic', rgb: [150, 110, 60], opacity: 0.6, tintingStrength: 1 },
  { code: 'W371', name: 'Metallic Dark Brown', brand: 'createx-wicked', category: 'metallic', rgb: [80, 50, 25], opacity: 0.6, tintingStrength: 1 },
  // Fluorescent
  { code: 'W019', name: 'Fluorescent Aqua', brand: 'createx-wicked', category: 'fluorescent', rgb: [0, 230, 200], opacity: 0.4, tintingStrength: 1 },
  { code: 'W020', name: 'Fluorescent Purple', brand: 'createx-wicked', category: 'fluorescent', rgb: [160, 0, 200], opacity: 0.4, tintingStrength: 1 },
  { code: 'W021', name: 'Fluorescent Raspberry', brand: 'createx-wicked', category: 'fluorescent', rgb: [230, 0, 100], opacity: 0.4, tintingStrength: 1 },
  { code: 'W022', name: 'Fluorescent Red', brand: 'createx-wicked', category: 'fluorescent', rgb: [255, 30, 30], opacity: 0.4, tintingStrength: 1 },
  { code: 'W023', name: 'Fluorescent Green', brand: 'createx-wicked', category: 'fluorescent', rgb: [0, 230, 50], opacity: 0.4, tintingStrength: 1 },
  { code: 'W024', name: 'Fluorescent Yellow', brand: 'createx-wicked', category: 'fluorescent', rgb: [255, 255, 0], opacity: 0.3, tintingStrength: 1 },
  { code: 'W025', name: 'Fluorescent Sunburst', brand: 'createx-wicked', category: 'fluorescent', rgb: [255, 200, 0], opacity: 0.4, tintingStrength: 1 },
  { code: 'W026', name: 'Fluorescent Pink', brand: 'createx-wicked', category: 'fluorescent', rgb: [255, 50, 150], opacity: 0.4, tintingStrength: 1 },
  { code: 'W027', name: 'Fluorescent Orange', brand: 'createx-wicked', category: 'fluorescent', rgb: [255, 130, 0], opacity: 0.4, tintingStrength: 1 },
  { code: 'W028', name: 'Fluorescent Blue', brand: 'createx-wicked', category: 'fluorescent', rgb: [0, 100, 255], opacity: 0.4, tintingStrength: 1 },
  { code: 'W029', name: 'Fluorescent Magenta', brand: 'createx-wicked', category: 'fluorescent', rgb: [255, 0, 150], opacity: 0.4, tintingStrength: 1 },
];

// ============ CREATEX ILLUSTRATION COLORS ============
const createxIllustration: Paint[] = [
  { code: '5050', name: 'White', brand: 'createx-illustration', category: 'opaque', rgb: [255, 255, 255], opacity: 0.9, tintingStrength: 1 },
  { code: '5051', name: 'Black', brand: 'createx-illustration', category: 'opaque', rgb: [10, 10, 10], opacity: 0.9, tintingStrength: 1 },
  { code: '5052', name: 'Yellow', brand: 'createx-illustration', category: 'transparent', rgb: [250, 210, 0], opacity: 0.5, tintingStrength: 1 },
  { code: '5053', name: 'Scarlet', brand: 'createx-illustration', category: 'transparent', rgb: [215, 25, 30], opacity: 0.5, tintingStrength: 1 },
  { code: '5054', name: 'Orange', brand: 'createx-illustration', category: 'transparent', rgb: [245, 120, 0], opacity: 0.5, tintingStrength: 1 },
  { code: '5055', name: 'Violet', brand: 'createx-illustration', category: 'transparent', rgb: [80, 30, 120], opacity: 0.5, tintingStrength: 1 },
  { code: '5056', name: 'Red Violet', brand: 'createx-illustration', category: 'transparent', rgb: [150, 20, 80], opacity: 0.5, tintingStrength: 1 },
  { code: '5057', name: 'Blue Violet', brand: 'createx-illustration', category: 'transparent', rgb: [45, 30, 130], opacity: 0.5, tintingStrength: 1 },
  { code: '5058', name: 'Blue Green', brand: 'createx-illustration', category: 'transparent', rgb: [0, 100, 100], opacity: 0.5, tintingStrength: 1 },
  { code: '5059', name: 'Moss Green', brand: 'createx-illustration', category: 'transparent', rgb: [45, 75, 35], opacity: 0.5, tintingStrength: 1 },
  { code: '5060', name: 'Viridian', brand: 'createx-illustration', category: 'transparent', rgb: [0, 110, 65], opacity: 0.5, tintingStrength: 1 },
  { code: '5061', name: 'Cobalt Blue', brand: 'createx-illustration', category: 'transparent', rgb: [0, 65, 160], opacity: 0.5, tintingStrength: 1 },
  { code: '5062', name: 'Burnt Umber', brand: 'createx-illustration', category: 'transparent', rgb: [70, 40, 20], opacity: 0.5, tintingStrength: 1 },
  { code: '5063', name: 'Carmine', brand: 'createx-illustration', category: 'transparent', rgb: [185, 0, 55], opacity: 0.5, tintingStrength: 1 },
  { code: '5064', name: 'Magenta', brand: 'createx-illustration', category: 'transparent', rgb: [210, 0, 110], opacity: 0.5, tintingStrength: 1 },
  { code: '5065', name: 'Yellow Ochre', brand: 'createx-illustration', category: 'transparent', rgb: [185, 135, 45], opacity: 0.5, tintingStrength: 1 },
  { code: '5066', name: 'Burnt Orange', brand: 'createx-illustration', category: 'transparent', rgb: [185, 65, 0], opacity: 0.5, tintingStrength: 1 },
  { code: '5067', name: 'Raw Sienna', brand: 'createx-illustration', category: 'transparent', rgb: [165, 105, 45], opacity: 0.5, tintingStrength: 1 },
  { code: '5068', name: 'Raw Umber', brand: 'createx-illustration', category: 'transparent', rgb: [95, 75, 45], opacity: 0.5, tintingStrength: 1 },
  { code: '5069', name: 'Cerulean Blue', brand: 'createx-illustration', category: 'transparent', rgb: [0, 125, 195], opacity: 0.5, tintingStrength: 1 },
  { code: '5070', name: 'Sepia', brand: 'createx-illustration', category: 'transparent', rgb: [55, 30, 10], opacity: 0.5, tintingStrength: 1 },
  { code: '5071', name: 'Paynes Grey', brand: 'createx-illustration', category: 'transparent', rgb: [55, 60, 70], opacity: 0.5, tintingStrength: 1 },
  { code: '5072', name: 'Smoke Black', brand: 'createx-illustration', category: 'transparent', rgb: [35, 35, 35], opacity: 0.4, tintingStrength: 1 },
  { code: '5073', name: 'Flesh Tone', brand: 'createx-illustration', category: 'transparent', rgb: [240, 175, 125], opacity: 0.5, tintingStrength: 1 },
  { code: '5074', name: 'Burnt Sienna', brand: 'createx-illustration', category: 'transparent', rgb: [160, 60, 25], opacity: 0.5, tintingStrength: 1 },
];

// ============ VALLEJO MODEL AIR ============
const vallejoModelAir: Paint[] = [
  { code: '71.001', name: 'White', brand: 'vallejo-model-air', category: 'standard', rgb: [255, 255, 255], opacity: 0.85, tintingStrength: 1 },
  { code: '71.002', name: 'Medium Yellow', brand: 'vallejo-model-air', category: 'standard', rgb: [240, 200, 30], opacity: 0.7, tintingStrength: 1 },
  { code: '71.003', name: 'Red RLM23', brand: 'vallejo-model-air', category: 'standard', rgb: [190, 30, 30], opacity: 0.75, tintingStrength: 1 },
  { code: '71.004', name: 'Blue', brand: 'vallejo-model-air', category: 'standard', rgb: [30, 60, 150], opacity: 0.75, tintingStrength: 1 },
  { code: '71.005', name: 'Intermediate Blue', brand: 'vallejo-model-air', category: 'standard', rgb: [80, 120, 170], opacity: 0.7, tintingStrength: 1 },
  { code: '71.006', name: 'Light Grey', brand: 'vallejo-model-air', category: 'standard', rgb: [180, 180, 180], opacity: 0.8, tintingStrength: 1 },
  { code: '71.007', name: 'Olive Green', brand: 'vallejo-model-air', category: 'standard', rgb: [70, 80, 40], opacity: 0.75, tintingStrength: 1 },
  { code: '71.008', name: 'Pale Blue', brand: 'vallejo-model-air', category: 'standard', rgb: [140, 170, 200], opacity: 0.7, tintingStrength: 1 },
  { code: '71.009', name: 'Gold Yellow', brand: 'vallejo-model-air', category: 'standard', rgb: [230, 180, 20], opacity: 0.7, tintingStrength: 1 },
  { code: '71.010', name: 'Interior Green', brand: 'vallejo-model-air', category: 'standard', rgb: [100, 130, 80], opacity: 0.75, tintingStrength: 1 },
  { code: '71.012', name: 'Tan', brand: 'vallejo-model-air', category: 'standard', rgb: [180, 150, 100], opacity: 0.75, tintingStrength: 1 },
  { code: '71.013', name: 'Yellow Olive', brand: 'vallejo-model-air', category: 'standard', rgb: [130, 120, 50], opacity: 0.75, tintingStrength: 1 },
  { code: '71.014', name: 'Gunmetal', brand: 'vallejo-model-air', category: 'metallic', rgb: [70, 70, 80], opacity: 0.8, tintingStrength: 1 },
  { code: '71.015', name: 'Burnt Sienna', brand: 'vallejo-model-air', category: 'standard', rgb: [140, 60, 25], opacity: 0.75, tintingStrength: 1 },
  { code: '71.016', name: 'Burnt Umber', brand: 'vallejo-model-air', category: 'standard', rgb: [75, 40, 20], opacity: 0.75, tintingStrength: 1 },
  { code: '71.017', name: 'Russian Green', brand: 'vallejo-model-air', category: 'standard', rgb: [60, 75, 45], opacity: 0.75, tintingStrength: 1 },
  { code: '71.021', name: 'Metallic Black', brand: 'vallejo-model-air', category: 'metallic', rgb: [25, 25, 30], opacity: 0.8, tintingStrength: 1 },
  { code: '71.022', name: 'Camouflage Green', brand: 'vallejo-model-air', category: 'standard', rgb: [55, 70, 40], opacity: 0.75, tintingStrength: 1 },
  { code: '71.023', name: 'Hemp', brand: 'vallejo-model-air', category: 'standard', rgb: [170, 155, 120], opacity: 0.75, tintingStrength: 1 },
  { code: '71.024', name: 'Yellow Ochre', brand: 'vallejo-model-air', category: 'standard', rgb: [180, 140, 50], opacity: 0.75, tintingStrength: 1 },
  { code: '71.025', name: 'FS36622 Grey', brand: 'vallejo-model-air', category: 'standard', rgb: [130, 135, 130], opacity: 0.8, tintingStrength: 1 },
  { code: '71.027', name: 'Light Brown', brand: 'vallejo-model-air', category: 'standard', rgb: [150, 110, 60], opacity: 0.75, tintingStrength: 1 },
  { code: '71.028', name: 'Desert Sand', brand: 'vallejo-model-air', category: 'standard', rgb: [200, 180, 140], opacity: 0.75, tintingStrength: 1 },
  { code: '71.029', name: 'Dark Earth', brand: 'vallejo-model-air', category: 'standard', rgb: [100, 80, 50], opacity: 0.75, tintingStrength: 1 },
  { code: '71.030', name: 'Dark Green', brand: 'vallejo-model-air', category: 'standard', rgb: [40, 60, 30], opacity: 0.75, tintingStrength: 1 },
  { code: '71.031', name: 'Middlestone', brand: 'vallejo-model-air', category: 'standard', rgb: [170, 150, 90], opacity: 0.75, tintingStrength: 1 },
  { code: '71.032', name: 'Golden Brown', brand: 'vallejo-model-air', category: 'standard', rgb: [160, 120, 40], opacity: 0.75, tintingStrength: 1 },
  { code: '71.033', name: 'Yellow Green', brand: 'vallejo-model-air', category: 'standard', rgb: [110, 140, 50], opacity: 0.75, tintingStrength: 1 },
  { code: '71.034', name: 'Sandy Brown', brand: 'vallejo-model-air', category: 'standard', rgb: [180, 145, 85], opacity: 0.75, tintingStrength: 1 },
  { code: '71.035', name: 'Camouflage Pale Brown', brand: 'vallejo-model-air', category: 'standard', rgb: [150, 130, 90], opacity: 0.75, tintingStrength: 1 },
  { code: '71.036', name: 'Burnt Iron', brand: 'vallejo-model-air', category: 'metallic', rgb: [50, 45, 45], opacity: 0.8, tintingStrength: 1 },
  { code: '71.037', name: 'Sand Yellow', brand: 'vallejo-model-air', category: 'standard', rgb: [190, 170, 110], opacity: 0.75, tintingStrength: 1 },
  { code: '71.039', name: 'Smoke', brand: 'vallejo-model-air', category: 'transparent', rgb: [40, 35, 30], opacity: 0.3, tintingStrength: 1 },
  { code: '71.041', name: 'Dark Olive Green', brand: 'vallejo-model-air', category: 'standard', rgb: [50, 55, 30], opacity: 0.75, tintingStrength: 1 },
  { code: '71.043', name: 'US Olive Drab', brand: 'vallejo-model-air', category: 'standard', rgb: [80, 75, 45], opacity: 0.75, tintingStrength: 1 },
  { code: '71.044', name: 'Grey', brand: 'vallejo-model-air', category: 'standard', rgb: [120, 120, 120], opacity: 0.8, tintingStrength: 1 },
  { code: '71.047', name: 'Grey Violet', brand: 'vallejo-model-air', category: 'standard', rgb: [100, 90, 110], opacity: 0.75, tintingStrength: 1 },
  { code: '71.050', name: 'Light Grey', brand: 'vallejo-model-air', category: 'standard', rgb: [195, 195, 195], opacity: 0.8, tintingStrength: 1 },
  { code: '71.052', name: 'German Grey', brand: 'vallejo-model-air', category: 'standard', rgb: [55, 55, 55], opacity: 0.8, tintingStrength: 1 },
  { code: '71.055', name: 'Grey Green', brand: 'vallejo-model-air', category: 'standard', rgb: [100, 110, 90], opacity: 0.75, tintingStrength: 1 },
  { code: '71.057', name: 'Black', brand: 'vallejo-model-air', category: 'standard', rgb: [15, 15, 15], opacity: 0.9, tintingStrength: 1 },
  { code: '71.062', name: 'Aluminum', brand: 'vallejo-model-air', category: 'metallic', rgb: [175, 180, 185], opacity: 0.8, tintingStrength: 1 },
  { code: '71.063', name: 'Silver RLM01', brand: 'vallejo-model-air', category: 'metallic', rgb: [190, 195, 200], opacity: 0.8, tintingStrength: 1 },
  { code: '71.065', name: 'Steel', brand: 'vallejo-model-air', category: 'metallic', rgb: [140, 145, 150], opacity: 0.8, tintingStrength: 1 },
  { code: '71.066', name: 'Gold', brand: 'vallejo-model-air', category: 'metallic', rgb: [200, 170, 50], opacity: 0.8, tintingStrength: 1 },
  { code: '71.068', name: 'Sun Yellow', brand: 'vallejo-model-air', category: 'standard', rgb: [250, 220, 30], opacity: 0.7, tintingStrength: 1 },
  { code: '71.069', name: 'Purple', brand: 'vallejo-model-air', category: 'standard', rgb: [90, 30, 110], opacity: 0.75, tintingStrength: 1 },
  { code: '71.070', name: 'Medium Green', brand: 'vallejo-model-air', category: 'standard', rgb: [60, 120, 50], opacity: 0.75, tintingStrength: 1 },
  { code: '71.075', name: 'Sand (Ivory)', brand: 'vallejo-model-air', category: 'standard', rgb: [220, 210, 170], opacity: 0.75, tintingStrength: 1 },
  { code: '71.076', name: 'Insignia Red', brand: 'vallejo-model-air', category: 'standard', rgb: [175, 25, 25], opacity: 0.8, tintingStrength: 1 },
  { code: '71.078', name: 'Gold Brown', brand: 'vallejo-model-air', category: 'standard', rgb: [145, 110, 40], opacity: 0.75, tintingStrength: 1 },
  { code: '71.080', name: 'Khaki Brown', brand: 'vallejo-model-air', category: 'standard', rgb: [115, 95, 55], opacity: 0.75, tintingStrength: 1 },
  { code: '71.085', name: 'Ferrari Red', brand: 'vallejo-model-air', category: 'standard', rgb: [200, 20, 20], opacity: 0.8, tintingStrength: 1 },
  { code: '71.102', name: 'Steel Blue', brand: 'vallejo-model-air', category: 'standard', rgb: [70, 100, 140], opacity: 0.75, tintingStrength: 1 },
  { code: '71.104', name: 'Fluorescent Green', brand: 'vallejo-model-air', category: 'fluorescent', rgb: [0, 220, 60], opacity: 0.4, tintingStrength: 1 },
  { code: '71.105', name: 'Luminous Orange', brand: 'vallejo-model-air', category: 'fluorescent', rgb: [255, 140, 0], opacity: 0.4, tintingStrength: 1 },
];

// ============ VALLEJO GAME AIR ============
const vallejoGameAir: Paint[] = [
  { code: '72.701', name: 'Dead White', brand: 'vallejo-game-air', category: 'standard', rgb: [255, 255, 255], opacity: 0.85, tintingStrength: 1 },
  { code: '72.702', name: 'White Primer', brand: 'vallejo-game-air', category: 'primer', rgb: [245, 245, 240], opacity: 0.9, tintingStrength: 1 },
  { code: '72.703', name: 'Pale Flesh', brand: 'vallejo-game-air', category: 'standard', rgb: [240, 200, 170], opacity: 0.75, tintingStrength: 1 },
  { code: '72.704', name: 'Elf Skin Tone', brand: 'vallejo-game-air', category: 'standard', rgb: [225, 180, 140], opacity: 0.75, tintingStrength: 1 },
  { code: '72.706', name: 'Sun Yellow', brand: 'vallejo-game-air', category: 'standard', rgb: [250, 220, 30], opacity: 0.7, tintingStrength: 1 },
  { code: '72.707', name: 'Gold Yellow', brand: 'vallejo-game-air', category: 'standard', rgb: [235, 185, 20], opacity: 0.7, tintingStrength: 1 },
  { code: '72.708', name: 'Orange Fire', brand: 'vallejo-game-air', category: 'standard', rgb: [240, 100, 0], opacity: 0.75, tintingStrength: 1 },
  { code: '72.709', name: 'Hot Orange', brand: 'vallejo-game-air', category: 'standard', rgb: [250, 130, 20], opacity: 0.75, tintingStrength: 1 },
  { code: '72.710', name: 'Bloody Red', brand: 'vallejo-game-air', category: 'standard', rgb: [200, 20, 20], opacity: 0.8, tintingStrength: 1 },
  { code: '72.711', name: 'Gory Red', brand: 'vallejo-game-air', category: 'standard', rgb: [160, 15, 15], opacity: 0.8, tintingStrength: 1 },
  { code: '72.712', name: 'Scarlet Red', brand: 'vallejo-game-air', category: 'standard', rgb: [220, 30, 30], opacity: 0.8, tintingStrength: 1 },
  { code: '72.714', name: 'Warlord Purple', brand: 'vallejo-game-air', category: 'standard', rgb: [100, 20, 80], opacity: 0.75, tintingStrength: 1 },
  { code: '72.716', name: 'Royal Purple', brand: 'vallejo-game-air', category: 'standard', rgb: [75, 25, 120], opacity: 0.75, tintingStrength: 1 },
  { code: '72.718', name: 'Magic Blue', brand: 'vallejo-game-air', category: 'standard', rgb: [30, 80, 170], opacity: 0.75, tintingStrength: 1 },
  { code: '72.720', name: 'Imperial Blue', brand: 'vallejo-game-air', category: 'standard', rgb: [20, 50, 130], opacity: 0.8, tintingStrength: 1 },
  { code: '72.721', name: 'Ghost Grey', brand: 'vallejo-game-air', category: 'standard', rgb: [200, 210, 215], opacity: 0.8, tintingStrength: 1 },
  { code: '72.722', name: 'Ultramarine Blue', brand: 'vallejo-game-air', category: 'standard', rgb: [30, 40, 140], opacity: 0.8, tintingStrength: 1 },
  { code: '72.723', name: 'Electric Blue', brand: 'vallejo-game-air', category: 'standard', rgb: [0, 100, 200], opacity: 0.75, tintingStrength: 1 },
  { code: '72.724', name: 'Turquoise', brand: 'vallejo-game-air', category: 'standard', rgb: [0, 150, 160], opacity: 0.75, tintingStrength: 1 },
  { code: '72.726', name: 'Jade Green', brand: 'vallejo-game-air', category: 'standard', rgb: [0, 130, 80], opacity: 0.75, tintingStrength: 1 },
  { code: '72.728', name: 'Dark Green', brand: 'vallejo-game-air', category: 'standard', rgb: [30, 70, 30], opacity: 0.8, tintingStrength: 1 },
  { code: '72.729', name: 'Sick Green', brand: 'vallejo-game-air', category: 'standard', rgb: [130, 160, 50], opacity: 0.7, tintingStrength: 1 },
  { code: '72.730', name: 'Goblin Green', brand: 'vallejo-game-air', category: 'standard', rgb: [50, 130, 40], opacity: 0.75, tintingStrength: 1 },
  { code: '72.731', name: 'Scorpy Green', brand: 'vallejo-game-air', category: 'standard', rgb: [100, 200, 50], opacity: 0.7, tintingStrength: 1 },
  { code: '72.732', name: 'Escorpena Green', brand: 'vallejo-game-air', category: 'standard', rgb: [80, 170, 40], opacity: 0.7, tintingStrength: 1 },
  { code: '72.735', name: 'Dead Flesh', brand: 'vallejo-game-air', category: 'standard', rgb: [200, 190, 150], opacity: 0.75, tintingStrength: 1 },
  { code: '72.736', name: 'Bronze Flesh', brand: 'vallejo-game-air', category: 'standard', rgb: [180, 130, 90], opacity: 0.75, tintingStrength: 1 },
  { code: '72.737', name: 'Filthy Brown', brand: 'vallejo-game-air', category: 'standard', rgb: [150, 120, 50], opacity: 0.75, tintingStrength: 1 },
  { code: '72.738', name: 'Plague Brown', brand: 'vallejo-game-air', category: 'standard', rgb: [180, 160, 60], opacity: 0.7, tintingStrength: 1 },
  { code: '72.740', name: 'Leather Brown', brand: 'vallejo-game-air', category: 'standard', rgb: [120, 70, 30], opacity: 0.75, tintingStrength: 1 },
  { code: '72.741', name: 'Charred Brown', brand: 'vallejo-game-air', category: 'standard', rgb: [60, 30, 15], opacity: 0.8, tintingStrength: 1 },
  { code: '72.743', name: 'Beasty Brown', brand: 'vallejo-game-air', category: 'standard', rgb: [100, 60, 25], opacity: 0.75, tintingStrength: 1 },
  { code: '72.745', name: 'Charcoal', brand: 'vallejo-game-air', category: 'standard', rgb: [45, 45, 45], opacity: 0.85, tintingStrength: 1 },
  { code: '72.747', name: 'Wolf Grey', brand: 'vallejo-game-air', category: 'standard', rgb: [150, 160, 170], opacity: 0.8, tintingStrength: 1 },
  { code: '72.748', name: 'Sombre Grey', brand: 'vallejo-game-air', category: 'standard', rgb: [80, 85, 90], opacity: 0.8, tintingStrength: 1 },
  { code: '72.750', name: 'Cold Grey', brand: 'vallejo-game-air', category: 'standard', rgb: [100, 105, 115], opacity: 0.8, tintingStrength: 1 },
  { code: '72.751', name: 'Black', brand: 'vallejo-game-air', category: 'standard', rgb: [10, 10, 10], opacity: 0.9, tintingStrength: 1 },
  { code: '72.753', name: 'Chainmail Silver', brand: 'vallejo-game-air', category: 'metallic', rgb: [180, 185, 190], opacity: 0.8, tintingStrength: 1 },
  { code: '72.755', name: 'Polished Gold', brand: 'vallejo-game-air', category: 'metallic', rgb: [200, 165, 40], opacity: 0.8, tintingStrength: 1 },
  { code: '72.756', name: 'Glorious Gold', brand: 'vallejo-game-air', category: 'metallic', rgb: [185, 150, 30], opacity: 0.8, tintingStrength: 1 },
  { code: '72.757', name: 'Bright Bronze', brand: 'vallejo-game-air', category: 'metallic', rgb: [170, 120, 50], opacity: 0.8, tintingStrength: 1 },
];

// ============ E'TAC AIRBRUSH COLORS ============
const etacColors: Paint[] = [
  // EFX Series (Fine Art)
  { code: 'EFX-100', name: 'White', brand: 'etac', category: 'opaque', rgb: [255, 255, 255], opacity: 0.9, tintingStrength: 1 },
  { code: 'EFX-101', name: 'Black', brand: 'etac', category: 'opaque', rgb: [10, 10, 10], opacity: 0.9, tintingStrength: 1 },
  { code: 'EFX-102', name: 'Yellow', brand: 'etac', category: 'standard', rgb: [250, 215, 0], opacity: 0.7, tintingStrength: 1 },
  { code: 'EFX-103', name: 'Orange', brand: 'etac', category: 'standard', rgb: [250, 110, 0], opacity: 0.7, tintingStrength: 1 },
  { code: 'EFX-104', name: 'Red', brand: 'etac', category: 'standard', rgb: [210, 25, 25], opacity: 0.7, tintingStrength: 1 },
  { code: 'EFX-105', name: 'Crimson', brand: 'etac', category: 'standard', rgb: [180, 0, 40], opacity: 0.7, tintingStrength: 1 },
  { code: 'EFX-106', name: 'Violet', brand: 'etac', category: 'standard', rgb: [85, 30, 120], opacity: 0.7, tintingStrength: 1 },
  { code: 'EFX-107', name: 'Blue', brand: 'etac', category: 'standard', rgb: [0, 60, 160], opacity: 0.7, tintingStrength: 1 },
  { code: 'EFX-108', name: 'Cerulean Blue', brand: 'etac', category: 'standard', rgb: [0, 120, 190], opacity: 0.7, tintingStrength: 1 },
  { code: 'EFX-109', name: 'Phthalo Green', brand: 'etac', category: 'standard', rgb: [0, 90, 70], opacity: 0.7, tintingStrength: 1 },
  { code: 'EFX-110', name: 'Green', brand: 'etac', category: 'standard', rgb: [0, 130, 60], opacity: 0.7, tintingStrength: 1 },
  { code: 'EFX-111', name: 'Burnt Sienna', brand: 'etac', category: 'standard', rgb: [150, 60, 20], opacity: 0.7, tintingStrength: 1 },
  { code: 'EFX-112', name: 'Burnt Umber', brand: 'etac', category: 'standard', rgb: [70, 40, 15], opacity: 0.7, tintingStrength: 1 },
  { code: 'EFX-113', name: 'Raw Umber', brand: 'etac', category: 'standard', rgb: [95, 75, 40], opacity: 0.7, tintingStrength: 1 },
  { code: 'EFX-114', name: 'Raw Sienna', brand: 'etac', category: 'standard', rgb: [160, 105, 40], opacity: 0.7, tintingStrength: 1 },
  { code: 'EFX-115', name: 'Yellow Ochre', brand: 'etac', category: 'standard', rgb: [180, 135, 40], opacity: 0.7, tintingStrength: 1 },
  { code: 'EFX-116', name: 'Flesh', brand: 'etac', category: 'standard', rgb: [235, 175, 125], opacity: 0.7, tintingStrength: 1 },
  { code: 'EFX-117', name: 'Magenta', brand: 'etac', category: 'standard', rgb: [200, 0, 100], opacity: 0.7, tintingStrength: 1 },
  { code: 'EFX-118', name: 'Paynes Grey', brand: 'etac', category: 'standard', rgb: [50, 55, 65], opacity: 0.7, tintingStrength: 1 },
  // Private Stock (Textile)
  { code: 'PS-100', name: 'White', brand: 'etac', category: 'opaque', rgb: [255, 255, 255], opacity: 0.9, tintingStrength: 1 },
  { code: 'PS-101', name: 'Black', brand: 'etac', category: 'opaque', rgb: [10, 10, 10], opacity: 0.9, tintingStrength: 1 },
  { code: 'PS-102', name: 'Yellow', brand: 'etac', category: 'standard', rgb: [255, 220, 0], opacity: 0.8, tintingStrength: 1 },
  { code: 'PS-103', name: 'Orange', brand: 'etac', category: 'standard', rgb: [255, 120, 0], opacity: 0.8, tintingStrength: 1 },
  { code: 'PS-104', name: 'Red', brand: 'etac', category: 'standard', rgb: [220, 20, 20], opacity: 0.8, tintingStrength: 1 },
  { code: 'PS-105', name: 'Magenta', brand: 'etac', category: 'standard', rgb: [210, 0, 100], opacity: 0.8, tintingStrength: 1 },
  { code: 'PS-106', name: 'Violet', brand: 'etac', category: 'standard', rgb: [90, 30, 130], opacity: 0.8, tintingStrength: 1 },
  { code: 'PS-107', name: 'Blue', brand: 'etac', category: 'standard', rgb: [0, 50, 160], opacity: 0.8, tintingStrength: 1 },
  { code: 'PS-108', name: 'Turquoise', brand: 'etac', category: 'standard', rgb: [0, 150, 160], opacity: 0.8, tintingStrength: 1 },
  { code: 'PS-109', name: 'Green', brand: 'etac', category: 'standard', rgb: [0, 140, 60], opacity: 0.8, tintingStrength: 1 },
  { code: 'PS-110', name: 'Brown', brand: 'etac', category: 'standard', rgb: [100, 55, 20], opacity: 0.8, tintingStrength: 1 },
  { code: 'PS-111', name: 'Maroon', brand: 'etac', category: 'standard', rgb: [120, 20, 30], opacity: 0.8, tintingStrength: 1 },
  { code: 'PS-112', name: 'Navy', brand: 'etac', category: 'standard', rgb: [20, 30, 80], opacity: 0.8, tintingStrength: 1 },
  { code: 'PS-113', name: 'Kelly Green', brand: 'etac', category: 'standard', rgb: [0, 120, 50], opacity: 0.8, tintingStrength: 1 },
  { code: 'PS-114', name: 'Pink', brand: 'etac', category: 'standard', rgb: [255, 100, 150], opacity: 0.7, tintingStrength: 1 },
  { code: 'PS-115', name: 'Light Blue', brand: 'etac', category: 'standard', rgb: [100, 160, 220], opacity: 0.7, tintingStrength: 1 },
  // Fluorescent
  { code: 'PS-F01', name: 'Fluorescent Yellow', brand: 'etac', category: 'fluorescent', rgb: [255, 255, 0], opacity: 0.4, tintingStrength: 1 },
  { code: 'PS-F02', name: 'Fluorescent Orange', brand: 'etac', category: 'fluorescent', rgb: [255, 130, 0], opacity: 0.4, tintingStrength: 1 },
  { code: 'PS-F03', name: 'Fluorescent Red', brand: 'etac', category: 'fluorescent', rgb: [255, 30, 30], opacity: 0.4, tintingStrength: 1 },
  { code: 'PS-F04', name: 'Fluorescent Pink', brand: 'etac', category: 'fluorescent', rgb: [255, 50, 150], opacity: 0.4, tintingStrength: 1 },
  { code: 'PS-F05', name: 'Fluorescent Green', brand: 'etac', category: 'fluorescent', rgb: [0, 230, 50], opacity: 0.4, tintingStrength: 1 },
  { code: 'PS-F06', name: 'Fluorescent Blue', brand: 'etac', category: 'fluorescent', rgb: [0, 100, 255], opacity: 0.4, tintingStrength: 1 },
];

// ============ BADGER MINITAIRE ============
const badgerMinitaire: Paint[] = [
  { code: 'D6-101', name: 'Skull White', brand: 'badger-minitaire', category: 'standard', rgb: [255, 255, 255], opacity: 0.85, tintingStrength: 1 },
  { code: 'D6-102', name: 'Angelic Yellow', brand: 'badger-minitaire', category: 'standard', rgb: [250, 225, 50], opacity: 0.7, tintingStrength: 1 },
  { code: 'D6-103', name: 'Harvest Gold', brand: 'badger-minitaire', category: 'standard', rgb: [220, 180, 40], opacity: 0.7, tintingStrength: 1 },
  { code: 'D6-104', name: 'Razorback Ridge', brand: 'badger-minitaire', category: 'standard', rgb: [200, 150, 50], opacity: 0.7, tintingStrength: 1 },
  { code: 'D6-105', name: 'Troll Flesh', brand: 'badger-minitaire', category: 'standard', rgb: [180, 200, 80], opacity: 0.7, tintingStrength: 1 },
  { code: 'D6-106', name: 'Zombie Flesh', brand: 'badger-minitaire', category: 'standard', rgb: [200, 200, 120], opacity: 0.7, tintingStrength: 1 },
  { code: 'D6-107', name: 'Bark', brand: 'badger-minitaire', category: 'standard', rgb: [80, 50, 25], opacity: 0.8, tintingStrength: 1 },
  { code: 'D6-108', name: 'Russ Grey', brand: 'badger-minitaire', category: 'standard', rgb: [100, 110, 130], opacity: 0.8, tintingStrength: 1 },
  { code: 'D6-109', name: 'Concrete Slab', brand: 'badger-minitaire', category: 'standard', rgb: [140, 140, 140], opacity: 0.8, tintingStrength: 1 },
  { code: 'D6-110', name: 'Obsidian Black', brand: 'badger-minitaire', category: 'standard', rgb: [10, 10, 10], opacity: 0.9, tintingStrength: 1 },
  { code: 'D6-111', name: 'Regal Blue', brand: 'badger-minitaire', category: 'standard', rgb: [20, 50, 120], opacity: 0.8, tintingStrength: 1 },
  { code: 'D6-112', name: 'Nautilus Blue', brand: 'badger-minitaire', category: 'standard', rgb: [30, 80, 160], opacity: 0.75, tintingStrength: 1 },
  { code: 'D6-113', name: 'Plasma Blue', brand: 'badger-minitaire', category: 'standard', rgb: [50, 130, 200], opacity: 0.7, tintingStrength: 1 },
  { code: 'D6-114', name: 'Lagoon Blue', brand: 'badger-minitaire', category: 'standard', rgb: [0, 150, 170], opacity: 0.7, tintingStrength: 1 },
  { code: 'D6-115', name: 'Ghost Tint Fresh Blood', brand: 'badger-minitaire', category: 'transparent', rgb: [180, 0, 0], opacity: 0.3, tintingStrength: 1 },
  { code: 'D6-116', name: 'Ghost Tint Plasma Fluid', brand: 'badger-minitaire', category: 'transparent', rgb: [0, 200, 100], opacity: 0.3, tintingStrength: 1 },
  { code: 'D6-117', name: 'Ghost Tint Oil Discharge', brand: 'badger-minitaire', category: 'transparent', rgb: [80, 60, 20], opacity: 0.3, tintingStrength: 1 },
  { code: 'D6-118', name: 'Werewolf Brown', brand: 'badger-minitaire', category: 'standard', rgb: [110, 70, 30], opacity: 0.75, tintingStrength: 1 },
  { code: 'D6-119', name: 'Sandstorm', brand: 'badger-minitaire', category: 'standard', rgb: [190, 170, 120], opacity: 0.75, tintingStrength: 1 },
  { code: 'D6-120', name: 'Crimson', brand: 'badger-minitaire', category: 'standard', rgb: [170, 10, 20], opacity: 0.8, tintingStrength: 1 },
  { code: 'D6-121', name: 'Blood Red', brand: 'badger-minitaire', category: 'standard', rgb: [200, 20, 20], opacity: 0.8, tintingStrength: 1 },
  { code: 'D6-122', name: 'Angron Red', brand: 'badger-minitaire', category: 'standard', rgb: [160, 25, 25], opacity: 0.8, tintingStrength: 1 },
  { code: 'D6-123', name: 'Autumn', brand: 'badger-minitaire', category: 'standard', rgb: [180, 80, 20], opacity: 0.75, tintingStrength: 1 },
  { code: 'D6-124', name: 'Brass Monkey', brand: 'badger-minitaire', category: 'metallic', rgb: [170, 120, 40], opacity: 0.8, tintingStrength: 1 },
  { code: 'D6-125', name: 'Steel', brand: 'badger-minitaire', category: 'metallic', rgb: [150, 155, 160], opacity: 0.8, tintingStrength: 1 },
  { code: 'D6-126', name: 'Silver', brand: 'badger-minitaire', category: 'metallic', rgb: [185, 190, 195], opacity: 0.8, tintingStrength: 1 },
  { code: 'D6-127', name: 'Gold', brand: 'badger-minitaire', category: 'metallic', rgb: [200, 165, 40], opacity: 0.8, tintingStrength: 1 },
  { code: 'D6-128', name: 'Copper', brand: 'badger-minitaire', category: 'metallic', rgb: [180, 100, 50], opacity: 0.8, tintingStrength: 1 },
  { code: 'D6-130', name: 'Warpstone Green', brand: 'badger-minitaire', category: 'standard', rgb: [0, 120, 50], opacity: 0.75, tintingStrength: 1 },
  { code: 'D6-131', name: 'Caliban Green', brand: 'badger-minitaire', category: 'standard', rgb: [20, 60, 30], opacity: 0.8, tintingStrength: 1 },
  { code: 'D6-132', name: 'Mace Purple', brand: 'badger-minitaire', category: 'standard', rgb: [90, 30, 100], opacity: 0.75, tintingStrength: 1 },
  { code: 'D6-133', name: 'Liche Purple', brand: 'badger-minitaire', category: 'standard', rgb: [60, 20, 80], opacity: 0.8, tintingStrength: 1 },
  { code: 'D6-134', name: 'Warlock Purple', brand: 'badger-minitaire', category: 'standard', rgb: [130, 30, 100], opacity: 0.75, tintingStrength: 1 },
  { code: 'D6-135', name: 'Flesh', brand: 'badger-minitaire', category: 'standard', rgb: [220, 170, 130], opacity: 0.75, tintingStrength: 1 },
  { code: 'D6-136', name: 'Dark Flesh', brand: 'badger-minitaire', category: 'standard', rgb: [160, 100, 60], opacity: 0.75, tintingStrength: 1 },
];

// ============ COM-ART (IWATA/MEDEA) ============
const comArt: Paint[] = [
  // Opaque
  { code: '10001', name: 'Opaque White', brand: 'com-art', category: 'opaque', rgb: [255, 255, 255], opacity: 0.9, tintingStrength: 1 },
  { code: '10002', name: 'Opaque Black', brand: 'com-art', category: 'opaque', rgb: [10, 10, 10], opacity: 0.9, tintingStrength: 1 },
  { code: '10011', name: 'Opaque Yellow', brand: 'com-art', category: 'opaque', rgb: [250, 215, 0], opacity: 0.85, tintingStrength: 1 },
  { code: '10021', name: 'Opaque Orange', brand: 'com-art', category: 'opaque', rgb: [245, 110, 0], opacity: 0.85, tintingStrength: 1 },
  { code: '10031', name: 'Opaque Red', brand: 'com-art', category: 'opaque', rgb: [210, 20, 20], opacity: 0.85, tintingStrength: 1 },
  { code: '10041', name: 'Opaque Violet', brand: 'com-art', category: 'opaque', rgb: [85, 25, 110], opacity: 0.85, tintingStrength: 1 },
  { code: '10051', name: 'Opaque Blue', brand: 'com-art', category: 'opaque', rgb: [0, 55, 155], opacity: 0.85, tintingStrength: 1 },
  { code: '10061', name: 'Opaque Green', brand: 'com-art', category: 'opaque', rgb: [0, 120, 55], opacity: 0.85, tintingStrength: 1 },
  { code: '10071', name: 'Opaque Burnt Sienna', brand: 'com-art', category: 'opaque', rgb: [145, 60, 20], opacity: 0.85, tintingStrength: 1 },
  { code: '10081', name: 'Opaque Burnt Umber', brand: 'com-art', category: 'opaque', rgb: [65, 35, 15], opacity: 0.85, tintingStrength: 1 },
  // Transparent
  { code: '20001', name: 'Transparent White', brand: 'com-art', category: 'transparent', rgb: [255, 255, 255], opacity: 0.3, tintingStrength: 1 },
  { code: '20002', name: 'Transparent Black', brand: 'com-art', category: 'transparent', rgb: [20, 20, 20], opacity: 0.5, tintingStrength: 1 },
  { code: '20011', name: 'Transparent Yellow', brand: 'com-art', category: 'transparent', rgb: [250, 215, 0], opacity: 0.4, tintingStrength: 1 },
  { code: '20021', name: 'Transparent Orange', brand: 'com-art', category: 'transparent', rgb: [250, 110, 0], opacity: 0.4, tintingStrength: 1 },
  { code: '20031', name: 'Transparent Red', brand: 'com-art', category: 'transparent', rgb: [200, 20, 20], opacity: 0.4, tintingStrength: 1 },
  { code: '20041', name: 'Transparent Violet', brand: 'com-art', category: 'transparent', rgb: [80, 25, 110], opacity: 0.4, tintingStrength: 1 },
  { code: '20051', name: 'Transparent Blue', brand: 'com-art', category: 'transparent', rgb: [0, 50, 150], opacity: 0.4, tintingStrength: 1 },
  { code: '20061', name: 'Transparent Green', brand: 'com-art', category: 'transparent', rgb: [0, 110, 50], opacity: 0.4, tintingStrength: 1 },
  { code: '20071', name: 'Transparent Burnt Sienna', brand: 'com-art', category: 'transparent', rgb: [140, 55, 15], opacity: 0.4, tintingStrength: 1 },
  { code: '20081', name: 'Transparent Burnt Umber', brand: 'com-art', category: 'transparent', rgb: [60, 30, 10], opacity: 0.4, tintingStrength: 1 },
  { code: '20091', name: 'Transparent Raw Sienna', brand: 'com-art', category: 'transparent', rgb: [155, 100, 35], opacity: 0.4, tintingStrength: 1 },
  { code: '20101', name: 'Transparent Raw Umber', brand: 'com-art', category: 'transparent', rgb: [85, 65, 35], opacity: 0.4, tintingStrength: 1 },
  { code: '20111', name: 'Transparent Magenta', brand: 'com-art', category: 'transparent', rgb: [200, 0, 90], opacity: 0.4, tintingStrength: 1 },
  { code: '20121', name: 'Transparent Cerulean Blue', brand: 'com-art', category: 'transparent', rgb: [0, 120, 185], opacity: 0.4, tintingStrength: 1 },
  { code: '20131', name: 'Transparent Phthalo Green', brand: 'com-art', category: 'transparent', rgb: [0, 85, 65], opacity: 0.4, tintingStrength: 1 },
  { code: '20141', name: 'Transparent Yellow Ochre', brand: 'com-art', category: 'transparent', rgb: [175, 130, 35], opacity: 0.4, tintingStrength: 1 },
];

// ============ CREATEX CANDY2O ============
const createxCandy2o: Paint[] = [
  { code: '4651', name: 'Lemon Yellow', brand: 'createx-candy2o', category: 'transparent', rgb: [255, 230, 0], opacity: 0.3, tintingStrength: 1 },
  { code: '4652', name: 'Yellow', brand: 'createx-candy2o', category: 'transparent', rgb: [255, 200, 0], opacity: 0.3, tintingStrength: 1 },
  { code: '4653', name: 'Gold', brand: 'createx-candy2o', category: 'transparent', rgb: [220, 170, 20], opacity: 0.3, tintingStrength: 1 },
  { code: '4654', name: 'Light Orange', brand: 'createx-candy2o', category: 'transparent', rgb: [255, 150, 0], opacity: 0.3, tintingStrength: 1 },
  { code: '4655', name: 'Orange', brand: 'createx-candy2o', category: 'transparent', rgb: [255, 100, 0], opacity: 0.3, tintingStrength: 1 },
  { code: '4656', name: 'Sunset Orange', brand: 'createx-candy2o', category: 'transparent', rgb: [240, 70, 0], opacity: 0.3, tintingStrength: 1 },
  { code: '4657', name: 'Light Red', brand: 'createx-candy2o', category: 'transparent', rgb: [230, 30, 20], opacity: 0.3, tintingStrength: 1 },
  { code: '4658', name: 'Red', brand: 'createx-candy2o', category: 'transparent', rgb: [200, 10, 20], opacity: 0.3, tintingStrength: 1 },
  { code: '4659', name: 'Blood Red', brand: 'createx-candy2o', category: 'transparent', rgb: [160, 0, 15], opacity: 0.3, tintingStrength: 1 },
  { code: '4660', name: 'Magenta', brand: 'createx-candy2o', category: 'transparent', rgb: [190, 0, 80], opacity: 0.3, tintingStrength: 1 },
  { code: '4661', name: 'Red Violet', brand: 'createx-candy2o', category: 'transparent', rgb: [140, 0, 80], opacity: 0.3, tintingStrength: 1 },
  { code: '4662', name: 'Violet', brand: 'createx-candy2o', category: 'transparent', rgb: [80, 20, 120], opacity: 0.3, tintingStrength: 1 },
  { code: '4663', name: 'Blue Violet', brand: 'createx-candy2o', category: 'transparent', rgb: [50, 20, 130], opacity: 0.3, tintingStrength: 1 },
  { code: '4664', name: 'Deep Blue', brand: 'createx-candy2o', category: 'transparent', rgb: [0, 30, 120], opacity: 0.3, tintingStrength: 1 },
  { code: '4665', name: 'Blue', brand: 'createx-candy2o', category: 'transparent', rgb: [0, 60, 160], opacity: 0.3, tintingStrength: 1 },
  { code: '4666', name: 'Teal', brand: 'createx-candy2o', category: 'transparent', rgb: [0, 100, 120], opacity: 0.3, tintingStrength: 1 },
  { code: '4667', name: 'Blue Green', brand: 'createx-candy2o', category: 'transparent', rgb: [0, 120, 100], opacity: 0.3, tintingStrength: 1 },
  { code: '4668', name: 'Green', brand: 'createx-candy2o', category: 'transparent', rgb: [0, 130, 50], opacity: 0.3, tintingStrength: 1 },
  { code: '4669', name: 'Light Green', brand: 'createx-candy2o', category: 'transparent', rgb: [50, 170, 50], opacity: 0.3, tintingStrength: 1 },
  { code: '4670', name: 'Root Beer', brand: 'createx-candy2o', category: 'transparent', rgb: [100, 50, 10], opacity: 0.3, tintingStrength: 1 },
  { code: '4671', name: 'Cola', brand: 'createx-candy2o', category: 'transparent', rgb: [60, 25, 5], opacity: 0.3, tintingStrength: 1 },
  { code: '4672', name: 'Black', brand: 'createx-candy2o', category: 'transparent', rgb: [15, 15, 15], opacity: 0.3, tintingStrength: 1 },
];

// ============ CREATEX AUTO-AIR COLORS ============
const createxAutoAir: Paint[] = [
  // Semi-Opaque (4200 Series)
  { code: '4201', name: 'White', brand: 'createx-autoair', category: 'opaque', rgb: [255, 255, 255], opacity: 0.85, tintingStrength: 1 },
  { code: '4202', name: 'Jet Black', brand: 'createx-autoair', category: 'opaque', rgb: [10, 10, 10], opacity: 0.85, tintingStrength: 1 },
  { code: '4203', name: 'Flame Yellow', brand: 'createx-autoair', category: 'opaque', rgb: [255, 210, 0], opacity: 0.8, tintingStrength: 1 },
  { code: '4204', name: 'Canary Yellow', brand: 'createx-autoair', category: 'opaque', rgb: [255, 230, 30], opacity: 0.8, tintingStrength: 1 },
  { code: '4205', name: 'Orange', brand: 'createx-autoair', category: 'opaque', rgb: [250, 110, 0], opacity: 0.8, tintingStrength: 1 },
  { code: '4206', name: 'Red', brand: 'createx-autoair', category: 'opaque', rgb: [210, 20, 20], opacity: 0.8, tintingStrength: 1 },
  { code: '4207', name: 'Crimson', brand: 'createx-autoair', category: 'opaque', rgb: [170, 0, 40], opacity: 0.8, tintingStrength: 1 },
  { code: '4208', name: 'Magenta', brand: 'createx-autoair', category: 'opaque', rgb: [190, 0, 90], opacity: 0.8, tintingStrength: 1 },
  { code: '4209', name: 'Violet', brand: 'createx-autoair', category: 'opaque', rgb: [80, 25, 120], opacity: 0.8, tintingStrength: 1 },
  { code: '4210', name: 'Blue', brand: 'createx-autoair', category: 'opaque', rgb: [0, 50, 150], opacity: 0.8, tintingStrength: 1 },
  { code: '4211', name: 'Deep Blue', brand: 'createx-autoair', category: 'opaque', rgb: [0, 30, 100], opacity: 0.8, tintingStrength: 1 },
  { code: '4212', name: 'Teal', brand: 'createx-autoair', category: 'opaque', rgb: [0, 110, 120], opacity: 0.8, tintingStrength: 1 },
  { code: '4213', name: 'Green', brand: 'createx-autoair', category: 'opaque', rgb: [0, 120, 50], opacity: 0.8, tintingStrength: 1 },
  { code: '4214', name: 'Leaf Green', brand: 'createx-autoair', category: 'opaque', rgb: [50, 150, 40], opacity: 0.8, tintingStrength: 1 },
  { code: '4215', name: 'Brown', brand: 'createx-autoair', category: 'opaque', rgb: [100, 55, 20], opacity: 0.8, tintingStrength: 1 },
  { code: '4216', name: 'Tan', brand: 'createx-autoair', category: 'opaque', rgb: [180, 150, 100], opacity: 0.8, tintingStrength: 1 },
  { code: '4217', name: 'Medium Grey', brand: 'createx-autoair', category: 'opaque', rgb: [130, 130, 130], opacity: 0.8, tintingStrength: 1 },
  { code: '4218', name: 'Dark Grey', brand: 'createx-autoair', category: 'opaque', rgb: [70, 70, 70], opacity: 0.85, tintingStrength: 1 },
  // Transparent (4200 Series continued)
  { code: '4230', name: 'Transparent Yellow', brand: 'createx-autoair', category: 'transparent', rgb: [250, 215, 0], opacity: 0.4, tintingStrength: 1 },
  { code: '4231', name: 'Transparent Orange', brand: 'createx-autoair', category: 'transparent', rgb: [250, 110, 0], opacity: 0.4, tintingStrength: 1 },
  { code: '4232', name: 'Transparent Red', brand: 'createx-autoair', category: 'transparent', rgb: [200, 15, 20], opacity: 0.4, tintingStrength: 1 },
  { code: '4233', name: 'Transparent Violet', brand: 'createx-autoair', category: 'transparent', rgb: [75, 20, 110], opacity: 0.4, tintingStrength: 1 },
  { code: '4234', name: 'Transparent Blue', brand: 'createx-autoair', category: 'transparent', rgb: [0, 50, 150], opacity: 0.4, tintingStrength: 1 },
  { code: '4235', name: 'Transparent Green', brand: 'createx-autoair', category: 'transparent', rgb: [0, 110, 50], opacity: 0.4, tintingStrength: 1 },
  { code: '4236', name: 'Transparent Brown', brand: 'createx-autoair', category: 'transparent', rgb: [100, 50, 10], opacity: 0.4, tintingStrength: 1 },
  // Metallic (4300 Series)
  { code: '4301', name: 'Metallic Silver', brand: 'createx-autoair', category: 'metallic', rgb: [185, 190, 195], opacity: 0.7, tintingStrength: 1 },
  { code: '4302', name: 'Metallic Gold', brand: 'createx-autoair', category: 'metallic', rgb: [200, 165, 40], opacity: 0.7, tintingStrength: 1 },
  { code: '4303', name: 'Metallic Copper', brand: 'createx-autoair', category: 'metallic', rgb: [180, 100, 50], opacity: 0.7, tintingStrength: 1 },
  { code: '4304', name: 'Metallic Bronze', brand: 'createx-autoair', category: 'metallic', rgb: [160, 120, 50], opacity: 0.7, tintingStrength: 1 },
  { code: '4305', name: 'Metallic Red', brand: 'createx-autoair', category: 'metallic', rgb: [170, 30, 30], opacity: 0.7, tintingStrength: 1 },
  { code: '4306', name: 'Metallic Blue', brand: 'createx-autoair', category: 'metallic', rgb: [30, 60, 150], opacity: 0.7, tintingStrength: 1 },
  { code: '4307', name: 'Metallic Green', brand: 'createx-autoair', category: 'metallic', rgb: [0, 100, 60], opacity: 0.7, tintingStrength: 1 },
  { code: '4308', name: 'Metallic Purple', brand: 'createx-autoair', category: 'metallic', rgb: [80, 20, 120], opacity: 0.7, tintingStrength: 1 },
  { code: '4309', name: 'Metallic Charcoal', brand: 'createx-autoair', category: 'metallic', rgb: [55, 55, 60], opacity: 0.7, tintingStrength: 1 },
  { code: '4310', name: 'Metallic Pewter', brand: 'createx-autoair', category: 'metallic', rgb: [120, 125, 130], opacity: 0.7, tintingStrength: 1 },
  // Pearl (4400 Series)
  { code: '4401', name: 'Pearl White', brand: 'createx-autoair', category: 'pearl', rgb: [240, 240, 235], opacity: 0.5, tintingStrength: 1 },
  { code: '4402', name: 'Pearl Yellow', brand: 'createx-autoair', category: 'pearl', rgb: [255, 230, 50], opacity: 0.5, tintingStrength: 1 },
  { code: '4403', name: 'Pearl Orange', brand: 'createx-autoair', category: 'pearl', rgb: [240, 120, 20], opacity: 0.5, tintingStrength: 1 },
  { code: '4404', name: 'Pearl Red', brand: 'createx-autoair', category: 'pearl', rgb: [200, 30, 40], opacity: 0.5, tintingStrength: 1 },
  { code: '4405', name: 'Pearl Magenta', brand: 'createx-autoair', category: 'pearl', rgb: [180, 20, 90], opacity: 0.5, tintingStrength: 1 },
  { code: '4406', name: 'Pearl Purple', brand: 'createx-autoair', category: 'pearl', rgb: [80, 20, 140], opacity: 0.5, tintingStrength: 1 },
  { code: '4407', name: 'Pearl Blue', brand: 'createx-autoair', category: 'pearl', rgb: [30, 80, 180], opacity: 0.5, tintingStrength: 1 },
  { code: '4408', name: 'Pearl Teal', brand: 'createx-autoair', category: 'pearl', rgb: [0, 120, 130], opacity: 0.5, tintingStrength: 1 },
  { code: '4409', name: 'Pearl Green', brand: 'createx-autoair', category: 'pearl', rgb: [0, 130, 80], opacity: 0.5, tintingStrength: 1 },
  { code: '4410', name: 'Pearl Lime Green', brand: 'createx-autoair', category: 'pearl', rgb: [100, 200, 50], opacity: 0.5, tintingStrength: 1 },
  { code: '4411', name: 'Pearl Black', brand: 'createx-autoair', category: 'pearl', rgb: [25, 25, 30], opacity: 0.5, tintingStrength: 1 },
  // Fluorescent (4250 Series)
  { code: '4250', name: 'Fluorescent Yellow', brand: 'createx-autoair', category: 'fluorescent', rgb: [255, 255, 0], opacity: 0.4, tintingStrength: 1 },
  { code: '4251', name: 'Fluorescent Orange', brand: 'createx-autoair', category: 'fluorescent', rgb: [255, 130, 0], opacity: 0.4, tintingStrength: 1 },
  { code: '4252', name: 'Fluorescent Red', brand: 'createx-autoair', category: 'fluorescent', rgb: [255, 30, 30], opacity: 0.4, tintingStrength: 1 },
  { code: '4253', name: 'Fluorescent Pink', brand: 'createx-autoair', category: 'fluorescent', rgb: [255, 50, 150], opacity: 0.4, tintingStrength: 1 },
  { code: '4254', name: 'Fluorescent Blue', brand: 'createx-autoair', category: 'fluorescent', rgb: [0, 100, 255], opacity: 0.4, tintingStrength: 1 },
  { code: '4255', name: 'Fluorescent Green', brand: 'createx-autoair', category: 'fluorescent', rgb: [0, 230, 50], opacity: 0.4, tintingStrength: 1 },
];

// ============ COMBINED DATABASE ============
export const allPaints: Paint[] = [
  ...createxWicked,
  ...createxIllustration,
  ...createxCandy2o,
  ...createxAutoAir,
  ...vallejoModelAir,
  ...vallejoGameAir,
  ...etacColors,
  ...badgerMinitaire,
  ...comArt,
];

// Legacy export for backward compatibility
export const wickedColors = createxWicked;

export function getPaintByCode(code: string): Paint | undefined {
  return allPaints.find(p => p.code === code);
}

export function getPaintsByCategory(category: PaintCategory): Paint[] {
  return allPaints.filter(p => p.category === category);
}

export function getPaintsByBrand(brand: PaintBrand): Paint[] {
  return allPaints.filter(p => p.brand === brand);
}

export function getPaintsByBrandAndCategory(brand: PaintBrand, category: PaintCategory): Paint[] {
  return allPaints.filter(p => p.brand === brand && p.category === category);
}

export function getBrandCategories(brand: PaintBrand): PaintCategory[] {
  const cats = new Set(allPaints.filter(p => p.brand === brand).map(p => p.category));
  return Array.from(cats);
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

export function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [0, 0, 0];
  return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
}
