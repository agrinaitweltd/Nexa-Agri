export const BUSINESS_CATEGORIES = [
  {
    category: "Crop Farming",
    types: [
      "Crop Farming (Maize, Wheat, Rice, etc.)",
      "Organic Farming",
      "Greenhouse Farming",
      "Floriculture (Flowers)",
      "Coffee Farming",
      "Tea Farming",
      "Cocoa Farming",
      "Sugarcane Farming",
      "Cotton Farming",
      "Mushroom Farming"
    ]
  },
  {
    category: "Livestock Farming",
    types: [
      "Livestock Farming (Cattle, Sheep, Goats)",
      "Poultry Farming",
      "Fish Farming (Aquaculture)",
      "Beekeeping (Apiculture)"
    ]
  },
  {
    category: "Agricultural Exports",
    types: [
      "Coffee Export",
      "Tea Export",
      "Horticulture Export (Fruits/Veg)",
      "Organic Produce Export",
      "Produce Trading / Aggregation",
      "General Agricultural Exports"
    ]
  }
];

export const mapTypeToSector = (type: string, category: string): import('../types').Sector => {
  const lowerType = type.toLowerCase();
  const lowerCat = category.toLowerCase();

  if (lowerType.includes('livestock') || lowerType.includes('poultry') || lowerType.includes('fish') || lowerType.includes('bee')) {
    return 'LIVESTOCK';
  }
  if (lowerCat.includes('export') || lowerCat.includes('trade')) {
    return 'EXPORT';
  }
  if (lowerCat.includes('crop') || lowerCat.includes('farming')) {
    return 'FARMING';
  }
  
  return 'GENERAL';
};