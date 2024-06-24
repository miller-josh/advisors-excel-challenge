import React, { useState } from "react"
import {account} from "../Types/Account"
import Paper from "@mui/material/Paper/Paper";
import { Alert, Button, Card, CardContent, Grid, TextField } from "@mui/material";
import { setEmitFlags } from "typescript";

type AccountDashboardProps = {
  account: account;
  signOut: () => Promise<void>;
}

export const AccountDashboard = (props: AccountDashboardProps) => {
  const [depositAmount, setDepositAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [account, setAccount] = useState(props.account); 
  const [depositLoading, setDepositLoading] = useState(false);
  const [depositError, setDepositError] = useState('');
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawError, setWithdrawError] = useState('');

  const {signOut} = props;

  const depositFunds = async () => {
    setDepositLoading(true);
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({amount: depositAmount})
    }
    const response = await fetch(`http://localhost:3000/transactions/${account.accountNumber}/deposit`, requestOptions);
    const data = await response.json();

    if (!response.ok) {
      if (data.error) {
        setDepositError(data.error);
      } else {
        setDepositError('An error occurred during the transaction.');
      }
    } else {
      setDepositError("");
      setAccount({
        accountNumber: data.account_number,
        name: data.name,
        amount: data.amount,
        type: data.type,
        creditLimit: data.credit_limit
      });
    }
    setDepositLoading(false);
  }

  const withdrawFunds = async () => {
    setWithdrawLoading(true);
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({amount: withdrawAmount})
    }
    const response = await fetch(`http://localhost:3000/transactions/${account.accountNumber}/withdraw`, requestOptions);
    const data = await response.json();

    if (!response.ok) {
      if (data.error) {
        setWithdrawError(data.error);
      } else {
        setWithdrawError('An error occurred during the transaction.');
      }
    } else {
      setWithdrawError("");
      setAccount({
        accountNumber: data.account_number,
        name: data.name,
        amount: data.amount,
        type: data.type,
        creditLimit: data.credit_limit
      });
    }

    setWithdrawLoading(false);
  }

  const handleDepositChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // disallow negative number:
    if (+e.target.value < 0) {
      e.target.value = '0';
    }
    setDepositAmount(+e.target.value);
  }

  const handleWithdrawChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // disallow negative number:
    if (+e.target.value < 0) {
      e.target.value = '0';
    }
    setWithdrawAmount(+e.target.value);
  }

  return (
    <Paper className="account-dashboard">
      <div className="dashboard-header">
        <h1>Hello, {account.name}!</h1>
        <Button variant="contained" onClick={signOut}>Sign Out</Button>
      </div>
      <h2>Balance: ${account.amount}</h2>
      <Grid container spacing={2} padding={2}>
        <Grid item xs={6}>
          <Card className="deposit-card">
            <CardContent>
              <h3>Deposit</h3>
              {depositError && (
                <Alert severity="error" sx={{ marginBottom: 2 }}>
                  {depositError}
                </Alert>
              )}
              <TextField 
                label="Deposit Amount" 
                variant="outlined" 
                type="number"
                InputProps={{
                  inputProps: { min: 0 }
                }}
                sx={{
                  display: 'flex',
                  margin: 'auto',
                }}
                onChange={handleDepositChange}
                disabled={depositLoading}
              />
              <Button 
                variant="contained" 
                sx={{
                  display: 'flex', 
                  margin: 'auto', 
                  marginTop: 2}}
                onClick={depositFunds}
              >
                {depositLoading ? "Loading..." : "Submit"}
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card className="withdraw-card">
            <CardContent>
              <h3>Withdraw</h3>
              {withdrawError && (
                <Alert severity="error" sx={{ marginBottom: 2 }}>
                  {withdrawError}
                </Alert>
              )}
              <TextField 
                label="Withdraw Amount" 
                variant="outlined" 
                type="number" 
                InputProps={{
                  inputProps: { min: 0 }
                }}
                sx={{
                  display: 'flex',
                  margin: 'auto',
                }}
                onChange={handleWithdrawChange}
                disabled={withdrawLoading}
              />
              <Button 
                variant="contained" 
                sx={{
                  display: 'flex', 
                  margin: 'auto', 
                  marginTop: 2
                }}
                onClick={withdrawFunds}
                >
                  {withdrawLoading ? "Loading..." : "Submit"}
                </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Paper>
    
  )
}