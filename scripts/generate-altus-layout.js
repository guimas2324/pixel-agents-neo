#!/usr/bin/env node
// generate-altus-layout.js
// Generates ~/.altus-office/agents.json (37 agents) and ~/.altus-office/layout.json (office layout)

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const OUTPUT_DIR = path.join(require('os').homedir(), '.altus-office');
const COLS = 64;
const ROWS = 50;
const TOTAL = COLS * ROWS;

// Tile types
const WALL = 0;
const FLOOR = 1; // FLOOR_1
const VOID = 255;

// ---------------------------------------------------------------------------
// 1. AGENTS
// ---------------------------------------------------------------------------
const agents = [
  // ALTUS CODE (15 agents, dept: "code")
  {
    id: 100,
    name: 'morpheus',
    role: 'Project Lead',
    dept: 'code',
    squad: 'core',
    rank: 'ceo',
    palette: 0,
    hueShift: 40,
    deskCol: 5,
    deskRow: 5,
    restCol: 16,
    restRow: 12,
  },
  {
    id: 101,
    name: 'neo',
    role: 'Backend Lead',
    dept: 'code',
    squad: 'backend',
    rank: 'lead',
    palette: 1,
    hueShift: 210,
    deskCol: 15,
    deskRow: 5,
    restCol: 21,
    restRow: 12,
  },
  {
    id: 102,
    name: 'tank',
    role: 'API Developer',
    dept: 'code',
    squad: 'backend',
    rank: 'dev',
    palette: 2,
    hueShift: 200,
    deskCol: 19,
    deskRow: 5,
    restCol: 16,
    restRow: 11,
  },
  {
    id: 103,
    name: 'dozer',
    role: 'DB Developer',
    dept: 'code',
    squad: 'backend',
    rank: 'dev',
    palette: 3,
    hueShift: 220,
    deskCol: 23,
    deskRow: 5,
    restCol: 21,
    restRow: 11,
  },
  {
    id: 104,
    name: 'link',
    role: 'Integrations',
    dept: 'code',
    squad: 'backend',
    rank: 'dev',
    palette: 4,
    hueShift: 190,
    deskCol: 27,
    deskRow: 5,
    restCol: 26,
    restRow: 11,
  },
  {
    id: 105,
    name: 'trinity',
    role: 'Frontend Lead',
    dept: 'code',
    squad: 'frontend',
    rank: 'lead',
    palette: 5,
    hueShift: 270,
    deskCol: 31,
    deskRow: 5,
    restCol: 31,
    restRow: 11,
  },
  {
    id: 106,
    name: 'pixel',
    role: 'UI Developer',
    dept: 'code',
    squad: 'frontend',
    rank: 'dev',
    palette: 0,
    hueShift: 280,
    deskCol: 15,
    deskRow: 7,
    restCol: 16,
    restRow: 13,
  },
  {
    id: 107,
    name: 'niobe',
    role: 'UX Developer',
    dept: 'code',
    squad: 'frontend',
    rank: 'dev',
    palette: 1,
    hueShift: 260,
    deskCol: 19,
    deskRow: 7,
    restCol: 21,
    restRow: 13,
  },
  {
    id: 108,
    name: 'glitch',
    role: 'Mobile Dev',
    dept: 'code',
    squad: 'frontend',
    rank: 'dev',
    palette: 2,
    hueShift: 250,
    deskCol: 23,
    deskRow: 7,
    restCol: 26,
    restRow: 12,
  },
  {
    id: 109,
    name: 'sentinel',
    role: 'Infra Lead',
    dept: 'code',
    squad: 'infra',
    rank: 'lead',
    palette: 3,
    hueShift: 0,
    deskCol: 27,
    deskRow: 7,
    restCol: 31,
    restRow: 12,
  },
  {
    id: 110,
    name: 'optimus',
    role: 'DevOps',
    dept: 'code',
    squad: 'infra',
    rank: 'dev',
    palette: 4,
    hueShift: 10,
    deskCol: 31,
    deskRow: 7,
    restCol: 36,
    restRow: 12,
  },
  {
    id: 111,
    name: 'sherlock',
    role: 'QA Tester',
    dept: 'code',
    squad: 'infra',
    rank: 'dev',
    palette: 5,
    hueShift: 350,
    deskCol: 15,
    deskRow: 9,
    restCol: 26,
    restRow: 13,
  },
  {
    id: 112,
    name: 'paranoid',
    role: 'Security',
    dept: 'code',
    squad: 'infra',
    rank: 'dev',
    palette: 0,
    hueShift: 340,
    deskCol: 19,
    deskRow: 9,
    restCol: 31,
    restRow: 13,
  },
  {
    id: 113,
    name: 'hawk',
    role: 'Performance',
    dept: 'code',
    squad: 'infra',
    rank: 'dev',
    palette: 1,
    hueShift: 20,
    deskCol: 23,
    deskRow: 9,
    restCol: 36,
    restRow: 11,
  },
  {
    id: 114,
    name: 'agent-smith',
    role: 'Code Reviewer',
    dept: 'code',
    squad: 'review',
    rank: 'special',
    palette: 2,
    hueShift: 0,
    deskCol: 27,
    deskRow: 9,
    restCol: 36,
    restRow: 13,
  },

  // ALTUS MARKETING (10 agents, dept: "marketing")
  {
    id: 200,
    name: 'stark',
    role: 'Marketing Lead',
    dept: 'marketing',
    squad: 'strategy',
    rank: 'lead',
    palette: 3,
    hueShift: 270,
    deskCol: 4,
    deskRow: 21,
    restCol: 5,
    restRow: 26,
  },
  {
    id: 201,
    name: 'thor',
    role: 'Content Lead',
    dept: 'marketing',
    squad: 'content',
    rank: 'lead',
    palette: 4,
    hueShift: 40,
    deskCol: 8,
    deskRow: 21,
    restCol: 11,
    restRow: 26,
  },
  {
    id: 202,
    name: 'shakespeare',
    role: 'Copywriter',
    dept: 'marketing',
    squad: 'content',
    rank: 'dev',
    palette: 5,
    hueShift: 280,
    deskCol: 12,
    deskRow: 21,
    restCol: 17,
    restRow: 26,
  },
  {
    id: 203,
    name: 'spider',
    role: 'Social Media',
    dept: 'marketing',
    squad: 'digital',
    rank: 'dev',
    palette: 0,
    hueShift: 290,
    deskCol: 16,
    deskRow: 21,
    restCol: 5,
    restRow: 28,
  },
  {
    id: 204,
    name: 'widow',
    role: 'Analytics',
    dept: 'marketing',
    squad: 'digital',
    rank: 'dev',
    palette: 1,
    hueShift: 260,
    deskCol: 20,
    deskRow: 21,
    restCol: 9,
    restRow: 28,
  },
  {
    id: 205,
    name: 'spielberg',
    role: 'Video Producer',
    dept: 'marketing',
    squad: 'creative',
    rank: 'dev',
    palette: 2,
    hueShift: 250,
    deskCol: 4,
    deskRow: 23,
    restCol: 13,
    restRow: 28,
  },
  {
    id: 206,
    name: 'zeus',
    role: 'Brand Manager',
    dept: 'marketing',
    squad: 'strategy',
    rank: 'dev',
    palette: 3,
    hueShift: 45,
    deskCol: 8,
    deskRow: 23,
    restCol: 17,
    restRow: 28,
  },
  {
    id: 207,
    name: 'poseidon',
    role: 'SEO Specialist',
    dept: 'marketing',
    squad: 'digital',
    rank: 'dev',
    palette: 4,
    hueShift: 50,
    deskCol: 12,
    deskRow: 23,
    restCol: 5,
    restRow: 25,
  },
  {
    id: 208,
    name: 'loki',
    role: 'Growth Hacker',
    dept: 'marketing',
    squad: 'strategy',
    rank: 'dev',
    palette: 5,
    hueShift: 35,
    deskCol: 16,
    deskRow: 23,
    restCol: 11,
    restRow: 25,
  },
  {
    id: 209,
    name: 'oracle',
    role: 'Market Research',
    dept: 'marketing',
    squad: 'strategy',
    rank: 'dev',
    palette: 0,
    hueShift: 55,
    deskCol: 20,
    deskRow: 23,
    restCol: 17,
    restRow: 25,
  },

  // ALTUS SALES (7 agents, dept: "sales")
  {
    id: 300,
    name: 'jordan',
    role: 'Sales Lead',
    dept: 'sales',
    squad: 'enterprise',
    rank: 'lead',
    palette: 1,
    hueShift: 0,
    deskCol: 26,
    deskRow: 21,
    restCol: 27,
    restRow: 26,
  },
  {
    id: 301,
    name: 'alfred',
    role: 'Account Lead',
    dept: 'sales',
    squad: 'accounts',
    rank: 'lead',
    palette: 2,
    hueShift: 185,
    deskCol: 30,
    deskRow: 21,
    restCol: 33,
    restRow: 26,
  },
  {
    id: 302,
    name: 'hunter',
    role: 'BDR',
    dept: 'sales',
    squad: 'enterprise',
    rank: 'dev',
    palette: 3,
    hueShift: 5,
    deskCol: 34,
    deskRow: 21,
    restCol: 37,
    restRow: 26,
  },
  {
    id: 303,
    name: 'harvey',
    role: 'Closer',
    dept: 'sales',
    squad: 'enterprise',
    rank: 'dev',
    palette: 4,
    hueShift: 355,
    deskCol: 38,
    deskRow: 21,
    restCol: 27,
    restRow: 28,
  },
  {
    id: 304,
    name: 'fox',
    role: 'SDR',
    dept: 'sales',
    squad: 'outbound',
    rank: 'dev',
    palette: 5,
    hueShift: 15,
    deskCol: 26,
    deskRow: 23,
    restCol: 33,
    restRow: 28,
  },
  {
    id: 305,
    name: 'robin',
    role: 'CSM',
    dept: 'sales',
    squad: 'accounts',
    rank: 'dev',
    palette: 0,
    hueShift: 180,
    deskCol: 30,
    deskRow: 23,
    restCol: 37,
    restRow: 28,
  },
  {
    id: 306,
    name: 'watson',
    role: 'Sales Ops',
    dept: 'sales',
    squad: 'ops',
    rank: 'dev',
    palette: 1,
    hueShift: 190,
    deskCol: 34,
    deskRow: 23,
    restCol: 30,
    restRow: 28,
  },

  // ALTUS LEGAL (5 agents, dept: "legal")
  {
    id: 400,
    name: 'dredd',
    role: 'Legal Lead',
    dept: 'legal',
    squad: 'compliance',
    rank: 'lead',
    palette: 2,
    hueShift: 185,
    deskCol: 4,
    deskRow: 35,
    restCol: 5,
    restRow: 39,
  },
  {
    id: 401,
    name: 'phoenix',
    role: 'IP Attorney',
    dept: 'legal',
    squad: 'ip',
    rank: 'dev',
    palette: 3,
    hueShift: 175,
    deskCol: 8,
    deskRow: 35,
    restCol: 11,
    restRow: 39,
  },
  {
    id: 402,
    name: 'atticus',
    role: 'Contract Law',
    dept: 'legal',
    squad: 'contracts',
    rank: 'dev',
    palette: 4,
    hueShift: 195,
    deskCol: 12,
    deskRow: 35,
    restCol: 5,
    restRow: 41,
  },
  {
    id: 403,
    name: 'themis',
    role: 'Compliance',
    dept: 'legal',
    squad: 'compliance',
    rank: 'dev',
    palette: 5,
    hueShift: 170,
    deskCol: 16,
    deskRow: 35,
    restCol: 11,
    restRow: 41,
  },
  {
    id: 404,
    name: 'daredevil',
    role: 'Litigation',
    dept: 'legal',
    squad: 'litigation',
    rank: 'dev',
    palette: 0,
    hueShift: 200,
    deskCol: 20,
    deskRow: 35,
    restCol: 17,
    restRow: 39,
  },
];

