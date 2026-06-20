// Comprehensive Herbal Knowledge Base
const herbalDB = {
  // Enhanced plant database with detailed information
  plants: {
    // Existing plants with enhanced data
    "Tulsi": {
      name: "Tulsi",
      scientific: "Ocimum tenuiflorum",
      family: "Lamiaceae",
      description: "Sacred basil known for its adaptogenic and immunomodulatory properties. Contains eugenol, ursolic acid, and rosmarinic acid.",
      parts_used: ["leaves", "seeds", "roots"],
      active_compounds: ["eugenol", "ursolic acid", "rosmarinic acid", "caryophyllene"],
      properties: ["adaptogen", "immunomodulator", "antioxidant", "anti-inflammatory", "antimicrobial"],
      preparation: [
        {
          type: "Tea",
          method: "Boil 5-6 fresh leaves in 1 cup water for 5 minutes. Strain and drink.",
          dosage: "1-2 times daily",
          uses: ["immunity", "respiratory health", "stress relief"]
        },
        {
          type: "Paste",
          method: "Grind fresh leaves with water to make a paste.",
          application: "Apply on skin for minor cuts or insect bites.",
          uses: ["wound healing", "skin infections"]
        }
      ],
      safety: {
        pregnancy: "Consult doctor before use",
        side_effects: "Rare, may cause nausea in high doses",
        interactions: "May enhance effects of blood thinners"
      },
      traditional_uses: [
        "Ayurvedic remedy for respiratory conditions",
        "Used in Thai cuisine as a culinary herb",
        "Traditional remedy for fever and malaria"
      ],
      research: [
        "Shows adaptogenic and stress-relieving properties (2017, Journal of Ayurveda and Integrative Medicine)",
        "Demonstrates antimicrobial activity against respiratory pathogens (2019, Journal of Ethnopharmacology)"
      ]
    },
    
    // Additional plants with comprehensive data
    "Ashwagandha": {
      name: "Ashwagandha",
      scientific: "Withania somnifera",
      family: "Solanaceae",
      description: "Powerful adaptogen known for its stress-reducing and rejuvenating properties. Contains withanolides, the primary active compounds.",
      parts_used: ["root", "leaves"],
      active_compounds: ["withanolides", "withaferin A", "sitoindosides"],
      properties: ["adaptogen", "anti-inflammatory", "neuroprotective", "antioxidant", "anxiolytic"],
      preparation: [
        {
          type: "Powder",
          method: "Mix 1/2 tsp with warm milk or water",
          dosage: "Once or twice daily, preferably with meals",
          uses: ["stress relief", "energy", "vitality"]
        },
        {
          type: "Capsule",
          method: "300-500mg standardized extract",
          dosage: "1-2 capsules daily with meals",
          uses: ["adrenal support", "anxiety", "sleep"]
        }
      ],
      safety: {
        pregnancy: "Avoid during pregnancy",
        side_effects: "Rare, may cause stomach upset",
        interactions: "May interact with sedatives and thyroid medications"
      },
      traditional_uses: [
        "Used in Ayurveda as a rasayana (rejuvenating tonic)",
        "Traditional remedy for weakness and fatigue",
        "Used to support healthy aging"
      ]
    }
  },
  
  // Disease database with herbal treatments
  diseases: {
    "diabetes": {
      name: "Diabetes",
      description: "A metabolic disorder characterized by high blood sugar levels over a prolonged period.",
      types: ["Type 1", "Type 2", "Gestational"],
      symptoms: ["increased thirst", "frequent urination", "fatigue", "blurred vision"],
      herbal_treatments: [
        {
          plant: "Bitter Melon (Momordica charantia)",
          part_used: "fruit, leaves",
          active_compounds: ["charantin", "vicine", "polypeptide-p"],
          mechanism: "Lowers blood glucose levels by increasing glucose uptake and glycogen synthesis",
          preparation: "Juice of 1-2 bitter melons on an empty stomach in the morning",
          research: "Shows significant hypoglycemic effects in multiple clinical trials"
        },
        {
          plant: "Cinnamon",
          part_used: "bark",
          active_compounds: ["cinnamaldehyde", "proanthocyanidins"],
          mechanism: "Improves insulin sensitivity and glucose metabolism",
          preparation: "1/2 to 1 tsp powder with warm water daily",
          research: "Clinical studies show reduction in fasting blood glucose levels"
        }
      ],
      lifestyle_recommendations: [
        "Regular physical activity",
        "Low glycemic index diet",
        "Stress management techniques",
        "Adequate sleep"
      ],
      precautions: [
        "Monitor blood sugar levels regularly",
        "Consult healthcare provider before combining with diabetes medications",
        "Be cautious of hypoglycemia"
      ]
    },
    "hypertension": {
      name: "Hypertension (High Blood Pressure)",
      description: "A condition characterized by consistently elevated blood pressure in the arteries.",
      symptoms: ["headaches", "shortness of breath", "dizziness", "chest pain"],
      herbal_treatments: [
        {
          plant: "Garlic",
          part_used: "cloves",
          active_compounds: ["allicin", "ajoene"],
          mechanism: "Vasodilation and reduction in cholesterol levels",
          preparation: "1-2 raw garlic cloves daily or aged garlic extract",
          research: "Multiple studies show modest reductions in blood pressure"
        },
        {
          plant: "Hawthorn",
          part_used: "berries, leaves, flowers",
          active_compounds: ["flavonoids", "oligomeric procyanidins"],
          mechanism: "Improves blood flow and strengthens heart function",
          preparation: "300-600mg standardized extract daily",
          research: "Shows promise in managing mild hypertension"
        }
      ]
    }
  },
  
  // Herbal formulations and combinations
  formulations: {
    "triphala": {
      name: "Triphala",
      composition: ["Amla (Emblica officinalis)", "Bibhitaki (Terminalia bellirica)", "Haritaki (Terminalia chebula)"],
      benefits: ["digestive health", "detoxification", "immune support", "antioxidant"],
      preparation: "1/2 to 1 tsp powder in warm water before bed",
      traditional_use: "Classic Ayurvedic formula for gentle detox and rejuvenation"
    },
    "trikatu": {
      name: "Trikatu",
      composition: ["Ginger (Zingiber officinale)", "Black Pepper (Piper nigrum)", "Long Pepper (Piper longum)"],
      benefits: ["digestive fire (agni)", "respiratory health", "metabolism"],
      preparation: "1/4 tsp with honey before meals",
      traditional_use: "Enhances bioavailability of nutrients and herbs"
    }
  },
  
  // Search and query functions
  searchHerbs: function(query) {
    query = query.toLowerCase();
    return Object.values(this.plants).filter(plant => 
      plant.name.toLowerCase().includes(query) ||
      (plant.scientific && plant.scientific.toLowerCase().includes(query)) ||
      (plant.properties && plant.properties.some(prop => prop.toLowerCase().includes(query))) ||
      (plant.active_compounds && plant.active_compounds.some(ac => ac.toLowerCase().includes(query)))
    );
  },
  
  findHerbForDisease: function(diseaseName) {
    const disease = this.diseases[diseaseName.toLowerCase()];
    if (!disease) return null;
    
    return {
      disease: disease.name,
      description: disease.description,
      treatments: disease.herbal_treatments
    };
  },
  
  getHerbDetails: function(herbName) {
    return this.plants[herbName] || null;
  },
  
  // Categorization for easier browsing
  categories: {
    "digestive": ["Ginger", "Peppermint", "Fennel", "Chamomile", "Licorice"],
    "respiratory": ["Tulsi", "Licorice", "Eucalyptus", "Thyme", "Mullein"],
    "stress": ["Ashwagandha", "Brahmi", "Gotu Kola", "Lavender", "Chamomile"],
    "immunity": ["Echinacea", "Elderberry", "Astragalus", "Andrographis", "Ginseng"],
    "pain": ["Turmeric", "Willow Bark", "Boswellia", "Cayenne", "Clove"],
    "skin": ["Neem", "Aloe Vera", "Calendula", "Tea Tree", "Chamomile"]
  }
};

// Make available globally
window.herbalDB = herbalDB;
