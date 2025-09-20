# Asset Mapping Images

This folder contains images for the Asset Mapping functionality. The images are organized by state and village.

## Image Structure

Images should be named using the following pattern:
- `{village}_{type}_{number}.jpg`

Where:
- `village` is the village name in lowercase
- `type` is the image type (forest, village, community)
- `number` is a sequential number

## Example Images

For demonstration purposes, the following images are expected:

### Madhya Pradesh
- **Bhind**: bhind_forest_1.jpg, bhind_village_1.jpg, bhind_community_1.jpg
- **Satna**: satna_forest_1.jpg, satna_village_1.jpg, satna_community_1.jpg

### Tripura
- **Nidaya**: nidaya_forest_1.jpg, nidaya_village_1.jpg, nidaya_community_1.jpg
- **Agartala**: agartala_forest_1.jpg, agartala_village_1.jpg, agartala_community_1.jpg

### Odisha
- **Jagatsinghpur**: jagatsinghpur_forest_1.jpg, jagatsinghpur_village_1.jpg, jagatsinghpur_community_1.jpg
- **Kalahandi**: kalahandi_forest_1.jpg, kalahandi_village_1.jpg, kalahandi_community_1.jpg

### Telangana
- **Narayanpet**: narayanpet_forest_1.jpg, narayanpet_village_1.jpg, narayanpet_community_1.jpg
- **Venkatapur**: venkatapur_forest_1.jpg, venkatapur_village_1.jpg, venkatapur_community_1.jpg

## Adding New Images

To add new images:
1. Place the image files in this directory
2. Follow the naming convention above
3. Update the `imageMapping` object in `data/stateVillageData.js` if needed

## Image Requirements

- Format: JPG or PNG
- Recommended size: 800x600 pixels or similar aspect ratio
- File size: Under 2MB per image
- Content: Should show relevant forest, village, or community scenes
