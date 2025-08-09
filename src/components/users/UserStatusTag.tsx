import {Tag} from 'antd';
import React from 'react';

interface UserStatusTagProps {
  status: string;
}

const UserStatusTag: React.FC<UserStatusTagProps> = ({ status }) => {
  const getColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'inactive':
        return 'red';
      case 'pending':
        return 'orange';
      default:
        return 'default';
    }
  };

  return <Tag color={getColor(status)}>{status}</Tag>;
};

export default UserStatusTag;
