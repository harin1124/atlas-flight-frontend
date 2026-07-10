import '@/components/home/style/quickLinksSection.scss';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import HotelIcon from '@mui/icons-material/Hotel';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';

const QUICK_LINKS = [
  { icon: <CardGiftcardIcon />, label: '이벤트' },
  { icon: <CreditCardIcon />, label: 'Atlas 항공카드' },
  { icon: <CardMembershipIcon />, label: '기프트카드' },
  { icon: <HotelIcon />, label: '호텔' },
  { icon: <DirectionsCarIcon />, label: '렌터카' },
  { icon: <ShoppingBagIcon />, label: '기내 면세점' },
  { icon: <HealthAndSafetyIcon />, label: '여행자 보험' },
  { icon: <TravelExploreIcon />, label: '여행 상품' },
];

const QuickLinksSection = () => {
  return (
    <section className="quick-links-section">
      <div className="quick-links-section__inner">
        <h2 className="quick-links-section__heading">여행의 완성을 위한 경험</h2>

        <div className="quick-links-section__grid">
          {QUICK_LINKS.map((link) => (
            <button type="button" className="quick-links-section__item" key={link.label}>
              <span className="quick-links-section__icon">{link.icon}</span>
              <span className="quick-links-section__label">{link.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickLinksSection;
