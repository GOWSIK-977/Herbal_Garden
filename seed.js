const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./backend/models/Product');

dotenv.config();

const productsData = [
  {
    name: 'Tulsi (Holy Basil)',
    scientificName: 'Ocimum tenuiflorum',
    description: 'Tulsi is a sacred plant in Hindu belief and is regarded as an elixir of life. It has strong antioxidant, anti-inflammatory, and antimicrobial properties.',
    uses: 'Boosts immunity, relieves stress, supports respiratory health, cures common cold and cough.',
    preparation: 'Brew leaves as tea or extract juice. Can be consumed directly.',
    precautions: 'May lower blood sugar. Consult doctor if pregnant or breastfeeding.',
    parts: ['leaves', 'flowers'],
    tags: ['immunity boosters', 'respiratory health', 'popular'],
    imageUrl: 'images/tulsi-holy-basil.jpg',
    rating: 4.8,
    ratingCount: 154,
    variants: [
      { size: '50g', price: 120, stock: 150 },
      { size: '100g', price: 216, stock: 120 },
      { size: '250g', price: 480, stock: 80 }
    ]
  },
  {
    name: 'Ashwagandha',
    scientificName: 'Withania somnifera',
    description: 'Ashwagandha is one of the most important herbs in Ayurveda. It has been used for over 3,000 years to relieve stress, increase energy levels, and improve concentration.',
    uses: 'Reduces stress and anxiety, improves sleep quality, boosts vitality and strength, enhances brain function.',
    preparation: 'Take powder with warm milk or honey before bed.',
    precautions: 'Avoid during pregnancy. May interact with thyroid or blood pressure medications.',
    parts: ['roots'],
    tags: ['stress relief', 'vitality', 'brain health', 'popular'],
    imageUrl: 'images/ashwagandha.jpg',
    rating: 4.9,
    ratingCount: 210,
    variants: [
      { size: '50g', price: 150, stock: 120 },
      { size: '100g', price: 270, stock: 100 },
      { size: '250g', price: 600, stock: 50 }
    ]
  },
  {
    name: 'Neem',
    scientificName: 'Azadirachta indica',
    description: 'Known as the "Nature\'s Drugstore", Neem has powerful antibacterial, antifungal, and antiviral properties. It is highly valued for skin care and detoxification.',
    uses: 'Purifies blood, treats skin acne and infections, promotes healthy teeth and gums, boosts liver health.',
    preparation: 'Leaves paste can be applied topically. Neem water or tablets can be consumed.',
    precautions: 'Not recommended for infants or pregnant women. Avoid long-term continuous high dosage.',
    parts: ['leaves', 'bark', 'seeds'],
    tags: ['skin care', 'detox', 'blood purifier'],
    imageUrl: 'images/neem.jpg',
    rating: 4.6,
    ratingCount: 98,
    variants: [
      { size: '50g', price: 90, stock: 200 },
      { size: '100g', price: 162, stock: 180 },
      { size: '250g', price: 360, stock: 100 }
    ]
  },
  {
    name: 'Amla (Indian Gooseberry)',
    scientificName: 'Phyllanthus emblica',
    description: 'Amla is an exceptionally rich source of Vitamin C. It is a powerful natural antioxidant that rejuvenates all body tissues and organs.',
    uses: 'Improves digestion, enhances skin and hair health, strengthens eyesight, boosts immune response.',
    preparation: 'Consume fresh juice, dried powder, or as Chyawanprash.',
    precautions: 'May increase risk of bleeding in people with bleeding disorders.',
    parts: ['fruits'],
    tags: ['immunity boosters', 'hair care', 'digestion', 'popular'],
    imageUrl: 'images/amla-indian-gooseberry.jpg',
    rating: 4.7,
    ratingCount: 145,
    variants: [
      { size: '50g', price: 110, stock: 150 },
      { size: '100g', price: 198, stock: 140 },
      { size: '250g', price: 440, stock: 90 }
    ]
  },
  {
    name: 'Giloy (Guduchi)',
    scientificName: 'Tinospora cordifolia',
    description: 'Giloy is known as "Amrita" in Sanskrit, translating literally to "the root of immortality". It is a versatile herbal adaptogen and immunomodulator.',
    uses: 'Treats chronic fevers, manages diabetes, boosts immunity, reduces anxiety and mental stress.',
    preparation: 'Boil stems in water to make decoction (kadha) or take juice.',
    precautions: 'May lower blood glucose levels, monitor if diabetic. Autoimmune patients should consult a physician.',
    parts: ['whole plant'],
    tags: ['immunity boosters', 'fever relief', 'diabetes management'],
    imageUrl: 'images/giloy-guduchi.jpg',
    rating: 4.7,
    ratingCount: 132,
    variants: [
      { size: '50g', price: 140, stock: 100 },
      { size: '100g', price: 252, stock: 90 },
      { size: '250g', price: 560, stock: 60 }
    ]
  },
  {
    name: 'Shatavari',
    scientificName: 'Asparagus racemosus',
    description: 'Shatavari is the primary Ayurvedic rejuvenative herb for women. It translates to "she who possesses a hundred husbands" referring to its power to support fertility and vitality.',
    uses: 'Supports female reproductive system, enhances lactation, balances hormones, soothes digestive tract.',
    preparation: 'Take powder with warm milk or ghee.',
    precautions: 'Avoid if sensitive to asparagus or have kidney disease.',
    parts: ['roots'],
    tags: ['women health', 'hormonal balance', 'vitality'],
    imageUrl: 'images/shatavari.jpg',
    rating: 4.8,
    ratingCount: 120,
    variants: [
      { size: '50g', price: 160, stock: 90 },
      { size: '100g', price: 288, stock: 80 },
      { size: '250g', price: 640, stock: 40 }
    ]
  },
  {
    name: 'Turmeric (Haldi)',
    scientificName: 'Curcuma longa',
    description: 'Turmeric is a golden spice widely renowned for its bioactive compound curcumin, which has scientifically proven health benefits.',
    uses: 'Anti-inflammatory, powerful antioxidant, improves joint health and reduces pain, prevents cell damage.',
    preparation: 'Mix in milk (Golden Milk) or use in cooking.',
    precautions: 'Safe in dietary amounts. High doses may thin the blood.',
    parts: ['rhizome'],
    tags: ['anti-inflammatory', 'joint health', 'skin care', 'popular'],
    imageUrl: 'images/turmeric-haldi.jpg',
    rating: 4.9,
    ratingCount: 250,
    variants: [
      { size: '50g', price: 85, stock: 300 },
      { size: '100g', price: 153, stock: 250 },
      { size: '250g', price: 340, stock: 150 }
    ]
  },
  {
    name: 'Ginger (Sunthi)',
    scientificName: 'Zingiber officinale',
    description: 'Ginger is a popular culinary and medicinal root. It contains gingerol, which has powerful anti-inflammatory and antioxidant properties.',
    uses: 'Relieves nausea and morning sickness, aids digestion, reduces muscle pain, lowers cholesterol.',
    preparation: 'Brew fresh ginger tea, chew raw slices, or take dry powder.',
    precautions: 'High doses might cause mild heartburn or diarrhea.',
    parts: ['rhizome'],
    tags: ['digestion', 'nausea relief', 'anti-inflammatory'],
    imageUrl: 'images/ginger-sunthi.jpg',
    rating: 4.5,
    ratingCount: 88,
    variants: [
      { size: '50g', price: 95, stock: 220 },
      { size: '100g', price: 171, stock: 200 },
      { size: '250g', price: 380, stock: 120 }
    ]
  },
  {
    name: 'Garlic (Lahsun)',
    scientificName: 'Allium sativum',
    description: 'Garlic is a species in the onion genus and is native to Central Asia. It contains compounds with potent medicinal properties, particularly allicin.',
    uses: 'Reduces blood pressure, lowers LDL cholesterol, prevents common cold, improves bone health.',
    preparation: 'Consume raw cloves on an empty stomach or use in food.',
    precautions: 'Can cause bad breath. May interact with blood thinners.',
    parts: ['bulb'],
    tags: ['heart health', 'blood pressure', 'immunity boosters'],
    imageUrl: 'images/garlic-lahsun.jpg',
    rating: 4.6,
    ratingCount: 110,
    variants: [
      { size: '50g', price: 80, stock: 250 },
      { size: '100g', price: 144, stock: 200 },
      { size: '250g', price: 320, stock: 100 }
    ]
  },
  {
    name: 'Cinnamon (Dalchini)',
    scientificName: 'Cinnamomum verum',
    description: 'Cinnamon is a delicious spice obtained from the inner bark of trees. It has been used as an ingredient throughout history, dating back as far as Ancient Egypt.',
    uses: 'Lowers blood sugar levels, reduces insulin resistance, protects against neurological diseases.',
    preparation: 'Add bark sticks to tea, porridge, or use powder in baking.',
    precautions: 'Ceylon cinnamon is preferred over Cassia cinnamon to avoid high coumarin levels.',
    parts: ['bark'],
    tags: ['diabetes management', 'heart health', 'metabolism'],
    imageUrl: 'images/cinnamon-dalchini.jpg',
    rating: 4.7,
    ratingCount: 115,
    variants: [
      { size: '50g', price: 130, stock: 140 },
      { size: '100g', price: 234, stock: 120 },
      { size: '250g', price: 520, stock: 80 }
    ]
  },
  {
    name: 'Cardamom (Elaichi)',
    scientificName: 'Elettaria cardamomum',
    description: 'Often referred to as the "Queen of Spices", Cardamom has a complex aroma and is widely used for culinary and oral hygiene purposes.',
    uses: 'Freshens breath, cures digestive discomfort, has diuretic properties, lowers blood pressure.',
    preparation: 'Chew whole pods or brew powder in milk/tea.',
    precautions: 'Safe in standard dietary amounts. Consult physician for large extracts.',
    parts: ['seeds'],
    tags: ['digestion', 'oral care', 'popular'],
    imageUrl: 'images/cardamom-elaichi.jpg',
    rating: 4.8,
    ratingCount: 142,
    variants: [
      { size: '50g', price: 220, stock: 100 },
      { size: '100g', price: 396, stock: 90 },
      { size: '250g', price: 880, stock: 50 }
    ]
  },
  {
    name: 'Clove (Laung)',
    scientificName: 'Syzygium aromaticum',
    description: 'Cloves are the aromatic flower buds of a tree in the family Myrtaceae. They contain eugenol, which makes them an outstanding local anesthetic.',
    uses: 'Relieves toothache and gum pain, improves liver health, regulates blood sugar, preserves bone mass.',
    preparation: 'Apply clove oil to sore teeth, chew whole buds, or steep in hot water.',
    precautions: 'Clove oil can irritate skin or gums if applied undiluted in large quantities.',
    parts: ['flowers'],
    tags: ['oral care', 'pain relief', 'anti-inflammatory'],
    imageUrl: 'images/clove-laung.jpg',
    rating: 4.7,
    ratingCount: 105,
    variants: [
      { size: '50g', price: 180, stock: 110 },
      { size: '100g', price: 324, stock: 100 },
      { size: '250g', price: 720, stock: 60 }
    ]
  },
  {
    name: 'Black Pepper (Kali Mirch)',
    scientificName: 'Piper nigrum',
    description: 'Black pepper is the fruit of the black pepper plant and is used as both a spice and medicine. Its active compound piperine dramatically enhances absorption of other nutrients.',
    uses: 'Enhances nutrient absorption (especially curcumin), boosts brain function, improves gut health.',
    preparation: 'Freshly grind over meals. Consume with turmeric for maximum synergy.',
    precautions: 'May cause sneezing or stomach upset in excessive quantities.',
    parts: ['fruits'],
    tags: ['digestion', 'metabolism', 'nutrient absorption'],
    imageUrl: 'images/black-pepper-kali-mirch.jpg',
    rating: 4.6,
    ratingCount: 89,
    variants: [
      { size: '50g', price: 170, stock: 150 },
      { size: '100g', price: 306, stock: 130 },
      { size: '250g', price: 680, stock: 80 }
    ]
  },
  {
    name: 'Fenugreek (Methi)',
    scientificName: 'Trigonella foenum-graecum',
    description: 'Fenugreek is an annual plant with yellow-white flowers and aromatic seeds. It is a traditional Ayurvedic remedy for digestive and metabolic support.',
    uses: 'Controls diabetes and insulin sensitivity, increases breastmilk production, lowers cholesterol.',
    preparation: 'Soak seeds overnight in water and drink the water in morning, or consume sprouts.',
    precautions: 'May cause mild bloating or gas. Can lower blood sugar excessively if combined with insulin.',
    parts: ['seeds', 'leaves'],
    tags: ['diabetes management', 'digestion', 'women health'],
    imageUrl: 'images/fenugreek-methi.jpg',
    rating: 4.4,
    ratingCount: 76,
    variants: [
      { size: '50g', price: 75, stock: 280 },
      { size: '100g', price: 135, stock: 240 },
      { size: '250g', price: 300, stock: 120 }
    ]
  },
  {
    name: 'Brahmi',
    scientificName: 'Bacopa monnieri',
    description: 'Brahmi is a classic Ayurvedic brain and nerve tonic. It is named after Brahma, the creator god, representing its high status in traditional medicine.',
    uses: 'Enhances memory and cognitive performance, reduces ADHD symptoms, lowers anxiety and stress.',
    preparation: 'Take powder with warm water or clarified butter (ghee).',
    precautions: 'May cause nausea or dry mouth. Consult doctor before usage.',
    parts: ['leaves', 'whole plant'],
    tags: ['brain health', 'stress relief', 'memory booster'],
    imageUrl: 'images/brahmi.jpg',
    rating: 4.8,
    ratingCount: 112,
    variants: [
      { size: '50g', price: 145, stock: 130 },
      { size: '100g', price: 261, stock: 100 },
      { size: '250g', price: 580, stock: 60 }
    ]
  },
  {
    name: 'Gotu Kola (Mandukaparni)',
    scientificName: 'Centella asiatica',
    description: 'Gotu Kola is known as the "herb of longevity". It is a staple in traditional Chinese, Indonesian, and Ayurvedic medicine to boost cognitive health.',
    uses: 'Improves blood circulation, heals wounds, reduces joint swelling, enhances memory retention.',
    preparation: 'Consume leaves juice or take dried herb tea.',
    precautions: 'High doses might cause headache or sleepiness. Rare liver toxicities in extreme long-term use.',
    parts: ['leaves', 'whole plant'],
    tags: ['circulation', 'skin care', 'brain health'],
    imageUrl: 'images/gotu-kola-mandukaparni.jpg',
    rating: 4.6,
    ratingCount: 78,
    variants: [
      { size: '50g', price: 135, stock: 110 },
      { size: '100g', price: 243, stock: 90 },
      { size: '250g', price: 540, stock: 50 }
    ]
  },
  {
    name: 'Licorice (Mulethi)',
    scientificName: 'Glycyrrhiza glabra',
    description: 'Licorice is a sweet root used traditionally for soothing respiratory and gastrointestinal membranes. It has powerful demulcent properties.',
    uses: 'Soothes sore throat and cough, cures acid reflux and stomach ulcers, reduces chronic inflammation.',
    preparation: 'Chew raw twigs or brew root chips in hot water.',
    precautions: 'Excessive consumption can raise blood pressure and drop potassium levels.',
    parts: ['roots'],
    tags: ['respiratory health', 'digestion', 'sore throat'],
    imageUrl: 'images/licorice-mulethi.jpg',
    rating: 4.7,
    ratingCount: 118,
    variants: [
      { size: '50g', price: 125, stock: 140 },
      { size: '100g', price: 225, stock: 120 },
      { size: '250g', price: 500, stock: 80 }
    ]
  },
  {
    name: 'Arjuna Bark',
    scientificName: 'Terminalia arjuna',
    description: 'Arjuna is the premier Ayurvedic herb for cardiovascular support. The bark of the tree has been used for centuries to support cardiac wellness.',
    uses: 'Strengthens cardiac muscles, regulates blood pressure, prevents free-radical damage to arteries.',
    preparation: 'Boil bark powder in milk and water (Arjuna Ksheerapaka).',
    precautions: 'Safe in standard doses. Consult a cardiologist if you have pre-existing severe heart disease.',
    parts: ['bark'],
    tags: ['heart health', 'circulation', 'blood pressure'],
    imageUrl: 'images/arjuna-bark.jpg',
    rating: 4.8,
    ratingCount: 124,
    variants: [
      { size: '50g', price: 150, stock: 100 },
      { size: '100g', price: 270, stock: 80 },
      { size: '250g', price: 600, stock: 50 }
    ]
  },
  {
    name: 'Guggul',
    scientificName: 'Commiphora wightii',
    description: 'Guggul is a resin extracted from the Mukul myrrh tree. It has been used in Ayurveda for weight management, joints support, and lipid clearance.',
    uses: 'Lowers cholesterol, reduces arthritic pain, supports thyroid function, helps with skin acne.',
    preparation: 'Take purified Guggul tablets or powder after meals.',
    precautions: 'Do not use if pregnant, lactating, or have hormone-sensitive cancers.',
    parts: ['oil'],
    tags: ['lipid health', 'weight management', 'joint health'],
    imageUrl: 'images/guggul.jpg',
    rating: 4.7,
    ratingCount: 95,
    variants: [
      { size: '50g', price: 190, stock: 90 },
      { size: '100g', price: 342, stock: 80 },
      { size: '250g', price: 760, stock: 40 }
    ]
  },
  {
    name: 'Triphala Blend',
    scientificName: 'Amla, Bibhitaki, Haritaki',
    description: 'Triphala is the most popular Ayurvedic herbal blend, consisting of three fruits. It is a daily rejuvenative that cleanses the colon gently.',
    uses: 'Cures constipation, detoxifies digestive tract, improves skin glow, supports digestion.',
    preparation: 'Mix powder in warm water and drink at night.',
    precautions: 'May cause temporary loose stools or mild cramps during detox phase.',
    parts: ['fruits'],
    tags: ['digestion', 'detox', 'popular'],
    imageUrl: 'images/triphala-blend.jpg',
    rating: 4.9,
    ratingCount: 180,
    variants: [
      { size: '50g', price: 160, stock: 160 },
      { size: '100g', price: 288, stock: 130 },
      { size: '250g', price: 640, stock: 90 }
    ]
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('CONNECTED TO DATABASE FOR SEEDING');

    // Clean products collection
    await Product.deleteMany({});
    console.log('CLEANED EXISTING PRODUCTS COLLECTION');

    // Seed products
    await Product.insertMany(productsData);
    console.log('SUCCESSFULLY SEEDED 20 MEDICINAL PRODUCTS INTO DATABASE');

    mongoose.connection.close();
    console.log('DATABASE CONNECTION CLOSED');
  } catch (error) {
    console.error('ERROR SEEDING DATABASE:', error);
    process.exit(1);
  }
};

seedDB();
