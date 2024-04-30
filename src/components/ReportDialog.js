import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

function ReportDialog({ open, onClose, report }) {
   console.log('Report in dialog',report);
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Event Report</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          Report Date: {new Date(report.reportDate).toLocaleString()}
        </Typography>
        <Typography variant="body1">
          Total Sales: {report.totalSales}
        </Typography>
        <Typography variant="body1">
          Total Revenue: {report.totalRevenue}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ReportDialog;