import os
from PIL import Image

RES_DIR = r"c:\Users\BHANU\Downloads\feedx-main\android\app\src\main\res"
ASSETS_DIR = r"c:\Users\BHANU\Downloads\feedx-main\assets\images"
ICON_PNG = os.path.join(ASSETS_DIR, "icon.png")
FG_PNG = os.path.join(ASSETS_DIR, "android-icon-foreground.png")
BG_PNG = os.path.join(ASSETS_DIR, "android-icon-background.png")

MIPMAP_ICON_SIZES = {
    "mipmap-mdpi": 48,
    "mipmap-hdpi": 72,
    "mipmap-xhdpi": 96,
    "mipmap-xxhdpi": 144,
    "mipmap-xxxhdpi": 192,
}

MIPMAP_ADAPTIVE_SIZES = {
    "mipmap-mdpi": 108,
    "mipmap-hdpi": 162,
    "mipmap-xhdpi": 216,
    "mipmap-xxhdpi": 324,
    "mipmap-xxxhdpi": 432,
}

DRAWABLE_SPLASH_SIZES = {
    "drawable-mdpi": 320,
    "drawable-hdpi": 480,
    "drawable-xhdpi": 640,
    "drawable-xxhdpi": 960,
    "drawable-xxxhdpi": 1280,
}

def main():
    icon_img = Image.open(ICON_PNG).convert("RGBA")
    fg_img = Image.open(FG_PNG).convert("RGBA")
    bg_img = Image.open(BG_PNG).convert("RGBA")

    # 1. Update mipmaps
    for folder, size in MIPMAP_ICON_SIZES.items():
        folder_path = os.path.join(RES_DIR, folder)
        os.makedirs(folder_path, exist_ok=True)
        
        # ic_launcher.png & ic_launcher_round.png
        resized_icon = icon_img.resize((size, size), Image.Resampling.LANCZOS)
        resized_icon.save(os.path.join(folder_path, "ic_launcher.png"), "PNG")
        resized_icon.save(os.path.join(folder_path, "ic_launcher_round.png"), "PNG")

    for folder, size in MIPMAP_ADAPTIVE_SIZES.items():
        folder_path = os.path.join(RES_DIR, folder)
        os.makedirs(folder_path, exist_ok=True)
        
        # ic_launcher_foreground.png & ic_launcher_background.png
        resized_fg = fg_img.resize((size, size), Image.Resampling.LANCZOS)
        resized_fg.save(os.path.join(folder_path, "ic_launcher_foreground.png"), "PNG")
        
        resized_bg = bg_img.resize((size, size), Image.Resampling.LANCZOS)
        resized_bg.save(os.path.join(folder_path, "ic_launcher_background.png"), "PNG")

    # 2. Update splash drawables
    for folder, size in DRAWABLE_SPLASH_SIZES.items():
        folder_path = os.path.join(RES_DIR, folder)
        if os.path.exists(folder_path):
            resized_splash = icon_img.resize((min(size, 480), min(size, 480)), Image.Resampling.LANCZOS)
            for splash_name in ["splashscreen_image.png", "splashscreen_logo.png", "splash_image.png"]:
                target = os.path.join(folder_path, splash_name)
                if os.path.exists(target) or splash_name == "splashscreen_image.png":
                    resized_splash.save(target, "PNG")

    # Also update root drawable if splash exists
    drawable_root = os.path.join(RES_DIR, "drawable")
    if os.path.exists(drawable_root):
        resized_splash = icon_img.resize((300, 300), Image.Resampling.LANCZOS)
        for splash_name in ["splashscreen_image.png", "splashscreen_logo.png"]:
            target = os.path.join(drawable_root, splash_name)
            if os.path.exists(target) or splash_name == "splashscreen_image.png":
                resized_splash.save(target, "PNG")

    print("Android native drawables and mipmaps synced successfully!")

if __name__ == "__main__":
    main()