// ---------------------------------------------------------------------------
// 2. LAYOUT — tiles + tileColors
// ---------------------------------------------------------------------------
const tiles = new Array(TOTAL).fill(VOID);
const tileColors = new Array(TOTAL).fill(null);

function idx(col, row) {
  return row * COLS + col;
}

function setTile(col, row, type) {
  if (col >= 0 && col < COLS && row >= 0 && row < ROWS) {
    tiles[idx(col, row)] = type;
  }
}

function getTile(col, row) {
  if (col >= 0 && col < COLS && row >= 0 && row < ROWS) {
    return tiles[idx(col, row)];
  }
  return VOID;
}

function setColor(col, row, color) {
  if (col >= 0 && col < COLS && row >= 0 && row < ROWS) {
    tileColors[idx(col, row)] = color;
  }
}

// Fill a rectangular region with a tile type
function fillRect(colStart, rowStart, colEnd, rowEnd, type) {
  for (let r = rowStart; r <= rowEnd; r++) {
    for (let c = colStart; c <= colEnd; c++) {
      setTile(c, r, type);
    }
  }
}

// Fill floor color for a rectangular region
function fillColor(colStart, rowStart, colEnd, rowEnd, color) {
  for (let r = rowStart; r <= rowEnd; r++) {
    for (let c = colStart; c <= colEnd; c++) {
      setColor(c, r, { ...color });
    }
  }
}

