'use client';

import React from 'react';
import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { useLocalization } from '@/hooks/useLocalization';
import { DownloadOutlined, EyeOutlined, FilePdfOutlined, FileTextOutlined } from '@ant-design/icons';
import { Card } from 'antd';

type DocumentType = "pdf" | "summary" | "other";

type Document = {
    id: string;
    title: string;
    date: string;
    type?: DocumentType;
    icon?: React.ReactNode;
};

const documentsData: Document[] = [
    {
        id: 'd1',
        title: 'Term 1 Report Card',
        date: 'Jun 30, 2023',
        type: "pdf",
        icon: <FilePdfOutlined />,
    },
    {
        id: 'd2',
        title: 'Academic Progress Summary',
        date: 'May 15, 2023',
        type: "summary",
        icon: <FileTextOutlined />,
    },
    {
        id: 'd3',
        title: 'Standardized Test Results',
        date: 'Apr 20, 2023',
        type: "pdf",
        icon: <FilePdfOutlined />,
    },
];

// Icon colors based on type
const typeColors: Record<DocumentType, { bg: string; text: string }> = {
    pdf: { bg: 'bg-red-100', text: 'text-red-600' },
    summary: { bg: 'bg-green-100', text: 'text-green-600' },
    other: { bg: 'bg-gray-100', text: 'text-gray-600' },
};

const ReportsDocuments = () => {
    const { t } = useLocalization();

    return (
        <Card className="bg-white shadow rounded-lg p-4 md:col-span-1" style={{marginTop:"10px"}}>
            <h3 className="font-bold text-xl mb-3">
                {t(LOCALE_KEYS.REPORTS_DOCUMENTS)}
            </h3>
            <ul className="text-sm space-y-2">
                {documentsData.map((doc) => {
                    const colors = doc.type ? typeColors[doc.type] : typeColors.other;

                    return (
                        <li
                            key={doc.id}
                            className="p-2 shadow rounded-md flex justify-between items-center gap-2"
                        >
                            <div className={`flex items-center justify-center w-7 h-7 rounded p-2 ${colors.bg} ${colors.text}`}>
                                {doc.icon || <span className="w-5" />}
                            </div>
                            <span>{`${doc.title} (${doc.date})`}</span>
                            <DownloadOutlined className="text-blue-600" />
                        </li>
                    );
                })}
            </ul>
            <button className="w-full mt-3 text-blue-600 text-sm border rounded-md p-2" style={{ color: "#1f4bca" }}>
                <EyeOutlined />   {t(LOCALE_KEYS.VIEW_ALL_DOCUMENTS)}
            </button>
        </Card>
    );
};

export default ReportsDocuments;
