use wasm_bindgen::prelude::*;
use std::collections::VecDeque;

#[wasm_bindgen]
#[derive(Clone, Copy, PartialEq)]  
pub enum Cell {
    Empty,
    Block,
    Mirror,
}

#[wasm_bindgen]
#[derive(Clone, Copy)]  
pub struct Position3D {
    x: i32,
    y: i32,
    z: i32,
}

#[wasm_bindgen]
#[derive(Clone, Copy)]  
pub enum Direction {
    Left,
    Right,
    Up,
    Down,
    Forward,
    Backward,
}

#[wasm_bindgen]
pub struct PuzzleMap3D {
    grid: Vec<Vec<Vec<Cell>>>,
    width: usize,
    height: usize,
    depth: usize,
}

#[wasm_bindgen]
impl PuzzleMap3D {
    pub fn new(width: usize, height: usize, depth: usize) -> PuzzleMap3D {
        let grid = vec![vec![vec![Cell::Empty; width]; height]; depth];
        PuzzleMap3D { grid, width, height, depth }
    }

    pub fn set_cell(&mut self, position: Position3D, cell_type: Cell) {
        self.grid[position.z as usize][position.y as usize][position.x as usize] = cell_type;
    }

    pub fn get_cell(&self, position: Position3D) -> Cell {
        self.grid[position.z as usize][position.y as usize][position.x as usize]
    }

    pub fn bfs(&self, start: Position3D, end: Position3D) -> bool {
        let mut queue = VecDeque::new();
        let mut visited = vec![vec![vec![false; self.width]; self.height]; self.depth];
        
        queue.push_back(start);
        visited[start.z as usize][start.y as usize][start.x as usize] = true;

        let directions = vec![
            (1, 0, 0), (-1, 0, 0), (0, 1, 0), (0, -1, 0),
            (0, 0, 1), (0, 0, -1),
        ];

        while let Some(current) = queue.pop_front() {
            if current.x == end.x && current.y == end.y && current.z == end.z {
                return true;
            }

            for (dx, dy, dz) in &directions {
                let new_pos = Position3D {
                    x: current.x + dx,
                    y: current.y + dy,
                    z: current.z + dz,
                };

                if new_pos.x >= 0 && new_pos.y >= 0 && new_pos.z >= 0
                    && (new_pos.x as usize) < self.width
                    && (new_pos.y as usize) < self.height
                    && (new_pos.z as usize) < self.depth
                    && !visited[new_pos.z as usize][new_pos.y as usize][new_pos.x as usize]
                    && self.get_cell(new_pos) != Cell::Block
                {
                    queue.push_back(new_pos);
                    visited[new_pos.z as usize][new_pos.y as usize][new_pos.x as usize] = true;
                }
            }
        }

        false
    }
}

#[wasm_bindgen]
pub struct Mirror3D {
    position: Position3D,
    direction: Direction,
}

#[wasm_bindgen]
impl Mirror3D {
    pub fn new(position: Position3D, direction: Direction) -> Mirror3D {
        Mirror3D { position, direction }
    }

    pub fn reflect_path(&self, start: Position3D) -> Position3D {
        match self.direction {
            Direction::Left => Position3D { x: start.x - 1, y: start.y, z: start.z },
            Direction::Right => Position3D { x: start.x + 1, y: start.y, z: start.z },
            Direction::Up => Position3D { x: start.x, y: start.y + 1, z: start.z },
            Direction::Down => Position3D { x: start.x, y: start.y - 1, z: start.z },
            Direction::Forward => Position3D { x: start.x, y: start.y, z: start.z + 1 },
            Direction::Backward => Position3D { x: start.x, y: start.y, z: start.z - 1 },
        }
    }
}

#[wasm_bindgen]
pub fn generate_puzzle(puzzle_index: usize) -> PuzzleMap3D {
    let (width, height, depth) = match puzzle_index {
        0..=4 => (5, 5, 5), // 작은 퍼즐
        5..=9 => (7, 7, 7), // 큰 퍼즐
        _ => (5, 5, 5),
    };

    let mut puzzle = PuzzleMap3D::new(width, height, depth);
    // 퍼즐 맵 초기화 (예: 블록 및 거울 배치)
    puzzle.set_cell(Position3D { x: 2, y: 2, z: 2 }, Cell::Block);
    puzzle.set_cell(Position3D { x: 3, y: 2, z: 2 }, Cell::Block);
    // 더 복잡한 퍼즐을 위해 추가 설정 가능
    puzzle
}
