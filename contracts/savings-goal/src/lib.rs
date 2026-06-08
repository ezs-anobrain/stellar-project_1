#![no_std]
//! WaterLoyalty — a loyalty program for the WaterX Station.
//!
//! It tracks refill stamps for users on-chain. After 10 stamps, the user
//! can claim a reward (a free refill), which resets their tally.

use soroban_sdk::{contract, contractimpl, contracttype, Address, Env};

#[contracttype]
pub enum DataKey {
    Tally(Address),
}

#[contract]
pub struct WaterLoyaltyContract;

#[contractimpl]
impl WaterLoyaltyContract {
    /// Add a stamp for the given user. Caps at 10.
    pub fn add_stamp(env: Env, user: Address) -> u32 {
        user.require_auth();
        let key = DataKey::Tally(user.clone());
        let current: u32 = env.storage().persistent().get(&key).unwrap_or(0);
        let new_tally = if current < 10 { current + 1 } else { 10 };
        env.storage().persistent().set(&key, &new_tally);
        
        // Extend TTL for persistent storage
        env.storage().persistent().extend_ttl(&key, 1000, 5000);
        
        new_tally
    }

    /// Read the current tally for a user.
    pub fn get_tally(env: Env, user: Address) -> u32 {
        let key = DataKey::Tally(user);
        env.storage().persistent().get(&key).unwrap_or(0)
    }

    /// Reset the tally for a user (called when claiming reward).
    pub fn reset_tally(env: Env, user: Address) -> u32 {
        user.require_auth();
        let key = DataKey::Tally(user);
        env.storage().persistent().set(&key, &0u32);
        0
    }
}

mod test;
