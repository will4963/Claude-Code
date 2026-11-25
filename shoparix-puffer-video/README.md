# ShopArix Puffer Handbag — 30s vertical video

`ShopArix-Puffer-Handbag-30s-vertical.mp4` — 1080×1920, 30 fps, H.264 + AAC, 30 s. Built for Reels / TikTok / Shorts.

Styled to the ShopAriX design system (Bone Cream, Carbon Black, Inter Tight, Bodoni Moda wordmark, outlined pill CTA, no shadows/gradients). Photos from "Puffer Pix.zip"; logo is the gold SX monogram. Music is an original synthesized pad (no licensing needed).

| Time | Scene |
|---|---|
| 0–3.5 | Gold SX monogram + ShopArix wordmark |
| 3.5–8 | Midnight hero — "Soft. Quilted. Yours." |
| 8–11.5 | Side profile — "Pillowy from every angle." |
| 11.5–15.5 | Interior — "Room for everything. A roomy interior and a front zip pocket." |
| 15.5–21.5 | Four colorways: Storm Grey, Caramel, Forest, Midnight |
| 21.5–25.5 | On-body — "In hand. On shoulder." |
| 25.5–30 | Colorway grid, logo, "Shop the Collection" |

## Re-render
Edit copy/timing in `source/video.html` (`render(t)` drives every frame), then:
```bash
node source/render.js "$PWD/source" video silent.mp4
ffmpeg -i silent.mp4 -i source/music-pad.wav -map 0:v -map 1:a -c:v copy -c:a aac -shortest out.mp4
```
