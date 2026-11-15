import os
from PIL import Image, ImageDraw, ImageChops

SRC_PATH_JPG = r"C:\Users\BHANU\.gemini\antigravity-ide\brain\ab2be987-a4d9-4930-9d60-fab55ac6a6a4\.user_uploaded\media_1786884520649.jpg"
SRC_PATH_PNG = r"C:\Users\BHANU\.gemini\antigravity-ide\brain\ab2be987-a4d9-4930-9d60-fab55ac6a6a4\.user_uploaded\media_1786884009068.png"
OUTPUT_DIR = r"c:\Users\BHANU\Downloads\feedx-main\assets\images"

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Prefer PNG for lossless or JPG
    if os.path.exists(SRC_PATH_PNG):
        raw = Image.open(SRC_PATH_PNG).convert("RGBA")
        # Find tight bounding box of non-white
        bg = Image.new("RGBA", raw.size, (255, 255, 255, 255))
        # Find difference
        diff = ImageChops.difference(raw.convert("RGB"), bg.convert("RGB"))
        bbox = diff.getbbox()
        if bbox:
            # Pad by 2px to ensure anti-aliased edge isn't clipped
            pad = 2
            bbox = (max(0, bbox[0]-pad), max(0, bbox[1]-pad), min(raw.width, bbox[2]+pad), min(raw.height, bbox[3]+pad))
            cropped = raw.crop(bbox)
        else:
            cropped = raw
    else:
        raw = Image.open(SRC_PATH_JPG).convert("RGB")
        bg = Image.new("RGB", raw.size, (255, 255, 255))
        diff = ImageChops.difference(raw, bg)
        bbox = diff.getbbox()
        cropped = raw.crop(bbox)
        
    print(f"Tightly cropped logo size: {cropped.size}")
    
    size = 1024
    
    # 1. icon.png - Zoomed in so ONLY the logo is visible, filling the square
    # Target size: 960px (out of 1024px, ~94% fill with tight minimal padding so rounded corners look gorgeous)
    icon_canvas = Image.new("RGBA", (size, size), (255, 255, 255, 255))
    target_dim = 960
    
    w, h = cropped.size
    scale = min(target_dim / w, target_dim / h)
    nw, nh = int(w * scale), int(h * scale)
    
    resized_icon = cropped.resize((nw, nh), Image.Resampling.LANCZOS)
    px = (size - nw) // 2
    py = (size - nh) // 2
    
    icon_canvas.paste(resized_icon, (px, py), resized_icon if resized_icon.mode == "RGBA" else None)
    
    # Save standard icon.png
    icon_canvas.save(os.path.join(OUTPUT_DIR, "icon.png"), "PNG")
    icon_canvas.save(os.path.join(OUTPUT_DIR, "splash-icon.png"), "PNG")
    
    # Save logo.jpg
    icon_canvas.convert("RGB").save(os.path.join(OUTPUT_DIR, "logo.jpg"), "JPEG", quality=98)
    
    # Save favicon.png
    fav = icon_canvas.resize((512, 512), Image.Resampling.LANCZOS)
    fav.save(os.path.join(OUTPUT_DIR, "favicon.png"), "PNG")
    
    # 2. android-icon-foreground.png (for Android adaptive icons)
    # Safe zone fill: 740px inside 1024x1024
    fg_canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    fg_dim = 720
    scale_fg = min(fg_dim / w, fg_dim / h)
    n_fg_w, n_fg_h = int(w * scale_fg), int(h * scale_fg)
    resized_fg = cropped.resize((n_fg_w, n_fg_h), Image.Resampling.LANCZOS)
    fg_px = (size - n_fg_w) // 2
    fg_py = (size - n_fg_h) // 2
    fg_canvas.paste(resized_fg, (fg_px, fg_py), resized_fg if resized_fg.mode == "RGBA" else None)
    fg_canvas.save(os.path.join(OUTPUT_DIR, "android-icon-foreground.png"), "PNG")
    
    # 3. android-icon-background.png
    bg_canvas = Image.new("RGBA", (size, size), (255, 255, 255, 255))
    bg_canvas.save(os.path.join(OUTPUT_DIR, "android-icon-background.png"), "PNG")
    
    # Remove test_cropped if exists
    test_path = os.path.join(OUTPUT_DIR, "test_cropped.png")
    if os.path.exists(test_path):
        os.remove(test_path)
        
    print("Tight cropped icons successfully generated in:", OUTPUT_DIR)

if __name__ == "__main__":
    main()