// Draw wall border (single row or column)
function wallRow(row, colStart, colEnd) {
  for (let c = colStart; c <= colEnd; c++) setTile(c, row, WALL);
}
function wallCol(col, rowStart, rowEnd) {
  for (let r = rowStart; r <= rowEnd; r++) setTile(col, r, WALL);
}

// ---- Floor color definitions ----
const COLOR_MINHA_SALA_FLOOR = { h: 45, s: 40, b: -10, c: 0, colorize: true };
const COLOR_CODE_PROD = { h: 210, s: 30, b: -20, c: 0, colorize: true };
const COLOR_CODE_REST = { h: 140, s: 20, b: -25, c: 0, colorize: true };
const COLOR_MARKETING_PROD = { h: 270, s: 30, b: -20, c: 0, colorize: true };
const COLOR_MARKETING_REST = { h: 270, s: 20, b: -25, c: 0, colorize: true };
const COLOR_SALES_PROD = { h: 0, s: 25, b: -15, c: 0, colorize: true };
const COLOR_SALES_REST = { h: 0, s: 15, b: -20, c: 0, colorize: true };
const COLOR_LEGAL_PROD = { h: 185, s: 30, b: -20, c: 0, colorize: true };
const COLOR_LEGAL_REST = { h: 185, s: 20, b: -25, c: 0, colorize: true };
const COLOR_CORRIDOR = { h: 220, s: 10, b: -30, c: 0, colorize: true };

