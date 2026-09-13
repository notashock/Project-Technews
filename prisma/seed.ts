import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Prasad Tech In Telugu database...');

  // Clean existing data for a fresh seed
  await prisma.deepDiveArticle.deleteMany();
  await prisma.newsTopic.deleteMany();
  await prisma.episodeDigest.deleteMany();
  await prisma.episode.deleteMany();

  // 1. Seed Episode 1852
  const ep1852 = await prisma.episode.create({
    data: {
      youtubeId: 'Wz3A9kZf4d8',
      episodeNumber: 1852,
      videoTitle: 'Tech News # 1852 - Nothing Phone 3 Leaks, Realme 14 Pro Launch Date, Jio New 5G Plans!',
      videoUrl: 'https://www.youtube.com/watch?v=Wz3A9kZf4d8',
      thumbnailUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
      channelTitle: 'Prasad Tech In Telugu',
      generationStage: 'Published',
      digest: {
        create: {
          slug: 'tech-news-1852-nothing-phone-3-realme-14-pro',
          titleEn: 'Tech News #1852: Nothing Phone 3 Flagship Leaks, Realme 14 Pro India Date & Jio 5G Revisions',
          titleTe: 'టెక్ న్యూస్ #1852: నథింగ్ ఫోన్ 3 లీక్స్, రియల్‌మీ 14 ప్రో లాంచ్ డేట్ మరియు జియో కొత్త 5G ప్లాన్స్!',
          summaryEn: 'In episode #1852, Prasad Tech In Telugu delivers an action-packed briefing covering upcoming premium mid-rangers and telecom policies. Headlining today is the Nothing Phone 3 featuring Qualcomm silicon, Realme\'s periscope zoom camera aggressive pricing, and new telecom regulations.',
          summaryTe: 'ప్రసాద్ టెక్ ఇన్ తెలుగు ఎపిసోడ్ #1852 లో స్మార్ట్‌ఫోన్ మార్కెట్ మరియు టెలికాం రంగంలో వచ్చిన ముఖ్యమైన మార్పులను అందించారు. నథింగ్ ఫోన్ 3 విశేషాలు, రియల్‌మీ 14 ప్రో కెమెరా వివరాలు మరియు జియో 5G డేటా ప్లాన్‌ల సమగ్ర సమీక్ష ఇది.',
          introEn: 'Namaskaram friends! Welcome to today\'s tech pulse. Big news coming in regarding flagship processors and aggressive pricing in the sub-₹35,000 category.',
          introTe: 'నమస్కారం తెలుగు టెక్ వీక్షకులకు స్వాగతం! నేటి ఎపిసోడ్‌లో ఫ్లాగ్‌షిప్ ప్రాసెసర్‌లు మరియు బడ్జెట్ మొబైల్స్ పై ఆసక్తికరమైన సమాచారం మీ కోసం.',
          keyTakeawaysEn: JSON.stringify([
            'Nothing Phone 3 tipped to feature Snapdragon 8s Gen 4 with customizable Glyph Matrix',
            'Realme 14 Pro Plus confirmed with 50MP Sony LYT-600 3x periscope zoom under ₹30,000',
            'Samsung Galaxy S25 Ultra expected India launch pricing leaked around ₹1,34,999',
            'Jio clarifies fair-usage policies for unlimited 5G recharges',
          ]),
          keyTakeawaysTe: JSON.stringify([
            'స్నాప్‌డ్రాగన్ 8s Gen 4 ప్రాసెసర్‌తో రానున్న నథింగ్ ఫోన్ 3',
            '₹30,000 లోపు 50MP పెరిస్కోప్ టెలిఫోటో జూమ్‌తో రియల్‌మీ 14 ప్రో ప్లస్',
            'శాంసంగ్ గెలాక్సీ S25 అల్ట్రా ఇండియా ధర దాదాపు ₹1,34,999 గా అంచనా',
            'జియో అన్‌లిమిటెడ్ 5G ప్లాన్‌లపై కొత్త నిబంధనలు',
          ]),
          publicationState: 'Published',
          publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
        },
      },
    },
  });

  // Topics for 1852
  const topic1 = await prisma.newsTopic.create({
    data: {
      episodeId: ep1852.id,
      timestamp: '00:42',
      seconds: 42,
      titleEn: 'Nothing Phone 3 First Look & Snapdragon 8s Gen 4 Leaks',
      titleTe: 'నథింగ్ ఫోన్ 3 ఫస్ట్ లుక్ & స్నాప్‌డ్రాగన్ 8s Gen 4 వివరాలు',
      summaryEn: 'Leaks suggest Nothing is ditching mid-range chips for a flagship-tier Snapdragon 8 series, along with a completely redesigned back glyph lighting system and eSIM support.',
      summaryTe: 'నథింగ్ ఫోన్ 3 మరింత శక్తివంతమైన స్నాప్‌డ్రాగన్ ప్రాసెసర్‌తో పాటు కొత్త గ్లిఫ్ ఇంటర్‌ఫేస్ మరియు ప్రీమియం గ్లాస్ బాడీతో రానుంది.',
      category: 'Smartphones',
      isSelectedForDeepDive: true,
    },
  });

  const topic2 = await prisma.newsTopic.create({
    data: {
      episodeId: ep1852.id,
      timestamp: '02:15',
      seconds: 135,
      titleEn: 'Realme 14 Pro Plus India Launch Date & Periscope Zoom',
      titleTe: 'రియల్‌మీ 14 ప్రో ప్లస్ ఇండియా లాంచ్ డేట్ & పెరిస్కోప్ కెమెరా',
      summaryEn: 'Realme continues to disrupt the sub-₹30K category by bringing a true 50MP periscope zoom lens with OIS and a 6000mAh battery.',
      summaryTe: 'రియల్‌మీ 14 ప్రో ప్లస్ మోడల్ ₹30,000 ధర విభాగంలో 3x పెరిస్కోప్ లెన్స్ మరియు 6000mAh బ్యాటరీతో లాంచ్ కానుంది.',
      category: 'Smartphones',
      isSelectedForDeepDive: true,
    },
  });

  await prisma.newsTopic.createMany({
    data: [
      {
        episodeId: ep1852.id,
        timestamp: '03:50',
        seconds: 230,
        titleEn: 'Samsung Galaxy S25 Ultra Price Leak in India',
        titleTe: 'శాంసంగ్ గెలాక్సీ S25 అల్ట్రా ఇండియా ధర లీక్',
        summaryEn: 'Expected retail price leaked at ₹1,34,999 with 12GB RAM standard across all storage tiers.',
        summaryTe: 'భారతదేశంలో శాంసంగ్ ఎస్25 అల్ట్రా ప్రారంభ ధర ₹1,34,999 ఉండవచ్చని సమాచారం.',
        category: 'Smartphones',
      },
      {
        episodeId: ep1852.id,
        timestamp: '05:10',
        seconds: 310,
        titleEn: 'Jio New 5G Unlimited True Data Plans Announced',
        titleTe: 'జియో సరికొత్త అన్‌లిమిటెడ్ 5G ప్లాన్స్',
        summaryEn: 'Reliance Jio announced revised tariffs with complimentary cloud storage and 5G network priority passes.',
        summaryTe: 'రిలయన్స్ జియో కొత్త రీఛార్జ్ ప్లాన్‌లలో క్లౌడ్ స్టోరేజ్ మరియు 5G స్పీడ్ ప్రయోజనాలను ప్రకటించింది.',
        category: 'Telecom',
      },
      {
        episodeId: ep1852.id,
        timestamp: '08:20',
        seconds: 500,
        titleEn: 'Ryzen 9000X3D Processors India Pricing Update',
        titleTe: 'రైజెన్ 9000X3D గేమింగ్ ప్రాసెసర్లు ఇండియా ధరలు',
        summaryEn: 'AMD officially brings its gaming flagship CPU to Indian distributors starting at ₹46,500.',
        summaryTe: 'గేమింగ్ ప్రియుల కోసం ఏఎమ్‌డీ రైజెన్ 9000X3D ప్రాసెసర్లు ఇండియన్ మార్కెట్‌లోకి అధికారికంగా వచ్చాయి.',
        category: 'Hardware',
      },
    ],
  });

  // Deep-Dive 1 for 1852
  await prisma.deepDiveArticle.create({
    data: {
      episodeId: ep1852.id,
      topicId: topic1.id,
      slug: 'nothing-phone-3-flagship-specs-price-india',
      titleEn: 'Nothing Phone 3 Deep Dive: Snapdragon 8s Gen 4, Redesigned Glyph & Price Expectations',
      titleTe: 'నథింగ్ ఫోన్ 3 డీప్ డైవ్: స్నాప్‌డ్రాగన్ 8s Gen 4, కొత్త గ్లిఫ్ మరియు ఇండియా ధరల అంచనా',
      category: 'Smartphones',
      readTimeMinutes: 5,
      coverImage: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1200&q=80',
      publicationState: 'Published',
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 7),
      specsJson: JSON.stringify({
        Processor: 'Qualcomm Snapdragon 8s Gen 4 (4nm)',
        Display: '6.7-inch 1.5K Flexible OLED, 120Hz LTPO',
        Cameras: '50MP Sony LYT Primary + 50MP Ultra-wide',
        Battery: '5,500 mAh Silicon-Carbon with 65W Charging',
        OS: 'Nothing OS 3.0 based on Android 15',
        'Expected Price': '₹42,999 - ₹45,999',
      }),
      contentEn: `## The Shift Toward True Premium Flagships

Carl Pei's Nothing is entering its third generation, and the ambitions are significantly higher. In Tech News #1852, Prasad pointed out that Nothing is moving away from the upper mid-range compromise seen in the Phone (2) and aiming straight for premium territory.

## Architectural Highlights

- **Snapdragon 8s Gen 4 Silicon:** Provides an ideal sweet spot between raw computing power and thermal management, avoiding the throttle issues of older chips.
- **Micro-LED Glyph Matrix:** A much denser LED array capable of granular animations, countdowns, and app-specific notification rings.
- **Clean Software Experience:** Nothing OS 3.0 promises zero bloatware, locking in snappy performance with 4 years of OS upgrades.

## Prasad's Perspective & Value Analysis

Prasad highlighted: *"If Nothing prices this phone above ₹48,000, it faces brutal competition from OnePlus and Samsung. But in the ₹40,000 to ₹45,000 sweet spot with card discounts, this clean design and snappy OS will be a massive hit in India."*

## The Bottom Line

For Telugu tech enthusiasts looking for an iPhone alternative that doesn't push into ₹70,000+ territory, the Nothing Phone 3 is shaping up to be one of the most exciting launches of the upcoming season.`,
      contentTe: `## ప్రీమియం సెగ్మెంట్‌లోకి నథింగ్ ఎంట్రీ

నథింగ్ బ్రాండ్ తన మూడవ తరం స్మార్ట్‌ఫోన్‌తో మరింత ఉన్నత స్థాయికి చేరుకుంటోంది. మన ప్రసాద్ టెక్ ఇన్ తెలుగు ఎపిసోడ్ #1852 లో ప్రసాద్ గారు పేర్కొన్నట్లుగా, ఈసారి నథింగ్ ఫోన్ 3 పనితీరులో ఎటువంటి రాజీ పడకుండా ఫ్లాగ్‌షిప్ ఫీచర్లతో రాబోతోంది.

## ముఖ్యమైన ఫీచర్లు

- **శక్తివంతమైన ప్రాసెసర్:** స్నాప్‌డ్రాగన్ 8s Gen 4 చిప్‌సెట్‌తో హెవీ గేమింగ్ మరియు మల్టీ టాస్కింగ్ లో అద్భుతమైన వేగం.
- **కొత్త గ్లిఫ్ లైటింగ్:** వెనుక భాగంలో మరింత ఆధునికమైన ఎల్ఈడీ ప్యాటర్న్స్, టైమర్ మరియు నోటిఫికేషన్ ఇండికేటర్స్.
- **క్లీన్ సాఫ్ట్‌వేర్:** ఎటువంటి అనవసర యాప్స్ (బ్లోట్‌వేర్) లేని నథింగ్ ఓఎస్ 3.0 అనుభూతి.

## ప్రసాద్ గారి విశ్లేషణ

ప్రసాద్ గారి అభిప్రాయం ప్రకారం: *"ఈ ఫోన్ ధరను ₹42,000 నుండి ₹45,000 మధ్య లాంచ్ చేస్తే వన్ ప్లస్ మరియు ఐకూ ఫోన్లకు గట్టి పోటీ ఇవ్వగలదు. క్లీన్ సాఫ్ట్‌వేర్ మరియు ప్రత్యేకమైన డిజైన్ కోరుకునే వారికి ఇది ఒక బెస్ట్ ఆప్షన్ అవుతుంది!"*

## ముగింపు

సరికొత్త లుక్ మరియు వేగవంతమైన పనితీరును ఆశించే వారికి నథింగ్ ఫోన్ 3 ఖచ్చితంగా ఒక గొప్ప ఎంపిక కానుంది. అధికారిక లాంచ్ ఆఫర్లను గమనించడం మర్చిపోకండి!`,
    },
  });

  // Deep-Dive 2 for 1852
  await prisma.deepDiveArticle.create({
    data: {
      episodeId: ep1852.id,
      topicId: topic2.id,
      slug: 'realme-14-pro-plus-periscope-camera-india-launch',
      titleEn: 'Realme 14 Pro+ Analysis: Periscope Camera Under ₹30,000 & 6000mAh Battery',
      titleTe: 'రియల్‌మీ 14 ప్రో+ విశ్లేషణ: ₹30,000 లోపు పెరిస్కోప్ జూమ్ మరియు 6000mAh బ్యాటరీ',
      category: 'Smartphones',
      readTimeMinutes: 4,
      coverImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80',
      publicationState: 'Published',
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
      specsJson: JSON.stringify({
        Processor: 'MediaTek Dimensity 7300-Ultra / Snapdragon 7s Gen 3',
        Display: '6.7-inch 120Hz Curved AMOLED with 2160Hz PWM Dimming',
        Cameras: '50MP Sony IMX890 OIS + 50MP Periscope (3x optical, 120x digital)',
        Battery: '6,000 mAh Silicon-Carbon with 80W SuperVOOC',
        'Expected Price': '₹28,999 - ₹31,999',
      }),
      contentEn: `## Bringing Flagship Camera Tech to the Masses

Realme's number series has carved a dominant niche in Indian tier-1 and tier-2 cities. With the Realme 14 Pro+, the focus is squarely on long-distance telephoto photography without demanding flagship prices.

## Camera System Breakdown

- **3x Optical Periscope Lens:** Utilizing the Sony sensor with dedicated Optical Image Stabilization ensures clean, shake-free portrait photos even at dusk.
- **Cold-Resistant 6,000 mAh Battery:** Despite housing a bulky periscope prism module, Realme maintained a sleek 8.2mm chassis.

## Prasad's Candid Verdict

Prasad remarked: *"Realme consistently nails the aesthetic and camera hardware for the Indian market. If you take lots of portrait photos of family and travel, this periscope lens under ₹30,000 offers unmatched utility compared to phones that still give you useless 2MP macro cameras!"*`,
      contentTe: `## బడ్జెట్ ధరలో పెరిస్కోప్ కెమెరా విప్లవం

భారతీయ మొబైల్ మార్కెట్లో రియల్‌మీ నంబర్ సిరీస్ ఫోన్‌లకు ప్రత్యేక ఆదరణ ఉంది. రియల్‌మీ 14 ప్రో+ ద్వారా అత్యంత ఖరీదైన ఫోన్‌లలో మాత్రమే ఉండే పెరిస్కోప్ జూమ్ కెమెరాను సాధారణ వినియోగదారులకు అందుబాటులోకి తెస్తున్నారు.

## కెమెరా విశేషాలు

- **3x ఆప్టికల్ పెరిస్కోప్ జూమ్:** దూరంగా ఉన్న దృశ్యాలను మరియు అందమైన పోర్ట్రెయిట్ ఫోటోలను అద్భుతమైన స్పష్టతతో క్యాప్చర్ చేస్తుంది.
- **6,000 mAh భారీ బ్యాటరీ:** పెరిస్కోప్ లెన్స్ ఉన్నప్పటికీ ఫోన్ సన్నగా మరియు తేలికగా ఉండేలా రూపొందించారు.

## ప్రసాద్ గారి బాటమ్ లైన్

ప్రసాద్ గారు చెప్పినట్లుగా: *"ఉపయోగం లేని 2MP డెప్త్ లేదా మాక్రో కెమెరాల స్థానంలో నిజమైన పెరిస్కోప్ లెన్స్ ఇవ్వడం అభినందనీయం. ఫ్యామిలీ ఫోటోలు మరియు ప్రయాణాలలో మంచి ఫోటోలు తీయాలనుకునే వారికి ₹30,000 బడ్జెట్‌లో ఇది సూపర్ డీల్!"*`,
    },
  });

  // 2. Seed Episode 1851
  await prisma.episode.create({
    data: {
      youtubeId: 'K9jL8pQ1w2e',
      episodeNumber: 1851,
      videoTitle: 'Tech News # 1851 - OnePlus 13 Official Specs, Intel Core Ultra 200, iQOO 13 AnTuTu Score!',
      videoUrl: 'https://www.youtube.com/watch?v=K9jL8pQ1w2e',
      thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 32),
      channelTitle: 'Prasad Tech In Telugu',
      generationStage: 'Published',
      digest: {
        create: {
          slug: 'tech-news-1851-oneplus-13-iqoo-13-intel-arrow-lake',
          titleEn: 'Tech News #1851: OnePlus 13 BOE Display & Glacier Battery, iQOO 13 AnTuTu Record',
          titleTe: 'టెక్ న్యూస్ #1851: వన్‌ప్లస్ 13 అఫీషియల్ స్పెసిఫికేషన్లు, ఐకూ 13 బెంచ్‌మార్క్ రికార్డు మరియు ఇంటెల్ సీపీయూలు!',
          summaryEn: 'Episode #1851 examines the Snapdragon 8 Elite showdown. OnePlus unveiled official engineering details of the OnePlus 13 with an IP69 rating, while iQOO 13 scored over 3.1 million on AnTuTu benchmarks.',
          summaryTe: 'ఎపిసోడ్ #1851 లో సరికొత్త స్నాప్‌డ్రాగన్ 8 ఎలైట్ ప్రాసెసర్ పనితీరును విశ్లేషించారు. వన్‌ప్లస్ 13 డిస్ప్లే మరియు గ్లేసియర్ బ్యాటరీ వివరాలు, ఐకూ 13 సాధించిన రికార్డు స్కోర్ గురించి చర్చించారు.',
          introEn: 'Welcome tech fans! Flagship season is officially in full throttle. Today we cover gaming monsters and new desktop processors.',
          introTe: 'నమస్కారం! సరికొత్త ఫ్లాగ్‌షిప్ స్మార్ట్‌ఫోన్‌ల సీజన్ మొదలైంది. అత్యంత వేగవంతమైన గేమింగ్ ఫోన్ల విశేషాలు నేటి డైజెస్ట్‌లో ఉన్నాయి.',
          keyTakeawaysEn: JSON.stringify([
            'OnePlus 13 features IP68 and IP69 dust and high-pressure water ingress resistance',
            'iQOO 13 crosses 3.15 million points on AnTuTu v10 benchmark with dedicated Q2 gaming chip',
            'Intel Core Ultra 200S desktop processors prioritize power efficiency over clock speeds',
            'Google confirms Pixel 10 Tensor G5 processor is shifting to TSMC 3nm foundry',
          ]),
          keyTakeawaysTe: JSON.stringify([
            'IP68 మరియు IP69 డస్ట్ & వాటర్ రెసిస్టెన్స్‌తో వన్‌ప్లస్ 13',
            'Q2 గేమింగ్ చిప్‌తో 31.5 లక్షల AnTuTu స్కోర్ సాధించిన ఐకూ 13',
            'తక్కువ పవర్ వినియోగంతో ఇంటెల్ కోర్ అల్ట్రా 200S డెస్క్‌టాప్ ప్రాసెసర్లు',
            'గూగుల్ పిక్సెల్ 10 టెన్సర్ G5 ప్రాసెసర్ TSMC 3nm కి మారుతున్నట్లు నిర్ధారణ',
          ]),
          publicationState: 'Published',
          publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 32),
        },
      },
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
