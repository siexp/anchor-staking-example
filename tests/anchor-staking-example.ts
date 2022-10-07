import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { AnchorStakingExample } from "../target/types/anchor_staking_example";
import { expect } from 'chai'

describe("anchor-staking-example", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.AnchorStakingExample as Program<AnchorStakingExample>;


  it('is initialized!', async () => {
    const stakingProgram = anchor.web3.Keypair.generate()
    const poolOwner = (program.provider as anchor.AnchorProvider).wallet
   
    const tx = await program.methods
      .initialize()
      .accounts({
        pool: stakingProgram.publicKey,
        authority: poolOwner.publicKey,
      })
      .signers([stakingProgram])
      .rpc()
 
    console.log(`tx ${tx}`)
 
    const state = await program.account.pool.fetch(stakingProgram.publicKey)
    console.log(`state ${JSON.stringify(state)}`)

    expect(state.authority.toString()).to.equal(poolOwner.publicKey.toString());
    expect(state.userCount).to.equal(0);
  })
});
