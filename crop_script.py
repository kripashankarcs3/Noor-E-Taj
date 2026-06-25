from PIL import Image
import os

# Paths
source_img_path = r"C:\Users\kripa\.gemini\antigravity-ide\brain\da42ffd1-98d2-4437-ac54-5439d00c3999\media__1782068790646.jpg"
dest_dir = r"d:\BrideVerse AI\public"

# Create dest dir if not exists
os.makedirs(dest_dir, exist_ok=True)

img = Image.open(source_img_path)
width, height = img.size
print(f"Loaded image size: {width}x{height}")

# Define coordinates for cropping (left, top, right, bottom)
crops = {
    # 1. Digital Twin Portrait from Screen 1 (approx y: 0 to 205)
    "digital_twin_portrait.png": (100, 56, 215, 175),
    
    # 2. Luxury Salon interior from Screen 2 (approx y: 205 to 410)
    "luxury_salon.png": (185, 220, 332, 365),
    
    # 3. Bridal Lehenga / Gown from Screen 3 (approx y: 410 to 614)
    "bridal_lehenga.png": (10, 420, 343, 565),
    
    # 4. Face Shape scanner profile from Screen 4 (approx y: 614 to 819)
    "faceshape_profile.png": (240, 665, 335, 780),
    
    # 5. Spot Eraser product from Screen 5 (approx y: 819 to 1024)
    "spot_eraser.png": (220, 875, 330, 945)
}

for name, box in crops.items():
    cropped = img.crop(box)
    cropped.save(os.path.join(dest_dir, name))
    print(f"Saved {name} with box {box}")

print("All crops completed successfully!")
