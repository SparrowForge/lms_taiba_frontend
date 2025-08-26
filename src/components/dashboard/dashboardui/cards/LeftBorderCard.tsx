import React from 'react';

interface LeftBorderCardProps {
    title: string;
    subTitle: string;
    number: string;
    icon: React.ReactNode;
    color: string;
    iconColor: string;
}

const LeftBorderCard: React.FC<LeftBorderCardProps> = ({ title, subTitle, number, icon, color,iconColor }) => {
    return (
        <div
            className="rounded-2xl p-6 shadow-md "
            style={{ borderLeft: `8px solid ${color}` }}
        >
            <div className="flex items-center justify-between gap-2">
                <div>
                    <h3 className="font-snormal text-[16px] text-gray-500">{title}</h3>
                    <div className="text-3xl font-bold">{number}</div>
                    <p  style={{
                        color: iconColor   }}>{subTitle}</p>
                </div>
                <div
                    style={{
                        color: iconColor,                 
                        fontSize: '30px',
                        backgroundColor: `${color}20`, 
                        padding: '10px',
                        borderRadius: '8px',
                    }}
                >
                    {icon}
                </div>


            </div>

        </div>
    );
};

export default LeftBorderCard;
