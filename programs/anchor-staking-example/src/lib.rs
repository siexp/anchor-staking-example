use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod anchor_staking_example {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        ctx.accounts.pool.authority = ctx.accounts.authority.key();
        ctx.accounts.pool.user_count = 0u32;
        Ok(())
    }

    pub fn create_user(ctx: Context<CreateUser>) -> Result<()> {
        let user = &mut ctx.accounts.user;
        user.stake = 0u64;
        user.bump = *ctx.bumps.get("user").unwrap();
 
        ctx.accounts.pool.user_count = ctx.accounts.pool.user_count + 1;
        Ok(())
    }
}

pub const POOL_STORAGE_TOTAL_BYTES: usize = 32 + 4;
 
#[account]
pub struct Pool {
    pub authority: Pubkey,
    pub user_count: u32,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = authority, space = 8 + POOL_STORAGE_TOTAL_BYTES)]
    pub pool: Account<'info, Pool>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>
}

pub const USER_STORAGE_TOTAL_BYTES: usize = 1 + 8;
 
#[account]
pub struct User {
    bump: u8,
    stake: u64,
}
 
#[derive(Accounts)]
pub struct CreateUser<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + USER_STORAGE_TOTAL_BYTES,
        seeds = [b"user", authority.key().as_ref()],
        bump
    )]
    pub user: Account<'info, User>,
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(mut)]
    pub pool: Account<'info, Pool>,
    pub system_program: Program<'info, System>,
}