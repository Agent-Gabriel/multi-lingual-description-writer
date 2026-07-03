export type Language = "en" | "th";

export interface TranslationSchema {
  // Navigation & Header
  appTitle: string;
  appSubtitle: string;
  simpleEasy: string;
  newSearch: string;
  startOver: string;
  backToHome: string;

  // View 1: Landing Page
  heroBadge: string;
  heroTitle1: string;
  heroTitleHighlight: string;
  heroDescription: string;
  searchPlaceholder: string;
  searchButton: string;
  placesSuggestionTitle: string;
  writeOwnButton: string;
  realtimeSearch: string;
  heroImageAlt: string;
  heroCardText: string;

  // Landing: Why Section
  whyTitle: string;
  whySubtitle: string;
  whyCard1Title: string;
  whyCard1Desc: string;
  whyCard2Title: string;
  whyCard2Desc: string;
  whyCard3Title: string;
  whyCard3Desc: string;

  // Landing: How It Works Section
  howItWorksTitle: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  step4Title: string;
  step4Desc: string;

  // View 2: Loading Search
  loadingSearchTitle: string;
  lookingFor: string;
  loadingSearchDesc: string;
  skipToManual: string;

  // View 3 & 5: Setup & Edit Dashboard
  setupTitle: string;
  setupSubtitle: string;
  shopNameLabel: string;
  shopNamePlaceholder: string;
  searchAgainButton: string;
  keywordLabel: string;
  keywordSubtitle: string;
  keywordPlaceholder: string;
  keywordDesc: string;
  locationLabel: string;
  locationPlaceholder: string;
  quickLocationsLabel: string;
  offersLabel: string;
  offersSubtitle: string;
  offersPlaceholder: string;
  clickSuggestionsLabel: string;
  createDescriptionsButton: string;
  editShopInfoTitle: string;
  rewriteDescriptionsButton: string;

  // View 4: Loading Generate
  generatingBadge: string;
  generatingTitle: string;
  generatingDesc: string;

  // View 5: Output screen
  optionLabel: string;
  shopAreaLabel: string;
  previewTextButton: string;
  directEditButton: string;
  editingModeLabel: string;
  readyLabel: string;
  warningTooLong: string;
  warningTooLongBadge: string;
  warningAlmostFull: string;
  warningAlmostFullBadge: string;
  thaiTextLabel: string;
  englishTextLabel: string;
  totalLettersLabel: string;
  copiedToastTitle: string;
  copiedToastSubtitle: string;
  copyAnywayButton: string;
  copyDescriptionButton: string;
  howGmapsWorksTitle: string;
  howGmapsWorksDesc: string;
  learnMoreButton: string;
  limitReachedTitle: string;
  limitReachedDesc: string;
  contactSupport: string;
  attemptsLeftLabel: string;
  exportPdfButton: string;
  exportingPdfStatus: string;
  pdfReportTitle: string;
  pdfMetaKeyword: string;
  pdfMetaLocation: string;
  pdfThaiSection: string;
  pdfEnglishSection: string;
  pdfFooterNote: string;

  // Dynamic values or arrays (pre-translated)
  suggestedAreas: string[];
  suggestedFeatures: string[];
}

