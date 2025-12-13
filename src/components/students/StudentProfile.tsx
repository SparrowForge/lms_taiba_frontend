import { Card } from 'antd'
import React from 'react'

import { LOCALE_KEYS } from '@/constants/localizationKeys'

import { useLocalization } from '@/hooks/useLocalization';

const StudentProfile = ({ config }) => {
    const { t } = useLocalization();
    return (
        <Card title={`${config.name} ${t(LOCALE_KEYS.INFORMATION)}`}>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                        {config.fields.map((field, index) => (
                            <tr
                                key={field.key}
                                style={{
                                    borderBottom:
                                        index < config.fields.length - 1 ? '1px solid #f0f0f0' : 'none',
                                }}
                            >
                                <td
                                    style={{
                                        padding: '12px 16px',
                                        fontWeight: '600',
                                        // backgroundColor: '#fafafa',
                                        width: '30%',
                                        verticalAlign: 'top',
                                    }}
                                >
                                    {field.label}
                                </td>
                                <td
                                    style={{
                                        padding: '12px 16px',
                                        verticalAlign: 'top',
                                    }}
                                >
                                    {field.render
                                        ? field.render((config.item as any)[field.key], config.item!)
                                        : (config.item as any)[field.key]}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>

    )
}

export default StudentProfile
