// Sample AI voice-call scripts for the "Products in action" page. These are illustrative scripts,
// not recordings. Lines alternate: AI first, then the customer. Have a native speaker review each
// language before using it in front of customers.

export type LangId = "en" | "hi" | "sw" | "ar";
export const languages: { id: LangId; label: string; tag: string; rtl?: boolean }[] = [
  { id: "en", label: "English", tag: "en-GB" },
  { id: "hi", label: "हिन्दी", tag: "hi-IN" },
  { id: "sw", label: "Kiswahili", tag: "sw-KE" },
  { id: "ar", label: "العربية", tag: "ar-SA", rtl: true },
];

export type VoiceTemplate = {
  id: string;
  industry: "BFSI" | "Retail" | "Logistics";
  title: string;
  scenario: string;
  caller: string; // who the AI speaks for
  callee: string;
  steps: string[]; // what the AI does, in order
  writes: [string, string][]; // outcome shown after the call
  lines: Record<LangId, [string, string, string, string, string]>;
};

export const industries = [
  { id: "BFSI", label: "BFSI", full: "Banking, financial services and insurance", color: "#2563EB", text: "Collections, KYC and reminders at a scale a call centre cannot match, with every promise logged." },
  { id: "Retail", label: "Retail", full: "Retail and e-commerce", color: "#EA580C", text: "Confirm cash-on-delivery orders, recover feedback and bring customers back, in their own language." },
  { id: "Logistics", label: "Logistics", full: "Transport and logistics", color: "#CA8A04", text: "Check in with drivers, update consignees on border clearance and keep ETAs honest." },
] as const;

