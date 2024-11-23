import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {PublicKey} from '@solana/web3.js'
import {Voting} from '../target/types/voting'
import {BankrunProvider, startAnchor} from "anchor-bankrun";
import {Buffer} from "buffer";

describe('voting', () => {

    const IDL = require('../target/idl/voting.json');
    const VOTING_ADDRESS = new PublicKey("Er37AJCjLgRxniR5dufQpm42ZjiwARpZqDunHBHwz5wU");

    let context;
    let provider;
    let votingProgram: Program<Voting>;

    beforeAll(async () => {
        context = await startAnchor("", [{name: "voting", programId: VOTING_ADDRESS}], []);
        provider = new BankrunProvider(context)

        votingProgram = new Program<Voting>(
            IDL,
            provider
        );
    });

    it('Initialize Poll', async () => {
        await votingProgram.methods.initializePoll(
            new anchor.BN(1),
            "What is the best type of coffee?",
            new anchor.BN(0),
            new anchor.BN(1800000000),
        ).rpc();

        const [pollAddress] = PublicKey.findProgramAddressSync(
            [new anchor.BN(1).toArrayLike(Buffer, 'le', 8)],
            VOTING_ADDRESS
        )

        const poll = await votingProgram.account.poll.fetch(pollAddress);

        console.log(poll);

        expect(poll.pollId.toNumber()).toEqual(1);
        expect(poll.description).toEqual("What is the best type of coffee?");
        expect(poll.pollStart.toNumber()).toBeLessThan(poll.pollEnd.toNumber());
    })

    it('Initialize Candidate', async () => {
        await votingProgram.methods.initializeCandidate(
            "Arabica",
            new anchor.BN(1),
        ).rpc();

        await votingProgram.methods.initializeCandidate(
            "Robusta",
            new anchor.BN(1),
        ).rpc();

        const [arabicaAddress] = PublicKey.findProgramAddressSync(
            [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("Arabica")],
            VOTING_ADDRESS
        )
        const [robustaAddress] = PublicKey.findProgramAddressSync(
            [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("Robusta")],
            VOTING_ADDRESS
        )

        const arabicaCandidate = await votingProgram.account.candidate.fetch(arabicaAddress);
        console.log(arabicaCandidate);
        const robustaCandidate = await votingProgram.account.candidate.fetch(robustaAddress);
        console.log(robustaCandidate);

        expect(arabicaCandidate.candidateVotes.toNumber()).toEqual(0);
        expect(robustaCandidate.candidateVotes.toNumber()).toEqual(0);
    })

    it('Vote', async () => {
        await votingProgram.methods.vote(
            "Arabica",
            new anchor.BN(1),
        ).rpc();

        const [arabicaAddress] = PublicKey.findProgramAddressSync(
            [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("Arabica")],
            VOTING_ADDRESS
        )

        const arabicaCandidate = await votingProgram.account.candidate.fetch(arabicaAddress);
        console.log(arabicaCandidate);

        expect(arabicaCandidate.candidateVotes.toNumber()).toEqual(1);
    })
})
