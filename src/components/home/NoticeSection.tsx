import '@/components/home/style/noticeSection.scss';
import { Link } from '@mui/material';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';

const NOTICES = [
  { title: '인천-두바이 왕복 노선 비정상 운항', date: '2026년 05월 08일' },
  { title: '신규 애니웨어 패스 제휴 (경주월드 캘리포니아비치)', date: '2026년 07월 09일' },
  { title: '기내 와이파이 시스템 개선 및 교체', date: '2026년 07월 08일' },
  { title: '신규 애니웨어 패스 제휴 (명보아트홀 공연 「점프」)', date: '2026년 07월 08일' },
];

const NoticeSection = () => {
  return (
    <section className="notice-section">
      <div className="notice-section__inner">
        <div className="notice-section__list-col">
          <div className="notice-section__header">
            <h2 className="notice-section__heading">알려드립니다</h2>
            <Link
              className="notice-section__more"
              href="#"
              underline="hover"
              onClick={(e) => e.preventDefault()}
            >
              목록보기
            </Link>
          </div>

          <ul className="notice-section__list">
            {NOTICES.map((notice) => (
              <li className="notice-section__item" key={notice.title}>
                <span className="notice-section__item-title">{notice.title}</span>
                <span className="notice-section__item-date">{notice.date}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="notice-section__app-card">
          <div className="notice-section__app-icon">
            <PhoneIphoneIcon />
          </div>
          <p className="notice-section__app-title">Atlas Flight My 앱</p>
          <p className="notice-section__app-subtitle">내 손안의 여행 큐레이터</p>
        </div>
      </div>
    </section>
  );
};

export default NoticeSection;
