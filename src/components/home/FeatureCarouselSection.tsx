import '@/components/home/style/featureCarouselSection.scss';
import { useState } from 'react';
import { IconButton } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

const CARDS = [
  {
    icon: <SmartToyIcon />,
    title: '여행의 모든 물음표를 느낌표로!',
    subtitle: 'Atlas Flight AI 챗봇 서비스 출시',
  },
  {
    icon: <ConfirmationNumberIcon />,
    title: '1천원당 최대 5마일 적립에',
    subtitle: '항공권 최대 20만원 할인까지',
  },
  {
    icon: <CardGiftcardIcon />,
    title: 'Atlas Flight 기프트카드로',
    subtitle: '여행을 선물하세요',
  },
  {
    icon: <EventAvailableIcon />,
    title: '특가 항공권을 놓치지 마세요',
    subtitle: '실시간 특가 알림 신청하기',
  },
];

const VISIBLE_COUNT = 3;

const FeatureCarouselSection = () => {
  const [startIndex, setStartIndex] = useState(0);

  const visibleCards = Array.from({ length: VISIBLE_COUNT }, (_, offset) => {
    const card = CARDS[(startIndex + offset) % CARDS.length];
    return { ...card, key: (startIndex + offset) % CARDS.length };
  });

  const handleNext = () => {
    setStartIndex((prev) => (prev + 1) % CARDS.length);
  };

  return (
    <section className="feature-carousel-section">
      <div className="feature-carousel-section__inner">
        <div className="feature-carousel-section__track">
          {visibleCards.map((card) => (
            <div className="feature-carousel-section__card" key={card.key}>
              <div className="feature-carousel-section__thumb">{card.icon}</div>
              <p className="feature-carousel-section__title">{card.title}</p>
              <p className="feature-carousel-section__subtitle">{card.subtitle}</p>
            </div>
          ))}
        </div>

        <IconButton
          className="feature-carousel-section__next"
          aria-label="다음 소식 보기"
          onClick={handleNext}
        >
          <ChevronRightIcon />
        </IconButton>
      </div>
    </section>
  );
};

export default FeatureCarouselSection;
