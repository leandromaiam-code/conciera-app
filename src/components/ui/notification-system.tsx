import { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  actions?: {
    label: string;
    onClick: () => void;
  }[];
}

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const colorMap = {
  success: 'text-esmeralda border-esmeralda/20 bg-esmeralda/5',
  error: 'text-erro border-erro/20 bg-erro/5',
  info: 'text-dourado border-dourado/20 bg-dourado/5',
  warning: 'text-orange-600 border-orange-200 bg-orange-50',
};

interface NotificationItemProps {
  notification: Notification;
  onDismiss: (id: string) => void;
}

const NotificationItem = ({ notification, onDismiss }: NotificationItemProps) => {
  const Icon = iconMap[notification.type];
  
  useEffect(() => {
    if (notification.duration) {
      const timer = setTimeout(() => {
        onDismiss(notification.id);
      }, notification.duration);
      
      return () => clearTimeout(timer);
    }
  }, [notification.id, notification.duration, onDismiss]);

  return (
    <div className={`
      border rounded-lg p-4 shadow-md bg-branco-puro
      animate-slide-in-right transition-elegant
      ${colorMap[notification.type]}
    `}>
      <div className="flex items-start gap-3">
        <Icon size={20} className="mt-0.5 flex-shrink-0" />
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-onyx">{notification.title}</h4>
          {notification.message && (
            <p className="text-xs text-grafite mt-1">{notification.message}</p>
          )}
          
          {notification.actions && (
            <div className="flex gap-2 mt-2">
              {notification.actions.map((action, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant="ghost"
                  onClick={action.onClick}
                  className="h-6 px-2 text-xs"
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDismiss(notification.id)}
          className="h-6 w-6 p-0 text-grafite hover:text-onyx"
        >
          <X size={14} />
        </Button>
      </div>
    </div>
  );
};

interface NotificationSystemProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

export const NotificationSystem = ({ notifications, onDismiss }: NotificationSystemProps) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-6 z-50 w-80 space-y-2">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
};