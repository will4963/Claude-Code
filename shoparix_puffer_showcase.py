"""ShopAriX Puffer Handbag for Women - 3D product showcase animation (Blender 4.0+)

HOW TO USE: File > New > General, then Scripting tab > + New > paste this > Run Script (Alt+P).
Then hover the 3D view and press SPACEBAR to play. The camera cuts between 5 shots automatically.
Render the video: Render > Render Animation (Ctrl+F12). MP4 is saved next to your .blend
(save the .blend first) or in your temp folder.

WARNING: clears the objects in the current scene first - use a new file.

LOGO: put ShopAriX_logo_gold.png in your Downloads folder, on your Desktop, or next to your
saved .blend - or paste its full path into LOGO_PATH below. If it is not found, a gold
"ShopAriX" 3D text is used in its place.

Shots (30 fps, 14 s):
  0  ShopAriX logo intro               frames   1-60
  1  Hero push-in on the front         frames  61-135
  2  3/4 orbit around the bag          frames 136-210
  3  Macro slide across the quilting   frames 211-270
  4  Low-angle tilt up to the handle   frames 271-330
  5  360 turntable + ShopAriX title    frames 331-420
"""
import bpy, bmesh, math, os

LOGO_PATH = ""   # optional: full path to ShopAriX_logo_gold.png, e.g. r"C:\Users\you\Downloads\ShopAriX_logo_gold.png"
from mathutils import Vector
from mathutils.bvhtree import BVHTree

scene = bpy.context.scene
# start from a clean scene: remove existing objects (your file is not saved, nothing on disk changes)
for o in list(scene.objects):
    bpy.data.objects.remove(o, do_unlink=True)

W, H, D = 0.40, 0.32, 0.16           # working size (m)
hx, hy, hz = W/2, D/2, H/2
R = 0.04                             # soft corner rounding
PUFF = 0.020                         # cushion loft per quilt panel
CELL = 0.16                          # square quilt panels: 0.16 x 0.16 m
# front: two full squares centred (the reference's 2x2 block) + narrow wrap strips at the corners
X_EDGES = [-hx, -CELL, 0.0, CELL, hx]
Y_EDGES = [-hy, hy]                  # side: one square across the 0.16 m depth
Z_EDGES = [-hz, 0.0, hz]             # two square rows over the 0.32 m height

def clamp(v, a, b): return max(a, min(b, v))

def cushion(a, edges):
    for e0, e1 in zip(edges, edges[1:]):
        if e0 <= a <= e1:
            return math.sin(math.pi * (a - e0) / (e1 - e0))
    return 0.0

# ---------------- body ----------------
bm = bmesh.new()
bmesh.ops.create_cube(bm, size=1.0)
bmesh.ops.subdivide_edges(bm, edges=bm.edges[:], cuts=110, use_grid_fill=True)
ih = Vector((hx-R, hy-R, hz-R))
for v in bm.verts:
    p = Vector((v.co.x*2*hx, v.co.y*2*hy, v.co.z*2*hz))
    q = Vector((clamp(p.x,-ih.x,ih.x), clamp(p.y,-ih.y,ih.y), clamp(p.z,-ih.z,ih.z)))
    d = p - q
    n = d.normalized() if d.length > 1e-9 else Vector((0, 0, 1))
    s = q + n*R
    cx = cushion(s.x, X_EDGES); cy = cushion(s.y, Y_EDGES); cz = cushion(s.z, Z_EDGES)
    front = (cx*cz) ** 0.35           # flat-topped pillows, tight seam channels
    side  = (cy*cz) ** 0.35
    base  = (cx*cy) ** 0.35
    off = PUFF * (n.y**2*front + n.x**2*side + (n.z**2*base if s.z < 0 else 0))
    s += n*off
    # overall pillowy belly on the big panels
    belly = 0.012 * (1-(s.x/hx)**2) * (1-(s.z/hz)**2)
    s.y += math.copysign(belly, s.y) * abs(n.y)
    t = clamp((s.z/hz + 1) / 2, 0.0, 1.0)
    # gathered mouth: top sinks in like an open, cinched tote
    if n.z > 0:
        s.z -= 0.045 * n.z**2 * (1-(s.x/hx)**2) * (1-(s.y/hy)**2)
        s.z += 0.006 * math.sin(s.x*90) * n.z   # gathers along the rim
    s.y *= 1 - 0.22 * t**2.5          # slight pinch in depth at the mouth
    s.x *= 1 + 0.035 * t**2           # reference flares a touch at the top
    s.x *= 1 - 0.05 * (1-t)**6        # tucked-in base band
    v.co = s
