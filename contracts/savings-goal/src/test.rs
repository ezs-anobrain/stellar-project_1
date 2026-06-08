#![cfg(test)]
use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env};

fn setup(env: &Env) -> WaterLoyaltyContractClient {
    let contract_id = env.register(WaterLoyaltyContract, ());
    WaterLoyaltyContractClient::new(env, &contract_id)
}

#[test]
fn increment_tracks_per_user() {
    let env = Env::default();
    env.mock_all_auths();
    let client = setup(&env);

    let user1 = Address::generate(&env);
    let user2 = Address::generate(&env);

    assert_eq!(client.add_stamp(&user1), 1);
    assert_eq!(client.add_stamp(&user1), 2);
    assert_eq!(client.get_tally(&user1), 2);

    assert_eq!(client.get_tally(&user2), 0);
    assert_eq!(client.add_stamp(&user2), 1);
    assert_eq!(client.get_tally(&user2), 1);
}

#[test]
fn reset_clears_tally() {
    let env = Env::default();
    env.mock_all_auths();
    let client = setup(&env);
    let user = Address::generate(&env);

    client.add_stamp(&user);
    client.add_stamp(&user);
    assert_eq!(client.get_tally(&user), 2);

    client.reset_tally(&user);
    assert_eq!(client.get_tally(&user), 0);
}

#[test]
fn caps_at_ten() {
    let env = Env::default();
    env.mock_all_auths();
    let client = setup(&env);
    let user = Address::generate(&env);

    for _ in 0..15 {
        client.add_stamp(&user);
    }
    assert_eq!(client.get_tally(&user), 10);
}
