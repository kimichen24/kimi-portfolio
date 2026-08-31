# ============================================================
# gen_brand_assets.ps1 — 生成稿纸红笔风格的 og-cover / apple-touch-icon
# 运行前需确保本文件为 UTF-8 BOM 编码（run_gen 脚本会自动转换）
# ============================================================
Add-Type -AssemblyName System.Drawing

$families = ([System.Drawing.FontFamily]::Families).Name
function Pick-Font($names, $fallback) {
  foreach ($n in $names) { if ($families -contains $n) { return $n } }
  return $fallback
}
$serifName = Pick-Font @('Noto Serif SC','Source Han Serif SC','STSong','SimSun') 'SimSun'
$sansName  = Pick-Font @('Noto Sans SC','Microsoft YaHei UI','Microsoft YaHei') 'Microsoft YaHei'
$monoName  = Pick-Font @('IBM Plex Mono','Consolas') 'Consolas'
Write-Host "fonts: serif=$serifName sans=$sansName mono=$monoName"

$INK   = [System.Drawing.Color]::FromArgb(255, 28, 26, 23)
$SOFT  = [System.Drawing.Color]::FromArgb(255, 87, 82, 74)
$MUTE  = [System.Drawing.Color]::FromArgb(255, 154, 148, 138)
$FAINT = [System.Drawing.Color]::FromArgb(255, 196, 190, 178)
$RED   = [System.Drawing.Color]::FromArgb(255, 200, 64, 31)
$PAPER = [System.Drawing.Color]::FromArgb(255, 250, 248, 243)
$LINE  = [System.Drawing.Color]::FromArgb(255, 228, 223, 210)

function New-Canvas($w, $h) {
  $bmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  $g.Clear($PAPER)
  return , @($bmp, $g)
}

function Draw-Grid($g, $w, $h, $step, $alpha) {
  $p = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb($alpha, 28, 26, 23), 1)
  for ($x = 0; $x -le $w; $x += $step) { $g.DrawLine($p, $x, 0, $x, $h) }
  for ($y = 0; $y -le $h; $y += $step) { $g.DrawLine($p, 0, $y, $w, $y) }
  $p.Dispose()
}

# ─────────────────────────────────────────────
# og-cover.png · 1200x630
# ─────────────────────────────────────────────
$list = New-Canvas 1200 630
$bmp = $list[0]; $g = $list[1]

Draw-Grid $g 1200 630 32 9

# 左缘装订红线
$rp = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(26, 200, 64, 31), 1)
$g.DrawLine($rp, 88, 0, 88, 630)
$rp.Dispose()

# 眉标（mono）— 全部用 char 码拼接，避开编码陷阱
# 注意：Font 默认单位是 Point（96DPI 下 1pt=1.33px），全部显式指定 Pixel
$PX = [System.Drawing.GraphicsUnit]::Pixel
$fMono = New-Object System.Drawing.Font($monoName, 24, [System.Drawing.FontStyle]::Regular, $PX)
$eyebrowText = 'PERSONAL SITE ', [string][char]0x00B7, ' EST. 2026' -join ''
$g.DrawString($eyebrowText, $fMono, (New-Object System.Drawing.SolidBrush($MUTE)), 124.0, 92.0)

# 大名（衬线英文 Kimi Chen · 墨）
$fName = New-Object System.Drawing.Font($serifName, 108, [System.Drawing.FontStyle]::Bold, $PX)
$g.DrawString('Kimi Chen', $fName, (New-Object System.Drawing.SolidBrush($INK)), 118.0, 140.0)

# 红笔下划线（贝塞尔手绘感）— 紧贴大字底部
$pen = New-Object System.Drawing.Pen($RED, 7)
$pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$g.DrawBezier($pen, 124, 282, 300, 272, 480, 290, 620, 276)
$pen.Dispose()

# 中文署名（sans 小字）— 全部用 char 码拼接，避开编码陷阱
$fSign = New-Object System.Drawing.Font($sansName, 26, [System.Drawing.FontStyle]::Regular, $PX)
$signText = ([char]0x9648, [char]0x6743, [char]0x5CF0, ' ', [char]0x00B7, ' ', [char]0x4E2A, [char]0x4EBA, [char]0x7F51, [char]0x7AD9) -join ''
$g.DrawString([string]$signText, $fSign, (New-Object System.Drawing.SolidBrush($MUTE)), 124.0, 300.0)

