import dayjs, { Dayjs } from 'dayjs';
import dayjsIsoWeek from 'dayjs/plugin/isoWeek';
import dayjsDuration from 'dayjs/plugin/duration';
import dayjsUTC from 'dayjs/plugin/utc';
import dayjsRelativeTime from 'dayjs/plugin/relativeTime';
import dayjsLocalizedFormat from 'dayjs/plugin/localizedFormat';
import dayjsQuarterOfYear from 'dayjs/plugin/quarterOfYear';
import isBetween from 'dayjs/plugin/isBetween';
import weekDay from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';

dayjs.extend(dayjsIsoWeek);
dayjs.extend(dayjsDuration);
dayjs.extend(dayjsUTC);
dayjs.extend(dayjsRelativeTime);
dayjs.extend(dayjsLocalizedFormat);
dayjs.extend(dayjsQuarterOfYear);
dayjs.extend(isBetween);
dayjs.extend(weekDay);
dayjs.extend(localeData);

const dayjsx = dayjs;

export { dayjsx, Dayjs };