export const translations: Record<Language, TranslationSchema> = {
  en: {
    appTitle: "Bilingual Map Description Maker",
    appSubtitle: "THAILAND MAPS",
    simpleEasy: "Simple & Easy",
    newSearch: "New Search",
    startOver: "Start Over",
    backToHome: "Back to Home",

    heroBadge: "Thai-English Maps Description Writer",
    heroTitle1: "Write Shop Descriptions in ",
    heroTitleHighlight: "Thai and English",
    heroDescription: "People in Thailand search Google Maps in both Thai and English. This simple tool helps you write descriptions using both languages. It puts your Thai info first, then adds a neat spacing trick so the English translation is hidden behind a clean \"Read more\" link on phones.",
    searchPlaceholder: "Type your shop name (e.g. Roots Sathorn)...",
    searchButton: "Search & Start",
    placesSuggestionTitle: "Or test with popular Thailand places:",
    writeOwnButton: "⚡ Write My Own",
    realtimeSearch: "Real-Time Search",
    heroImageAlt: "Thailand Local SEO Illustration",
    heroCardText: "Having both Thai and English makes it easy for customers to find your shop, whether they search in English or Thai.",

    whyTitle: "Why Use Both Thai and English?",
    whySubtitle: "Writing in both languages makes it easy for more customers to find and read about your shop.",
    whyCard1Title: "Reach More Customers",
    whyCard1Desc: "People in places like Bangkok or Phuket search in both Thai and English. Writing in both languages ensures that everyone can find you, no matter which language they use.",
    whyCard2Title: "Clean Layout",
    whyCard2Desc: "By putting two empty lines after the Thai text, Google shows a tidy \"Read more\" button on your profile so both languages look neat on mobile screens.",
    whyCard3Title: "Letter Count Checker",
    whyCard3Desc: "Google only lets you write 750 letters in your shop's description. We automatically check and limit your text so it is never too long.",

    howItWorksTitle: "How it works",
    step1Title: "Type Shop Name",
    step1Desc: "Type your shop's name. We will search for your shop's details on Google Maps.",
    step2Title: "Choose Keywords",
    step2Desc: "Pick your area and the main words that describe what you sell.",
    step3Title: "Get Descriptions",
    step3Desc: "Our easy-to-use tool writes descriptions in both Thai and English.",
    step4Title: "Copy & Paste",
    step4Desc: "Copy the text with one tap and paste it straight onto Google Maps.",

    loadingSearchTitle: "Searching for your shop on Google Maps...",
    lookingFor: "Looking for:",
    loadingSearchDesc: "We search the web to find your shop's address and details so we can write the best description for you.",
    skipToManual: "Skip and type details myself",

    setupTitle: "Check and Edit Shop Details",
    setupSubtitle: "Make any changes to your shop's info before we write the descriptions.",
    shopNameLabel: "Shop Name (or Category)",
    shopNamePlaceholder: "e.g. Starbucks Thonglor",
    searchAgainButton: "Search Maps Again",
    keywordLabel: "What your shop does (Keyword)",
    keywordSubtitle: "Helps customers find you",
    keywordPlaceholder: "e.g. Italian Restaurant Thonglor",
    keywordDesc: "This is what people type when looking for your kind of shop (e.g., Italian Restaurant, Coffee Shop, or Spa).",
    locationLabel: "Shop Location (District & Province)",
    locationPlaceholder: "e.g. Nimman, Chiang Mai",
    quickLocationsLabel: "Quick locations:",
    offersLabel: "What your shop offers",
    offersSubtitle: "1 on each line",
    offersPlaceholder: "- authentic neapolitan pizza\n- imported ingredients\n- cozy atmospheric seating\n- rooftop cocktails",
    clickSuggestionsLabel: "Click to add suggestions below:",
    createDescriptionsButton: "Create Descriptions",
    editShopInfoTitle: "Edit Shop Info",
    rewriteDescriptionsButton: "Rewrite Descriptions",

    generatingBadge: "Writing descriptions...",
    generatingTitle: "Writing Thai and English descriptions...",
    generatingDesc: "We write polite descriptions in Thai (using Ka/Krap), add empty space so it looks neat, translate them into English, and make sure everything is under 750 letters.",

    optionLabel: "Option",
    shopAreaLabel: "Shop Area:",
    previewTextButton: "Preview Text",
    directEditButton: "Direct Edit",
    editingModeLabel: "Editing Mode",
    readyLabel: "Ready",
    warningTooLong: "Description too long ({count} / 750 letters). Google Maps might not accept it. Please make it shorter by tapping Direct Edit.",
    warningTooLongBadge: "Too Long",
    warningAlmostFull: "Almost full ({count} / 750 letters). Tap Direct Edit to shorten the text slightly.",
    warningAlmostFullBadge: "Almost Full",
    thaiTextLabel: "Thai text:",
    englishTextLabel: "English text:",
    totalLettersLabel: "Total:",
    copiedToastTitle: "Copied!",
    copiedToastSubtitle: "Ready to paste on Google Maps.",
    copyAnywayButton: "Copy anyway (Too long)",
    copyDescriptionButton: "Copy Description",
    howGmapsWorksTitle: "How Google Maps Works in Thailand",
    howGmapsWorksDesc: "Google search works in both Thai and English. This template puts the Thai translation first, then adds empty lines so that the English translation is hidden behind a clean \"Read more\" button on phones.",
    learnMoreButton: "Learn More",
    limitReachedTitle: "Free Rewrite Limit Reached",
    limitReachedDesc: "You have reached your limit of 2 free description generations per session. To protect our free service and ensure everyone gets high quality resources, we ask that you get in touch for more options.",
    contactSupport: "Contact Local SEO Support",
    attemptsLeftLabel: "Generations used in this session: {count} of 2",
    exportPdfButton: "Export PDF",
    exportingPdfStatus: "Exporting...",
    pdfReportTitle: "Google Maps Optimization Card",
    pdfMetaKeyword: "Target SEO Keyword",
    pdfMetaLocation: "Optimized Location",
    pdfThaiSection: "🇹🇭 Thai Version (First)",
    pdfEnglishSection: "🇺🇸 English Translation (Behind Space)",
    pdfFooterNote: "Generated by Thailand Maps - Bilingual Description Maker",

    suggestedAreas: [
      "Thonglor, Bangkok",
      "Sathorn, Bangkok",
      "Nimman, Chiang Mai",
      "Patong, Phuket",
      "Pattaya",
      "Bophut, Koh Samui"
    ],
    suggestedFeatures: [
      "free parking",
      "outdoor terrace",
      "English-speaking staff",
      "BTS/MRT close",
      "free Wi-Fi",
      "pet friendly",
      "rooftop seating",
      "halal options",
      "vegetarian-friendly"
    ]
  },
  th: {
    appTitle: "เครื่องมือเขียนคำอธิบายแผนที่สองภาษา",
    appSubtitle: "แผนที่ประเทศไทย",
    simpleEasy: "ง่ายและสะดวก",
    newSearch: "ค้นหาใหม่",
    startOver: "เริ่มต้นใหม่",
    backToHome: "กลับหน้าหลัก",

    heroBadge: "เครื่องมือเขียนคำอธิบายแผนที่ไทย-อังกฤษ",
    heroTitle1: "เขียนคำอธิบายร้านค้าใน ",
    heroTitleHighlight: "ภาษาไทยและอังกฤษ",
    heroDescription: "ผู้คนในประเทศไทยค้นหาข้อมูลบน Google Maps ทั้งในภาษาไทยและภาษาอังกฤษ เครื่องมือช่วยนี้จะช่วยคุณเขียนคำอธิบายด้วยทั้งสองภาษา โดยจะแสดงข้อมูลภาษาไทยเป็นอันดับแรก จากนั้นใช้เทคนิคการเว้นบรรทัดแบบพิเศษเพื่อให้คำแปลภาษาอังกฤษซ่อนอยู่หลังลิงก์ \"ดูเพิ่มเติม\" ที่สะอาดตาบนหน้าจอมือถือ",
    searchPlaceholder: "พิมพ์ชื่อร้านค้าของคุณ (เช่น Roots Sathorn)...",
    searchButton: "ค้นหาและเริ่ม",
    placesSuggestionTitle: "หรือทดลองใช้กับสถานที่ยอดนิยมในไทย:",
    writeOwnButton: "⚡ เขียนด้วยตัวเอง",
    realtimeSearch: "ค้นหาเรียลไทม์",
    heroImageAlt: "ภาพประกอบการทำ SEO ท้องถิ่นในประเทศไทย",
    heroCardText: "การมีทั้งภาษาไทยและภาษาอังกฤษช่วยให้ลูกค้าค้นหาร้านค้าของคุณได้ง่ายขึ้น ไม่ว่าพวกเขาจะค้นหาด้วยภาษาอังกฤษหรือภาษาไทยก็ตาม",

    whyTitle: "ทำไมต้องใช้ทั้งภาษาไทยและภาษาอังกฤษ?",
    whySubtitle: "การเขียนรายละเอียดทั้งสองภาษาจะช่วยให้ลูกค้ากลุ่มต่างๆ ค้นพบและอ่านข้อมูลเกี่ยวกับร้านค้าของคุณได้สะดวกขึ้น",
    whyCard1Title: "เข้าถึงลูกค้าได้กว้างขวาง",
    whyCard1Desc: "ผู้คนในแหล่งท่องเที่ยวหรือย่านธุรกิจอย่างกรุงเทพฯ หรือภูเก็ต มีการค้นหาทั้งภาษาไทยและอังกฤษ การลงข้อมูลทั้งคู่จะทำให้ร้านค้าของคุณมีโอกาสถูกค้นพบจากทุกคน",
    whyCard2Title: "เลย์เอาต์ที่สะอาดตา",
    whyCard2Desc: "ด้วยการเว้นบรรทัดว่าง 2 บรรทัดต่อท้ายข้อความภาษาไทย Google จะซ่อนข้อมูลภาษาอังกฤษไว้หลังปุ่ม \"ดูเพิ่มเติม\" ทำให้หน้าโปรไฟล์ของคุณบนมือถือดูเป็นระเบียบเรียบร้อย",
    whyCard3Title: "ระบบนับตัวอักษรเพื่อความชัวร์",
    whyCard3Desc: "Google อนุญาตให้เขียนคำอธิบายร้านค้าได้ไม่เกิน 750 ตัวอักษร ระบบของเราจะช่วยคำนวณและจำกัดไม่ให้ยาวเกินข้อกำหนดโดยอัตโนมัติ",

    howItWorksTitle: "วิธีการทำงาน",
    step1Title: "พิมพ์ชื่อร้าน",
    step1Desc: "พิมพ์ชื่อร้านค้าของคุณ ระบบจะช่วยดึงรายละเอียดที่เกี่ยวข้องบน Google Maps มาเป็นฐานข้อมูล",
    step2Title: "เลือกคำสำคัญ",
    step2Desc: "ระบุย่านที่ตั้งร้านและคำหลักสำคัญที่อธิบายบริการของคุณเพื่อช่วยเรื่องการทำ SEO",
    step3Title: "รับคำอธิบายสองภาษา",
    step3Desc: "ระบบอัจฉริยะของเราจะเขียนคำอธิบายแบบสองภาษาที่เหมาะสมและดึงดูดใจ",
    step4Title: "คัดลอกและไปใช้งาน",
    step4Desc: "แตะคัดลอกเพียงครั้งเดียว แล้วนำไปวางในช่องข้อมูลร้านค้าบน Google Maps ได้ทันที",

    loadingSearchTitle: "กำลังค้นหาข้อมูลร้านค้าของคุณบน Google Maps...",
    lookingFor: "กำลังค้นหา:",
    loadingSearchDesc: "เรากำลังค้นหาที่อยู่และรายละเอียดของร้านค้าบนเว็บ เพื่อให้ได้ข้อมูลอ้างอิงสำหรับการเขียนคำอธิบายที่ดีที่สุด",
    skipToManual: "ข้ามแล้วพิมพ์รายละเอียดด้วยตนเอง",

    setupTitle: "ตรวจสอบและปรับแต่งรายละเอียดร้านค้า",
    setupSubtitle: "คุณสามารถแก้ไขข้อมูลรายละเอียดของร้านก่อนที่เราจะเริ่มเขียนคำอธิบายได้ตามต้องการ",
    shopNameLabel: "ชื่อร้านค้า (หรือประเภทธุรกิจ)",
    shopNamePlaceholder: "เช่น Starbucks Thonglor",
    searchAgainButton: "ค้นหาแผนที่อีกครั้ง",
    keywordLabel: "ประเภทธุรกิจหรือบริการหลัก (คำสำคัญ SEO)",
    keywordSubtitle: "ช่วยให้ลูกค้าค้นหาร้านคุณเจอ",
    keywordPlaceholder: "เช่น ร้านอาหารอิตาเลียน ทองหล่อ",
    keywordDesc: "นี่คือสิ่งที่ผู้คนพิมพ์เมื่อต้องการค้นหาธุรกิจแบบคุณ (เช่น ร้านอาหารอิตาเลียน, ร้านกาแฟ, หรือสปา)",
    locationLabel: "ที่ตั้งร้านค้า (เขต/อำเภอ และจังหวัด)",
    locationPlaceholder: "เช่น นิมมาน, เชียงใหม่",
    quickLocationsLabel: "สถานที่แนะนำด่วน:",
    offersLabel: "จุดเด่นหรือบริการของร้านคุณ",
    offersSubtitle: "ใส่ 1 บริการต่อบรรทัด",
    offersPlaceholder: "- พิซซ่าสไตล์เนเปิลส์แท้\n- ใช้วัตถุดิบนำเข้าชั้นดี\n- บรรยากาศอบอุ่นเป็นกันเอง\n- มีเครื่องดื่มค็อกเทลบริการบนดาดฟ้า",
    clickSuggestionsLabel: "คลิกเพื่อเพิ่มคำแนะนำทางด้านล่าง:",
    createDescriptionsButton: "สร้างคำอธิบายสองภาษา",
    editShopInfoTitle: "แก้ไขข้อมูลร้าน",
    rewriteDescriptionsButton: "เขียนคำอธิบายใหม่",

    generatingBadge: "กำลังเขียนคำอธิบาย...",
    generatingTitle: "กำลังเขียนคำอธิบายภาษาไทยและภาษาอังกฤษ...",
    generatingDesc: "เรากำลังเขียนคำอธิบายภาษาไทยที่สุภาพมีหางเสียง (ค่ะ/ครับ) พร้อมทั้งเว้นช่องว่างอย่างเหมาะสมเพื่อความสบายตา แปลเป็นอังกฤษ และตรวจสอบให้แน่ใจว่าทั้งหมดไม่เกิน 750 ตัวอักษร",

    optionLabel: "ตัวเลือกที่",
    shopAreaLabel: "พื้นที่ร้าน:",
    previewTextButton: "ดูตัวอย่างคำอธิบาย",
    directEditButton: "แก้ไขข้อความเอง",
    editingModeLabel: "โหมดแก้ไขข้อความ",
    readyLabel: "พร้อมใช้งาน",
    warningTooLong: "คำอธิบายยาวเกินกำหนด ({count} / 750 ตัวอักษร) Google Maps อาจจะไม่บันทึกข้อมูล โปรดกดปุ่ม \"แก้ไขข้อความเอง\" เพื่อตัดทอนข้อความให้สั้นลง",
    warningTooLongBadge: "ยาวเกินไป",
    warningAlmostFull: "ข้อความเกือบเต็มสิทธิ์แล้ว ({count} / 750 ตัวอักษร) คุณสามารถกด \"แก้ไขข้อความเอง\" เพื่อตกแต่งข้อความให้พอดีที่สุด",
    warningAlmostFullBadge: "ใกล้เต็มแล้ว",
    thaiTextLabel: "ข้อความภาษาไทย:",
    englishTextLabel: "ข้อความภาษาอังกฤษ:",
    totalLettersLabel: "รวมทั้งสิ้น:",
    copiedToastTitle: "คัดลอกเรียบร้อย!",
    copiedToastSubtitle: "พร้อมสำหรับการนำไปวางบนหน้า Google Maps ของคุณแล้ว",
    copyAnywayButton: "คัดลอกอยู่ดี (แม้เกินเกณฑ์)",
    copyDescriptionButton: "คัดลอกคำอธิบาย",
    howGmapsWorksTitle: "Google Maps ทำงานอย่างไรในประเทศไทย",
    howGmapsWorksDesc: "ผู้ใช้มักจะค้นหาแผนที่ด้วยทั้งสองภาษา วิธีการวางข้อความภาษาไทยไว้ด้านบนสุดและเพิ่มบรรทัดว่าง 2 บรรทัด จะช่วยซ่อนเนื้อหาภาษาอังกฤษให้อยู่ใต้ปุ่ม \"ดูเพิ่มเติม\" อย่างเป็นระเบียบบนหน้าจอมือถือ",
    learnMoreButton: "เรียนรู้เพิ่มเติม",
    limitReachedTitle: "จำกัดการสร้างข้อความฟรีครบแล้ว",
    limitReachedDesc: "คุณใช้สิทธิ์สร้างและเขียนคำอธิบายใหม่ครบ 2 ครั้งในเซสชันนี้แล้ว เพื่อรักษาคุณภาพการให้บริการฟรีแก่ทุกคนอย่างทั่วถึง เราขอความกรุณาติดต่อเราหากต้องการตัวเลือกเพิ่มเติมหรือบริการสนับสนุนด้าน SEO ท้องถิ่น",
    contactSupport: "ติดต่อฝ่ายสนับสนุน SEO ท้องถิ่น",
    attemptsLeftLabel: "จำนวนครั้งที่ใช้ในเซสชันนี้: {count} จาก 2",
    exportPdfButton: "ส่งออก PDF",
    exportingPdfStatus: "กำลังส่งออก...",
    pdfReportTitle: "การ์ดเพิ่มประสิทธิภาพ Google Maps",
    pdfMetaKeyword: "คำสำคัญ SEO เป้าหมาย",
    pdfMetaLocation: "พื้นที่ที่ได้รับการตั้งค่า",
    pdfThaiSection: "🇹🇭 ฉบับภาษาไทย (ส่วนแรก)",
    pdfEnglishSection: "🇺🇸 ฉบับแปลภาษาอังกฤษ (ซ่อนหลังช่องว่าง)",
    pdfFooterNote: "สร้างโดย Thailand Maps - เครื่องมือเขียนคำอธิบายสองภาษา",

    suggestedAreas: [
      "ทองหล่อ, กรุงเทพฯ",
      "สาทร, กรุงเทพฯ",
      "นิมมาน, เชียงใหม่",
      "ป่าตอง, ภูเก็ต",
      "พัทยา",
      "บ่อผุด, เกาะสมุย"
    ],
    suggestedFeatures: [
      "มีที่จอดรถฟรี",
      "ระเบียงนั่งกลางแจ้ง",
      "พนักงานสื่อสารภาษาอังกฤษได้",
      "ใกล้สถานี BTS/MRT",
      "ฟรีบริการ Wi-Fi",
      "ต้อนรับสัตว์เลี้ยง",
      "ที่นั่งบนดาดฟ้า",
      "มีตัวเลือกอาหารฮาลาล",
      "เหมาะสำหรับผู้ทานมังสวิรัติ"
    ]
  }
};