bmesh.ops.remove_doubles(bm, verts=bm.verts[:], dist=1e-5)
mn = Vector([min(v.co[i] for v in bm.verts) for i in range(3)])
mx = Vector([max(v.co[i] for v in bm.verts) for i in range(3)])
for v in bm.verts:   # normalise body to the exact working size, sitting on the floor
    v.co.x = (v.co.x - (mn.x+mx.x)/2) * W/(mx.x-mn.x)
    v.co.y = (v.co.y - (mn.y+mx.y)/2) * D/(mx.y-mn.y)
    v.co.z = (v.co.z - mn.z) * H/(mx.z-mn.z)
bm.normal_update()
bvh = BVHTree.FromBMesh(bm)
me = bpy.data.meshes.new("ToteBody"); bm.to_mesh(me); bm.free()
body = bpy.data.objects.new("PufferTote", me); scene.collection.objects.link(body)
print("BODY_ONLY_DIMS", tuple(round(d, 4) for d in body.dimensions))

def front_y(x, z):
    hit = bvh.ray_cast(Vector((x, -1.0, z)), Vector((0, 1, 0)))
    return hit[0].y if hit[0] else -hy

def catmull(pts, samples):
    out = []
    P = [pts[0]] + pts + [pts[-1]]
    for i in range(1, len(P)-2):
        p0, p1, p2, p3 = (Vector(P[j]) for j in (i-1, i, i+1, i+2))
        for k in range(samples):
            u = k / samples
            out.append(0.5*((2*p1) + (-p0+p2)*u + (2*p0-5*p1+4*p2-p3)*u*u + (-p0+3*p1-3*p2+p3)*u**3))
    out.append(Vector(pts[-1]))
    return out

def tube(name, pts, radius, gathers_per_m=22):
    cu = bpy.data.curves.new(name, 'CURVE'); cu.dimensions = '3D'
    cu.bevel_depth = radius; cu.bevel_resolution = 6; cu.use_fill_caps = True
    sp = cu.splines.new('POLY'); sp.points.add(len(pts)-1)
    L = 0.0
    for i, (pt, c) in enumerate(zip(sp.points, pts)):
        if i: L += (c - pts[i-1]).length
        pt.co = (c.x, c.y, c.z, 1)
        pt.radius = 1 + 0.035*math.sin(2*math.pi*gathers_per_m*L)   # ruched padding
    ob = bpy.data.objects.new(name, cu); scene.collection.objects.link(ob)
    return ob

# short carry handle: rises from the mouth to a pinched peak (reference top loop)
ctrl = [(-0.07, 0.02, H-0.05), (-0.066, 0.02, H+0.02), (-0.05, 0.015, H+0.10), (-0.022, 0.01, H+0.16),
        (0.0, 0.01, H+0.172), (0.022, 0.01, H+0.16), (0.05, 0.015, H+0.10), (0.066, 0.02, H+0.02), (0.07, 0.02, H-0.05)]
h1 = tube("Handle_Top", catmull(ctrl, 14), 0.017)

# long padded strap draping over the front in a slack U (reference front strap)
path2d = [(-0.105, H-0.022), (-0.10, H-0.045), (-0.085, H-0.12), (-0.055, 0.12), (-0.02, 0.075),
          (0.005, 0.06), (0.035, 0.08), (0.07, 0.15), (0.095, H-0.07), (0.105, H-0.045), (0.108, H-0.022)]
strap = []
for p in catmull([(x, 0, z) for x, z in path2d], 16):
    y = front_y(p.x, min(p.z, H-0.012)) - 0.0145
    # strap swings slightly clear of the bag at its lowest point
    y -= 0.01 * clamp(1 - (p.z-0.06)/0.12, 0, 1)
    strap.append(Vector((p.x, y, p.z)))
