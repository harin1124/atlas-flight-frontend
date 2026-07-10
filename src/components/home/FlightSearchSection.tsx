import '@/components/home/style/flightSearchSection.scss';
import { useState, type CSSProperties } from 'react';
import { Button, Checkbox, FormControlLabel, IconButton, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import FlightIcon from '@mui/icons-material/Flight';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { atlasColors } from '@/theme/colors';

type TripType = 'round' | 'oneway' | 'multi';
type BookingMode = 'booking' | 'mileage';

const TABS = [
  { label: '항공권 예매', icon: <FlightIcon fontSize="small" /> },
  { label: '나의 여행', icon: <PersonOutlineIcon fontSize="small" /> },
  { label: '체크인', icon: <HowToRegIcon fontSize="small" /> },
  { label: '출도착/스케줄', icon: <AccessTimeIcon fontSize="small" /> },
];

const searchStyle = {
  '--flight-search-brand': atlasColors.brand.navy,
  '--flight-search-border': atlasColors.border.default,
  '--flight-search-muted': atlasColors.text.muted,
  '--flight-search-subtle-bg': atlasColors.background.subtle,
} as CSSProperties;

const FlightSearchSection = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [bookingMode, setBookingMode] = useState<BookingMode>('booking');
  const [tripType, setTripType] = useState<TripType>('round');
  const [nearbyDates, setNearbyDates] = useState(false);

  return (
    <div className="flight-search-section" style={searchStyle}>
      <div className="flight-search-section__inner">
        <div className="flight-search-section__tabs" role="tablist">
          {TABS.map((tab, index) => (
            <button
              key={tab.label}
              type="button"
              role="tab"
              aria-selected={activeTab === index}
              className={`flight-search-section__tab${
                activeTab === index ? ' flight-search-section__tab--active' : ''
              }`}
              onClick={() => setActiveTab(index)}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flight-search-section__panel">
          {activeTab === 0 ? (
            <>
              <div className="flight-search-section__row flight-search-section__row--options">
                <ToggleButtonGroup
                  className="flight-search-section__mode"
                  exclusive
                  size="small"
                  value={bookingMode}
                  onChange={(_, value: BookingMode | null) => value && setBookingMode(value)}
                >
                  <ToggleButton value="booking">예매</ToggleButton>
                  <ToggleButton value="mileage">마일리지 예매</ToggleButton>
                </ToggleButtonGroup>

                <ToggleButtonGroup
                  className="flight-search-section__trip-type"
                  exclusive
                  size="small"
                  value={tripType}
                  onChange={(_, value: TripType | null) => value && setTripType(value)}
                >
                  <ToggleButton value="round">왕복</ToggleButton>
                  <ToggleButton value="oneway">편도</ToggleButton>
                  <ToggleButton value="multi">다구간</ToggleButton>
                </ToggleButtonGroup>
                <Tooltip title="여정 유형을 선택하세요">
                  <HelpOutlineIcon fontSize="small" className="flight-search-section__help" />
                </Tooltip>

                <FormControlLabel
                  className="flight-search-section__nearby"
                  control={
                    <Checkbox
                      size="small"
                      checked={nearbyDates}
                      onChange={(e) => setNearbyDates(e.target.checked)}
                    />
                  }
                  label="가까운 날짜 함께 조회"
                />
              </div>

              <div className="flight-search-section__row flight-search-section__row--search">
                <div className="flight-search-section__field flight-search-section__field--origin">
                  <span className="flight-search-section__field-label">서울/모든 공항</span>
                  <span className="flight-search-section__field-value">SEL</span>
                </div>

                <IconButton
                  className="flight-search-section__swap"
                  aria-label="출발지/도착지 교체"
                  size="small"
                >
                  <SwapHorizIcon fontSize="small" />
                </IconButton>

                <div className="flight-search-section__field flight-search-section__field--destination">
                  <span className="flight-search-section__field-label">도착지</span>
                  <span className="flight-search-section__field-value flight-search-section__field-value--placeholder">
                    To
                  </span>
                </div>

                <div className="flight-search-section__field flight-search-section__field--date">
                  <span className="flight-search-section__field-label">
                    <CalendarTodayIcon fontSize="inherit" /> 출발일
                  </span>
                  <span className="flight-search-section__field-value flight-search-section__field-value--placeholder">
                    가는 날 ~ 오는 날
                  </span>
                </div>

                <div className="flight-search-section__field flight-search-section__field--passenger">
                  <span className="flight-search-section__field-label">탑승객</span>
                  <span className="flight-search-section__field-value">성인 1 · 소아 0 · 유아 0</span>
                </div>

                <div className="flight-search-section__field flight-search-section__field--cabin">
                  <span className="flight-search-section__field-label">좌석 등급</span>
                  <span className="flight-search-section__field-value flight-search-section__field-value--placeholder">
                    선택하세요
                  </span>
                </div>

                <Button className="flight-search-section__submit" variant="contained" disableElevation>
                  항공편 검색
                </Button>
              </div>
            </>
          ) : (
            <div className="flight-search-section__placeholder">준비 중인 서비스입니다.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlightSearchSection;