export const voiceTemplates: VoiceTemplate[] = [
  {
    id: "loan-reminder", industry: "BFSI", title: "Loan repayment reminder", caller: "Capital Trust Finance", callee: "Asha",
    scenario: "An instalment is due in two days. The AI calls, agrees a payment date and sends the pay link.",
    steps: ["Dials at the customer's preferred time", "Confirms who is on the line", "States the amount and due date", "Captures a promise to pay", "Sends a WhatsApp payment link"],
    writes: [["Promise to pay", "Friday, 4,500"], ["WhatsApp", "Pay link sent"], ["CRM", "Call logged, follow-up set"]],
    lines: {
      en: ["Hello, this is the Capital Trust assistant. Am I speaking with Asha?", "Yes, speaking.", "Your loan instalment of 4,500 is due on Friday. Would you like to pay today?", "I can pay on Friday morning.", "Noted. I will send a payment link on WhatsApp for Friday. Thank you, Asha."],
      hi: ["नमस्ते, मैं कैपिटल ट्रस्ट का असिस्टेंट बोल रहा हूँ। क्या मेरी बात आशा जी से हो रही है?", "हाँ, बोल रही हूँ।", "आपकी लोन किस्त 4,500 की शुक्रवार को देय है। क्या आप आज भुगतान करना चाहेंगी?", "मैं शुक्रवार सुबह भुगतान कर दूँगी।", "ठीक है, मैं शुक्रवार के लिए WhatsApp पर पेमेंट लिंक भेज देता हूँ। धन्यवाद, आशा जी।"],
      sw: ["Habari, mimi ni msaidizi wa Capital Trust. Naongea na Asha?", "Ndiyo, ni mimi.", "Malipo ya mkopo wako ya 4,500 yanatakiwa Ijumaa. Ungependa kulipa leo?", "Nitalipa Ijumaa asubuhi.", "Sawa. Nitakutumia kiungo cha malipo kupitia WhatsApp kwa ajili ya Ijumaa. Asante, Asha."],
      ar: ["مرحباً، أنا مساعد كابيتال ترست. هل أتحدث مع آشا؟", "نعم، أنا معك.", "قسط قرضك بقيمة 4,500 مستحق يوم الجمعة. هل تودين السداد اليوم؟", "سأسدد صباح الجمعة.", "حسناً، سأرسل لك رابط الدفع عبر واتساب ليوم الجمعة. شكراً لك يا آشا."],
    },
  },
  {
    id: "kyc-check", industry: "BFSI", title: "KYC verification call", caller: "Capital Trust Finance", callee: "Asha",
    scenario: "A new account needs verification. The AI checks identity on the call and collects the ID photo on WhatsApp.",
    steps: ["Introduces itself and the reason for the call", "Asks a security question", "Verifies the answer against the record", "Sends an upload link on WhatsApp", "Marks the account as verified"],
    writes: [["Identity", "Verified on call"], ["WhatsApp", "ID upload link sent"], ["Account", "KYC step 2 of 3 complete"]],
    lines: {
      en: ["Hello, this is the Capital Trust assistant. I'm calling to complete your account verification. Is this Asha?", "Yes, this is Asha.", "For security, please confirm the year you were born.", "1991.", "Thank you, verified. I've sent a WhatsApp link to upload your ID photo. It takes one minute."],
      hi: ["नमस्ते, मैं कैपिटल ट्रस्ट का असिस्टेंट हूँ। आपके खाते का सत्यापन पूरा करने के लिए कॉल कर रहा हूँ। क्या मैं आशा जी से बात कर रहा हूँ?", "हाँ, मैं आशा बोल रही हूँ।", "सुरक्षा के लिए, कृपया अपना जन्म वर्ष बताइए।", "1991।", "धन्यवाद, सत्यापन हो गया। आपकी ID फ़ोटो अपलोड करने के लिए मैंने WhatsApp पर लिंक भेजा है। इसमें एक मिनट लगेगा।"],
      sw: ["Habari, mimi ni msaidizi wa Capital Trust. Ninapiga simu kukamilisha uthibitisho wa akaunti yako. Je, naongea na Asha?", "Ndiyo, ni Asha.", "Kwa usalama, tafadhali thibitisha mwaka uliozaliwa.", "1991.", "Asante, imethibitishwa. Nimekutumia kiungo cha WhatsApp kupakia picha ya kitambulisho chako. Itachukua dakika moja."],
      ar: ["مرحباً، أنا مساعد كابيتال ترست. أتصل لإكمال التحقق من حسابك. هل أتحدث مع آشا؟", "نعم، أنا آشا.", "للأمان، يرجى تأكيد سنة ميلادك.", "1991.", "شكراً، تم التحقق. أرسلت لك رابطاً عبر واتساب لرفع صورة هويتك. يستغرق دقيقة واحدة."],
    },
  },
  {
    id: "cod-confirm", industry: "Retail", title: "Cash-on-delivery confirmation", caller: "Urban Mart", callee: "Asha",
    scenario: "A cash-on-delivery order is about to ship. The AI confirms the customer is real and agrees a delivery window.",
    steps: ["Calls right after the order is placed", "Reads back the items and total", "Confirms the address and delivery time", "Books the slot with the courier", "Sends a tracking link on WhatsApp"],
    writes: [["Order", "Confirmed, COD 2,300"], ["Delivery", "Tomorrow after 5 pm"], ["WhatsApp", "Tracking link sent"]],
    lines: {
      en: ["Hello, this is Urban Mart calling about your order of two shirts, to be delivered tomorrow. Am I speaking with Asha?", "Yes.", "It's cash on delivery, total 2,300. Shall we go ahead and deliver tomorrow?", "Yes, please deliver after 5 pm.", "Done. Delivery is booked for tomorrow after 5 pm. You'll get a WhatsApp tracking link shortly."],
      hi: ["नमस्ते, मैं अर्बन मार्ट से बोल रहा हूँ। आपके दो शर्ट के ऑर्डर की डिलीवरी कल होनी है। क्या मैं आशा जी से बात कर रहा हूँ?", "हाँ।", "यह कैश ऑन डिलीवरी है, कुल 2,300। क्या हम कल डिलीवर कर दें?", "हाँ, शाम 5 बजे के बाद डिलीवर कीजिए।", "ठीक है। डिलीवरी कल शाम 5 बजे के बाद बुक हो गई है। आपको जल्द ही WhatsApp पर ट्रैकिंग लिंक मिलेगा।"],
      sw: ["Habari, huyu ni Urban Mart tunapiga kuhusu oda yako ya mashati mawili, itakayowasilishwa kesho. Naongea na Asha?", "Ndiyo.", "Ni malipo wakati wa kupokea, jumla 2,300. Tuendelee kuwasilisha kesho?", "Ndiyo, tafadhali leta baada ya saa kumi na moja jioni.", "Imekamilika. Uwasilishaji umepangwa kesho baada ya saa kumi na moja jioni. Utapata kiungo cha ufuatiliaji kupitia WhatsApp hivi karibuni."],
      ar: ["مرحباً، معك أوربان مارت بخصوص طلبك من قميصين والمقرر توصيله غداً. هل أتحدث مع آشا؟", "نعم.", "الدفع عند الاستلام والإجمالي 2,300. هل نتابع التوصيل غداً؟", "نعم، من فضلك بعد الساعة الخامسة مساءً.", "تم. حُجز التوصيل غداً بعد الخامسة مساءً. ستصلك رسالة واتساب برابط التتبع قريباً."],
    },
  },
  {
    id: "feedback", industry: "Retail", title: "Post-purchase feedback and win-back", caller: "Urban Mart", callee: "Asha",
    scenario: "A day after delivery the AI asks how it went, offers a coupon and routes complaints to the right team.",
    steps: ["Calls one day after delivery", "Asks for a 1 to 5 rating", "Listens for the reason", "Offers a coupon when the rating is low", "Shares feedback with the owning team"],
    writes: [["Rating", "4 of 5"], ["Issue", "Late delivery, sent to logistics"], ["WhatsApp", "10% coupon sent"]],
    lines: {
      en: ["Hello Asha, this is Urban Mart. You received your order yesterday. How was your experience, from one to five?", "Four. The shirts are good but delivery was late.", "Thank you, and sorry about the delay. Would you like a 10 percent coupon for your next order?", "Yes, that would be nice.", "Great. I've sent the coupon on WhatsApp, and I've shared your feedback with our delivery team."],
      hi: ["नमस्ते आशा जी, मैं अर्बन मार्ट से बोल रहा हूँ। आपका ऑर्डर कल मिला था। एक से पाँच में आप अपने अनुभव को कितने अंक देंगी?", "चार। शर्ट अच्छी हैं, लेकिन डिलीवरी देर से आई।", "धन्यवाद, और देरी के लिए खेद है। क्या आप अगले ऑर्डर पर 10 प्रतिशत का कूपन लेना चाहेंगी?", "हाँ, यह अच्छा रहेगा।", "बढ़िया। मैंने कूपन WhatsApp पर भेज दिया है, और आपकी प्रतिक्रिया डिलीवरी टीम को बता दी है।"],
      sw: ["Habari Asha, huyu ni Urban Mart. Ulipokea oda yako jana. Uzoefu wako ulikuwaje, kwa alama moja hadi tano?", "Nne. Mashati ni mazuri lakini uwasilishaji ulichelewa.", "Asante, na samahani kwa kuchelewa. Ungependa kuponi ya asilimia 10 kwa oda yako ijayo?", "Ndiyo, hiyo itakuwa vizuri.", "Vizuri. Nimekutumia kuponi kupitia WhatsApp, na nimeshiriki maoni yako na timu yetu ya uwasilishaji."],
      ar: ["مرحباً آشا، معك أوربان مارت. استلمتِ طلبك أمس. كيف كانت تجربتك من واحد إلى خمسة؟", "أربعة. القمصان جيدة لكن التوصيل تأخر.", "شكراً لك، ونعتذر عن التأخير. هل تودين قسيمة خصم 10 بالمئة على طلبك القادم؟", "نعم، سيكون ذلك جيداً.", "رائع. أرسلت القسيمة عبر واتساب، ونقلت ملاحظاتك إلى فريق التوصيل."],
    },
  },
  {
    id: "driver-checkin", industry: "Logistics", title: "Driver check-in and ETA", caller: "Zambezi Haulage", callee: "Joseph",
    scenario: "A truck is mid-route. The AI calls the driver, confirms position, load and fuel, and updates the ETA for the customer.",
    steps: ["Calls the driver at set checkpoints", "Asks for location, load and fuel status", "Understands the answer in the driver's language", "Recalculates the ETA", "Notifies the customer"],
    writes: [["Truck ZM 4821", "Near Kapiri Mposhi"], ["ETA", "Updated to 6 pm"], ["Customer", "Notified on WhatsApp"]],
    lines: {
      en: ["Hello Joseph, this is the dispatch assistant at Zambezi Haulage. Where is truck ZM 4821 right now?", "I'm near Kapiri Mposhi, about three hours from Lusaka.", "Thank you. Is the load safe and is the fuel enough to reach the depot?", "Load is fine. Fuel is enough.", "Noted. I've updated the ETA to 6 pm and informed the customer. Drive safely."],
      hi: ["नमस्ते जोसेफ, मैं ज़ाम्बेज़ी हॉलेज के डिस्पैच का असिस्टेंट बोल रहा हूँ। ट्रक ZM 4821 अभी कहाँ है?", "मैं कपिरी मपोशी के पास हूँ, लुसाका से लगभग तीन घंटे दूर।", "धन्यवाद। क्या माल सुरक्षित है और डिपो तक पहुँचने के लिए डीज़ल पर्याप्त है?", "माल ठीक है। डीज़ल काफ़ी है।", "ठीक है। मैंने अनुमानित आगमन शाम 6 बजे कर दिया है और ग्राहक को बता दिया है। सुरक्षित चलाइए।"],
      sw: ["Habari Joseph, mimi ni msaidizi wa usafirishaji wa Zambezi Haulage. Lori ZM 4821 liko wapi sasa hivi?", "Niko karibu na Kapiri Mposhi, takriban saa tatu kutoka Lusaka.", "Asante. Je, mzigo uko salama na mafuta yanatosha kufika bohari?", "Mzigo uko sawa. Mafuta yanatosha.", "Nimeandika. Nimesasisha muda wa kufika kuwa saa kumi na mbili jioni na nimemjulisha mteja. Endesha salama."],
      ar: ["مرحباً جوزيف، معك مساعد الإرسال في زامبيزي هولاج. أين الشاحنة ZM 4821 الآن؟", "أنا قرب كابيري مبوشي، على بعد ثلاث ساعات تقريباً من لوساكا.", "شكراً. هل الحمولة آمنة وهل الوقود كافٍ للوصول إلى المستودع؟", "الحمولة بخير. الوقود كافٍ.", "تم التسجيل. حدّثت وقت الوصول إلى السادسة مساءً وأبلغت العميل. قُد بأمان."],
    },
  },
  {
    id: "border-update", industry: "Logistics", title: "Border clearance update", caller: "Zambezi Haulage", callee: "Asha",
    scenario: "A shipment clears customs. The AI calls the consignee with the news and books a receiving window.",
    steps: ["Triggers when clearance status changes", "Calls the consignee", "Explains status and expected arrival", "Asks for a receiving window", "Sends a tracking link on WhatsApp"],
    writes: [["Shipment 7731", "Cleared, crossed border"], ["Delivery", "Tomorrow, noon"], ["Receiving window", "From 10 am"]],
    lines: {
      en: ["Hello, this is Zambezi Haulage. Am I speaking with Asha about shipment 7731?", "Yes, I'm waiting for that shipment.", "Good news: customs documents are cleared and the truck crossed the border this morning. Delivery is expected tomorrow at noon.", "Great. Someone will be at the warehouse from ten.", "Perfect. I've logged your receiving window and sent the tracking link on WhatsApp."],
      hi: ["नमस्ते, मैं ज़ाम्बेज़ी हॉलेज से बोल रहा हूँ। क्या मैं शिपमेंट 7731 के बारे में आशा जी से बात कर रहा हूँ?", "हाँ, मैं उसी शिपमेंट का इंतज़ार कर रही हूँ।", "अच्छी खबर है: कस्टम के दस्तावेज़ मंज़ूर हो गए हैं और ट्रक आज सुबह सीमा पार कर चुका है। डिलीवरी कल दोपहर तक अपेक्षित है।", "बहुत बढ़िया। गोदाम में दस बजे से कोई मौजूद रहेगा।", "ठीक है। मैंने आपका रिसीविंग समय दर्ज कर लिया है और WhatsApp पर ट्रैकिंग लिंक भेज दिया है।"],
      sw: ["Habari, huyu ni Zambezi Haulage. Naongea na Asha kuhusu shehena 7731?", "Ndiyo, ninasubiri shehena hiyo.", "Habari njema: nyaraka za forodha zimeidhinishwa na lori lilivuka mpaka asubuhi hii. Uwasilishaji unatarajiwa kesho adhuhuri.", "Vizuri. Kutakuwa na mtu ghalani kuanzia saa nne asubuhi.", "Sawa kabisa. Nimerekodi muda wako wa kupokea na kutuma kiungo cha ufuatiliaji kupitia WhatsApp."],
      ar: ["مرحباً، معك زامبيزي هولاج. هل أتحدث مع آشا بخصوص الشحنة 7731؟", "نعم، أنتظر هذه الشحنة.", "أخبار سارة: تم تخليص مستندات الجمارك وعبرت الشاحنة الحدود هذا الصباح. التسليم متوقع غداً عند الظهر.", "رائع. سيكون هناك شخص في المستودع من الساعة العاشرة.", "ممتاز. سجلت وقت الاستلام وأرسلت رابط التتبع عبر واتساب."],
    },
  },
];