// ===================== MINHA SALA (rows 2-7, cols 2-10) =====================
// Walls
wallRow(2, 2, 10); // top wall
wallRow(7, 2, 5); // bottom wall left
wallRow(7, 7, 10); // bottom wall right
// col 6 row 7 = FLOOR (door)
wallCol(2, 3, 6); // left wall
wallCol(10, 3, 6); // right wall

// Floor
fillRect(3, 3, 9, 6, FLOOR);
setTile(6, 7, FLOOR); // door opening

// Colors (walls get null — already default)
fillColor(3, 3, 9, 6, COLOR_MINHA_SALA_FLOOR);
setColor(6, 7, { ...COLOR_MINHA_SALA_FLOOR });

// ===================== ALTUS CODE (rows 2-16, cols 13-42) =====================
// Outer walls
wallRow(2, 13, 42); // top
wallRow(16, 13, 42); // bottom
wallCol(13, 3, 15); // left (except row 9 = door)
setTile(13, 9, FLOOR); // door on left wall
wallCol(42, 3, 15); // right

// Internal divider at row 10
wallRow(10, 13, 42);
setTile(27, 10, FLOOR); // door opening
setTile(28, 10, FLOOR); // door opening

// Production floor (rows 3-9, cols 14-41)
fillRect(14, 3, 41, 9, FLOOR);
fillColor(14, 3, 41, 9, COLOR_CODE_PROD);

// Rest floor (rows 11-15, cols 14-41)
fillRect(14, 11, 41, 15, FLOOR);
fillColor(14, 11, 41, 15, COLOR_CODE_REST);

// Color the door openings
setColor(13, 9, { ...COLOR_CORRIDOR });
setColor(27, 10, { ...COLOR_CODE_PROD });
setColor(28, 10, { ...COLOR_CODE_PROD });

// ===================== ALTUS MARKETING (rows 18-30, cols 2-22) =====================
// Outer walls
wallRow(18, 2, 22); // top (except col 12 = door)
setTile(12, 18, FLOOR);
wallRow(30, 2, 22); // bottom
wallCol(2, 19, 29); // left
wallCol(22, 19, 29); // right

// Internal divider at row 24
wallRow(24, 2, 22);
setTile(11, 24, FLOOR); // door opening
setTile(12, 24, FLOOR); // door opening

// Production floor (rows 19-23, cols 3-21)
fillRect(3, 19, 21, 23, FLOOR);
fillColor(3, 19, 21, 23, COLOR_MARKETING_PROD);

