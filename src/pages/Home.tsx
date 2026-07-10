import '@/pages/style/home.scss';
import AlertBanner from '@/components/home/AlertBanner';
import FlightSearchSection from '@/components/home/FlightSearchSection';
import OnlineServicePromoSection from '@/components/home/OnlineServicePromoSection';
import FeatureCarouselSection from '@/components/home/FeatureCarouselSection';
import NoticeSection from '@/components/home/NoticeSection';
import QuickLinksSection from '@/components/home/QuickLinksSection';

const Home = () => {
  return (
    <>
      <div className="home-page__hero">
        <AlertBanner />
        <FlightSearchSection />
      </div>
      <OnlineServicePromoSection />
      <FeatureCarouselSection />
      <NoticeSection />
      <QuickLinksSection />
    </>
  );
};

export default Home;
