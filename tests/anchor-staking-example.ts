import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { AnchorStakingExample } from "../target/types/anchor_staking_example";

describe("anchor-staking-example", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.AnchorStakingExample as Program<AnchorStakingExample>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