// Rest floor (rows 25-29, cols 3-21)
fillRect(3, 25, 21, 29, FLOOR);
fillColor(3, 25, 21, 29, COLOR_MARKETING_REST);

// Door opening colors
setColor(12, 18, { ...COLOR_CORRIDOR });
setColor(11, 24, { ...COLOR_MARKETING_PROD });
setColor(12, 24, { ...COLOR_MARKETING_PROD });

// ===================== ALTUS SALES (rows 18-30, cols 24-42) =====================
// Outer walls
wallRow(18, 24, 42); // top (except col 33 = door)
setTile(33, 18, FLOOR);
wallRow(30, 24, 42); // bottom
wallCol(24, 19, 29); // left
wallCol(42, 19, 29); // right

// Internal divider at row 24
wallRow(24, 24, 42);
setTile(33, 24, FLOOR); // door opening
setTile(34, 24, FLOOR); // door opening

// Production floor (rows 19-23, cols 25-41)
fillRect(25, 19, 41, 23, FLOOR);
fillColor(25, 19, 41, 23, COLOR_SALES_PROD);

// Rest floor (rows 25-29, cols 25-41)
fillRect(25, 25, 41, 29, FLOOR);
fillColor(25, 25, 41, 29, COLOR_SALES_REST);

// Door opening colors
setColor(33, 18, { ...COLOR_CORRIDOR });
setColor(33, 24, { ...COLOR_SALES_PROD });
setColor(34, 24, { ...COLOR_SALES_PROD });

// ===================== ALTUS LEGAL (rows 32-44, cols 2-22) =====================
// Outer walls
wallRow(32, 2, 22); // top (except col 12 = door)
setTile(12, 32, FLOOR);
wallRow(44, 2, 22); // bottom
wallCol(2, 33, 43); // left
wallCol(22, 33, 43); // right

// Internal divider at row 37
wallRow(37, 2, 22);
setTile(11, 37, FLOOR); // door opening
setTile(12, 37, FLOOR); // door opening

// Production floor (rows 33-36, cols 3-21)
fillRect(3, 33, 21, 36, FLOOR);
fillColor(3, 33, 21, 36, COLOR_LEGAL_PROD);

// Rest floor (rows 38-43, cols 3-21)
fillRect(3, 38, 21, 43, FLOOR);
fillColor(3, 38, 21, 43, COLOR_LEGAL_REST);

// Door opening colors
setColor(12, 32, { ...COLOR_CORRIDOR });
setColor(11, 37, { ...COLOR_LEGAL_PROD });
setColor(12, 37, { ...COLOR_LEGAL_PROD });

// ===================== CORRIDORS =====================
// Vertical corridor: cols 11-12, rows 2-44
// Set FLOOR on any VOID tile at cols 11-12
for (let r = 2; r <= 44; r++) {
  for (let c = 11; c <= 12; c++) {
    if (getTile(c, r) === VOID) {
      setTile(c, r, FLOOR);
      setColor(c, r, { ...COLOR_CORRIDOR });
    }
  }
}

// Horizontal corridor 1: row 17, cols 2-42
for (let c = 2; c <= 42; c++) {
  if (getTile(c, 17) === VOID) {
    setTile(c, 17, FLOOR);
    setColor(c, 17, { ...COLOR_CORRIDOR });
  }
}

// Horizontal corridor 2: row 31, cols 2-22
for (let c = 2; c <= 22; c++) {
  if (getTile(c, 31) === VOID) {
    setTile(c, 31, FLOOR);
    setColor(c, 31, { ...COLOR_CORRIDOR });
  }
}

// ---------------------------------------------------------------------------
// 3. FURNITURE
// ---------------------------------------------------------------------------
let furnitureCounter = 0;
function uid() {
  furnitureCounter++;
  return `f-${String(furnitureCounter).padStart(3, '0')}`;
}

function f(type, col, row, color) {
  const item = { uid: uid(), type, col, row };
  if (color) item.color = color;
  return item;
}

const furniture = [];

// ---- PC variant cycle ----
const pcVariants = ['PC_FRONT_ON_1', 'PC_FRONT_ON_2', 'PC_FRONT_ON_3'];
let pcIdx = 0;
function nextPC() {
  const v = pcVariants[pcIdx % pcVariants.length];
  pcIdx++;
  return v;
}

