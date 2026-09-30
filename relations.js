// relations.js
const relations = [
  // Core 13
  { order: 1,  kannada: "ಪಿತೃ / ತಂದೆ",                          sanskrit: "पितरम्",              english: "Father",                              group: "Pitruvarga",       gender: "male",   family: "paternal" },
  { order: 2,  kannada: "ಪಿತಾಮಹ / ತಾತ",                         sanskrit: "पितामहम्",            english: "Paternal Grandfather",               group: "Pitruvarga",       gender: "male",   family: "paternal" },
  { order: 3,  kannada: "ಪ್ರಪಿತಾಮಹ / ಮುತ್ತಜ್ಜ",                   sanskrit: "प्रपितामहम्",         english: "Paternal Great-grandfather",         group: "Pitruvarga",       gender: "male",   family: "paternal" },
  { order: 4,  kannada: "ಮಾತೃ / ತಾಯಿ",                            sanskrit: "मातरम्",              english: "Mother",                              group: "Matruvarga",       gender: "female", family: "paternal" },
  { order: 5,  kannada: "ಪಿತಾಮಹಿ / ಅಜ್ಜಿ",                        sanskrit: "पितामहीम्",           english: "Paternal Grandmother",               group: "Matruvarga",       gender: "female", family: "paternal" },
  { order: 6,  kannada: "ಪ್ರಪಿತಾಮಹಿ / ಮುತ್ತಜ್ಜಿ",                 sanskrit: "प्रपितामहीम्",        english: "Paternal Great-grandmother",         group: "Matruvarga",       gender: "female", family: "paternal" },
  { order: 7,  kannada: "ಸಾಪತ್ನಿ ಜನನಿ",                           sanskrit: "सापत्नी जननी",         english: "Step Mother",                         group: "Matruvarga",       gender: "female", family: "paternal" },

  { order: 8,  kannada: "ಮಾತಾಮಹ / ತಾಯಿಯ ತಂದೆ",                    sanskrit: "मातामहम्",            english: "Maternal Grandfather",               group: "Maataamaha",       gender: "male",   family: "maternal" },
  { order: 9,  kannada: "ಮಾತುಃ ಪಿತಾಮಹ / ತಾಯಿಯ ತಾತ",               sanskrit: "मातुः पितामहम्",      english: "Maternal Great-grandfather",         group: "Maataamaha",       gender: "male",   family: "maternal" },
  { order: 10, kannada: "ಮಾತುಃ ಪ್ರಪಿತಾಮಹ / ತಾಯಿಯ ಮುತ್ತಜ್ಜ",       sanskrit: "मातुः प्रपितामहम्",  english: "Maternal Great-great-grandfather",   group: "Maataamaha",       gender: "male",   family: "maternal" },
  { order: 11, kannada: "ಮಾತಾಮಹಿ / ತಾಯಿಯ ತಾಯಿ",                   sanskrit: "मातामहीम्",           english: "Maternal Grandmother",               group: "Maataamahi",       gender: "female", family: "maternal" },
  { order: 12, kannada: "ಮಾತುಃ ಪಿತಾಮಹಿ / ತಾಯಿಯ ಅಜ್ಜಿ",            sanskrit: "मातुः पितामहीम्",     english: "Maternal Great-grandmother",         group: "Maataamahi",       gender: "female", family: "maternal" },
  { order: 13, kannada: "ಮಾತುಃ ಪ್ರಪಿತಾಮಹಿ / ತಾಯಿಯ ಮುತ್ತಜ್ಜಿ",     sanskrit: "मातुः प्रपितामहीम्", english: "Maternal Great-great-grandmother",   group: "Maataamahi",       gender: "female", family: "maternal" },

  // Other + Pairs
  { order: 14, kannada: "ಹೆಂಡತಿ",                                 sanskrit: "आत्म पत्नीम्",         english: "Wife",                                group: "Other",            gender: "female", family: "self" },
  { order: 15, kannada: "ಮಗ",                                     sanskrit: "सुतम्",               english: "Son",                                 group: "Other",            gender: "male",   family: "self" },

  { order: 16, kannada: "ಸಹೋದರ",                                  sanskrit: "भ्रातरम्",             english: "Brother",                             group: "Other",            gender: "male",   family: "paternal", pairWith: 17 },
  { order: 17, kannada: "ಸಹೋದರನ ಹೆಂಡತಿ",                           sanskrit: "तत्पत्नीम्",           english: "Brother’s Wife",                      group: "Other",            gender: "female", family: "paternal", pairWith: 16 },

  { order: 18, kannada: "ತಂದೆಯ ಅಣ್ಣ/ತಮ್ಮ",                         sanskrit: "पितृव्यम्",            english: "Father’s Brother",                    group: "Other",            gender: "male",   family: "paternal", pairWith: 19 },
  { order: 19, kannada: "ತಂದೆಯ ಅಣ್ಣ/ತಮ್ಮನ ಹೆಂಡತಿ",                 sanskrit: "तत्पत्नीम्",           english: "Paternal Uncle’s Wife",               group: "Other",            gender: "female", family: "paternal", pairWith: 18 },

  { order: 20, kannada: "ಸೋದರ ಮಾವ",                                sanskrit: "मातुल",               english: "Maternal Uncle",                      group: "Other",            gender: "male",   family: "maternal", pairWith: 21 },
  { order: 21, kannada: "ಸೋದರ ಮಾವನ ಹೆಂಡತಿ",                        sanskrit: "तत्पत्नीम्",           english: "Maternal Uncle’s Wife",               group: "Other",            gender: "female", family: "maternal", pairWith: 20 },

  { order: 22, kannada: "ಮಗಳು",                                   sanskrit: "दुहितरम्",             english: "Daughter",                            group: "Other",            gender: "female", family: "self",     pairWith: 23 },
  { order: 23, kannada: "ಅಳಿಯ",                                   sanskrit: "तद्भर्तारम्",          english: "Daughter’s Husband",                  group: "Other",            gender: "male",   family: "self",     pairWith: 22 },

  { order: 24, kannada: "ಮೊಮ್ಮಗ (ಮಗಳ ಮಗ)",                         sanskrit: "दौहित्रम्",            english: "Daughter’s Son",                      group: "Other",            gender: "male",   family: "self" },

  { order: 25, kannada: "ಸಹೋದರಿ",                                  sanskrit: "आत्म भगिनी",           english: "Sister",                              group: "Other",            gender: "female", family: "paternal", pairWith: 26 },
  { order: 26, kannada: "ಸಹೋದರಿಯ ಗಂಡ",                             sanskrit: "तद्भर्तारम्",          english: "Sister’s Husband",                    group: "Other",            gender: "male",   family: "paternal", pairWith: 25 },

  { order: 27, kannada: "ಸಹೋದರಿಯ ಮಗ",                              sanskrit: "तत्पुत्रम्",           english: "Sister’s Son",                        group: "Other",            gender: "male",   family: "paternal" },

  { order: 28, kannada: "ತಂದೆಯ ಸಹೋದರಿ",                            sanskrit: "पितृस्वसा",            english: "Father’s Sister",                     group: "Other",            gender: "female", family: "paternal", pairWith: 29 },
  { order: 29, kannada: "ತಂದೆಯ ಸಹೋದರಿಯ ಗಂಡ",                       sanskrit: "तत्पतिम्",             english: "Paternal Aunt’s Husband",             group: "Other",            gender: "male",   family: "paternal", pairWith: 28 },

  { order: 30, kannada: "ತಾಯಿಯ ಸಹೋದರಿ",                            sanskrit: "मातृस्वसा",            english: "Mother’s Sister",                     group: "Other",            gender: "female", family: "maternal", pairWith: 31 },
  { order: 31, kannada: "ತಾಯಿಯ ಸಹೋದರಿಯ ಗಂಡ",                       sanskrit: "तत्पतिम्",             english: "Maternal Aunt’s Husband",             group: "Other",            gender: "male",   family: "maternal", pairWith: 30 },

  { order: 32, kannada: "ಮಾವ",                         sanskrit: "जायापितृ",             english: "Father-in-law",                       group: "Other",            gender: "male",   family: "inlaw",    pairWith: 33 },
  { order: 33, kannada: "ಅತ್ತೆ",                                   sanskrit: "जामातृ",               english: "Mother-in-law",                       group: "Other",            gender: "female", family: "inlaw",    pairWith: 32 },

  { order: 34, kannada: "ಹೆಂಡತಿಯ ಅಣ್ಣ/ತಮ್ಮ",                       sanskrit: "श्यालक",               english: "Brother-in-law",                      group: "Other",            gender: "male",   family: "inlaw",    pairWith: 35 },
  { order: 35, kannada: "ಹೆಂಡತಿಯ ಅಣ್ಣ/ತಮ್ಮನ ಹೆಂಡತಿ",               sanskrit: "तत्पत्नीम्",           english: "Brother-in-law’s Wife",               group: "Other",            gender: "female", family: "inlaw",    pairWith: 34 },

  { order: 36, kannada: "ಗುರು",                                    sanskrit: "गुरुम्",               english: "Vidya Guru",                          group: "Other",            gender: "male",   family: "other",    pairWith: 37 },
  { order: 37, kannada: "ಗುರು ಪತ್ನಿ",                               sanskrit: "तत्पत्नीम्",           english: "Guru’s Wife",                         group: "Other",            gender: "female", family: "other",    pairWith: 36 },

  { order: 38, kannada: "ಪುರೋಹಿತ",                                 sanskrit: "आचार्यम्",             english: "Purohit",                             group: "Other",            gender: "male",   family: "other",    pairWith: 39 },
  { order: 39, kannada: "ಪುರೋಹಿತನ ಪತ್ನಿ",                           sanskrit: "तत्पत्नीम्",           english: "Priest’s Wife",                       group: "Other",            gender: "female", family: "other",    pairWith: 38 },

  { order: 40, kannada: "ಶಿಷ್ಯ",                                   sanskrit: "शिष्यम्",              english: "Disciple",                            group: "Other",            gender: "male",   family: "other" },
  { order: 41, kannada: "ಸ್ನೇಹಿತ",                                  sanskrit: "आप्तम्",               english: "Friend",                              group: "Other",            gender: "male",   family: "other" }
];

const DEFAULT_GOTRA = "Kashyapa";
const DEFAULT_MALE_NAME = "Yajnyappa";
const DEFAULT_FEMALE_NAME = "Yajnyamma";