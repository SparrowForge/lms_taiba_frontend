import {Tag} from 'antd';

export default function StatusTag({ status }: { status: string }) {
  const getColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'inactive':
        return 'red';
      default:
        return 'default';
    }
  };
  return <Tag color={getColor(status)}>{status}</Tag>;
}
