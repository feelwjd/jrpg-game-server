# Dream Ticker Puzzle
## 프로젝트 설명
Dream Ticker Puzzle는 3D 퍼즐 게임으로, **붕괴:스타레일의 "꿈세계 시계(Dream Ticker)"** 기믹에서 영감을 받아 제작되었습니다. 이 프로젝트는 Rust 언어로 작성되었으며, `WebAssembly(WASM)`로 변환하여 웹 브라우저에서 실행할 수 있습니다.

### 주요 기능
- 3D 경로 탐색 및 퍼즐 해결: 사용자는 거울과 블록을 이동, 회전시켜 목표 지점에 도달하는 경로를 만듭니다.
- 반사 알고리즘: 거울을 통해 빛을 반사하듯이 경로를 동적으로 변화시키는 기믹을 구현했습니다.
- 10가지 문제 제공: 사용자가 해결할 수 있는 다양한 난이도의 퍼즐을 제공합니다.

### 퍼즐 설명
퍼즐은 3차원 좌표계를 기반으로 하며, 각 퍼즐은 x, y, z 축으로 구성된 맵에서 거울과 블록의 배치를 통해 경로를 이어가는 방식입니다. 사용자는 10개의 문제를 해결하면서 다양한 난이도의 도전 과제를 경험하게 됩니다.

## 빌드 방법

### 프로젝트 설정 및 빌드
1. wasm-pack 설치
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
cargo install wasm-pack
```

2. **wasm-pack**을 사용해 WebAssembly 빌드
```bash
wasm-pack build --target nodejs
```

## 코드 설명
### 주요 구조
* `Cell` 열거형
```rust
#[derive(Clone, Copy, PartialEq)]
pub enum Cell {
    Empty,
    Block,
    Mirror,
}
```
 `Cell`은 각 퍼즐 셀의 상태를 나타냅니다. *Empty*는 빈 공간, *Block*은 이동할 수 없는 블록, *Mirror*는 반사되는 거울을 의미합니다.
이 열거형은 `Clone`과 `Copy`, `PartialEq`를 사용하여 쉽게 복사 및 비교할 수 있도록 설정하였습니다.

* `Position3D` 구조체
```rust
#[derive(Clone, Copy)]
pub struct Position3D {
    x: i32,
    y: i32,
    z: i32,
}
```
`Position3D`는 3D 공간에서의 좌표를 나타내며, 퍼즐에서 각 셀의 위치를 추적하는 데 사용됩니다.

* `BFS(너비 우선 탐색)` 알고리즘
```rust
pub fn bfs(&self, start: Position3D, end: Position3D) -> bool {
    // 경로 탐색 코드
}
```
퍼즐의 경로를 찾기 위해 너비 우선 탐색 알고리즘을 구현했습니다. 사용자는 거울을 회전시켜 경로를 조작하고 목표 지점에 도달하는지 확인합니다.

### 퍼즐 생성
```rust
#[wasm_bindgen]
pub fn generate_puzzle(puzzle_index: usize) -> PuzzleMap3D {
    let (width, height, depth) = match puzzle_index {
        0..=4 => (5, 5, 5),
        5..=9 => (7, 7, 7),
        _ => (5, 5, 5),
    };

    let mut puzzle = PuzzleMap3D::new(width, height, depth);
    puzzle.set_cell(Position3D { x: 2, y: 2, z: 2 }, Cell::Block);
    puzzle.set_cell(Position3D { x: 3, y: 2, z: 2 }, Cell::Block);
    puzzle
}
```
