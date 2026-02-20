'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { currencyService } from '@/services/currencyService';
import { ICurrency, IExchangeRateCreate } from '@/types/currency';
import { SaveOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  DatePicker,
  InputNumber,
  message,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

const { Text } = Typography;

export default function ExchangeRatePage() {
  const t = useTranslations();
  const [currencies, setCurrencies] = useState<ICurrency[]>([]);
  const [rates, setRates] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [defaultCurrency, setDefaultCurrency] = useState<ICurrency | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize);
  }, [selectedDate]);

  const fetchData = async (page: number, limit: number) => {
    setLoading(true);
    try {
      // 1. Fetch Currencies (Paginated)
      const currencyRes = await currencyService.getCurrencies({ page, limit });
      const currenciesData = currencyRes.data.items;
      setCurrencies(currenciesData);
      setPagination({
        current: currencyRes.data.meta.page,
        pageSize: currencyRes.data.meta.limit,
        total: currencyRes.data.meta.total,
      });

      const defaultCurr = currenciesData.find((c) => c.isDefault);
      setDefaultCurrency(defaultCurr || null);

      // 2. Fetch Rates (We need rates for the *displayed* currencies)
      // Since our API currently paginates rates independently, we have a challenge matching them 1:1 if we paginate both differently.
      // However, usually we want to see the rates for the currencies we are editing.
      // For now, let's fetch a larger set of rates to ensure we cover them, OR we can rely on the user to populate them.
      // Ideally backend would support "get rates for these currency IDs".
      // As a workaround to satisfy "use paginate", we request rates.
      // We'll fetch a reasonable amount to cover displayed items.
      const dateStr = selectedDate.format('YYYY-MM-DD');
      const ratesRes = await currencyService.getExchangeRates(dateStr, { page: 1, limit: 100 });
      const ratesData = ratesRes.data.items;

      const ratesMap: Record<number, number> = {};
      ratesData.forEach((r) => {
        ratesMap[r.currency.id] = r.rate;
      });
      setRates(ratesMap);
    } catch (error) {
      console.error(error);
      message.error(t(LOCALE_KEYS.FAILED_NAME, { name: t(LOCALE_KEYS.EXCHANGE_RATES) }));
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (newPagination: any) => {
    fetchData(newPagination.current, newPagination.pageSize);
  };

  const handleRateChange = (currencyId: number, value: number | null) => {
    if (value !== null) {
      setRates((prev) => ({ ...prev, [currencyId]: value }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const dateStr = selectedDate.format('YYYY-MM-DD');
      const ratesToSave: IExchangeRateCreate[] = Object.entries(rates).map(
        ([currencyId, rate]) => ({
          currencyId: Number(currencyId),
          rate,
          date: dateStr,
        }),
      );

      await currencyService.saveExchangeRates(ratesToSave);
      message.success(t(LOCALE_KEYS.RATES_UPDATED_SUCCESSFULLY));
      fetchData(pagination.current, pagination.pageSize); // Refresh data
    } catch (error) {
      console.error(error);
      message.error(t(LOCALE_KEYS.FAILED_SAVE_RATES));
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      title: t(LOCALE_KEYS.CURRENCY),
      dataIndex: 'code',
      key: 'code',
      render: (_: any, record: ICurrency) => (
        <Space>
          <Text strong>{record.code}</Text>
          <Text type="secondary">({record.name})</Text>
          {record.isDefault && <Tag color="blue">{t(LOCALE_KEYS.DEFAULT)}</Tag>}
        </Space>
      ),
    },
    {
      title: `${t(LOCALE_KEYS.RATE)} (1 ${defaultCurrency?.code || 'Default'} = ? ${t(LOCALE_KEYS.CURRENCY)})`,
      key: 'rate',
      render: (_: any, record: ICurrency) => {
        // If it's default currency, show 1 and disabled
        if (record.isDefault) {
          return <InputNumber style={{ width: '100%' }} value={1} disabled />;
        }
        return (
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            step={0.0001}
            precision={4}
            value={rates[record.id]}
            onChange={(value) => handleRateChange(record.id, value)}
            placeholder={t(LOCALE_KEYS.ENTER_RATE)}
          />
        );
      },
    },
  ];

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="p-6">
          <Card
            title={t(LOCALE_KEYS.EXCHANGE_RATES)}
            extra={
              <Space>
                <DatePicker
                  value={selectedDate}
                  onChange={(date) => date && setSelectedDate(date)}
                  allowClear={false}
                />
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={handleSave}
                  loading={saving}
                >
                  {t(LOCALE_KEYS.SAVE)}
                </Button>
              </Space>
            }
          >
            <Table
              columns={columns}
              dataSource={currencies}
              rowKey="id"
              loading={loading}
              pagination={pagination}
              onChange={handleTableChange}
            />
          </Card>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