// ===================== MINHA SALA furniture =====================
furniture.push(
  f('DESK_FRONT', 5, 4),
  f('PC_FRONT_ON_1', 5, 4),
  f('CUSHIONED_CHAIR_FRONT', 5, 5),
  f('LARGE_PLANT', 3, 3),
  f('LARGE_PLANT', 9, 3),
  f('COFFEE', 7, 4),
  f('BOOKSHELF', 2, 2),
  f('DOUBLE_BOOKSHELF', 6, 2),
  f('LARGE_PAINTING', 4, 2),
  f('CLOCK', 9, 2),
  f('CACTUS', 8, 6),
  f('BIN', 3, 6),
);

// ===================== ALTUS CODE Production furniture =====================
// 15 workstations in 3 rows of 5
// Row 1: desks at row 4, chairs at row 5
// Row 2: desks at row 6, chairs at row 7
// Row 3: desks at row 8, chairs at row 9
const codeDeskCols = [15, 19, 23, 27, 31];
pcIdx = 0; // reset PC cycle for CODE section
for (const deskRow of [4, 6, 8]) {
  const chairRow = deskRow + 1;
  for (const col of codeDeskCols) {
    furniture.push(
      f('DESK_FRONT', col, deskRow),
      f(nextPC(), col, deskRow),
      f('WOODEN_CHAIR_FRONT', col, chairRow),
    );
  }
}

// Wall decorations (on row 2 wall)
furniture.push(
  f('WHITEBOARD', 14, 2),
  f('WHITEBOARD', 22, 2),
  f('CLOCK', 30, 2),
  f('HANGING_PLANT', 18, 2),
  f('HANGING_PLANT', 26, 2),
);

// Misc
furniture.push(f('BIN', 35, 4), f('BIN', 35, 8));

// ===================== ALTUS CODE Rest furniture =====================
furniture.push(
  // Sofas
  f('SOFA_FRONT', 15, 11),
  f('SOFA_FRONT', 20, 11),
  f('SOFA_FRONT', 25, 11),
  f('SOFA_FRONT', 30, 11),
  // Coffee tables
  f('COFFEE_TABLE', 15, 12),
  f('COFFEE_TABLE', 20, 12),
  f('COFFEE_TABLE', 25, 12),
  f('COFFEE_TABLE', 30, 12),
  // Back sofas + bench
  f('SOFA_BACK', 15, 13),
  f('SOFA_BACK', 20, 13),
  f('CUSHIONED_BENCH', 25, 13),
  // Table area
  f('TABLE_FRONT', 35, 11),
  f('WOODEN_CHAIR_FRONT', 35, 12),
  f('WOODEN_CHAIR_FRONT', 37, 12),
  f('COFFEE', 36, 11),
  // Large plants
  f('LARGE_PLANT', 14, 11),
  f('LARGE_PLANT', 14, 15),
  f('LARGE_PLANT', 41, 11),
  f('LARGE_PLANT', 41, 15),
  // Small plants
  f('PLANT', 18, 14),
  f('PLANT', 28, 14),
  f('PLANT_2', 23, 14),
  f('CACTUS', 33, 14),
  f('CACTUS', 38, 14),
  // Wall items (on row 10 divider wall)
  f('BOOKSHELF', 14, 10),
  f('BOOKSHELF', 38, 10),
  f('SMALL_PAINTING', 20, 10),
  f('SMALL_PAINTING_2', 28, 10),
  // Pot
  f('POT', 40, 13),
);

// ===================== ALTUS MARKETING Production furniture =====================
// 10 workstations in 2 rows of 5
const mktgDeskCols = [4, 8, 12, 16, 20];
pcIdx = 0; // reset
for (const deskRow of [20, 22]) {
  const chairRow = deskRow + 1;
  for (const col of mktgDeskCols) {
    furniture.push(
      f('DESK_FRONT', col, deskRow),
      f(nextPC(), col, deskRow),
      f('WOODEN_CHAIR_FRONT', col, chairRow),
    );
  }
}

// Wall decorations (on row 18 wall)
furniture.push(
  f('WHITEBOARD', 3, 18),
  f('CLOCK', 11, 18),
  f('HANGING_PLANT', 7, 18),
  f('HANGING_PLANT', 15, 18),
);

// Misc
furniture.push(f('BIN', 21, 20));

