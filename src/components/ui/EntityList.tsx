'use client';

import { FileExcelOutlined, SearchOutlined, UserAddOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Input, Pagination, Table, Typography } from 'antd';
import { TableProps } from 'antd/es/table';
import { useRouter, useSearchParams } from 'next/navigation';

import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { useLocalization } from '@/hooks/useLocalization';

const { Title } = Typography;
const { Search } = Input;

// Generic interface for entity configuration
export interface EntityConfig<T> {
  name: string;
  title: string;
  route: string;
  exportUrl?: string;
  columns: TableProps<T>['columns'];
  searchFields: (keyof T)[];
  onSearch?: (searchText: string) => void;
  onQuickAdd?: () => void;
  disableAddNew?: boolean;
  items: T[];
  itemsCount: number;
  loading: boolean;
  error: string | null | undefined;
  extraActions?: React.ReactNode[];
}

// Generic EntityList component
export const EntityList = <T extends { id: number }>({ config }: { config: EntityConfig<T> }) => {
  const { t } = useLocalization();
  const router = useRouter();
  const searchParams = useSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');
  const handleAddItem = () => {
    // if (config.onAdd) {
    //   config.onAdd()
    // } else {
    //   router.push(`${config.route}/create`)
    // }
    router.push(`${config.route}/create`);
  };

  const handleExport = () => {
    //download file from url
    const url = `${process.env.NEXT_PUBLIC_API_URL}${config.exportUrl}`;
    //download file from url
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.name}.xlsx`;
    a.click();
  };

  return (
    <div className="p-2 h-screen flex flex-col">
      <Card className="flex flex-col flex-1">
        {/* Fixed Top Section */}
        <div className="sticky top-0 z-10 pb-4 border-b mb-4 ">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            {/* Title */}
            <Title level={2} className="!mb-0">
              {config.title}
            </Title>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              {config.extraActions?.map((action, index) => (
                <div key={index}>{action}</div>
              ))}

              {!config.disableAddNew && (
                <Button
                  type="primary"
                  icon={<UserAddOutlined />}
                  onClick={handleAddItem}
                  className="bg-blue-500 border-blue-500 w-full sm:w-auto"
                >
                  {t(LOCALE_KEYS.ADD_NAME, { name: config.name })}
                </Button>
              )}

              {config.onQuickAdd && (
                <Button
                  type="primary"
                  icon={<UserAddOutlined />}
                  onClick={config.onQuickAdd}
                  style={{ backgroundColor: '#722ed1', borderColor: '#722ed1' }}
                >
                  {t(LOCALE_KEYS.QUICK_ADD_NAME, { name: config.name })}
                </Button>
              )}

              {config.exportUrl && (
                <Button
                  type="primary"
                  icon={<FileExcelOutlined />}
                  onClick={handleExport}
                  className="w-full sm:w-auto"
                >
                  {t(LOCALE_KEYS.EXPORT)}
                </Button>
              )}
            </div>
          </div>

          {config.error && (
            <Alert
              message={t(LOCALE_KEYS.ERROR)}
              description={config.error}
              type="error"
              showIcon
              className="mb-4"
            />
          )}

          {config.onSearch && (
            <Search
              placeholder={t(LOCALE_KEYS.SEARCH_NAME, {
                name: config.name,
                fields: config.searchFields.join(', '),
              })}
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={(value) => config.onSearch?.(value)}
              size="large"
              className="w-full md:max-w-md"
            />
          )}
        </div>

        {/* Scrollable Table Section */}
        <div className="flex-1 overflow-auto mb-4">
          <Table
            scroll={{ x: true, y: 'calc(100vh - 360px)' }}
            loading={config.loading}
            columns={config.columns}
            dataSource={config.items}
            rowKey="id"
            pagination={false}
            className="border border-gray-200 rounded-md"
          />
        </div>

        {/* Fixed Bottom Pagination */}
        <div className="sticky bottom-0 z-10 border-t py-3  flex justify-center">
          <Pagination
            current={skip ? parseInt(skip ?? '0') / parseInt(limit ?? '10') + 1 : 1}
            total={config.itemsCount ?? config.items.length}
            pageSize={parseInt(limit ?? '10')}
            showSizeChanger
            showQuickJumper
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} ${t(LOCALE_KEYS.OF)} ${total} ${config.name}`
            }
            onChange={(page, pageSize) => {
              router.push(`${config.route}?skip=${(page - 1) * pageSize}&limit=${pageSize}`);
            }}
          />
        </div>
      </Card>
    </div>

  );
};
