import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {PublicKey} from '@solana/web3.js'
import {Votingdapp} from '../target/types/votingdapp'
import {BankrunProvider, startAnchor} from "anchor-bankrun";

describe('voting', () => {

  const IDL = require('../target/idl/votingdapp.json');
  const VOTING_ADDRESS = new PublicKey("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ");

  it('Initialize Poll', async () => {
    const context = await startAnchor("", [{name: "Voting", programId: VOTING_ADDRESS}], []);
    const provider = new BankrunProvider(context)

    const votingProgram = new Program<Votingdapp>(
        IDL,
        provider
    );

    await votingProgram.methods.initializePoll(
        new anchor.BN(1),
        "What is the best type of coffee?",
        new anchor.BN(0),
        new anchor.BN(1800000000),
    ).rpc();
  })
})