# tuck both ends over the rim into the mouth
# ends are stitched onto the top of the front panel: sink them into the body
strap = [strap[0] + Vector((0, 0.022, -0.004))] + strap + [strap[-1] + Vector((0, 0.022, -0.004))]
h2 = tube("Handle_FrontStrap", strap, 0.016)

# join into ONE model
bpy.context.view_layer.objects.active = body
for o in (h1, h2): o.select_set(True)
body.select_set(True)
bpy.ops.object.convert(target='MESH')
bpy.ops.object.join()
body = bpy.context.view_layer.objects.active
body.name = "PufferTote_Midnight"
bpy.ops.object.shade_smooth()
sub = body.modifiers.new("Subsurf", 'SUBSURF'); sub.levels = 1; sub.render_levels = 1

# ---------------- material ----------------
def srgb2lin(c):
    c /= 255.0
    return c/12.92 if c <= 0.04045 else ((c+0.055)/1.055)**2.4
mat = bpy.data.materials.new("Midnight_Nylon"); mat.use_nodes = True
bsdf = mat.node_tree.nodes["Principled BSDF"]
bsdf.inputs["Base Color"].default_value = (srgb2lin(0x23), srgb2lin(0x1f), srgb2lin(0x20), 1)  # #231f20
bsdf.inputs["Roughness"].default_value = 0.32
bsdf.inputs["Sheen Weight"].default_value = 0.25
bsdf.inputs["Coat Weight"].default_value = 0.15
# satin nylon crinkle: fine stretched noise -> bump on the BSDF normal (values above untouched)
nt = mat.node_tree
tc = nt.nodes.new("ShaderNodeTexCoord"); mp = nt.nodes.new("ShaderNodeMapping")
mp.inputs["Scale"].default_value = (1.0, 1.0, 2.2)
nz = nt.nodes.new("ShaderNodeTexNoise"); nz.inputs["Scale"].default_value = 28.0
nz.inputs["Detail"].default_value = 6.0; nz.inputs["Distortion"].default_value = 0.6
bp = nt.nodes.new("ShaderNodeBump"); bp.inputs["Strength"].default_value = 0.18
bp.inputs["Distance"].default_value = 0.002
nt.links.new(tc.outputs["Object"], mp.inputs["Vector"]); nt.links.new(mp.outputs["Vector"], nz.inputs["Vector"])
nt.links.new(nz.outputs["Fac"], bp.inputs["Height"]); nt.links.new(bp.outputs["Normal"], bsdf.inputs["Normal"])
body.data.materials.append(mat)

# ---------------- studio (warm grey, like the reference backdrop) ----------------
bpy.ops.mesh.primitive_plane_add(size=8, location=(0, 0, 0))
floor = bpy.context.object; floor.name = "Studio_Floor"
fm = bpy.data.materials.new("Studio"); fm.use_nodes = True
fm.node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value = (0.50, 0.46, 0.41, 1)
fm.node_tree.nodes["Principled BSDF"].inputs["Roughness"].default_value = 0.9
floor.data.materials.append(fm)
bpy.ops.mesh.primitive_plane_add(size=8, location=(0, 1.2, 4), rotation=(math.pi/2, 0, 0))
wall = bpy.context.object; wall.name = "Studio_Wall"; wall.data.materials.append(fm)
world = bpy.data.worlds.new("W"); scene.world = world; world.use_nodes = True
world.node_tree.nodes["Background"].inputs[0].default_value = (0.5, 0.48, 0.45, 1)
world.node_tree.nodes["Background"].inputs[1].default_value = 0.04

def area(name, loc, energy, size, target=(0, 0, 0.18)):
    l = bpy.data.lights.new(name, 'AREA'); l.energy = energy; l.size = size
    o = bpy.data.objects.new(name, l); o.location = loc; scene.collection.objects.link(o)
    o.rotation_euler = (Vector(target) - Vector(loc)).to_track_quat('-Z', 'Y').to_euler()
