import os
from PIL import Image

ASSETS_DIR = r"c:\Users\BHANU\Downloads\feedx-main\assets\images"
BASE_LOGO = os.path.join(ASSETS_DIR, "icon.png")

def main():
    if not os.path.exists(BASE_LOGO):
        print("Base logo not found at:", BASE_LOGO)
        return

    raw_img = Image.open(BASE_LOGO).convert("RGBA")
    w, h = raw_img.size
    print(f"Loaded base icon: {w}x{h}")

    # Crop to bounding box of content (ignore transparent or solid white edges)
    # Convert white to transparent for bbox detection
    datas = raw_img.getdata()
    temp_data = []
    for item in datas:
        if item[0] > 250 and item[1] > 250 and item[2] > 250:
            temp_data.append((255, 255, 255, 0))
        else:
            temp_data.append(item)
    
    test_img = Image.new("RGBA", raw_img.size)
    test_img.putdata(temp_data)
    bbox = test_img.getbbox()
    
    if bbox:
        cropped_logo = raw_img.crop(bbox)
    else:
        cropped_logo = raw_img

    cw, ch = cropped_logo.size
    print(f"Content bbox size: {cw}x{ch}")

    SIZE = 1024

    # 1. icon.png (1024x1024, clean white background, logo occupying ~82% of width/height = 840px)
    icon_canvas = Image.new("RGBA", (SIZE, SIZE), (255, 255, 255, 255))
    target_main_size = 840
    scale_main = min(target_main_size / cw, target_main_size / ch)
    mw, mh = int(cw * scale_main), int(ch * scale_main)
    resized_main = cropped_logo.resize((mw, mh), Image.Resampling.LANCZOS)
    icon_canvas.paste(resized_main, ((SIZE - mw) // 2, (SIZE - mh) // 2), resized_main if resized_main.mode == "RGBA" else None)
    icon_canvas.save(os.path.join(ASSETS_DIR, "icon.png"), "PNG")
    icon_canvas.save(os.path.join(ASSETS_DIR, "splash-icon.png"), "PNG")

    # 2. android-icon-foreground.png (1024x1024, transparent background, logo within ~640px center safe zone)
    # Android Adaptive Icon safe zone: 66% diameter circle (~675px)
    fg_canvas = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    target_fg_size = 640
    scale_fg = min(target_fg_size / cw, target_fg_size / ch)
    fw, fh = int(cw * scale_fg), int(ch * scale_fg)
    resized_fg = cropped_logo.resize((fw, fh), Image.Resampling.LANCZOS)
    fg_canvas.paste(resized_fg, ((SIZE - fw) // 2, (SIZE - fh) // 2), resized_fg if resized_fg.mode == "RGBA" else None)
    fg_canvas.save(os.path.join(ASSETS_DIR, "android-icon-foreground.png"), "PNG")

    # 3. android-icon-background.png (1024x1024, solid pure white #FFFFFF)
    bg_canvas = Image.new("RGBA", (SIZE, SIZE), (255, 255, 255, 255))
    bg_canvas.save(os.path.join(ASSETS_DIR, "android-icon-background.png"), "PNG")

    # 4. favicon.png (512x512)
    fav_canvas = icon_canvas.resize((512, 512), Image.Resampling.LANCZOS)
    fav_canvas.save(os.path.join(ASSETS_DIR, "favicon.png"), "PNG")

    # 5. logo.jpg
    rgb_icon = icon_canvas.convert("RGB")
    rgb_icon.save(os.path.join(ASSETS_DIR, "logo.jpg"), "JPEG", quality=95)

    print("All app icon assets generated successfully!")

if __name__ == "__main__":
    main()
