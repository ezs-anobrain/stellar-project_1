import {
  Contract,
  TransactionBuilder,
  BASE_FEE,
  Account,
  rpc,
  nativeToScVal,
  scValToNative,
} from '@stellar/stellar-sdk';
import { server, NETWORK_PASSPHRASE, CONTRACT_ID } from './stellar';

// A real, funded testnet account used ONLY as the source for read-only
// simulations. Nothing is signed or submitted for reads, so any existing
// account works — we reuse the Circle USDC issuer.
const READ_SOURCE = 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5';

export function contractConfigured(): boolean {
  return Boolean(CONTRACT_ID);
}

/** Read get_tally(user) via simulation — no wallet or signature required. */
export async function readTally(user: string): Promise<number> {
  if (!CONTRACT_ID) return 0;
  const contract = new Contract(CONTRACT_ID);
  const source = new Account(READ_SOURCE, '0');

  const tx = new TransactionBuilder(source, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call('get_tally', nativeToScVal(user, { type: 'address' })))
    .setTimeout(30)
    .build();

  const sim = await server.simulateTransaction(tx);
  if (!rpc.Api.isSimulationSuccess(sim) || !sim.result) {
    return 0;
  }

  return scValToNative(sim.result.retval) as number;
}

/**
 * Build + simulate + assemble an unsigned `add_stamp(user)` invocation.
 */
export async function buildAddStampXDR(
  user: string,
): Promise<string> {
  const contract = new Contract(CONTRACT_ID);
  const account = await server.getAccount(user);

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      contract.call('add_stamp', nativeToScVal(user, { type: 'address' }))
    )
    .setTimeout(30)
    .build();

  const sim = await server.simulateTransaction(tx);
  if (!rpc.Api.isSimulationSuccess(sim)) {
    throw new Error('Simulation failed — the add_stamp call would not succeed.');
  }

  return rpc.assembleTransaction(tx, sim).build().toXDR();
}

/**
 * Build + simulate + assemble an unsigned `reset_tally(user)` invocation.
 */
export async function buildResetTallyXDR(
  user: string,
): Promise<string> {
  const contract = new Contract(CONTRACT_ID);
  const account = await server.getAccount(user);

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      contract.call('reset_tally', nativeToScVal(user, { type: 'address' }))
    )
    .setTimeout(30)
    .build();

  const sim = await server.simulateTransaction(tx);
  if (!rpc.Api.isSimulationSuccess(sim)) {
    throw new Error('Simulation failed — the reset_tally call would not succeed.');
  }

  return rpc.assembleTransaction(tx, sim).build().toXDR();
}
