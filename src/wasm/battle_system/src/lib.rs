use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn calculate_damage(attack: u32, defense: u32) -> u32 {
    attack.saturating_sub(defense / 2)
}