area("Key", (-1.3, -1.2, 1.5), 45, 0.5)
area("Fill", (1.5, -0.9, 0.6), 8, 0.6)
area("Rim", (0.7, 0.9, 1.3), 45, 0.5)
area("Top", (0, -0.2, 2.0), 40, 0.6)
# big soft-box above/behind camera: the satin nylon mirrors it as broad sheen across each pillow
area("Softbox", (-0.35, -1.9, 1.05), 55, 1.4)
area("Wall", (0, 0.2, 1.4), 160, 2.0, target=(0, 1.2, 0.6))
# light linking: the backdrop light only lights the backdrop, so the bag keeps its Midnight depth
bg = bpy.data.collections.new("Backdrop"); scene.collection.children.link(bg)
for o in (floor, wall): bg.objects.link(o)
for o in (floor, wall):            # backdrop stays in shot but is not mirrored by the satin nylon
    o.visible_glossy = False; o.visible_diffuse = False
scene.objects["Wall"].light_linking.receiver_collection = bg


# =====================================================================
#  ANIMATION: camera angles showcasing the product
# =====================================================================
FPS, END = 30, 360
INTRO = 60                      # 2 s logo intro; every product shot starts after it
scene.render.fps = FPS
scene.frame_start, scene.frame_end = 1, END + INTRO
for m in list(scene.timeline_markers):
    scene.timeline_markers.remove(m)

def empty(name, loc):
    e = bpy.data.objects.new(name, None); e.location = loc
    e.empty_display_size = 0.05; scene.collection.objects.link(e)
    return e

def camera(name, lens, target, loc=(0, 0, 0), fstop=None):
    cd = bpy.data.cameras.new(name); cd.lens = lens; cd.clip_start = 0.01
    if fstop:
        cd.dof.use_dof = True; cd.dof.focus_object = target; cd.dof.aperture_fstop = fstop
    c = bpy.data.objects.new(name, cd); c.location = loc; scene.collection.objects.link(c)
    tc_ = c.constraints.new('TRACK_TO'); tc_.target = target
    tc_.track_axis = 'TRACK_NEGATIVE_Z'; tc_.up_axis = 'UP_Y'
    return c

def key_abs(ob, path, frame, value):
    setattr(ob, path, value); ob.keyframe_insert(data_path=path, frame=frame)

def key(ob, path, frame, value):            # product-shot frames, shifted after the intro
    key_abs(ob, path, frame + INTRO, value)

def cut(name, frame, cam, offset=True):
    m = scene.timeline_markers.new(name, frame=frame + (INTRO if offset else 0)); m.camera = cam

# --- Shot 0: ShopAriX logo intro (its own little stage, off to the side) ---
LX = 3.0                                     # logo stage sits 3 m to the right, out of the bag shots
def find_logo():
    names = ["ShopAriX_logo_gold.png", "ShopAriX-SX-3D-v2-extruded-gold.png"]
    dirs = [os.path.dirname(LOGO_PATH)] if LOGO_PATH else []
    if bpy.data.filepath:
        dirs.append(os.path.dirname(bpy.data.filepath))
    home = os.path.expanduser("~")
    dirs += [os.path.join(home, "Downloads"), os.path.join(home, "Desktop"), home]
    if LOGO_PATH and os.path.isfile(LOGO_PATH):
        return LOGO_PATH
    for d_ in dirs:
        for n_ in names:
            f_ = os.path.join(d_, n_)
            if os.path.isfile(f_):
                return f_
    return None