// ===================== ALTUS MARKETING Rest furniture =====================
furniture.push(
  f('SOFA_FRONT', 4, 25),
  f('SOFA_FRONT', 10, 25),
  f('SOFA_FRONT', 16, 25),
  f('COFFEE_TABLE', 4, 26),
  f('COFFEE_TABLE', 10, 26),
  f('COFFEE', 16, 26),
  f('LARGE_PLANT', 3, 25),
  f('LARGE_PLANT', 21, 25),
  f('LARGE_PLANT', 3, 29),
  f('PLANT', 8, 28),
  f('PLANT_2', 14, 28),
  f('CACTUS', 20, 28),
  // Wall items (on row 24 divider wall)
  f('BOOKSHELF', 3, 24),
  f('DOUBLE_BOOKSHELF', 12, 24),
  f('SMALL_PAINTING', 8, 24),
);

// ===================== ALTUS SALES Production furniture =====================
// 7 workstations: 4 in row 1, 3 in row 2
const salesRow1Cols = [26, 30, 34, 38];
const salesRow2Cols = [26, 30, 34];
pcIdx = 0; // reset

for (const col of salesRow1Cols) {
  furniture.push(f('DESK_FRONT', col, 20), f(nextPC(), col, 20), f('WOODEN_CHAIR_FRONT', col, 21));
}
for (const col of salesRow2Cols) {
  furniture.push(f('DESK_FRONT', col, 22), f(nextPC(), col, 22), f('WOODEN_CHAIR_FRONT', col, 23));
}

// Wall decorations (on row 18 wall)
furniture.push(f('WHITEBOARD', 25, 18), f('CLOCK', 33, 18), f('HANGING_PLANT', 29, 18));

// ===================== ALTUS SALES Rest furniture =====================
furniture.push(
  f('SOFA_FRONT', 26, 25),
  f('SOFA_FRONT', 32, 25),
  f('COFFEE_TABLE', 26, 26),
  f('COFFEE', 32, 26),
  f('SOFA_BACK', 38, 25),
  f('LARGE_PLANT', 25, 25),
  f('LARGE_PLANT', 41, 25),
  f('PLANT', 30, 28),
  f('CACTUS', 36, 28),
  // Wall items (on row 24 divider wall)
  f('SMALL_PAINTING_2', 28, 24),
  f('BOOKSHELF', 36, 24),
);

// ===================== ALTUS LEGAL Production furniture =====================
// 5 workstations in 1 row
const legalDeskCols = [4, 8, 12, 16, 20];
pcIdx = 0; // reset
for (const col of legalDeskCols) {
  furniture.push(f('DESK_FRONT', col, 34), f(nextPC(), col, 34), f('WOODEN_CHAIR_FRONT', col, 35));
}

// Wall decorations (on row 32 wall)
furniture.push(f('WHITEBOARD', 3, 32), f('DOUBLE_BOOKSHELF', 10, 32), f('HANGING_PLANT', 7, 32));

// Conference room (rows 34-36, cols 16-21) — additional items
// Note: the workstations at cols 16 and 20 are already placed above.
// The conference table + chairs are in the same area.
// Since the task says TABLE_FRONT at col 17 and 19, and chairs at 16, 18, 20:
// But cols 16 and 20 already have desks + chairs from the workstations above.
// The spec lists them separately, so the conference items may overlap.
// We'll trust the spec and add them. The workstation desks at 16 and 20 are at row 34,
// while the conference table is also at row 34. This could be intentional for a
// conference-style layout. Let me re-read the spec...
// Actually, looking more carefully: the 5 workstations use cols 4,8,12,16,20 at row 34.
// The conference room items at cols 16-21 overlap with the last two workstations.
// The task explicitly lists both, so I'll add the conference items. The TABLE_FRONT
// items at cols 17 and 19 sit between the desks.
furniture.push(
  f('TABLE_FRONT', 17, 34),
  f('TABLE_FRONT', 19, 34),
  f('CUSHIONED_CHAIR_FRONT', 16, 35),
  f('CUSHIONED_CHAIR_FRONT', 18, 35),
  f('CUSHIONED_CHAIR_FRONT', 20, 35),
  // Wall paintings for conference area
  f('SMALL_PAINTING', 16, 32),
  f('SMALL_PAINTING_2', 20, 32),
);

