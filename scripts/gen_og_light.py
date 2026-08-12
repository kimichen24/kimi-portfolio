from PIL import Image, ImageDraw, ImageFont
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONT = "C:/Windows/Fonts/simhei.ttf"

def font(size):
    return ImageFont.truetype(FONT, size)

def og_cover():
    W, H = 1200, 630
    img = Image.new("RGB", (W, H), "#f5f5f7")
    d = ImageDraw.Draw(img)

    # 极淡发丝框
    d.rectangle([40, 40, W - 40, H - 40], outline="#000000", width=1)
    # 四角 L 标记
    L = 24
    for x, y, dx, dy in [(40, 40, 1, 1), (W - 40, 40, -1, 1), (40, H - 40, 1, -1), (W - 40, H - 40, -1, -1)]:
        d.line([(x, y), (x + L * dx, y)], fill="#000000", width=1)
        d.line([(x, y), (x, y + L * dy)], fill="#000000", width=1)

    # 主字标
    title = "KIMI"
    f_title = font(160)
    bbox = d.textbbox((0, 0), title, font=f_title)
    tw = bbox[2] - bbox[0]
    d.text(((W - tw) / 2, 210), title, font=f_title, fill="#1d1d1f")

    # 副文案
    sub = "陈权峰 · 个人作品集"
    f_sub = font(32)
    bbox2 = d.textbbox((0, 0), sub, font=f_sub)
    tw2 = bbox2[2] - bbox2[0]
    d.text(((W - tw2) / 2, 400), sub, font=f_sub, fill="#6e6e73")

    # 底部小字
    foot = "内容运营 · 用户调研 · 数据驱动 · AI 增效"
    f_foot = font(22)
    bbox3 = d.textbbox((0, 0), foot, font=f_foot)
    tw3 = bbox3[2] - bbox3[0]
    d.text(((W - tw3) / 2, 470), foot, font=f_foot, fill="#a1a1a6")

    img.save(os.path.join(ROOT, "public", "og-cover.png"))
    print("og-cover.png saved")

def apple_icon():
    S = 180
    img = Image.new("RGB", (S, S), "#ffffff")
    d = ImageDraw.Draw(img)
    # 细黑框
    d.rounded_rectangle([8, 8, S - 8, S - 8], radius=36, outline="#1d1d1f", width=2)
    # K
    f = font(90)
    bbox = d.textbbox((0, 0), "K", font=f)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    d.text(((S - tw) / 2, (S - th) / 2 - 6), "K", font=f, fill="#1d1d1f")
    img.save(os.path.join(ROOT, "public", "apple-touch-icon.png"))
    print("apple-touch-icon.png saved")

if __name__ == "__main__":
    og_cover()
    apple_icon()