logo_file = find_logo()
gold = bpy.data.materials.new("ShopAriX_Logo"); gold.use_nodes = True
gnt = gold.node_tree; gnt.nodes.clear()
g_out = gnt.nodes.new("ShaderNodeOutputMaterial")
if logo_file:
    img = bpy.data.images.load(logo_file, check_existing=True)
    img.pack()                               # keep the logo inside the .blend
    aspect = img.size[0] / max(1, img.size[1])
    tex = gnt.nodes.new("ShaderNodeTexImage"); tex.image = img
    emi = gnt.nodes.new("ShaderNodeEmission")
    trn = gnt.nodes.new("ShaderNodeBsdfTransparent")
    mix = gnt.nodes.new("ShaderNodeMixShader")
    gnt.links.new(tex.outputs["Color"], emi.inputs["Color"])
    gnt.links.new(tex.outputs["Alpha"], mix.inputs["Fac"])
    gnt.links.new(trn.outputs[0], mix.inputs[1]); gnt.links.new(emi.outputs[0], mix.inputs[2])
    gnt.links.new(mix.outputs[0], g_out.inputs["Surface"])
    bpy.ops.mesh.primitive_plane_add(size=1.0, location=(LX, 0, 0.36), rotation=(math.radians(90), 0, 0))
    logo = bpy.context.object; logo.name = "ShopAriX_Logo"
    logo.dimensions = (0.30 * aspect, 0.30, 0)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    logo.data.materials.append(gold)
    glint = emi.inputs["Strength"]
    print("ShopAriX logo loaded:", logo_file)
else:
    print("Logo PNG not found - using gold 3D text. Set LOGO_PATH at the top of the script.")
    bsd = gnt.nodes.new("ShaderNodeBsdfPrincipled")
    bsd.inputs["Base Color"].default_value = (0.75, 0.52, 0.18, 1)
    bsd.inputs["Metallic"].default_value = 1.0; bsd.inputs["Roughness"].default_value = 0.25
    gnt.links.new(bsd.outputs[0], g_out.inputs["Surface"])
    cu = bpy.data.curves.new("ShopAriX_Logo", 'FONT'); cu.body = "ShopAriX"; cu.size = 0.16
    cu.align_x = 'CENTER'; cu.align_y = 'CENTER'; cu.extrude = 0.012; cu.bevel_depth = 0.002
    logo = bpy.data.objects.new("ShopAriX_Logo", cu); scene.collection.objects.link(logo)
    logo.location = (LX, 0, 0.36); logo.rotation_euler = (math.radians(90), 0, 0)
    logo.data.materials.append(gold)
    glint = bsd.inputs["Emission Strength"]
    bsd.inputs["Emission Color"].default_value = (1.0, 0.75, 0.35, 1)

# reveal: rises, turns to camera and grows; a gold glint peaks as it settles
key_abs(logo, "scale", 1, (0.55, 0.55, 0.55)); key_abs(logo, "scale", 42, (1, 1, 1))
key_abs(logo, "rotation_euler", 1, (math.radians(90), 0, math.radians(-35)))
key_abs(logo, "rotation_euler", 42, (math.radians(90), 0, 0))
key_abs(logo, "location", 1, (LX, 0, 0.30)); key_abs(logo, "location", 42, (LX, 0, 0.36))
for f_, v_ in ((1, 0.15 if logo_file else 0.0), (36, 1.6 if logo_file else 0.8), (52, 1.0 if logo_file else 0.0)):
    glint.default_value = v_; glint.keyframe_insert("default_value", frame=f_)
t0 = empty("T_Logo", (LX, 0, 0.36))
c0 = camera("CAM_0_Logo", 60, t0)
key_abs(c0, "location", 1, (LX, -1.55, 0.40)); key_abs(c0, "location", 60, (LX, -1.40, 0.38))
cut("0 Logo", 1, c0, offset=False)

# --- Shot 1: hero push-in on the front ---
t1 = empty("T_Hero", (0, 0, 0.25))
c1 = camera("CAM_1_Hero", 60, t1)
key(c1, "location", 1,  (0.0, -2.45, 0.36))
key(c1, "location", 75, (0.05, -1.95, 0.33))
cut("1 Hero", 1, c1)

# --- Shot 2: three-quarter orbit ---
pivot = empty("Orbit_Pivot", (0, 0, 0.0))
t2 = empty("T_Orbit", (0, 0, 0.25))
c2 = camera("CAM_2_Orbit", 55, t2, loc=(0, -1.75, 0.45)); c2.parent = pivot
key(pivot, "rotation_euler", 76,  (0, 0, math.radians(-55)))
key(pivot, "rotation_euler", 150, (0, 0, math.radians(40)))
cut("2 Orbit", 76, c2)

