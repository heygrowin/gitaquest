import os
from svglib.svglib import svg2rlg
from reportlab.graphics import renderPM
from PIL import Image, ImageDraw

def render_logo(target_dim):
    drawing = svg2rlg('public/gitaquest_logo.svg')
    # original is 90x90
    orig_w, orig_h = drawing.width, drawing.height
    scale = target_dim / max(orig_w, orig_h)
    drawing.scale(scale, scale)
    drawing.width = int(orig_w * scale)
    drawing.height = int(orig_h * scale)
    img = renderPM.drawToPIL(drawing)
    return img.convert("RGBA")

def create_icons():
    res_base = 'android/app/src/main/res'
    densities = {
        'mdpi': (48, 108),
        'hdpi': (72, 162),
        'xhdpi': (96, 216),
        'xxhdpi': (144, 324),
        'xxxhdpi': (192, 432)
    }

    print("Rendering base logo at 1024x1024...")
    base_logo = render_logo(1024)

    bg_color = (251, 248, 242, 255) # #FBF8F2 warm ivory

    for density, (icon_size, fg_size) in densities.items():
        folder = os.path.join(res_base, f'mipmap-{density}')
        os.makedirs(folder, exist_ok=True)

        # 1. ic_launcher_foreground.png (transparent background, logo in 65% safe center)
        fg_img = Image.new("RGBA", (fg_size, fg_size), (0, 0, 0, 0))
        logo_fg_size = int(fg_size * 0.65)
        scaled_logo_fg = base_logo.resize((logo_fg_size, logo_fg_size), Image.Resampling.LANCZOS)
        offset_fg = ((fg_size - logo_fg_size) // 2, (fg_size - logo_fg_size) // 2)
        fg_img.paste(scaled_logo_fg, offset_fg, scaled_logo_fg)
        fg_path = os.path.join(folder, 'ic_launcher_foreground.png')
        fg_img.save(fg_path, 'PNG')

        # 2. ic_launcher.png (square / squircle icon with #FBF8F2 background)
        legacy_img = Image.new("RGBA", (icon_size, icon_size), bg_color)
        logo_legacy_size = int(icon_size * 0.72)
        scaled_legacy = base_logo.resize((logo_legacy_size, logo_legacy_size), Image.Resampling.LANCZOS)
        offset_legacy = ((icon_size - logo_legacy_size) // 2, (icon_size - logo_legacy_size) // 2)
        legacy_img.paste(scaled_legacy, offset_legacy, scaled_legacy)
        legacy_path = os.path.join(folder, 'ic_launcher.png')
        legacy_img.save(legacy_path, 'PNG')

        # 3. ic_launcher_round.png (circular icon with round clip)
        round_img = Image.new("RGBA", (icon_size, icon_size), (0, 0, 0, 0))
        mask = Image.new("L", (icon_size, icon_size), 0)
        draw_mask = ImageDraw.Draw(mask)
        draw_mask.ellipse((0, 0, icon_size - 1, icon_size - 1), fill=255)
        round_content = Image.new("RGBA", (icon_size, icon_size), bg_color)
        round_content.paste(scaled_legacy, offset_legacy, scaled_legacy)
        round_img.paste(round_content, (0, 0), mask)
        round_path = os.path.join(folder, 'ic_launcher_round.png')
        round_img.save(round_path, 'PNG')

        print(f"Generated icons for mipmap-{density} (legacy: {icon_size}x{icon_size}, fg: {fg_size}x{fg_size})")

    # Generate Splash screens
    splash_sizes = {
        'drawable': (480, 320),
        'drawable-port-mdpi': (320, 480),
        'drawable-port-hdpi': (480, 800),
        'drawable-port-xhdpi': (720, 1280),
        'drawable-port-xxhdpi': (960, 1600),
        'drawable-port-xxxhdpi': (1280, 1920),
        'drawable-land-mdpi': (480, 320),
        'drawable-land-hdpi': (800, 480),
        'drawable-land-xhdpi': (1280, 720),
        'drawable-land-xxhdpi': (1600, 960),
        'drawable-land-xxxhdpi': (1920, 1280)
    }

    for folder_name, (w, h) in splash_sizes.items():
        splash_dir = os.path.join(res_base, folder_name)
        os.makedirs(splash_dir, exist_ok=True)
        splash_img = Image.new("RGBA", (w, h), bg_color)
        logo_dim = int(min(w, h) * 0.40)
        scaled_splash_logo = base_logo.resize((logo_dim, logo_dim), Image.Resampling.LANCZOS)
        offset = ((w - logo_dim) // 2, (h - logo_dim) // 2)
        splash_img.paste(scaled_splash_logo, offset, scaled_splash_logo)
        out_path = os.path.join(splash_dir, 'splash.png')
        splash_img.save(out_path, 'PNG')
        print(f"Generated splash for {folder_name}: {w}x{h}")

    print("All Android icons and splashes generated successfully!")

if __name__ == '__main__':
    create_icons()
