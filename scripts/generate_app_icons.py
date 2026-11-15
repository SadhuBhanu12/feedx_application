import os
from PIL import Image, ImageDraw, ImageOps, ImageFilter

SRC_PATH = r"C:\Users\BHANU\.gemini\antigravity-ide\brain\ab2be987-a4d9-4930-9d60-fab55ac6a6a4\.user_uploaded\media_1786884009068.png"
OUTPUT_DIR = r"c:\Users\BHANU\Downloads\feedx-main\assets\images"

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Open original uploaded logo
    raw_img = Image.open(SRC_PATH).convert("RGBA")
    
    # 1. Clean transparent logo:
    # Convert pure white background (or near-white) to transparent outside the circle
    # The logo consists of dark blue / cyan elements on white inside and outside
    w, h = raw_img.size
    
    # Create 1024x1024 base canvas
    size = 1024
    
    # --- A. Full Logo (1024x1024) centered with clean aspect ratio ---
    # Crop to content bbox
    # Let's find content bbox
    # Replace near-white background outside
    r, g, b, a = raw_img.split()
    # Find bounding box of non-white
    # Make a copy for transparency
    datas = raw_img.getdata()
    newData = []
    for item in datas:
        # Check if pixel is white or near-white (e.g. > 248 on all channels)
        if item[0] > 245 and item[1] > 245 and item[2] > 245:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)
    
    trans_img = Image.new("RGBA", raw_img.size)
    trans_img.putdata(newData)
    
    bbox = trans_img.getbbox()
    if bbox:
        cropped_logo = raw_img.crop(bbox)
        cropped_trans = trans_img.crop(bbox)
    else:
        cropped_logo = raw_img
        cropped_trans = trans_img
        
    print("Cropped logo size:", cropped_logo.size)
    
    # --- B. Square App Icon (1024x1024) with proper rounded corners at the edges ---
    # According to modern app design (iOS & Android squircle / rounded square):
    # Base background: clean crisp white #FFFFFF (or subtle modern border)
    # The logo is centered with proper padding (75-80% of canvas)
    app_icon = Image.new("RGBA", (size, size), (255, 255, 255, 255))
    
    # Resize cropped logo to fit nicely in 780x780 (leaving ~120px margin around for perfect squircle corners)
    target_logo_size = 800
    logo_w, logo_h = cropped_logo.size
    scale = min(target_logo_size / logo_w, target_logo_size / logo_h)
    new_w = int(logo_w * scale)
    new_h = int(logo_h * scale)
    
    resized_logo = cropped_logo.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    pos_x = (size - new_w) // 2
    pos_y = (size - new_h) // 2
    
    # Paste logo onto white square
    app_icon.paste(resized_logo, (pos_x, pos_y), resized_logo if resized_logo.mode == "RGBA" else None)
    
    # Create rounded corner mask for square app icon with proper corner radius (22% of size = 225px)
    corner_radius = 220
    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle([(0, 0), (size - 1, size - 1)], radius=corner_radius, fill=255)
    
    # Rounded square icon with alpha channel
    square_app_icon = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    square_app_icon.paste(app_icon, (0, 0), mask=mask)
    
    # Save standard full icon (flat full-bleed with white bg for app stores & Expo standard icon)
    # Expo icon.png: usually 1024x1024 full square, OS applies its own mask, or can have clean rounded square
    # Let's save icon.png as high-res rounded square icon with white background
    app_icon.save(os.path.join(OUTPUT_DIR, "icon.png"), "PNG")
    
    # Save splash-icon.png
    app_icon.save(os.path.join(OUTPUT_DIR, "splash-icon.png"), "PNG")
    
    # Save logo.jpg as RGB JPEG
    rgb_app_icon = app_icon.convert("RGB")
    rgb_app_icon.save(os.path.join(OUTPUT_DIR, "logo.jpg"), "JPEG", quality=95)
    
    # Save favicon.png (512x512)
    fav = app_icon.resize((512, 512), Image.Resampling.LANCZOS)
    fav.save(os.path.join(OUTPUT_DIR, "favicon.png"), "PNG")
    
    # --- C. Android Adaptive Icon Foreground (1024x1024) ---
    # Safe zone for adaptive icon is center 66% (circle of diameter ~680px)
    # Target size ~ 600px inside 1024x1024
    adaptive_fg = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    adaptive_target_size = 620
    scale_fg = min(adaptive_target_size / logo_w, adaptive_target_size / logo_h)
    fg_w = int(logo_w * scale_fg)
    fg_h = int(logo_h * scale_fg)
    resized_fg = cropped_logo.resize((fg_w, fg_h), Image.Resampling.LANCZOS)
    fg_x = (size - fg_w) // 2
    fg_y = (size - fg_h) // 2
    adaptive_fg.paste(resized_fg, (fg_x, fg_y), resized_fg if resized_fg.mode == "RGBA" else None)
    adaptive_fg.save(os.path.join(OUTPUT_DIR, "android-icon-foreground.png"), "PNG")
    
    # Adaptive background: solid white
    adaptive_bg = Image.new("RGBA", (size, size), (255, 255, 255, 255))
    adaptive_bg.save(os.path.join(OUTPUT_DIR, "android-icon-background.png"), "PNG")
    
    print("All icons successfully generated in:", OUTPUT_DIR)

if __name__ == "__main__":
    main()
