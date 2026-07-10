import '@/components/home/style/onlineServicePromoSection.scss';
import { Button } from '@mui/material';

const OnlineServicePromoSection = () => {
  return (
    <section className="online-service-promo">
      <div className="online-service-promo__inner">
        <h2 className="online-service-promo__title">아틀라스 항공의 새로워진 온라인 서비스를 한눈에</h2>
        <Button className="online-service-promo__cta" variant="outlined">
          신규 서비스 보러가기
        </Button>
      </div>
    </section>
  );
};

export default OnlineServicePromoSection;
