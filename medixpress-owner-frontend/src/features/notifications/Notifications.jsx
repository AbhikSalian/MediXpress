import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Chip,
  Alert,
  Snackbar,
  Divider,
} from '@mui/material'
import {
  Notifications as NotificationsIcon,
  ShoppingCart,
  Warning,
  CheckCircle,
  MarkEmailRead,
  ClearAll,
  Circle,
} from '@mui/icons-material'
import { notificationService } from '../../services/notificationService'
import { formatDateTime, getRelativeTime } from '../../utils/helpers'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'

const Notifications = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    try {
      const data = await notificationService.getNotifications()
      setNotifications(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to load notifications',
        severity: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId)
      setSnackbar({
        open: true,
        message: 'Notification marked as read',
        severity: 'success'
      })
      loadNotifications()
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to update notification',
        severity: 'error'
      })
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead()
      setSnackbar({
        open: true,
        message: 'All notifications marked as read',
        severity: 'success'
      })
      loadNotifications()
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to update notifications',
        severity: 'error'
      })
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order':
        return <ShoppingCart color="primary" />
      case 'stock':
        return <Warning color="warning" />
      case 'system':
        return <CheckCircle color="success" />
      default:
        return <NotificationsIcon />
    }
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case 'order':
        return 'primary'
      case 'stock':
        return 'warning'
      case 'system':
        return 'success'
      default:
        return 'default'
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading notifications..." />
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <NotificationsIcon />
            Notifications
            {unreadCount > 0 && (
              <Chip
                label={`${unreadCount} unread`}
                color="error"
                size="small"
                sx={{ ml: 1 }}
              />
            )}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Stay updated with important alerts and updates
          </Typography>
        </Box>
        {unreadCount > 0 && (
          <Button
            variant="outlined"
            startIcon={<ClearAll />}
            onClick={handleMarkAllAsRead}
          >
            Mark All as Read
          </Button>
        )}
      </Box>

      {notifications.length > 0 ? (
        <Card>
          <List>
            {notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    backgroundColor: notification.read ? 'inherit' : 'action.hover',
                    borderLeft: notification.read ? 'none' : `4px solid ${
                      getNotificationColor(notification.type) === 'primary' ? '#2196F3' :
                      getNotificationColor(notification.type) === 'warning' ? '#ff9800' :
                      getNotificationColor(notification.type) === 'success' ? '#4caf50' : '#666'
                    }`
                  }}
                >
                  <ListItemIcon sx={{ mt: 1 }}>
                    {getNotificationIcon(notification.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1" fontWeight={notification.read ? 'normal' : 'bold'}>
                          {notification.title}
                        </Typography>
                        {!notification.read && (
                          <Circle sx={{ fontSize: 8, color: 'primary.main' }} />
                        )}
                        <Chip
                          label={notification.type}
                          color={getNotificationColor(notification.type)}
                          size="small"
                          variant="outlined"
                          sx={{ ml: 'auto' }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {getRelativeTime(notification.createdAt)}
                          {' • '}
                          {formatDateTime(notification.createdAt)}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    {!notification.read && (
                      <IconButton
                        edge="end"
                        aria-label="mark as read"
                        onClick={() => handleMarkAsRead(notification.id)}
                        color="primary"
                      >
                        <MarkEmailRead />
                      </IconButton>
                    )}
                  </ListItemSecondaryAction>
                </ListItem>
                {index < notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Card>
      ) : (
        <EmptyState
          icon={NotificationsIcon}
          title="No notifications"
          description="You're all caught up! Notifications about orders, stock alerts, and important updates will appear here."
        />
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Notifications