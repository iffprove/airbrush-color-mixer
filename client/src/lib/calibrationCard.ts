/**
 * Generates and downloads a printable calibration card as a PNG.
 * A6 @ 300 DPI (1240 × 1748 px) with white / 18%-gray / black patches.
 * 18% gray in sRGB: linear 0.18 → ~#767676.
 */
export function downloadCalibrationCard(): void {
  const W = 1240;
  const H = 1748;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);

  // Title
  ctx.fillStyle = '#111111';
  ctx.font = 'bold 52px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('AIRBRUSH CALIBRATION CARD', W / 2, 80);

  ctx.font = '30px sans-serif';
  ctx.fillStyle = '#555555';
  ctx.fillText('Print on matte cardstock · Do not laminate · Keep flat', W / 2, 128);

  const patches: { color: string; label: string; sublabel: string; textColor: string; top: number }[] = [
    { color: '#ffffff', label: 'WHITE',    sublabel: 'Tap this patch first when calibrating', textColor: '#222222', top: 190 },
    { color: '#767676', label: '18% GRAY', sublabel: 'Mid-tone reference (optional)',          textColor: '#ffffff', top: 680 },
    { color: '#000000', label: 'BLACK',    sublabel: 'Tap this patch second when calibrating', textColor: '#ffffff', top: 1170 },
  ];

  for (const p of patches) {
    const patchH = 440;
    // Border
    ctx.strokeStyle = '#999999';
    ctx.lineWidth = 4;
    ctx.fillStyle = p.color;
    ctx.fillRect(100, p.top, W - 200, patchH);
    ctx.strokeRect(100, p.top, W - 200, patchH);

    // Label
    ctx.fillStyle = p.textColor;
    ctx.font = 'bold 64px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(p.label, W / 2, p.top + patchH / 2 - 10);

    ctx.font = '26px sans-serif';
    ctx.fillText(p.sublabel, W / 2, p.top + patchH / 2 + 46);
  }

  // Footer
  ctx.fillStyle = '#333333';
  ctx.font = '24px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('iffprove.github.io/airbrush-color-mixer', W / 2, H - 30);

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'airbrush-calibration-card.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 'image/png');
}
