'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { ExplorerLink } from '../cluster/cluster-ui';
import { WalletButton } from '../solana/solana-provider';
import { AppHero, ellipsify } from '../ui/ui-layout';
import { useBasicProgram } from './basic-data-access';
import { BasicCreate, BasicProgram } from './basic-ui';
import {VOTING_PROGRAM_ID} from "@project/anchor";

export default function BasicFeature() {
  const { publicKey } = useWallet();
  const { VOTING_PROGRAM_ID } = useBasicProgram();

  return publicKey ? (
    <div>
      <AppHero
        title="Basic"
        subtitle={'Run the program by clicking the "Run program" button.'}
      >
        <p className="mb-6">
          <ExplorerLink
            path={`account/${VOTING_PROGRAM_ID}`}
            label={ellipsify(VOTING_PROGRAM_ID.toString())}
          />
        </p>
        <BasicCreate />
      </AppHero>
      <BasicProgram />
    </div>
  ) : (
    <div className="max-w-4xl mx-auto">
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <WalletButton className="btn btn-primary" />
        </div>
      </div>
    </div>
  );
}
