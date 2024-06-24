import db from '../utils/db';
import { getAccount, getWithdrawalsToday } from '../handlers/accountHandler';

export const withdrawal = async (accountID: string, amount: number) => {
  if (amount > 200) {
    throw new Error("Cannot withdraw more than $200 in a single transaction.");
  }

  if (amount % 5 !== 0) {
    throw new Error("Withdrawal amount must be in multiples of $5.");
  }

  const account = await getAccount(accountID);

  const withdrawalsToday = await getWithdrawalsToday(accountID);
  const totalWithdrawnToday = withdrawalsToday.reduce((total: number, withdrawal: { amount: number; }) => total + withdrawal.amount, 0);

  if (totalWithdrawnToday + amount > 400) {
    throw new Error("Cannot withdraw more than $400 in a single day.");
  }

  if (account.type === 'credit') {
    if (amount > account.creditLimit) {
      throw new Error("Cannot withdraw more than the credit limit.");
    }
  } else {
    if (amount > account.amount) {
      throw new Error("Cannot withdraw more than the available balance.");
    }
  }

  account.amount -= amount;

  try {
    // do account credit/debit and transaction in a single DB-TX:
    await db.tx(async t => {
      const res = await t.none(`
        UPDATE accounts
        SET amount = $1 
        WHERE account_number = $2`,
        [account.amount, accountID]
      );

      await t.none(`
        INSERT INTO transactions (account_number, type, amount, date)
        VALUES ($1, 'withdrawal', $2, CURRENT_DATE)`,
        [accountID, amount]
      );
    });
  } catch (err) {
    console.error("Transaction failed: ", err);
    throw new Error("Transaction failed: " + err);
  }

  return account;
};

export const deposit = async (accountID: string, amount: number) => {
  if (amount > 1000) {
    throw new Error("Cannot deposit more than $1000 in a single transaction.");
  }

  const account = await getAccount(accountID);

  if (account.type === 'credit') {
    if (account.amount + amount > 0) {
      throw new Error("Cannot deposit more than is needed to 0 out the credit account.");
    }
  }

  account.amount += amount;
  const res = await db.result(`
    UPDATE accounts
    SET amount = $1 
    WHERE account_number = $2`,
    [account.amount, accountID]
  );

  if (res.rowCount === 0) {
    throw new Error('Transaction failed');
  }

  return account;
}