// ===================== ALTUS LEGAL Rest furniture =====================
furniture.push(
  f('SOFA_FRONT', 4, 38),
  f('SOFA_FRONT', 10, 38),
  f('COFFEE_TABLE', 4, 39),
  f('COFFEE', 10, 39),
  f('LARGE_PLANT', 3, 38),
  f('LARGE_PLANT', 21, 38),
  f('PLANT_2', 8, 41),
  f('CACTUS', 16, 41),
  // Wall items (on row 37 divider wall)
  f('BOOKSHELF', 3, 37),
  // Pot
  f('POT', 20, 41),
);

// ===================== CORRIDOR plants =====================
furniture.push(
  f('PLANT', 11, 5),
  f('PLANT', 11, 14),
  f('PLANT', 11, 22),
  f('PLANT', 11, 28),
  f('PLANT', 11, 38),
);

// ---------------------------------------------------------------------------
// 4. BUILD LAYOUT OBJECT
// ---------------------------------------------------------------------------
const layout = {
  version: 1,
  cols: COLS,
  rows: ROWS,
  tiles,
  furniture,
  tileColors,
};

// ---------------------------------------------------------------------------
// 5. VALIDATE
// ---------------------------------------------------------------------------
function validate() {
  const errors = [];

  // Tiles
  if (layout.tiles.length !== TOTAL) {
    errors.push(`tiles: expected ${TOTAL} entries, got ${layout.tiles.length}`);
  }
  for (let i = 0; i < layout.tiles.length; i++) {
    const t = layout.tiles[i];
    if (t !== WALL && t !== FLOOR && t !== VOID) {
      errors.push(`tiles[${i}]: invalid tile type ${t}`);
    }
  }

  // tileColors
  if (layout.tileColors.length !== TOTAL) {
    errors.push(`tileColors: expected ${TOTAL} entries, got ${layout.tileColors.length}`);
  }

  // Furniture catalog validation
  const catalogPath = path.join(
    __dirname,
    '..',
    'dist',
    'webview',
    'assets',
    'furniture-catalog.json',
  );
  let validIds = new Set();
  try {
    const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
    validIds = new Set(catalog.map((e) => e.id));
  } catch (e) {
    errors.push(`Could not read furniture catalog at ${catalogPath}: ${e.message}`);
  }

  const uidSet = new Set();
  for (const item of layout.furniture) {
    if (uidSet.has(item.uid)) {
      errors.push(`furniture: duplicate uid "${item.uid}"`);
    }
    uidSet.add(item.uid);

    if (validIds.size > 0 && !validIds.has(item.type)) {
      errors.push(`furniture: unknown type "${item.type}" at uid ${item.uid}`);
    }
  }

  // Agents validation
  const agentIds = new Set();
  const agentNames = new Set();
  for (const a of agents) {
    if (agentIds.has(a.id)) errors.push(`agents: duplicate id ${a.id}`);
    if (agentNames.has(a.name)) errors.push(`agents: duplicate name "${a.name}"`);
    agentIds.add(a.id);
    agentNames.add(a.name);
  }

  if (agents.length !== 37) {
    errors.push(`agents: expected 37, got ${agents.length}`);
  }

  return errors;
}

// ---------------------------------------------------------------------------
// 6. WRITE FILES
// ---------------------------------------------------------------------------
const errors = validate();
if (errors.length > 0) {
  console.error('VALIDATION ERRORS:');
  errors.forEach((e) => console.error('  -', e));
  process.exit(1);
}

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const agentsPath = path.join(OUTPUT_DIR, 'agents.json');
const layoutPath = path.join(OUTPUT_DIR, 'layout.json');

fs.writeFileSync(agentsPath, JSON.stringify(agents, null, 2));
fs.writeFileSync(layoutPath, JSON.stringify(layout));

// Stats
const floorCount = tiles.filter((t) => t === FLOOR).length;
const wallCount = tiles.filter((t) => t === WALL).length;
const voidCount = tiles.filter((t) => t === VOID).length;

console.log('Generated successfully:');
console.log(`  ${agentsPath} — ${agents.length} agents`);
console.log(`  ${layoutPath} — ${COLS}x${ROWS} grid`);
console.log(
  `  Tiles: ${floorCount} floor, ${wallCount} wall, ${voidCount} void (total: ${tiles.length})`,
);
console.log(`  Furniture: ${furniture.length} items`);
console.log(
  `  tileColors: ${tileColors.filter((c) => c !== null).length} colored / ${tileColors.length} total`,
);
