import db from "../utils/db";

export const getAccount = async (accountID: string) => {
  const acct = await db.oneOrNone(`
    SELECT account_number, name, amount, type, credit_limit 
    FROM accounts 
    WHERE account_number = $1`,
    [accountID]
  );

  if (!acct) {
    throw new Error("Account not found");
  }

  return acct;
};

export const getWithdrawalsToday = async (accountID: string) => {
  try {
    const withdrawals = await db.any(`
      SELECT amount 
      FROM transactions 
      WHERE account_number = $1 
      AND type = 'withdrawal' 
      AND date = CURRENT_DATE`, 
      [accountID]
    );

    return withdrawals;
  } catch (err) {
    console.error("Error fetching withdrawals: ", err);
    throw err;
  }
};