# --- Shot 3: macro slide across the quilted cushions (shallow focus) ---
t3 = empty("T_Macro", (-0.09, -0.09, 0.25))
c3 = camera("CAM_3_Macro", 85, t3, fstop=2.0)
key(c3, "location", 151, (-0.16, -0.78, 0.30))
key(c3, "location", 210, (0.12, -0.74, 0.19))
key(t3, "location", 151, (-0.09, -0.09, 0.25))
key(t3, "location", 210, (0.07, -0.09, 0.16))
cut("3 Macro", 151, c3)

# --- Shot 4: low angle, tilt up to the padded handle ---
t4 = empty("T_Handle", (0, 0, 0.30))
c4 = camera("CAM_4_Handle", 40, t4, fstop=4.0)
key(c4, "location", 211, (0.60, -1.05, 0.07))
key(c4, "location", 270, (0.45, -0.98, 0.20))
key(t4, "location", 211, (0.0, 0.0, 0.24))
key(t4, "location", 270, (0.0, 0.01, 0.38))
cut("4 Handle", 211, c4)

# --- Shot 5: wide 360 turntable + title ---
t5 = empty("T_Wide", (0, 0, 0.33))
c5 = camera("CAM_5_Turntable", 50, t5, loc=(0, -1.8, 0.52))
key(body, "rotation_euler", 271, (0, 0, 0))
key(body, "rotation_euler", 360, (0, 0, math.radians(360)))
cut("5 Turntable", 271, c5)

# title: ShopAriX / Puffer Handbag for Women
tm = bpy.data.materials.new("Title"); tm.use_nodes = True
tb = tm.node_tree.nodes["Principled BSDF"]
tb.inputs["Base Color"].default_value = (srgb2lin(0x23), srgb2lin(0x1f), srgb2lin(0x20), 1)
tb.inputs["Roughness"].default_value = 0.4
def title(txt, size, z, name):
    cu = bpy.data.curves.new(name, 'FONT'); cu.body = txt; cu.size = size
    cu.align_x = 'CENTER'; cu.align_y = 'CENTER'; cu.extrude = size * 0.06
    ob = bpy.data.objects.new(name, cu); ob.location = (0, 0.30, z)
    ob.rotation_euler = (math.radians(90), 0, 0); ob.data.materials.append(tm)
    scene.collection.objects.link(ob)
    key(ob, "scale", 1, (0, 0, 0)); key(ob, "scale", 285, (0, 0, 0))
    key(ob, "scale", 305, (1, 1, 1)); key(ob, "scale", 360, (1.04, 1.04, 1.04))
    return ob
title("ShopAriX", 0.10, 0.66, "Title_ShopAriX")
title("Puffer Handbag for Women", 0.036, 0.585, "Title_Subtitle")

scene.camera = c0
scene.frame_set(1)

# --- render settings: 1080p MP4 ---
scene.render.engine = 'CYCLES'
scene.cycles.device = 'CPU'           # switch to GPU in Preferences > System if you have one
scene.cycles.samples = 64; scene.cycles.use_denoising = True
scene.render.resolution_x, scene.render.resolution_y = 1920, 1080
scene.render.resolution_percentage = 100
scene.view_settings.view_transform = 'AgX'
scene.render.filepath = "//ShopAriX_Puffer_Showcase_"
try:
    try:
        scene.render.image_settings.media_type = 'VIDEO'   # Blender 5.x
    except Exception:
        pass
    scene.render.image_settings.file_format = 'FFMPEG'
    scene.render.ffmpeg.format = 'MPEG4'
    scene.render.ffmpeg.codec = 'H264'
    scene.render.ffmpeg.constant_rate_factor = 'HIGH'
except Exception as e:
    print("MP4 output not available, rendering PNG frames instead:", e)

# show it: look through the active camera in Material Preview
for area_ in (bpy.context.screen.areas if bpy.context.screen else []):
    if area_.type == 'VIEW_3D':
        sp_ = area_.spaces.active
        sp_.shading.type = 'MATERIAL'
        sp_.region_3d.view_perspective = 'CAMERA'
print("ShopAriX Puffer Handbag showcase ready: press SPACEBAR in the 3D view to play.")
