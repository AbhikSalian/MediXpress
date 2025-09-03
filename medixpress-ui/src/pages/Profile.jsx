import React, { useEffect, useState } from 'react';
import { 
  Container, Typography, Button, Grid, Paper, Avatar, TextField, Dialog, DialogTitle, DialogContent, DialogActions 
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [openEdit, setOpenEdit] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);
  const [editData, setEditData] = useState(null);
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '' });

  const storedUser = sessionStorage.getItem('user')
    ? JSON.parse(sessionStorage.getItem('user'))
    : null;

  const displayUser = storedUser || user || {
    customerID: "N/A",
    customerName: "Demo User",
    email: "demo@medixpress.com",
    phone: "0000000000",
    pincode: "000000",
    address: "Unknown",
    createdAt: new Date().toISOString()
  };

  useEffect(() => {
    if (!storedUser && !user) {
      navigate('/');
    }
  }, [storedUser, user, navigate]);

  const handleEditOpen = () => {
    setEditData(displayUser);
    setOpenEdit(true);
  };

  const handleEditSave = async () => {
    try {
      const payload = {
        customerId: displayUser.customerID,
        pinCode: editData.pincode,
        address: editData.address,
      };

      const res = await fetch("https://localhost:8010/api/Customer/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to update customer");
      }

      // Update locally
      const updatedUser = {
        ...displayUser,
        pincode: editData.pincode,
        address: editData.address,
      };

      sessionStorage.setItem('user', JSON.stringify(updatedUser));
      login(updatedUser);
      setOpenEdit(false);
    } catch (err) {
      console.error("Edit failed", err);
    }
  };

  const handlePasswordSave = async () => {
    try {
      const payload = {
        customerID: displayUser.customerID,
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      };

      const res = await fetch("https://localhost:8010/api/Customer/update-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to update password");
      }

      setOpenPassword(false);
      setPasswordData({ oldPassword: '', newPassword: '' });
      alert("Password updated successfully!");
    } catch (err) {
      console.error("Password update failed", err);
      alert("Failed to update password. Check old password.");
    }
  };

  return (
    <Container
      maxWidth={false}
      disableGutters={false}
      sx={{
        pl: { xs: 2, md: 5 },  // left padding
        pr: { xs: 2, md: 5 },  // right padding
        pt: 3,                 // top padding
        pb: 3,                 // bottom padding if needed
      }}
    >
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={3} sx={{ textAlign: 'center' }}>
            <Avatar sx={{ width: 100, height: 100, bgcolor: 'primary.main', fontSize: 40 }}>
              {displayUser.customerName?.charAt(0) || 'U'}
            </Avatar>
            <Typography variant="h6" sx={{ mt: 2 }}>{displayUser.customerName}</Typography>
            <Typography variant="body2" color="text.secondary">{displayUser.email}</Typography>
          </Grid>
          <Grid item xs={12} sm={9}>
            <Typography variant="subtitle1"><b>Customer ID:</b> {displayUser.customerID}</Typography>
            <Typography variant="subtitle1"><b>Phone:</b> {displayUser.phone}</Typography>
            <Typography variant="subtitle1"><b>Pincode:</b> {displayUser.pincode}</Typography>
            <Typography variant="subtitle1"><b>Address:</b> {displayUser.address}</Typography>
            <Typography variant="subtitle1"><b>Joined:</b> {new Date(displayUser.createdAt).toLocaleString()}</Typography>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 4 }}>
          <Grid item>
            <Button variant="contained" color="primary" onClick={handleEditOpen}>
              Edit Profile
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="secondary" onClick={() => setOpenPassword(true)}>
              Update Password
            </Button>
          </Grid>
          <Grid item>
            {(storedUser || user) && (
              <Button variant="contained" color="error" onClick={logout}>
                Logout
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* Edit Profile Dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Pincode"
            fullWidth
            value={editData?.pincode || ''}
            onChange={(e) => setEditData({ ...editData, pincode: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Address"
            fullWidth
            value={editData?.address || ''}
            onChange={(e) => setEditData({ ...editData, address: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Update Password Dialog */}
      <Dialog open={openPassword} onClose={() => setOpenPassword(false)}>
        <DialogTitle>Update Password</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Old Password"
            type="password"
            fullWidth
            value={passwordData.oldPassword}
            onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
          />
          <TextField
            margin="dense"
            label="New Password"
            type="password"
            fullWidth
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPassword(false)}>Cancel</Button>
          <Button onClick={handlePasswordSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
