'use client';
import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { useLocalization } from '@/hooks/useLocalization';
import { Card, Image, Carousel } from 'antd';
import React from 'react';

const parentsData = [
  { id: 'p1', name: 'Ahmed Mohammed', grade: 'Grade 11', img: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png' },
  { id: 'p2', name: 'Sara Ali', grade: 'Grade 10', img: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png' },
  { id: 'p3', name: 'Omar Khan', grade: 'Grade 12', img: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png' },
  { id: 'p4', name: 'Laila Hassan', grade: 'Grade 9', img: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png' },
];

const ParentsSection = () => {
  const { t } = useLocalization();

  return (
    <Card className="rounded-lg p-6" style={{marginTop:"20px"}}>
      <h3 className="font-bold text-xl mb-4">{t(LOCALE_KEYS.PARENTS_VIEW)}</h3>
      
      <Carousel
        dots={false}
        slidesToShow={1.5} 
        slidesToScroll={1}
        infinite
        autoplay

      >
        {parentsData.map((parent) => (
          <div key={parent.id} className="p-2">
            <div className="shadow p-2 rounded flex items-center gap-3 bg-white">
              <Image
                width={60}
                src={parent.img}
                className="rounded-full"
              />
              <div>
                <p className="font-semibold">{parent.name.slice(0,8)}</p>
                <p className="text-xs text-gray-500">{parent.grade}</p>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </Card>
  );
};

export default ParentsSection;
