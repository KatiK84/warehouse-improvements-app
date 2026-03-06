const quarterByMonth = {
  0: 'Q1',
  1: 'Q1',
  2: 'Q1',
  3: 'Q2',
  4: 'Q2',
  5: 'Q2',
  6: 'Q3',
  7: 'Q3',
  8: 'Q3',
  9: 'Q4',
  10: 'Q4',
  11: 'Q4'
};

export const getQuarterFromDate = (dateInput = new Date()) => {
  const date = new Date(dateInput);
  const q = quarterByMonth[date.getMonth()] ?? 'Q1';
  return `${q} ${date.getFullYear()}`;
};

export const getCurrentQuarter = () => getQuarterFromDate(new Date());

export const isValidQuarter = (value) => /^Q[1-4]\s\d{4}$/.test(String(value));

export const parseQuarter = (value) => {
  const [quarterPart, yearPart] = String(value).split(' ');
  const quarterNumber = Number.parseInt(quarterPart?.replace('Q', ''), 10);
  const year = Number.parseInt(yearPart, 10);

  return {
    quarterNumber,
    year
  };
};

export const compareQuartersDesc = (a, b) => {
  const qa = parseQuarter(a);
  const qb = parseQuarter(b);
  if (qa.year !== qb.year) return qb.year - qa.year;
  return qb.quarterNumber - qa.quarterNumber;
};

export const listDefaultQuarters = (centerYear = new Date().getFullYear()) => {
  const years = [centerYear - 1, centerYear, centerYear + 1];
  const rows = [];
  years.forEach((year) => {
    rows.push(`Q1 ${year}`, `Q2 ${year}`, `Q3 ${year}`, `Q4 ${year}`);
  });
  return rows.sort(compareQuartersDesc);
};

export const extractQuarterOptions = (...sources) => {
  const found = new Set();

  sources
    .flat()
    .forEach((item) => {
      if (item && isValidQuarter(item.quarter)) {
        found.add(item.quarter);
      }
    });

  listDefaultQuarters().forEach((q) => found.add(q));
  found.add(getCurrentQuarter());

  return Array.from(found).sort(compareQuartersDesc);
};
