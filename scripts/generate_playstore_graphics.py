import os
import math
from svglib.svglib import svg2rlg
from reportlab.graphics import renderPM
from PIL import Image, ImageDraw, ImageFont, ImageFilter

OUTPUT_DIR = "playstore_assets"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def render_svg(svg_path, target_dim):
    drawing = svg2rlg(svg_path)
    orig_w, orig_h = drawing.width, drawing.height
    scale = target_dim / max(orig_w, orig_h)
    drawing.scale(scale, scale)
    drawing.width = int(orig_w * scale)
    drawing.height = int(orig_h * scale)
    img = renderPM.drawToPIL(drawing)
    return img.convert("RGBA")

def create_app_icons():
    print("Generating 512x512 Google Play Store App Icons...")
    logo = render_svg("public/gitaquest_logo.svg", 1024)

    # 1. Warm Ivory Light Edition (512x512)
    dim = 512
    icon_light = Image.new("RGBA", (dim, dim), (251, 248, 242, 255)) # #FBF8F2
    
    # Subtle circular soft gradient / glow in center
    glow = Image.new("RGBA", (dim, dim), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.ellipse((40, 40, dim - 40, dim - 40), fill=(244, 238, 224, 255))
    glow = glow.filter(ImageFilter.GaussianBlur(30))
    icon_light.paste(glow, (0, 0), glow)

    # Scaled emblem (safe area ~72%)
    logo_size = int(dim * 0.72)
    scaled_logo = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
    offset = ((dim - logo_size) // 2, (dim - logo_size) // 2)
    icon_light.paste(scaled_logo, offset, scaled_logo)

    # Save 32-bit PNG
    light_path = os.path.join(OUTPUT_DIR, "icon_512x512.png")
    icon_light.save(light_path, "PNG")
    print(f" -> Saved {light_path}")

    # 2. Forest Green Dark / Sacred Edition (512x512)
    icon_dark = Image.new("RGBA", (dim, dim), (19, 43, 32, 255)) # #132B20
    dark_glow = Image.new("RGBA", (dim, dim), (0, 0, 0, 0))
    dark_glow_draw = ImageDraw.Draw(dark_glow)
    dark_glow_draw.ellipse((50, 50, dim - 50, dim - 50), fill=(28, 62, 47, 255))
    dark_glow = dark_glow.filter(ImageFilter.GaussianBlur(40))
    icon_dark.paste(dark_glow, (0, 0), dark_glow)

    icon_dark.paste(scaled_logo, offset, scaled_logo)
    dark_path = os.path.join(OUTPUT_DIR, "icon_dark_512x512.png")
    icon_dark.save(dark_path, "PNG")
    print(f" -> Saved {dark_path}")

def create_feature_graphic():
    print("Generating 1024x500 Google Play Store Feature Graphic...")
    w, h = 1024, 500

    # Rich radial & linear forest green gradient
    img = Image.new("RGB", (w, h), (14, 34, 25)) # #0E2219
    draw = ImageDraw.Draw(img)

    for y in range(h):
        # vertical gradient blend
        ratio = y / h
        r = int(14 + (24 - 14) * ratio)
        g = int(34 + (58 - 34) * ratio)
        b = int(25 + (44 - 25) * ratio)
        draw.line([(0, y), (w, y)], fill=(r, g, b))

    # Add soft radial gold & forest glow on left-center
    glow_layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow_layer)
    glow_draw.ellipse((60, 50, 480, 450), fill=(212, 163, 89, 45)) # warm gold ambient glow
    glow_draw.ellipse((100, 90, 440, 410), fill=(35, 78, 59, 120))
    glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(50))
    img.paste(glow_layer, (0, 0), glow_layer)

    # Render emblem
    logo = render_svg("public/gitaquest_logo.svg", 600)
    logo_size = 320
    scaled_logo = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
    img.paste(scaled_logo, (90, 90), scaled_logo)

    # Text rendering using available Windows TrueType fonts
    font_bold = None
    font_sub = None
    font_pill = None
    font_sanskrit = None

    font_paths = [
        "C:\\Windows\\Fonts\\georgiab.ttf",
        "C:\\Windows\\Fonts\\segoeuib.ttf",
        "C:\\Windows\\Fonts\\arialbd.ttf"
    ]
    for p in font_paths:
        if os.path.exists(p):
            try:
                font_bold = ImageFont.truetype(p, 56)
                font_sub = ImageFont.truetype("C:\\Windows\\Fonts\\segoeui.ttf", 21)
                font_pill = ImageFont.truetype("C:\\Windows\\Fonts\\segoeuib.ttf", 15)
                break
            except Exception:
                pass

    devanagari_paths = [
        "C:\\Windows\\Fonts\\nirmala.ttf",
        "C:\\Windows\\Fonts\\mangal.ttf",
        "C:\\Windows\\Fonts\\aparaj.ttf"
    ]
    for p in devanagari_paths:
        if os.path.exists(p):
            try:
                font_sanskrit = ImageFont.truetype(p, 24)
                break
            except Exception:
                pass

    if not font_bold:
        font_bold = ImageFont.load_default()
    if not font_sub:
        font_sub = ImageFont.load_default()
    if not font_pill:
        font_pill = ImageFont.load_default()
    if not font_sanskrit:
        font_sanskrit = font_sub

    text_x = 460
    # 1. Category / Devanagari kicker
    draw.text((text_x, 105), "श्रीमद्भगवद्गीता • SACRED SCRIPTURE", font=font_sanskrit, fill=(212, 163, 89)) # Gold

    # 2. Brand Name
    draw.text((text_x, 142), "GitaQuest", font=font_bold, fill=(251, 248, 242)) # Warm white

    # 3. Main Tagline
    draw.text((text_x, 215), "Read. Reflect. Grow.", font=font_sub, fill=(232, 189, 112)) # Saffron gold
    draw.text((text_x, 248), "All 701 Verses with Authentic Sanskrit, Hindi & English", font=font_sub, fill=(200, 215, 207))
    draw.text((text_x, 280), "Track Daily Sadhana • Build Habit • Earn Certificate", font=font_sub, fill=(160, 185, 172))

    # 4. Feature Pills
    pills = [
        ("100% Free & Ad-Free", (255, 245, 230), (74, 56, 40)),
        ("701 Verses", (240, 245, 242), (30, 58, 47)),
        ("Daily Streaks", (240, 245, 242), (30, 58, 47)),
        ("Offline Ready", (240, 245, 242), (30, 58, 47))
    ]

    pill_x = text_x
    pill_y = 345
    for label, bg_color, text_color in pills:
        bbox = font_pill.getbbox(label)
        text_w = bbox[2] - bbox[0]
        pill_w = text_w + 26
        pill_h = 32
        
        # Draw pill
        draw.rounded_rectangle((pill_x, pill_y, pill_x + pill_w, pill_y + pill_h), radius=16, fill=bg_color)
        draw.text((pill_x + 13, pill_y + 7), label, font=font_pill, fill=text_color)
        pill_x += pill_w + 12

    # Save JPG and PNG (Google Play accepts 1024x500 JPG or 24-bit PNG with no alpha)
    feature_path_png = os.path.join(OUTPUT_DIR, "feature_graphic_1024x500.png")
    feature_path_jpg = os.path.join(OUTPUT_DIR, "feature_graphic_1024x500.jpg")
    img.save(feature_path_png, "PNG")
    img.save(feature_path_jpg, "JPEG", quality=95)
    print(f" -> Saved {feature_path_png}")
    print(f" -> Saved {feature_path_jpg}")

if __name__ == "__main__":
    create_app_icons()
    create_feature_graphic()
    print("Done generating Play Store branding assets!")
