import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { AnchorStakingExample } from "../target/types/anchor_staking_example";
import { expect } from 'chai'

describe("staking", async () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.AnchorStakingExample as Program<AnchorStakingExample>;
  const stakingProgram = anchor.web3.Keypair.generate()
  const poolOwner = (program.provider as anchor.AnchorProvider).wallet
 
  it('is initialized!', async () => {
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
    expect(state.totalStaked).to.equal(0);
  }),

  it('is user created!', async () => {
    const userAccount = provider.wallet
    const [userPDA, _] = await anchor.web3.PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode('user'),
        userAccount.publicKey.toBuffer(),
      ],
      program.programId
    )

    const tx = await program.methods
      .createUser()
      .accounts({
        user: userPDA,
        authority: userAccount.publicKey,
        pool: stakingProgram.publicKey,
      })
      .rpc()

    console.log(`tx ${tx}`)

    const state = await program.account.pool.fetch(stakingProgram.publicKey)
    console.log(`state ${JSON.stringify(state)}`)
    expect(state.userCount).to.equal(1)
 
    const user = await program.account.user.fetch(userPDA)
    console.log(`user ${JSON.stringify(user)}`)
    expect(user.stake.toNumber()).to.equal(0)
  })
});
