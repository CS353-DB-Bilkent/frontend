import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';
import { getMyTransactions } from '../services/lib/wallet';
import TRANSACTION_TYPE from '../constants/transactionType';
import { getEventById } from '../services/lib/event';

const MyTransactions = ({ user }) => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (user) {
      getMyTransactions()
        .then(async (response) => {
          console.log('Transaction data:', response.data.data);  // Debug: Check the raw transaction data structure
          const enrichedTransactions = await Promise.all(response.data.data.map(async (transaction) => {
            if (transaction.transactionType === TRANSACTION_TYPE.EVENT_BUY || transaction.transactionType === TRANSACTION_TYPE.EVENT_REFUND) {
              try {
                const eventDetails = await getEventById(transaction.eventId);
                console.log('Event details:', eventDetails.data); // Debug: Verify fetched event data structure
                return {...transaction, eventTitle: eventDetails.data.name};
              } catch (error) {
                console.error(`Failed to fetch title for event ID: ${transaction.eventId}`, error);
                return {...transaction, eventTitle: 'Event details not found'};
              }
            } else {
              return transaction;
            }
          }));

          console.log('Enriched Transactions:', enrichedTransactions); // Debug: Check the final list of transactions
          setTransactions(enrichedTransactions);
        })
        .catch(error => {
          console.error('Error fetching transactions:', error);
        });
    }
  }, [user]);


  // Function to get the transaction description based on its type
  const getTransactionDescription = (transaction) => {
    switch (transaction.transactionType) {
      case TRANSACTION_TYPE.DEPOSIT:
        return 'DEPOSIT | Money deposited to the Wallet';
      case TRANSACTION_TYPE.WITHDRAWAL:
        return 'WITHDRAW | Money withdrawn from the Wallet';
      case TRANSACTION_TYPE.EVENT_BUY:
        return `BUY | ${transaction.eventTitle} Ticket`;
      case TRANSACTION_TYPE.EVENT_REFUND:
        return `REFUND | ${transaction.eventTitle} Ticket`;
      default:
        return 'UNRECOGNIZED | Transaction';
    }
  };

  const formatAmount = (transaction) => {
    const { transactionType, transactionAmount } = transaction;
    switch (transactionType) {
      case TRANSACTION_TYPE.DEPOSIT:
      case TRANSACTION_TYPE.EVENT_REFUND:
        return `+${transactionAmount.toFixed(2)}`; // Assuming amount is a number
      case TRANSACTION_TYPE.EVENT_BUY:
      case TRANSACTION_TYPE.WITHDRAWAL:
        return `-${transactionAmount.toFixed(2)}`;
      default:
        return `${transactionAmount.toFixed(2)}`;  // No sign for unrecognized types
    }
  };
  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        My Transactions
      </Typography>
      <Paper elevation={1} sx={{ maxHeight: '75vh', overflow: 'auto' }}>
        <List>
          {transactions.map((transaction, index) => (
            <React.Fragment key={transaction.id}>
              <ListItem>
                <ListItemText
                  primary={getTransactionDescription(transaction)}
                  primaryTypographyProps={{
                    style: { fontWeight: 'bold' }
                  }}
                  secondary={new Date(transaction.transactionDate).toLocaleDateString()}
                  secondaryTypographyProps={{
                    style: { color: '#555' }
                  }}
                />
                <Typography variant="body2" sx={{ textAlign: 'right', marginRight: 2 }}>
                  {formatAmount(transaction)} TL
                </Typography>
              </ListItem>
              {index < transactions.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default MyTransactions;
