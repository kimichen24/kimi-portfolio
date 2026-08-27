Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile("$PSScriptRoot\..\public\og-cover.png")
# 红色像素 x 分布直方图（每 20px 一桶，y 采样 100~570 数字区）
$buckets = @{}
for ($x = 0; $x -lt 1200; $x++) {
  $n = 0
  for ($y = 100; $y -lt 570; $y++) {
    if (($y % 3) -ne 0) { continue }
    $c = $bmp.GetPixel($x, $y)
    if ($c.R -gt 180 -and $c.G -lt 110 -and $c.B -lt 90) { $n++ }
  }
  if ($n -gt 2) {
    $b = [math]::Floor($x / 20) * 20
    if (-not $buckets.ContainsKey($b)) { $buckets[$b] = 0 }
    $buckets[$b] += $n
  }
}
$buckets.GetEnumerator() | Sort-Object { [int]$_.Key } | ForEach-Object {
  Write-Host ("x {0,4}-{1}: {2}" -f $_.Key, ([int]$_.Key + 19), $_.Value)
}
$bmp.Dispose()