# 宣言（sans·次墨）— 与首页同句
$fSub = New-Object System.Drawing.Font($sansName, 30, [System.Drawing.FontStyle]::Regular, $PX)
$g.DrawString([string]::Concat([char]0x5199, [char]0x70B9, [char]0x4E1C, [char]0x897F, [char]0xFF0C, [char]0x505A, [char]0x70B9, [char]0x8FD0, [char]0x8425, [char]0xFF0C, [char]0x8BA4, [char]0x771F, [char]0x542C, [char]0x7528, [char]0x6237, [char]0x8BF4, [char]0x8BDD, [char]0x3002), $fSub, (New-Object System.Drawing.SolidBrush($SOFT)), 124.0, 392.0)
$g.DrawString([string]::Concat([char]0x6848, [char]0x5377, ' / ', [char]0x624B, [char]0x8BB0, ' / ', [char]0x91C7, [char]0x6837, [char]0x7B14, [char]0x8BB0), $fSub, (New-Object System.Drawing.SolidBrush($MUTE)), 124.0, 442.0)

# 右侧数据栏（红）— 平行数组，避免 PowerShell 嵌套数组展平陷阱
$fNum = New-Object System.Drawing.Font($sansName, 46, [System.Drawing.FontStyle]::Bold, $PX)
$fLab = New-Object System.Drawing.Font($sansName, 20, [System.Drawing.FontStyle]::Regular, $PX)
$nums = @(
  ('10.66' + [char]0x4E07 + '+')
  '81.7%'
  '38%'
  '3'
)
$labs = @(
  (([char]0x8D26, [char]0x53F7, [char]0x64AD, [char]0x653E) -join '')
  (([char]0x6548, [char]0x7387, [char]0x63D0, [char]0x5347) -join '')
  (([char]0x8F6C, [char]0x5316, [char]0x7387) -join '')
  (([char]0x72EC, [char]0x7ACB, [char]0x9879, [char]0x76EE) -join '')
)
$y0 = 120
for ($i = 0; $i -lt 4; $i++) {
  $y = $y0 + $i * 118
  $g.DrawString([string]$nums[$i], $fNum, (New-Object System.Drawing.SolidBrush($RED)), 830.0, $y)
  $g.DrawString([string]$labs[$i], $fLab, (New-Object System.Drawing.SolidBrush($MUTE)), 832.0, ($y + 60))
}

# 底部小字（mono·淡）
$fFoot = New-Object System.Drawing.Font($monoName, 20, [System.Drawing.FontStyle]::Regular, $PX)
$g.DrawString('kimichen24.github.io', $fFoot, (New-Object System.Drawing.SolidBrush($FAINT)), 124.0, 556.0)

# 外缘细框
$bp = New-Object System.Drawing.Pen($LINE, 2)
$g.DrawRectangle($bp, 1, 1, 1198, 628)
$bp.Dispose()

$bmp.Save("$PSScriptRoot\..\public\og-cover.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $bmp.Dispose()
Write-Host 'og-cover.png saved'

# ─────────────────────────────────────────────
# apple-touch-icon.png · 180x180
# ─────────────────────────────────────────────
$list2 = New-Canvas 180 180
$bmp2 = $list2[0]; $g2 = $list2[1]

Draw-Grid $g2 180 180 18 8

$fGlyph = New-Object System.Drawing.Font($serifName, 96, [System.Drawing.FontStyle]::Regular, $PX)
$sz = $g2.MeasureString([string][char]0x5CF0, $fGlyph)
$g2.DrawString([string][char]0x5CF0, $fGlyph, (New-Object System.Drawing.SolidBrush($INK)), ((180 - $sz.Width) / 2), ((180 - $sz.Height) / 2 - 8))

$pen2 = New-Object System.Drawing.Pen($RED, 6)
$pen2.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$pen2.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$g2.DrawBezier($pen2, 44, 140, 80, 132, 110, 144, 138, 134)
$pen2.Dispose()

$bmp2.Save("$PSScriptRoot\..\public\apple-touch-icon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g2.Dispose(); $bmp2.Dispose()
Write-Host 'apple-touch-icon.png saved'
