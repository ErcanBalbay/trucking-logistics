import clsx from 'clsx';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const statusColors: Record<string, string> = {
  // Truck statuses
  active: 'bg-green-100 text-green-800',
  in_maintenance: 'bg-yellow-100 text-yellow-800',
  out_of_service: 'bg-red-100 text-red-800',
  available: 'bg-blue-100 text-blue-800',
  // Driver statuses
  on_duty: 'bg-indigo-100 text-indigo-800',
  driving: 'bg-green-100 text-green-800',
  off_duty: 'bg-gray-100 text-gray-800',
  on_break: 'bg-purple-100 text-purple-800',
  // Load statuses
  pending: 'bg-yellow-100 text-yellow-800',
  assigned: 'bg-blue-100 text-blue-800',
  picked_up: 'bg-indigo-100 text-indigo-800',
  in_transit: 'bg-cyan-100 text-cyan-800',
  delivered: 'bg-green-100 text-green-800',
  canceled: 'bg-red-100 text-red-800',
  // Invoice statuses
  draft: 'bg-gray-100 text-gray-800',
  sent: 'bg-blue-100 text-blue-800',
  paid: 'bg-green-100 text-green-800',
  overdue: 'bg-red-100 text-red-800',
};

const statusLabels: Record<string, string> = {
  active: 'Active',
  in_maintenance: 'In Maintenance',
  out_of_service: 'Out of Service',
  available: 'Available',
  on_duty: 'On Duty',
  driving: 'Driving',
  off_duty: 'Off Duty',
  on_break: 'On Break',
  pending: 'Pending',
  assigned: 'Assigned',
  picked_up: 'Picked Up',
  in_transit: 'In Transit',
  delivered: 'Delivered',
  canceled: 'Canceled',
  draft: 'Draft',
  sent: 'Sent',
  paid: 'Paid',
  overdue: 'Overdue',
};

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium rounded-full',
        statusColors[status] || 'bg-gray-100 text-gray-800',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      )}
    >
      {statusLabels[status] || status}
    </span>
  );
}