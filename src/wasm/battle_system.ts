import * as path from 'path';
import * as fs from 'fs';
import { instantiateSync } from '@assemblyscript/loader';

// WASM 파일 경로 설정
const wasmPath = path.join(__dirname, 'battle_system', 'pkg', 'battle_system_bg.wasm');
const wasmBuffer = fs.readFileSync(wasmPath);

// WASM 모듈 로드
const wasmModule = instantiateSync(wasmBuffer, {}).exports as unknown as {
  calculate_damage: (attack: number, defense: number) => number;
};

// 함수 호출 예시
export const simulateBattle = (attack: number, defense: number): number => {
  return wasmModule.calculate_damage(attack, defense);
};
